import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

const DEBUG_TEXTURE_SIZE = 64
const DEBUG_PARTICLE_COUNT = DEBUG_TEXTURE_SIZE * DEBUG_TEXTURE_SIZE
const DEBUG_POINT_SCALE = 1.08
const GPGPU_DEBUG_TEXTURE_MOTION = true
const CLUSTER_MIN = new THREE.Vector3(-1.4, -0.9, -0.6)
const CLUSTER_MAX = new THREE.Vector3(1.4, 0.9, 0.6)

const fullscreenVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const velocityFragmentShader = `
  precision highp float;

  uniform sampler2D uPositionTexture;
  uniform sampler2D uVelocityTexture;
  uniform sampler2D uInitialVelocityTexture;
  uniform float uDelta;
  uniform float uFrame;
  uniform float uTime;
  uniform float uDebugTextureMotion;
  uniform float uDebugTextureMotion;

  varying vec2 vUv;

  void main() {
    vec4 positionSample = texture2D(uPositionTexture, vUv);
    vec3 position = positionSample.xyz;
    vec3 velocity = uFrame < 1.0 ? texture2D(uInitialVelocityTexture, vUv).xyz : texture2D(uVelocityTexture, vUv).xyz;

    vec3 tangent = normalize(vec3(-position.y, position.x, 0.0) + vec3(0.0001));
    vec3 sineDrift = vec3(
      sin(uTime * 0.42 + vUv.y * 6.2831),
      cos(uTime * 0.34 + vUv.x * 6.2831),
      sin(uTime * 0.28 + length(position.xy))
    );
    vec3 centerPull = -position * 0.018;
    vec3 force = tangent * 0.42 + sineDrift * 0.18 + centerPull;

    velocity += force * uDelta;
    velocity *= 0.986;
    velocity = clamp(velocity, vec3(-0.46), vec3(0.46));

    gl_FragColor = vec4(velocity, 1.0);
  }
`

const positionFragmentShader = `
  precision highp float;

  uniform sampler2D uInitialPositionTexture;
  uniform sampler2D uPositionTexture;
  uniform sampler2D uVelocityTexture;
  uniform float uDelta;
  uniform float uFrame;
  uniform float uTime;

  varying vec2 vUv;

  void main() {
    vec4 current = uFrame < 1.0 ? texture2D(uInitialPositionTexture, vUv) : texture2D(uPositionTexture, vUv);
    vec3 position = current.xyz;
    float layer = current.w;
    vec3 velocity = texture2D(uVelocityTexture, vUv).xyz;

    position += velocity * uDelta * 1.6;

    float localPhase = uTime * 0.55 + vUv.x * 6.2831 + vUv.y * 3.14159;
    vec2 debugSwirl = vec2(-position.y, position.x) * 0.035;
    vec3 debugFlow = vec3(
      sin(localPhase + position.y * 0.8),
      cos(localPhase * 0.84 + position.x * 0.9),
      sin(localPhase * 0.62 + position.x * 0.5)
    ) * 0.065;
    position.xy += debugSwirl * uDebugTextureMotion * uDelta;
    position += debugFlow * uDebugTextureMotion * uDelta;

    position = clamp(position, vec3(-1.4, -0.9, -0.6), vec3(1.4, 0.9, 0.6));

    gl_FragColor = vec4(position, layer);
  }
`

const particleVertexShader = `
  precision highp float;

  uniform sampler2D uPositionTexture;
  uniform float uPointScale;
  uniform float uTime;

  attribute vec2 aReference;
  attribute float aSeed;
  attribute float aSize;

  varying float vAlpha;
  varying float vFallback;
  varying float vLayer;
  varying float vSeed;

  void main() {
    vec4 positionSample = texture2D(uPositionTexture, aReference);
    vec3 sampledPosition = clamp(positionSample.xyz, vec3(-1.4, -0.9, -0.6), vec3(1.4, 0.9, 0.6));
    float sampleDistance = length(positionSample.xyz);
    float invalidSample = float(
      any(notEqual(positionSample.xyz, positionSample.xyz)) ||
      sampleDistance > 3.0 ||
      abs(positionSample.w) > 3.5
    );
    float nearZeroUnexpected = 1.0 - step(0.0008, length(positionSample.xyz));
    float useFallback = max(invalidSample, nearZeroUnexpected);
    vec3 p = mix(sampledPosition, position, useFallback);
    float layer = mix(clamp(positionSample.w, 0.0, 2.0), 1.0, useFallback);

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float depthScale = clamp(7.0 / max(-mvPosition.z, 0.1), 0.6, 1.6);
    float breathe = 0.88 + sin(uTime * 0.8 + aSeed * 6.2831) * 0.12;
    gl_PointSize = max(aSize * uPointScale * depthScale * breathe, 3.0);

    vAlpha = 0.58 + (1.0 - layer * 0.14) * 0.16;
    vFallback = useFallback;
    vLayer = layer;
    vSeed = aSeed;
  }
`

const particleFragmentShader = `
  precision mediump float;

  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  varying float vAlpha;
  varying float vFallback;
  varying float vLayer;
  varying float vSeed;

  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    float core = smoothstep(0.44, 0.08, dist) * 0.88;
    float halo = smoothstep(0.5, 0.3, dist) * 0.1;
    float alpha = (core + halo) * vAlpha;

    if (alpha < 0.015) discard;

    vec3 sampledDebugColor = vec3(0.36, 0.86, 1.0);
    vec3 fallbackDebugColor = vec3(1.0, 0.38, 0.72);
    vec3 color = mix(sampledDebugColor, fallbackDebugColor, vFallback);
    color = min(mix(color, vec3(1.0), 0.12 + vSeed * 0.035), vec3(0.88, 0.86, 0.92));

    gl_FragColor = vec4(color, alpha * 0.78);
  }
`

interface DebugTextures {
  initialPositionTexture: THREE.DataTexture
  initialVelocityTexture: THREE.DataTexture
  staticPositions: Float32Array
  references: Float32Array
  seeds: Float32Array
  sizes: Float32Array
}

interface DebugTargets {
  positionA: THREE.WebGLRenderTarget
  positionB: THREE.WebGLRenderTarget
  velocityA: THREE.WebGLRenderTarget
  velocityB: THREE.WebGLRenderTarget
}

export function GpgpuParticleDebug({ accentColor = '#7fc7d8' }: { accentColor?: string }) {
  const { gl } = useThree()
  const helperRef = useRef<THREE.Mesh>(null)
  const frameRef = useRef(0)
  const readIndexRef = useRef(0)
  const textures = useMemo(() => createDebugTextures(), [])
  const targets = useMemo(() => createDebugTargets(), [])
  const materials = useMemo(() => createDebugMaterials(textures), [textures])
  const compute = useMemo(() => createComputeResources(materials.velocity), [materials.velocity])
  const geometry = useMemo(() => createDebugParticleGeometry(textures), [textures])
  const renderUniforms = useMemo(
    () => ({
      uPositionTexture: { value: textures.initialPositionTexture as THREE.Texture },
      uPointScale: { value: DEBUG_POINT_SCALE },
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color(accentColor) },
      uColorB: { value: new THREE.Color('#8f7ad8') },
      uColorC: { value: new THREE.Color('#d19ab8') },
    }),
    [accentColor, textures.initialPositionTexture],
  )

  useEffect(() => {
    return () => {
      geometry.dispose()
      materials.position.dispose()
      materials.velocity.dispose()
      textures.initialPositionTexture.dispose()
      textures.initialVelocityTexture.dispose()
      Object.values(targets).forEach((target) => target.dispose())
      compute.geometry.dispose()
    }
  }, [compute.geometry, geometry, materials, targets, textures])

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime()
    const delta = Math.min(clock.getDelta(), 0.033)
    const frame = frameRef.current
    const readIndex = readIndexRef.current
    const positionRead = readIndex === 0 ? targets.positionA : targets.positionB
    const positionWrite = readIndex === 0 ? targets.positionB : targets.positionA
    const velocityRead = readIndex === 0 ? targets.velocityA : targets.velocityB
    const velocityWrite = readIndex === 0 ? targets.velocityB : targets.velocityA

    materials.velocity.uniforms.uPositionTexture.value = frame < 1 ? textures.initialPositionTexture : positionRead.texture
    materials.velocity.uniforms.uVelocityTexture.value = frame < 1 ? textures.initialVelocityTexture : velocityRead.texture
    materials.velocity.uniforms.uDelta.value = delta
    materials.velocity.uniforms.uFrame.value = frame
    materials.velocity.uniforms.uTime.value = elapsed
    renderComputePass(gl, compute, materials.velocity, velocityWrite)

    materials.position.uniforms.uPositionTexture.value = frame < 1 ? textures.initialPositionTexture : positionRead.texture
    materials.position.uniforms.uVelocityTexture.value = velocityWrite.texture
    materials.position.uniforms.uDelta.value = delta
    materials.position.uniforms.uDebugTextureMotion.value = GPGPU_DEBUG_TEXTURE_MOTION ? 1 : 0
    materials.position.uniforms.uFrame.value = frame
    materials.position.uniforms.uTime.value = elapsed
    renderComputePass(gl, compute, materials.position, positionWrite)

    renderUniforms.uPositionTexture.value = positionWrite.texture
    renderUniforms.uTime.value = elapsed
    ;(renderUniforms.uColorA.value as THREE.Color).lerp(new THREE.Color(accentColor), 0.04)

    if (helperRef.current) {
      helperRef.current.position.x = Math.sin(elapsed * 1.2) * 1.5
      helperRef.current.position.y = Math.cos(elapsed * 0.9) * 0.45
    }

    readIndexRef.current = readIndex === 0 ? 1 : 0
    frameRef.current += 1
  })

  return (
    <group>
      <Html center position={[0, 3.75, 0]} style={{ pointerEvents: 'none' }}>
        <div
          style={{
            color: '#c7eaff',
            fontSize: 12,
            letterSpacing: 1.4,
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            textShadow: '0 0 14px rgba(125, 211, 252, 0.55)',
          }}
        >
          GPGPU DEBUG ACTIVE
        </div>
      </Html>
      <mesh ref={helperRef} position={[0, -3.25, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#ff3434" transparent opacity={0.82} depthWrite={false} />
      </mesh>
      <points frustumCulled={false}>
        <primitive object={geometry} attach="geometry" />
        <shaderMaterial
          vertexShader={particleVertexShader}
          fragmentShader={particleFragmentShader}
          uniforms={renderUniforms}
          transparent
          depthWrite={false}
          depthTest
          blending={THREE.NormalBlending}
        />
      </points>
    </group>
  )
}

function createDebugTextures(): DebugTextures {
  const count = DEBUG_PARTICLE_COUNT
  const positionData = new Float32Array(count * 4)
  const velocityData = new Float32Array(count * 4)
  const staticPositions = new Float32Array(count * 3)
  const references = new Float32Array(count * 2)
  const seeds = new Float32Array(count)
  const sizes = new Float32Array(count)

  for (let index = 0; index < count; index += 1) {
    const x = index % DEBUG_TEXTURE_SIZE
    const y = Math.floor(index / DEBUG_TEXTURE_SIZE)
    const seedA = random(index * 7 + 1)
    const seedB = random(index * 11 + 3)
    const seedC = random(index * 17 + 5)
    const layer = seedA < 0.24 ? 0 : seedA < 0.78 ? 1 : 2
    const angle = index * 2.399963 + seedB * 0.8
    const radius = Math.pow(seedC, layer === 0 ? 0.62 : layer === 1 ? 0.42 : 0.24) * (layer === 0 ? 0.42 : layer === 1 ? 0.9 : 1.34)
    const offset = index * 4
    const uvOffset = index * 2

    positionData[offset] = THREE.MathUtils.clamp(
      Math.cos(angle) * radius * (0.84 + random(index * 19 + 9) * 0.22),
      CLUSTER_MIN.x,
      CLUSTER_MAX.x,
    )
    positionData[offset + 1] = THREE.MathUtils.clamp(
      Math.sin(angle) * radius * (layer === 2 ? 0.38 : 0.55),
      CLUSTER_MIN.y,
      CLUSTER_MAX.y,
    )
    positionData[offset + 2] = THREE.MathUtils.clamp(
      (random(index * 23 + 13) - 0.5) * (layer === 0 ? 0.32 : layer === 1 ? 0.7 : 1.1),
      CLUSTER_MIN.z,
      CLUSTER_MAX.z,
    )
    positionData[offset + 3] = layer
    staticPositions[index * 3] = positionData[offset]
    staticPositions[index * 3 + 1] = positionData[offset + 1]
    staticPositions[index * 3 + 2] = positionData[offset + 2]

    velocityData[offset] = (random(index * 29 + 15) - 0.5) * 0.035
    velocityData[offset + 1] = (random(index * 31 + 17) - 0.5) * 0.035
    velocityData[offset + 2] = (random(index * 37 + 19) - 0.5) * 0.025
    velocityData[offset + 3] = 1

    references[uvOffset] = (x + 0.5) / DEBUG_TEXTURE_SIZE
    references[uvOffset + 1] = (y + 0.5) / DEBUG_TEXTURE_SIZE
    seeds[index] = seedA
    sizes[index] = layer === 0 ? 3.4 + seedC * 3.4 : layer === 1 ? 2.0 + seedC * 2.7 : 1.25 + seedC * 1.9
  }

  return {
    initialPositionTexture: createDataTexture(positionData),
    initialVelocityTexture: createDataTexture(velocityData),
    staticPositions,
    references,
    seeds,
    sizes,
  }
}

function createDataTexture(data: Float32Array): THREE.DataTexture {
  const texture = new THREE.DataTexture(data, DEBUG_TEXTURE_SIZE, DEBUG_TEXTURE_SIZE, THREE.RGBAFormat, THREE.FloatType)
  texture.needsUpdate = true
  texture.minFilter = THREE.NearestFilter
  texture.magFilter = THREE.NearestFilter
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  return texture
}

function createDebugTargets(): DebugTargets {
  return {
    positionA: createRenderTarget(),
    positionB: createRenderTarget(),
    velocityA: createRenderTarget(),
    velocityB: createRenderTarget(),
  }
}

function createRenderTarget(): THREE.WebGLRenderTarget {
  return new THREE.WebGLRenderTarget(DEBUG_TEXTURE_SIZE, DEBUG_TEXTURE_SIZE, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
    format: THREE.RGBAFormat,
    type: THREE.HalfFloatType,
    depthBuffer: false,
    stencilBuffer: false,
  })
}

function createComputeResources(initialMaterial: THREE.ShaderMaterial) {
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 2)
  camera.position.z = 1
  const scene = new THREE.Scene()
  const geometry = new THREE.PlaneGeometry(2, 2)
  const mesh = new THREE.Mesh(geometry, initialMaterial)
  mesh.frustumCulled = false
  scene.add(mesh)
  return { camera, geometry, mesh, scene }
}

function createDebugMaterials(textures: DebugTextures) {
  return {
    velocity: new THREE.ShaderMaterial({
      vertexShader: fullscreenVertexShader,
      fragmentShader: velocityFragmentShader,
      uniforms: {
        uPositionTexture: { value: textures.initialPositionTexture },
        uVelocityTexture: { value: textures.initialVelocityTexture },
        uInitialVelocityTexture: { value: textures.initialVelocityTexture },
        uDelta: { value: 0.016 },
        uDebugTextureMotion: { value: GPGPU_DEBUG_TEXTURE_MOTION ? 1 : 0 },
        uFrame: { value: 0 },
        uTime: { value: 0 },
      },
      depthWrite: false,
      depthTest: false,
    }),
    position: new THREE.ShaderMaterial({
      vertexShader: fullscreenVertexShader,
      fragmentShader: positionFragmentShader,
      uniforms: {
        uInitialPositionTexture: { value: textures.initialPositionTexture },
        uPositionTexture: { value: textures.initialPositionTexture },
        uVelocityTexture: { value: textures.initialVelocityTexture },
        uDelta: { value: 0.016 },
        uFrame: { value: 0 },
        uTime: { value: 0 },
      },
      depthWrite: false,
      depthTest: false,
    }),
  }
}

function createDebugParticleGeometry(textures: DebugTextures): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(textures.staticPositions, 3))
  geometry.setAttribute('aReference', new THREE.BufferAttribute(textures.references, 2))
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(textures.seeds, 1))
  geometry.setAttribute('aSize', new THREE.BufferAttribute(textures.sizes, 1))
  geometry.computeBoundingSphere()
  return geometry
}

function renderComputePass(
  gl: THREE.WebGLRenderer,
  compute: ReturnType<typeof createComputeResources>,
  material: THREE.ShaderMaterial,
  target: THREE.WebGLRenderTarget,
): void {
  const previousTarget = gl.getRenderTarget()
  const previousXr = gl.xr.enabled
  const previousShadowAutoUpdate = gl.shadowMap.autoUpdate

  compute.mesh.material = material
  gl.xr.enabled = false
  gl.shadowMap.autoUpdate = false
  gl.setRenderTarget(target)
  gl.render(compute.scene, compute.camera)
  gl.setRenderTarget(previousTarget)
  gl.xr.enabled = previousXr
  gl.shadowMap.autoUpdate = previousShadowAutoUpdate
}

function random(seed: number): number {
  return Math.abs(Math.sin(seed * 12.9898) * 43758.5453) % 1
}
