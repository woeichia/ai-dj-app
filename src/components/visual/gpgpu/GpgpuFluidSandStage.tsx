import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import {
  GPGPU_PARTICLE_COUNT,
  GPGPU_TEXTURE_SIZE,
  createSimulationTextures,
} from './createSimulationTextures'
import {
  fullscreenVertexShader,
  particleFragmentShader,
  particleVertexShader,
  positionFragmentShader,
  velocityFragmentShader,
} from './shaders'

type FluidState = 'idle' | 'thinking' | 'listening' | 'speaking' | 'fading' | 'playing' | 'paused'

export interface GpgpuFluidSandProfile {
  primary: string
  secondary: string
  particle: string
  drift: number
  pulse: number
  speed: number
  opacity: number
}

interface GpgpuFluidSandStageProps {
  orbState: FluidState
  profile: GpgpuFluidSandProfile
  reducedMotion: boolean
  onUnavailable: () => void
}

interface SimulationTargets {
  positionA: THREE.WebGLRenderTarget
  positionB: THREE.WebGLRenderTarget
  velocityA: THREE.WebGLRenderTarget
  velocityB: THREE.WebGLRenderTarget
}

interface SimulationMaterials {
  velocity: THREE.ShaderMaterial
  position: THREE.ShaderMaterial
}

const simulationQuadGeometry = new THREE.PlaneGeometry(2, 2)
const GPGPU_DEBUG_MOTION = true
const phaseAMotionScale = 3.4
const phaseAFlowBoost = 2.8

export function GpgpuFluidSandStage({
  orbState,
  profile,
  reducedMotion,
  onUnavailable,
}: GpgpuFluidSandStageProps) {
  const { gl } = useThree()
  const pointsRef = useRef<THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>>(null)
  const frameRef = useRef(0)
  const readIndexRef = useRef(0)

  const supported = useMemo(() => canUseGpgpu(gl), [gl])
  const textures = useMemo(() => createSimulationTextures(GPGPU_TEXTURE_SIZE), [])
  const targets = useMemo(() => createSimulationTargets(GPGPU_TEXTURE_SIZE), [])
  const materials = useMemo(() => createSimulationMaterials(textures), [textures])
  const compute = useMemo(() => createComputeResources(materials.velocity), [materials.velocity])
  const geometry = useMemo(() => createParticleGeometry(textures), [textures])
  const renderUniforms = useMemo(
    () => ({
      uPositionTexture: { value: textures.initialPositionTexture as THREE.Texture },
      uPointScale: { value: 1.18 },
      uBasePointSize: { value: 1.0 },
      uTime: { value: 0 },
      uInternalMotion: { value: GPGPU_DEBUG_MOTION ? 1 : 0.55 },
      uColorA: { value: new THREE.Color(profile.primary) },
      uColorB: { value: new THREE.Color(profile.secondary) },
      uColorC: { value: new THREE.Color(profile.particle) },
      uOpacity: { value: profile.opacity * 0.86 },
    }),
    [profile.particle, profile.primary, profile.secondary, profile.opacity, textures.initialPositionTexture],
  )

  useEffect(() => {
    if (!supported) onUnavailable()
  }, [onUnavailable, supported])

  useEffect(() => {
    return () => {
      geometry.dispose()
      textures.initialPositionTexture.dispose()
      textures.initialVelocityTexture.dispose()
      Object.values(targets).forEach((target) => target.dispose())
      materials.velocity.dispose()
      materials.position.dispose()
      compute.geometry.dispose()
    }
  }, [compute.geometry, geometry, materials, targets, textures])

  useFrame(({ clock }) => {
    if (!supported || reducedMotion) return

    const elapsed = clock.getElapsedTime()
    const frame = frameRef.current
    const readIndex = readIndexRef.current
    const positionRead = readIndex === 0 ? targets.positionA : targets.positionB
    const positionWrite = readIndex === 0 ? targets.positionB : targets.positionA
    const velocityRead = readIndex === 0 ? targets.velocityA : targets.velocityB
    const velocityWrite = readIndex === 0 ? targets.velocityB : targets.velocityA
    const delta = Math.min(clock.getDelta(), 0.033)
    const stateEnergy = getStateEnergy(orbState)

    // Velocity texture update: compute the next velocity texture from previous velocity, current position, time, and flow.
    materials.velocity.uniforms.uPositionTexture.value = frame < 1 ? textures.initialPositionTexture : positionRead.texture
    materials.velocity.uniforms.uVelocityTexture.value = frame < 1 ? textures.initialVelocityTexture : velocityRead.texture
    materials.velocity.uniforms.uTime.value = elapsed
    materials.velocity.uniforms.uDelta.value = delta
    materials.velocity.uniforms.uFrame.value = frame
    materials.velocity.uniforms.uDamping.value = getStateDamping(orbState)
    materials.velocity.uniforms.uDebugMotion.value = GPGPU_DEBUG_MOTION ? 1 : 0
    materials.velocity.uniforms.uFlowStrength.value = profile.drift * (0.34 + stateEnergy * 0.12) * phaseAFlowBoost
    materials.velocity.uniforms.uMotionScale.value = phaseAMotionScale
    materials.velocity.uniforms.uStateEnergy.value = stateEnergy
    // Compute step: this render pass writes the velocity FBO every frame.
    renderSimulationPass(gl, compute, materials.velocity, velocityWrite)

    // Position texture update: compute the next position texture by sampling the freshly-written velocity texture.
    materials.position.uniforms.uPositionTexture.value = frame < 1 ? textures.initialPositionTexture : positionRead.texture
    materials.position.uniforms.uVelocityTexture.value = velocityWrite.texture
    materials.position.uniforms.uDelta.value = delta
    materials.position.uniforms.uDebugMotion.value = GPGPU_DEBUG_MOTION ? 1 : 0
    materials.position.uniforms.uFrame.value = frame
    materials.position.uniforms.uTime.value = elapsed
    materials.position.uniforms.uMotionScale.value = phaseAMotionScale
    // Compute step: this render pass writes the position FBO every frame.
    renderSimulationPass(gl, compute, materials.position, positionWrite)

    // Render shader texture sampling: Points render from the current computed position texture, not static geometry positions.
    renderUniforms.uPositionTexture.value = positionWrite.texture
    renderUniforms.uTime.value = elapsed
    renderUniforms.uInternalMotion.value = GPGPU_DEBUG_MOTION ? 1 : 0.55
    renderUniforms.uPointScale.value = THREE.MathUtils.lerp(
      renderUniforms.uPointScale.value as number,
      getPointScale(orbState),
      0.04,
    )
    renderUniforms.uOpacity.value = THREE.MathUtils.lerp(
      renderUniforms.uOpacity.value as number,
      profile.opacity * 0.86,
      0.04,
    )
    ;(renderUniforms.uColorA.value as THREE.Color).lerp(new THREE.Color(profile.primary), 0.04)
    ;(renderUniforms.uColorB.value as THREE.Color).lerp(new THREE.Color(profile.secondary), 0.04)
    ;(renderUniforms.uColorC.value as THREE.Color).lerp(new THREE.Color(profile.particle), 0.04)

    if (pointsRef.current) pointsRef.current.rotation.z = 0

    readIndexRef.current = readIndex === 0 ? 1 : 0
    frameRef.current += 1
  })

  if (!supported || reducedMotion) return null

  return (
    <points ref={pointsRef} frustumCulled={false}>
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
  )
}

function canUseGpgpu(gl: THREE.WebGLRenderer): boolean {
  const context = gl.getContext()
  const isWebGL2 = gl.capabilities.isWebGL2
  const floatSupport = Boolean(
    context.getExtension('OES_texture_float') ||
      context.getExtension('OES_texture_half_float') ||
      isWebGL2,
  )
  const colorBufferSupport = Boolean(
    context.getExtension('EXT_color_buffer_float') ||
      context.getExtension('EXT_color_buffer_half_float') ||
      isWebGL2,
  )

  return floatSupport && colorBufferSupport
}

function createSimulationTargets(size: number): SimulationTargets {
  return {
    positionA: createRenderTarget(size),
    positionB: createRenderTarget(size),
    velocityA: createRenderTarget(size),
    velocityB: createRenderTarget(size),
  }
}

function createRenderTarget(size: number): THREE.WebGLRenderTarget {
  return new THREE.WebGLRenderTarget(size, size, {
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

function createSimulationMaterials(textures: ReturnType<typeof createSimulationTextures>): SimulationMaterials {
  return {
    velocity: new THREE.ShaderMaterial({
      vertexShader: fullscreenVertexShader,
      fragmentShader: velocityFragmentShader,
      uniforms: {
        uPositionTexture: { value: textures.initialPositionTexture },
        uVelocityTexture: { value: textures.initialVelocityTexture },
        uInitialVelocityTexture: { value: textures.initialVelocityTexture },
        uTime: { value: 0 },
        uDelta: { value: 0.016 },
        uFrame: { value: 0 },
        uDamping: { value: 0.975 },
        uDebugMotion: { value: GPGPU_DEBUG_MOTION ? 1 : 0 },
        uFlowStrength: { value: 0.08 },
        uMotionScale: { value: phaseAMotionScale },
        uStateEnergy: { value: 0.2 },
      },
      depthWrite: false,
      depthTest: false,
    }),
    position: new THREE.ShaderMaterial({
      vertexShader: fullscreenVertexShader,
      fragmentShader: positionFragmentShader,
      uniforms: {
        uPositionTexture: { value: textures.initialPositionTexture },
        uVelocityTexture: { value: textures.initialVelocityTexture },
        uInitialPositionTexture: { value: textures.initialPositionTexture },
        uDelta: { value: 0.016 },
        uDebugMotion: { value: GPGPU_DEBUG_MOTION ? 1 : 0 },
        uFrame: { value: 0 },
        uBoundsRadius: { value: 5.4 },
        uTime: { value: 0 },
        uMotionScale: { value: phaseAMotionScale },
      },
      depthWrite: false,
      depthTest: false,
    }),
  }
}

function createParticleGeometry(textures: ReturnType<typeof createSimulationTextures>): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(GPGPU_PARTICLE_COUNT * 3), 3))
  geometry.setAttribute('aReference', new THREE.BufferAttribute(textures.particleReferences, 2))
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(textures.particleSeeds, 1))
  geometry.setAttribute('aSize', new THREE.BufferAttribute(textures.particleSizes, 1))
  geometry.computeBoundingSphere()
  return geometry
}

function renderSimulationPass(
  gl: THREE.WebGLRenderer,
  compute: ReturnType<typeof createComputeResources>,
  material: THREE.ShaderMaterial,
  target: THREE.WebGLRenderTarget,
): void {
  const previousRenderTarget = gl.getRenderTarget()
  const previousXrEnabled = gl.xr.enabled
  const previousShadowAutoUpdate = gl.shadowMap.autoUpdate

  compute.mesh.material = material
  gl.xr.enabled = false
  gl.shadowMap.autoUpdate = false
  gl.setRenderTarget(target)
  gl.render(compute.scene, compute.camera)
  gl.setRenderTarget(previousRenderTarget)
  gl.xr.enabled = previousXrEnabled
  gl.shadowMap.autoUpdate = previousShadowAutoUpdate
}

function createComputeResources(initialMaterial: THREE.ShaderMaterial) {
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 2)
  camera.position.z = 1

  const scene = new THREE.Scene()
  const geometry = simulationQuadGeometry.clone()
  const mesh = new THREE.Mesh(geometry, initialMaterial)
  mesh.frustumCulled = false
  scene.add(mesh)

  return { camera, geometry, mesh, scene }
}

function getStateEnergy(orbState: FluidState): number {
  if (orbState === 'speaking') return 0.62
  if (orbState === 'thinking') return 0.52
  if (orbState === 'listening') return 0.44
  if (orbState === 'fading') return 0.38
  if (orbState === 'playing') return 0.34
  if (orbState === 'paused') return 0.08
  return 0.18
}

function getStateDamping(orbState: FluidState): number {
  if (orbState === 'paused') return 0.962
  if (orbState === 'speaking') return 0.984
  if (orbState === 'thinking') return 0.98
  return 0.976
}

function getPointScale(orbState: FluidState): number {
  if (orbState === 'paused') return 0.92
  if (orbState === 'speaking') return 1.22
  if (orbState === 'thinking' || orbState === 'listening') return 1.14
  return 1.08
}
