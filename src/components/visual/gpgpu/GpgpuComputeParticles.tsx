import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import {
  GPUComputationRenderer,
  type GPUComputationVariable,
} from 'three/examples/jsm/misc/GPUComputationRenderer.js'

const TEXTURE_SIZE = 64
const PARTICLE_COUNT = TEXTURE_SIZE * TEXTURE_SIZE

const velocityComputeShader = `
  uniform float uTime;
  uniform float uDelta;
  uniform float uDamping;
  uniform float uFlowStrength;

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec3 position = texture2D(texturePosition, uv).xyz;
    vec3 velocity = texture2D(textureVelocity, uv).xyz;

    vec3 tangent = normalize(vec3(-position.y, position.x, 0.0) + vec3(0.0001));
    vec3 flow = vec3(
      sin(uTime * 0.34 + uv.y * 6.283185),
      cos(uTime * 0.28 + uv.x * 6.283185),
      sin(uTime * 0.22 + length(position.xy) * 1.4)
    );
    vec3 centerPull = -position * 0.035;
    vec3 force = tangent * 0.16 + flow * 0.095 + centerPull;

    velocity += force * uFlowStrength * uDelta;
    velocity *= uDamping;
    velocity = clamp(velocity, vec3(-0.32), vec3(0.32));

    gl_FragColor = vec4(velocity, 1.0);
  }
`

const positionComputeShader = `
  uniform float uDelta;

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 positionSample = texture2D(texturePosition, uv);
    vec3 position = positionSample.xyz;
    float layer = positionSample.w;
    vec3 velocity = texture2D(textureVelocity, uv).xyz;

    position += velocity * uDelta * 1.75;
    position = clamp(position, vec3(-1.45, -0.92, -0.72), vec3(1.45, 0.92, 0.72));

    gl_FragColor = vec4(position, layer);
  }
`

const renderVertexShader = `
  precision highp float;

  uniform sampler2D uPositionTexture;
  uniform float uPointScale;
  uniform float uTime;

  attribute vec2 aReference;
  attribute float aSeed;
  attribute float aSize;

  varying float vAlpha;
  varying float vLayer;
  varying float vSeed;

  void main() {
    vec4 positionSample = texture2D(uPositionTexture, aReference);
    vec3 p = clamp(positionSample.xyz, vec3(-1.45, -0.92, -0.72), vec3(1.45, 0.92, 0.72));
    float layer = clamp(positionSample.w, 0.0, 2.0);

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float depthScale = clamp(7.0 / max(-mvPosition.z, 0.1), 0.6, 1.6);
    float breathe = 0.92 + sin(uTime * 0.58 + aSeed * 6.283185) * 0.08;
    gl_PointSize = max(aSize * uPointScale * depthScale * breathe, 2.7);

    vAlpha = 0.58 + (1.0 - layer * 0.12) * 0.16;
    vLayer = layer;
    vSeed = aSeed;
  }
`

const renderFragmentShader = `
  precision mediump float;

  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  varying float vAlpha;
  varying float vLayer;
  varying float vSeed;

  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    float core = smoothstep(0.44, 0.08, dist) * 0.88;
    float halo = smoothstep(0.5, 0.3, dist) * 0.1;
    float alpha = (core + halo) * vAlpha;

    if (alpha < 0.015) discard;

    vec3 color = mix(uColorA, uColorB, clamp(vLayer * 0.55, 0.0, 1.0));
    color = mix(color, uColorC, smoothstep(0.65, 2.0, vLayer));
    color = min(mix(color, vec3(1.0), 0.12 + vSeed * 0.03), vec3(0.88, 0.86, 0.92));

    gl_FragColor = vec4(color, alpha * 0.78);
  }
`

interface GpgpuComputeParticlesProps {
  accentColor?: string
  pointScale?: number
}

interface ComputeResources {
  gpuCompute: GPUComputationRenderer
  positionVariable: GPUComputationVariable
  velocityVariable: GPUComputationVariable
}

interface ParticleBuffers {
  references: Float32Array
  seeds: Float32Array
  sizes: Float32Array
}

export function GpgpuComputeParticles({
  accentColor = '#7fc7d8',
  pointScale = 1.08,
}: GpgpuComputeParticlesProps) {
  const { gl } = useThree()
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const computeResources = useMemo(() => createComputeResources(gl), [gl])
  const buffers = useMemo(() => createParticleBuffers(), [])
  const geometry = useMemo(() => createParticleGeometry(buffers), [buffers])
  const uniforms = useMemo(
    () => ({
      uPositionTexture: {
        value: computeResources.gpuCompute.getCurrentRenderTarget(computeResources.positionVariable).texture,
      },
      uPointScale: { value: pointScale },
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color(accentColor) },
      uColorB: { value: new THREE.Color('#8f7ad8') },
      uColorC: { value: new THREE.Color('#d19ab8') },
    }),
    [accentColor, computeResources, pointScale],
  )

  useEffect(() => {
    return () => {
      geometry.dispose()
      computeResources.gpuCompute.dispose()
    }
  }, [computeResources, geometry])

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime()
    const delta = Math.min(clock.getDelta(), 0.033)

    computeResources.velocityVariable.material.uniforms.uTime.value = elapsed
    computeResources.velocityVariable.material.uniforms.uDelta.value = delta
    computeResources.positionVariable.material.uniforms.uDelta.value = delta

    computeResources.gpuCompute.compute()

    const material = materialRef.current
    if (!material) return

    material.uniforms.uPositionTexture.value = computeResources.gpuCompute.getCurrentRenderTarget(
      computeResources.positionVariable,
    ).texture
    material.uniforms.uTime.value = elapsed
    material.uniforms.uPointScale.value = pointScale
    ;(material.uniforms.uColorA.value as THREE.Color).lerp(new THREE.Color(accentColor), 0.04)
  })

  return (
    <points frustumCulled={false}>
      <primitive object={geometry} attach="geometry" />
      <shaderMaterial
        ref={materialRef}
        vertexShader={renderVertexShader}
        fragmentShader={renderFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest
        blending={THREE.NormalBlending}
      />
    </points>
  )
}

function createComputeResources(renderer: THREE.WebGLRenderer): ComputeResources {
  const gpuCompute = new GPUComputationRenderer(TEXTURE_SIZE, TEXTURE_SIZE, renderer)
  const positionTexture = gpuCompute.createTexture()
  const velocityTexture = gpuCompute.createTexture()

  fillPositionTexture(positionTexture)
  fillVelocityTexture(velocityTexture)

  const positionVariable = gpuCompute.addVariable('texturePosition', positionComputeShader, positionTexture)
  const velocityVariable = gpuCompute.addVariable('textureVelocity', velocityComputeShader, velocityTexture)

  gpuCompute.setVariableDependencies(positionVariable, [positionVariable, velocityVariable])
  gpuCompute.setVariableDependencies(velocityVariable, [positionVariable, velocityVariable])

  positionVariable.material.uniforms.uDelta = { value: 0.016 }
  velocityVariable.material.uniforms.uTime = { value: 0 }
  velocityVariable.material.uniforms.uDelta = { value: 0.016 }
  velocityVariable.material.uniforms.uDamping = { value: 0.982 }
  velocityVariable.material.uniforms.uFlowStrength = { value: 1.0 }

  const error = gpuCompute.init()
  if (error && import.meta.env.DEV) {
    console.warn(`GpgpuComputeParticles init failed: ${error}`)
  }

  return { gpuCompute, positionVariable, velocityVariable }
}

function fillPositionTexture(texture: THREE.DataTexture): void {
  const data = texture.image.data as Float32Array

  for (let index = 0; index < PARTICLE_COUNT; index += 1) {
    const seedA = random(index * 7 + 1)
    const seedB = random(index * 11 + 3)
    const seedC = random(index * 17 + 5)
    const layer = seedA < 0.24 ? 0 : seedA < 0.78 ? 1 : 2
    const angle = index * 2.399963 + seedB * 0.8
    const radius = Math.pow(seedC, layer === 0 ? 0.62 : layer === 1 ? 0.42 : 0.24) * (layer === 0 ? 0.42 : layer === 1 ? 0.9 : 1.34)
    const offset = index * 4

    data[offset] = THREE.MathUtils.clamp(Math.cos(angle) * radius * (0.84 + random(index * 19 + 9) * 0.22), -1.4, 1.4)
    data[offset + 1] = THREE.MathUtils.clamp(Math.sin(angle) * radius * (layer === 2 ? 0.38 : 0.55), -0.9, 0.9)
    data[offset + 2] = THREE.MathUtils.clamp((random(index * 23 + 13) - 0.5) * (layer === 0 ? 0.32 : layer === 1 ? 0.7 : 1.1), -0.6, 0.6)
    data[offset + 3] = layer
  }
}

function fillVelocityTexture(texture: THREE.DataTexture): void {
  const data = texture.image.data as Float32Array

  for (let index = 0; index < PARTICLE_COUNT; index += 1) {
    const offset = index * 4
    data[offset] = (random(index * 29 + 15) - 0.5) * 0.018
    data[offset + 1] = (random(index * 31 + 17) - 0.5) * 0.018
    data[offset + 2] = (random(index * 37 + 19) - 0.5) * 0.012
    data[offset + 3] = 1
  }
}

function createParticleBuffers(): ParticleBuffers {
  const references = new Float32Array(PARTICLE_COUNT * 2)
  const seeds = new Float32Array(PARTICLE_COUNT)
  const sizes = new Float32Array(PARTICLE_COUNT)

  for (let index = 0; index < PARTICLE_COUNT; index += 1) {
    const x = index % TEXTURE_SIZE
    const y = Math.floor(index / TEXTURE_SIZE)
    const seed = random(index * 7 + 1)
    const layer = seed < 0.24 ? 0 : seed < 0.78 ? 1 : 2
    const uvOffset = index * 2

    references[uvOffset] = (x + 0.5) / TEXTURE_SIZE
    references[uvOffset + 1] = (y + 0.5) / TEXTURE_SIZE
    seeds[index] = seed
    sizes[index] = layer === 0 ? 3.2 + seed * 3.1 : layer === 1 ? 1.9 + seed * 2.5 : 1.2 + seed * 1.8
  }

  return { references, seeds, sizes }
}

function createParticleGeometry(buffers: ParticleBuffers): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(PARTICLE_COUNT * 3), 3))
  geometry.setAttribute('aReference', new THREE.BufferAttribute(buffers.references, 2))
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(buffers.seeds, 1))
  geometry.setAttribute('aSize', new THREE.BufferAttribute(buffers.sizes, 1))
  geometry.computeBoundingSphere()
  return geometry
}

function random(seed: number): number {
  return Math.abs(Math.sin(seed * 12.9898) * 43758.5453) % 1
}
