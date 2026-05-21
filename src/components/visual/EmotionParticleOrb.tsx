import { Canvas, useFrame } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import type { PlaybackStatus } from '../../types/audio'

interface EmotionParticleOrbProps {
  status: PlaybackStatus
  mood?: string
  listening?: boolean
}

type OrbState = 'idle' | 'thinking' | 'listening' | 'speaking' | 'fading' | 'playing' | 'paused'
type MoodTone = 'calm' | 'happy' | 'sad' | 'romantic' | 'lonely'

const particleCount = 128

interface OrbProfile {
  primary: string
  secondary: string
  particle: string
  density: number
  gather: number
  expansion: number
  drift: number
  pulse: number
  speed: number
  opacity: number
}

export function EmotionParticleOrb({ status, mood, listening = false }: EmotionParticleOrbProps) {
  const [webglFailed, setWebglFailed] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const orbState = listening ? 'listening' : getOrbState(status)
  const moodTone = getMoodTone(mood)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  if (webglFailed || !canUseWebGL()) {
    return <EmotionOrbFallback orbState={orbState} moodTone={moodTone} />
  }

  return (
    <div className={`emotion-orb emotion-orb-${orbState} mood-${moodTone}`} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 7.4], fov: 40 }}
        dpr={[1, 1.35]}
        gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        onError={() => setWebglFailed(true)}
      >
        <ambientLight intensity={0.32} />
        <ParticleCloud orbState={orbState} moodTone={moodTone} reducedMotion={reducedMotion} />
        <EnergyAura orbState={orbState} moodTone={moodTone} reducedMotion={reducedMotion} />
        <OrbitRings orbState={orbState} moodTone={moodTone} reducedMotion={reducedMotion} />
        <Preload all />
      </Canvas>
      <div className="emotion-orb-vignette" />
      <svg className="emotion-orbit-lines" viewBox="0 0 420 420" aria-hidden="true">
        <circle cx="210" cy="210" r="138" />
        <ellipse cx="210" cy="210" rx="172" ry="86" />
      </svg>
    </div>
  )
}

function ParticleCloud({
  orbState,
  moodTone,
  reducedMotion,
}: {
  orbState: OrbState
  moodTone: MoodTone
  reducedMotion: boolean
}) {
  const meshRef = useRef<THREE.InstancedMesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>>(null)
  const materialRef = useRef<THREE.MeshBasicMaterial>(null)
  const dummyRef = useRef(new THREE.Object3D())
  const basePositions = useMemo(() => createOrbPositions(), [])
  const profile = getOrbProfile(orbState, moodTone, reducedMotion)

  useFrame(({ clock }) => {
    const mesh = meshRef.current
    const material = materialRef.current
    const dummy = dummyRef.current
    if (!mesh || !material) return

    const elapsed = clock.getElapsedTime()
    const rhythm = Math.sin(elapsed * profile.speed) * profile.pulse
    const activeCount = Math.floor(particleCount * profile.density)

    for (let index = 0; index < particleCount; index += 1) {
      const offset = index * 3
      const visible = index < activeCount
      const baseX = basePositions[offset]
      const baseY = basePositions[offset + 1]
      const baseZ = basePositions[offset + 2]
      const layer = 0.64 + (index % 9) * 0.05
      const driftWave = Math.sin(elapsed * profile.speed + index * 0.31)
      const breathWave = Math.cos(elapsed * profile.speed * 0.72 + index * 0.23)
      const scale = 1 + profile.expansion + rhythm - profile.gather * 0.46

      dummy.position.x = baseX * scale - baseX * profile.gather * 0.3 + driftWave * profile.drift * layer
      dummy.position.y = baseY * scale - baseY * profile.gather * 0.22 + breathWave * profile.drift * 0.7
      dummy.position.z = baseZ * (0.82 + profile.expansion * 0.28) + Math.sin(elapsed * 0.22 + index) * 0.08
      dummy.scale.setScalar(visible ? 0.8 + layer * 0.22 + Math.max(0, rhythm) * 0.7 : 0.001)
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
    }

    mesh.instanceMatrix.needsUpdate = true
    mesh.rotation.y = Math.sin(elapsed * 0.08) * 0.1
    mesh.rotation.z = elapsed * 0.012
    material.opacity = profile.opacity + Math.max(0, rhythm) * 0.12
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]}>
      <sphereGeometry args={[0.035, 8, 8]} />
      <meshBasicMaterial
        ref={materialRef}
        color={profile.particle}
        transparent
        opacity={profile.opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  )
}

function EnergyAura({
  orbState,
  moodTone,
  reducedMotion,
}: {
  orbState: OrbState
  moodTone: MoodTone
  reducedMotion: boolean
}) {
  const warmRef = useRef<THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>>(null)
  const coolRef = useRef<THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>>(null)
  const profile = getOrbProfile(orbState, moodTone, reducedMotion)

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime()
    const pulse = 1 + Math.sin(elapsed * profile.speed * 0.9) * profile.pulse * 1.8

    if (warmRef.current) {
      warmRef.current.scale.setScalar((1.42 + profile.expansion) * pulse)
      warmRef.current.material.opacity = profile.opacity * 0.28
    }

    if (coolRef.current) {
      coolRef.current.scale.setScalar((1.86 + profile.expansion * 0.8) / pulse)
      coolRef.current.rotation.z = elapsed * 0.025
      coolRef.current.material.opacity = profile.opacity * 0.18
    }
  })

  return (
    <>
      <mesh ref={warmRef} position={[-0.24, 0.1, -1.2]}>
        <sphereGeometry args={[1.55, 32, 16]} />
        <meshBasicMaterial
          color={profile.primary}
          transparent
          opacity={profile.opacity * 0.28}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={coolRef} position={[0.28, -0.04, -1.7]}>
        <sphereGeometry args={[1.4, 32, 16]} />
        <meshBasicMaterial
          color={profile.secondary}
          transparent
          opacity={profile.opacity * 0.18}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  )
}

function OrbitRings({
  orbState,
  moodTone,
  reducedMotion,
}: {
  orbState: OrbState
  moodTone: MoodTone
  reducedMotion: boolean
}) {
  const ringRef = useRef<THREE.Group>(null)
  const profile = getOrbProfile(orbState, moodTone, reducedMotion)
  const visible = orbState === 'listening' || orbState === 'speaking' || orbState === 'thinking'

  useFrame(({ clock }) => {
    if (!ringRef.current) return
    const elapsed = clock.getElapsedTime()
    ringRef.current.rotation.z = elapsed * (reducedMotion ? 0.015 : 0.075)
    ringRef.current.rotation.x = Math.sin(elapsed * 0.2) * 0.18
  })

  return (
    <group ref={ringRef} visible={visible}>
      <mesh rotation={[Math.PI / 2.8, 0, 0]}>
        <torusGeometry args={[2.18, 0.006, 8, 96]} />
        <meshBasicMaterial
          color={profile.secondary}
          transparent
          opacity={visible ? 0.42 : 0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2.05, 0.3, 0.2]}>
        <torusGeometry args={[1.54, 0.005, 8, 96]} />
        <meshBasicMaterial
          color={profile.primary}
          transparent
          opacity={visible ? 0.3 : 0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

function EmotionOrbFallback({ orbState, moodTone }: { orbState: OrbState; moodTone: MoodTone }) {
  return (
    <div className={`emotion-orb emotion-orb-fallback emotion-orb-${orbState} mood-${moodTone}`} aria-hidden="true">
      <div className="fallback-orb-core" />
      <div className="fallback-orb-ring" />
      <div className="fallback-orb-particles">
        {Array.from({ length: 42 }, (_, index) => (
          <span
            key={index}
            style={{
              left: `${10 + ((index * 19) % 80)}%`,
              top: `${10 + ((index * 31) % 78)}%`,
              animationDelay: `${index * 0.13}s`,
            }}
          />
        ))}
      </div>
      <div className="emotion-orb-vignette" />
    </div>
  )
}

function getOrbState(status: PlaybackStatus): OrbState {
  if (status === 'idle') return 'idle'
  if (status === 'paused') return 'paused'
  if (status === 'understanding' || status === 'searching' || status === 'preparing') return 'thinking'
  if (status === 'voice-speaking' || status === 'music-ducked') return 'speaking'
  if (status === 'fading-in') return 'fading'
  return 'playing'
}

function getMoodTone(mood?: string): MoodTone {
  if (!mood) return 'calm'
  if (mood.includes('想念')) return 'romantic'
  if (mood.includes('孤独')) return 'lonely'
  if (mood.includes('疲惫') || mood.includes('安静')) return 'sad'
  if (mood.includes('释然') || mood.includes('轻松') || mood.includes('温暖')) return 'happy'
  return 'calm'
}

function getOrbProfile(orbState: OrbState, moodTone: MoodTone, reducedMotion: boolean): OrbProfile {
  const moodProfiles: Record<MoodTone, Pick<OrbProfile, 'primary' | 'secondary' | 'particle' | 'density' | 'opacity'>> = {
    calm: { primary: '#8ddff0', secondary: '#bca7ff', particle: '#d7f7ff', density: 0.88, opacity: 0.48 },
    happy: { primary: '#ffd58d', secondary: '#f6a3d3', particle: '#fff0c8', density: 0.96, opacity: 0.56 },
    sad: { primary: '#7bb7d8', secondary: '#8e82c8', particle: '#c9ddff', density: 0.72, opacity: 0.36 },
    romantic: { primary: '#f4a0c8', secondary: '#b995ff', particle: '#ffd8ef', density: 0.9, opacity: 0.52 },
    lonely: { primary: '#86c9dd', secondary: '#8a79b8', particle: '#d6d4ff', density: 0.58, opacity: 0.34 },
  }

  const stateProfiles: Record<OrbState, Pick<OrbProfile, 'gather' | 'expansion' | 'drift' | 'pulse' | 'speed'>> = {
    idle: { gather: 0.02, expansion: 0, drift: 0.04, pulse: 0.02, speed: 0.42 },
    thinking: { gather: 0.42, expansion: -0.06, drift: 0.034, pulse: 0.032, speed: 0.58 },
    listening: { gather: 0.18, expansion: 0.04, drift: 0.048, pulse: 0.052, speed: 0.72 },
    speaking: { gather: 0.08, expansion: 0.08, drift: 0.064, pulse: 0.062, speed: 0.92 },
    fading: { gather: 0, expansion: 0.28, drift: 0.052, pulse: 0.04, speed: 0.52 },
    playing: { gather: 0.04, expansion: 0.12, drift: 0.058, pulse: 0.044, speed: 0.78 },
    paused: { gather: 0, expansion: -0.04, drift: 0.024, pulse: 0.014, speed: 0.28 },
  }

  const motionScale = reducedMotion ? 0.28 : 1
  const mood = moodProfiles[moodTone]
  const state = stateProfiles[orbState]

  return {
    ...mood,
    ...state,
    drift: state.drift * motionScale,
    pulse: state.pulse * motionScale,
    speed: state.speed * (reducedMotion ? 0.45 : 1),
  }
}

function createOrbPositions(): Float32Array {
  const positions = new Float32Array(particleCount * 3)

  for (let index = 0; index < particleCount; index += 1) {
    const radius = Math.sqrt((index + 0.5) / particleCount) * 2.8
    const angle = index * 2.399963
    const depth = Math.sin(index * 1.41) * 0.95
    const offset = index * 3

    positions[offset] = Math.cos(angle) * radius * 1.05
    positions[offset + 1] = Math.sin(angle) * radius * 0.82
    positions[offset + 2] = depth
  }

  return positions
}

function canUseWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
  } catch {
    return false
  }
}
