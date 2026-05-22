import { Canvas, useFrame } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import type { PlaybackStatus } from '../../types/audio'

interface EmotionParticleOrbProps {
  status: PlaybackStatus
  mood?: string
  listening?: boolean
  coverUrl?: string
  accentColor?: string
}

type OrbState = 'idle' | 'thinking' | 'listening' | 'speaking' | 'fading' | 'playing' | 'paused'
type MoodTone = 'calm' | 'happy' | 'sad' | 'romantic' | 'lonely'

const shaderParticleCount = 9000
const reducedMotionParticleCount = 2600

interface OrbProfile {
  primary: string
  secondary: string
  particle: string
  coreDensity: number
  middleDensity: number
  dustDensity: number
  gather: number
  expansion: number
  drift: number
  pulse: number
  swirl: number
  speed: number
  opacity: number
}

interface ShaderParticleBuffers {
  positions: Float32Array
  seeds: Float32Array
  phases: Float32Array
  sizes: Float32Array
  layers: Float32Array
  orders: Float32Array
  textureUvs: Float32Array
}

const particleVertexShader = `
  uniform float uTime;
  uniform float uGather;
  uniform float uExpansion;
  uniform float uDrift;
  uniform float uPulse;
  uniform float uSwirl;
  uniform float uSpeed;
  uniform float uPointScale;
  uniform float uBasePointSize;
  uniform vec3 uLayerDensity;

  attribute float aSeed;
  attribute float aPhase;
  attribute float aSize;
  attribute float aLayer;
  attribute float aOrder;
  attribute vec2 aTextureUv;

  varying float vAlpha;
  varying float vGlow;
  varying float vLayer;
  varying vec2 vTextureUv;

  vec4 permute(vec4 x) {
    return mod(((x * 34.0) + 1.0) * x, 289.0);
  }

  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }

  float snoise(vec3 v) {
    const vec2 c = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 d = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i = floor(v + dot(v, c.yyy));
    vec3 x0 = v - i + dot(i, c.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + c.xxx;
    vec3 x2 = x0 - i2 + c.yyy;
    vec3 x3 = x0 - d.yyy;

    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * d.wyz - d.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  vec3 curlNoise(vec3 p) {
    float e = 0.12;
    float n1 = snoise(vec3(p.x, p.y + e, p.z));
    float n2 = snoise(vec3(p.x, p.y - e, p.z));
    float a = (n1 - n2) / (2.0 * e);

    n1 = snoise(vec3(p.x, p.y, p.z + e));
    n2 = snoise(vec3(p.x, p.y, p.z - e));
    float b = (n1 - n2) / (2.0 * e);

    n1 = snoise(vec3(p.x + e, p.y, p.z));
    n2 = snoise(vec3(p.x - e, p.y, p.z));
    float c = (n1 - n2) / (2.0 * e);

    return normalize(vec3(a - b, b - c, c - a) + vec3(0.0001));
  }

  mat2 rotate2d(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
  }

  void main() {
    float density = mix(mix(uLayerDensity.x, uLayerDensity.y, step(0.5, aLayer)), uLayerDensity.z, step(1.5, aLayer));
    float visible = step(aOrder, density);
    vec3 p = position;

    float layerDepth = 1.0 + aLayer * 0.6;
    float delayedTime = uTime - aSeed * 0.58;
    float breath = sin(delayedTime * uSpeed * 0.42 + aPhase) * uPulse;
    float gather = uGather * (1.0 - aLayer * 0.18);
    float radius = length(p.xy);
    float pulseWave = max(0.0, sin(delayedTime * 1.36 - radius * 0.92 + aPhase)) * uPulse * 1.2;
    float swirl = (uSwirl + pulseWave * 0.22) * (0.45 + aLayer * 0.32);
    float focusEase = smoothstep(0.0, 1.0, clamp(gather * 2.0, 0.0, 1.0));

    p.xy *= rotate2d(swirl * sin(delayedTime * 0.22 + aPhase));
    p *= 1.0 + uExpansion + breath - gather * 0.22 + pulseWave * 0.1;

    vec3 flowDomain = p * (0.26 + aLayer * 0.07) + vec3(aSeed * 5.0, delayedTime * 0.07, aPhase);
    vec3 curlA = curlNoise(flowDomain);
    vec3 curlB = curlNoise(flowDomain * 0.64 + vec3(1.7, -0.4, delayedTime * 0.02));
    vec3 fluidFlow = mix(curlA, curlB, 0.42);
    vec3 inertialFlow = mix(fluidFlow * 0.56, curlB * 0.34, smoothstep(0.0, 1.0, fract(aSeed + delayedTime * 0.018)));
    p += inertialFlow * uDrift * layerDepth * 0.72;
    p.xy -= normalize(p.xy + vec2(0.0001)) * gather * (0.12 + aLayer * 0.035);
    p.z += sin(delayedTime * 0.11 + aPhase) * uDrift * (0.7 + aLayer * 0.32);
    p = mix(position + (p - position) * 0.68, p, 0.52 + focusEase * 0.3);

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float depthScale = clamp(7.2 / max(-mvPosition.z, 0.1), 0.55, 1.65);
    float calculatedSize = aSize * uBasePointSize * uPointScale * depthScale * (0.72 + pulseWave * 0.54) * visible;
    gl_PointSize = max(calculatedSize, 3.5);
    vAlpha = visible * (0.235 + aLayer * 0.06 + max(0.0, breath) * 0.11 + pulseWave * 0.105);
    vGlow = clamp(0.13 + pulseWave * 0.36 + (1.0 - aLayer) * 0.055, 0.0, 0.46);
    vLayer = aLayer;
    vTextureUv = aTextureUv;
  }
`

const particleFragmentShader = `
  precision mediump float;

  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform float uOpacity;
  uniform sampler2D uTexture;
  uniform float uTextureInfluence;

  varying float vAlpha;
  varying float vGlow;
  varying float vLayer;
  varying vec2 vTextureUv;

  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    float core = smoothstep(0.44, 0.07, dist) * 0.92;
    float halo = smoothstep(0.5, 0.27, dist) * 0.16;
    float circularMask = core + halo * vGlow;
    float grainAlpha = clamp(0.86 + vAlpha * 0.18, 0.8, 1.0);
    float alpha = clamp(circularMask * grainAlpha * uOpacity, 0.0, 0.82);

    if (alpha < 0.015) discard;

    vec3 inner = mix(uColorA, uColorB, clamp(vLayer * 0.5, 0.0, 1.0));
    vec3 color = mix(inner, uColorC, smoothstep(0.7, 2.0, vLayer));
    vec3 textureColor = texture2D(uTexture, vTextureUv).rgb;
    textureColor = max(textureColor, vec3(0.08, 0.08, 0.12));
    color = mix(color, textureColor, uTextureInfluence);
    color = pow(color, vec3(0.74));
    color = mix(color, vec3(1.0), 0.22);
    color = min(color + vec3(0.045, 0.04, 0.06) * vGlow, vec3(0.92, 0.9, 0.96));
    gl_FragColor = vec4(color, alpha);
  }
`

export function EmotionParticleOrb({
  status,
  mood,
  listening = false,
  coverUrl,
  accentColor,
}: EmotionParticleOrbProps) {
  const [webglFailed, setWebglFailed] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const orbState = listening ? 'listening' : getOrbState(status)
  const moodTone = getMoodTone(mood)
  const atmosphereColor = accentColor ?? getOrbProfile(orbState, moodTone, reducedMotion).primary

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
      <CoverAtmosphere coverUrl={coverUrl} accentColor={atmosphereColor} orbState={orbState} />
      <Canvas
        camera={{ position: [0, 0, 12], fov: 52, near: 0.1, far: 80 }}
        dpr={[1, 1.35]}
        gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        onError={() => setWebglFailed(true)}
        style={{ position: 'relative', zIndex: 2 }}
      >
        <ParticleStageWithGpgpuFallback
          orbState={orbState}
          moodTone={moodTone}
          reducedMotion={reducedMotion}
          coverUrl={coverUrl}
          accentColor={atmosphereColor}
        />
        <Preload all />
      </Canvas>
      <div className="emotion-orb-vignette" />
    </div>
  )
}

function ParticleStageWithGpgpuFallback({
  orbState,
  moodTone,
  reducedMotion,
  coverUrl,
  accentColor,
}: {
  orbState: OrbState
  moodTone: MoodTone
  reducedMotion: boolean
  coverUrl?: string
  accentColor: string
}) {
  return (
    <ShaderParticleStage
      orbState={orbState}
      moodTone={moodTone}
      reducedMotion={reducedMotion}
      coverUrl={coverUrl}
      accentColor={accentColor}
    />
  )
}

function CoverAtmosphere({
  coverUrl,
  accentColor,
  orbState,
}: {
  coverUrl?: string
  accentColor: string
  orbState: OrbState
}) {
  const rgb = hexToRgb(accentColor)
  const opacity = orbState === 'paused' ? 0.12 : orbState === 'speaking' ? 0.2 : 0.16
  const backgroundImage = coverUrl
    ? [
        `radial-gradient(circle at 50% 48%, rgba(${rgb}, 0.16), transparent 48%)`,
        `linear-gradient(135deg, rgba(8, 12, 26, 0.82), rgba(${rgb}, 0.08))`,
        `url("${coverUrl}")`,
      ].join(', ')
    : [
        `radial-gradient(circle at 44% 42%, rgba(${rgb}, 0.14), transparent 34%)`,
        'radial-gradient(circle at 62% 58%, rgba(142, 99, 188, 0.08), transparent 42%)',
        'radial-gradient(circle at 50% 50%, rgba(71, 132, 154, 0.06), transparent 58%)',
      ].join(', ')

  return (
    <div
      style={{
        position: 'absolute',
        inset: '10%',
        zIndex: 0,
        borderRadius: '999px',
        backgroundImage,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        filter: 'blur(38px) saturate(0.58) brightness(0.48)',
        opacity,
        transform: 'translate3d(0, 0, 0) scale(1.1)',
        mixBlendMode: 'screen',
        pointerEvents: 'none',
      }}
    />
  )
}

function ShaderParticleStage({
  orbState,
  moodTone,
  reducedMotion,
  coverUrl,
  accentColor,
}: {
  orbState: OrbState
  moodTone: MoodTone
  reducedMotion: boolean
  coverUrl?: string
  accentColor: string
}) {
  const pointsRef = useRef<THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>>(null)
  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null)
  const auraRef = useRef<THREE.Group>(null)
  const cameraTargetRef = useRef(new THREE.Vector3(0, 0, 12))
  const particleCount = reducedMotion ? reducedMotionParticleCount : shaderParticleCount
  const buffers = useMemo(() => createShaderParticleBuffers(particleCount), [particleCount])
  const geometry = useMemo(() => {
    const nextGeometry = new THREE.BufferGeometry()
    nextGeometry.setAttribute('position', new THREE.BufferAttribute(buffers.positions, 3))
    nextGeometry.setAttribute('aSeed', new THREE.BufferAttribute(buffers.seeds, 1))
    nextGeometry.setAttribute('aPhase', new THREE.BufferAttribute(buffers.phases, 1))
    nextGeometry.setAttribute('aSize', new THREE.BufferAttribute(buffers.sizes, 1))
    nextGeometry.setAttribute('aLayer', new THREE.BufferAttribute(buffers.layers, 1))
    nextGeometry.setAttribute('aOrder', new THREE.BufferAttribute(buffers.orders, 1))
    nextGeometry.setAttribute('aTextureUv', new THREE.BufferAttribute(buffers.textureUvs, 2))
    nextGeometry.computeBoundingSphere()
    return nextGeometry
  }, [buffers])
  const profile = getOrbProfile(orbState, moodTone, reducedMotion)
  const fallbackTexture = useMemo(() => createEmotionalTexture(accentColor), [accentColor])
  const uniforms = useMemo(
    () =>
      ({
        uTime: { value: 0 },
        uGather: { value: 0.04 },
        uExpansion: { value: 0 },
        uDrift: { value: 0.2 },
        uPulse: { value: 0.02 },
        uSwirl: { value: 0.02 },
        uSpeed: { value: 0.42 },
        uOpacity: { value: 0.9 },
        uPointScale: { value: 1.55 },
        uBasePointSize: { value: 1.0 },
        uLayerDensity: { value: new THREE.Vector3(0.8, 0.72, 0.24) },
        uColorA: { value: new THREE.Color('#8ddff0') },
        uColorB: { value: new THREE.Color('#bca7ff') },
        uColorC: { value: new THREE.Color('#d7f7ff') },
        uTexture: { value: fallbackTexture },
        uTextureInfluence: { value: 0.14 },
      }),
    [fallbackTexture],
  )

  useEffect(() => () => geometry.dispose(), [geometry])

  useEffect(() => {
    const material = shaderMaterialRef.current
    if (!material) return undefined

    material.uniforms.uTexture.value = fallbackTexture
    material.uniforms.uTextureInfluence.value = coverUrl ? 0.18 : 0.12

    if (!coverUrl) return undefined

    const loader = new THREE.TextureLoader()
    loader.setCrossOrigin('anonymous')
    let loadedTexture: THREE.Texture | undefined

    loader.load(
      coverUrl,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        loadedTexture = texture
        if (shaderMaterialRef.current) {
          shaderMaterialRef.current.uniforms.uTexture.value = texture
          shaderMaterialRef.current.uniforms.uTextureInfluence.value = 0.18
        }
      },
      undefined,
      () => {
        if (shaderMaterialRef.current) {
          shaderMaterialRef.current.uniforms.uTexture.value = fallbackTexture
          shaderMaterialRef.current.uniforms.uTextureInfluence.value = 0.12
        }
      },
    )

    return () => {
      loadedTexture?.dispose()
    }
  }, [coverUrl, fallbackTexture])

  useFrame(({ camera, clock, pointer }) => {
    const material = shaderMaterialRef.current
    if (!material) return

    const elapsed = clock.getElapsedTime()
    const shaderUniforms = material.uniforms
    const parallax = reducedMotion ? 0 : 1

    shaderUniforms.uTime.value = elapsed
    shaderUniforms.uGather.value = THREE.MathUtils.lerp(shaderUniforms.uGather.value as number, profile.gather, 0.035)
    shaderUniforms.uExpansion.value = THREE.MathUtils.lerp(shaderUniforms.uExpansion.value as number, profile.expansion, 0.035)
    shaderUniforms.uDrift.value = THREE.MathUtils.lerp(shaderUniforms.uDrift.value as number, profile.drift, 0.035)
    shaderUniforms.uPulse.value = THREE.MathUtils.lerp(shaderUniforms.uPulse.value as number, profile.pulse, 0.035)
    shaderUniforms.uSwirl.value = THREE.MathUtils.lerp(shaderUniforms.uSwirl.value as number, profile.swirl, 0.04)
    shaderUniforms.uSpeed.value = THREE.MathUtils.lerp(shaderUniforms.uSpeed.value as number, profile.speed, 0.04)
    shaderUniforms.uOpacity.value = THREE.MathUtils.lerp(shaderUniforms.uOpacity.value as number, profile.opacity, 0.045)
    shaderUniforms.uPointScale.value = reducedMotion ? 1.26 : 1.55
    shaderUniforms.uBasePointSize.value = 1.0
    ;(shaderUniforms.uLayerDensity.value as THREE.Vector3).lerp(
      new THREE.Vector3(profile.coreDensity, profile.middleDensity, profile.dustDensity),
      0.045,
    )
    ;(shaderUniforms.uColorA.value as THREE.Color).lerp(new THREE.Color(profile.primary), 0.04)
    ;(shaderUniforms.uColorB.value as THREE.Color).lerp(new THREE.Color(profile.secondary), 0.04)
    ;(shaderUniforms.uColorC.value as THREE.Color).lerp(new THREE.Color(profile.particle), 0.04)

    cameraTargetRef.current.set(pointer.x * 0.2 * parallax, pointer.y * 0.14 * parallax, 12)
    camera.position.lerp(cameraTargetRef.current, 0.035)
    camera.lookAt(0, 0, 0)

    if (pointsRef.current) {
      pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, pointer.y * 0.05 * parallax, 0.035)
      pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, pointer.x * 0.08 * parallax, 0.035)
      pointsRef.current.rotation.z = Math.sin(elapsed * 0.036) * 0.045
    }

    if (auraRef.current) {
      const breath = 1 + Math.sin(elapsed * profile.speed * 0.42) * profile.pulse * 1.8 + profile.expansion * 0.22
      auraRef.current.scale.setScalar(breath)
      auraRef.current.rotation.z = elapsed * 0.012
    }
  })

  return (
    <group>
      <group ref={auraRef}>
        <mesh position={[-0.2, 0.08, -1.4]}>
          <sphereGeometry args={[1.7, 32, 16]} />
          <meshBasicMaterial
            color={profile.primary}
            transparent
            opacity={profile.opacity * 0.035}
            depthWrite={false}
            blending={THREE.NormalBlending}
          />
        </mesh>
        <mesh position={[0.22, -0.05, -1.8]}>
          <sphereGeometry args={[1.45, 32, 16]} />
          <meshBasicMaterial
            color={profile.secondary}
            transparent
            opacity={profile.opacity * 0.025}
            depthWrite={false}
            blending={THREE.NormalBlending}
          />
        </mesh>
      </group>
      <points ref={pointsRef} frustumCulled={false}>
        <primitive object={geometry} attach="geometry" />
        <shaderMaterial
          ref={shaderMaterialRef}
          vertexShader={particleVertexShader}
          fragmentShader={particleFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          depthTest
          blending={THREE.NormalBlending}
        />
      </points>
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
  if (mood.includes('æƒ³å¿µ')) return 'romantic'
  if (mood.includes('å­¤ç‹¬')) return 'lonely'
  if (mood.includes('ç–²æƒ«') || mood.includes('å®‰é™')) return 'sad'
  if (mood.includes('é‡Šç„¶') || mood.includes('è½»æ¾') || mood.includes('æ¸©æš–')) return 'happy'
  return 'calm'
}

function getOrbProfile(orbState: OrbState, moodTone: MoodTone, reducedMotion: boolean): OrbProfile {
  const moodProfiles: Record<MoodTone, Pick<OrbProfile, 'primary' | 'secondary' | 'particle' | 'opacity'>> = {
    calm: { primary: '#5bb5c4', secondary: '#8774c4', particle: '#9bd5df', opacity: 0.82 },
    happy: { primary: '#c4a065', secondary: '#b87aa1', particle: '#dbc384', opacity: 0.86 },
    sad: { primary: '#5b8bab', secondary: '#7068aa', particle: '#9ab5d7', opacity: 0.76 },
    romantic: { primary: '#bb6f93', secondary: '#8974ca', particle: '#d39abe', opacity: 0.84 },
    lonely: { primary: '#609cad', secondary: '#6c63a0', particle: '#a29fd0', opacity: 0.72 },
  }

  const stateProfiles: Record<
    OrbState,
    Pick<
      OrbProfile,
      | 'coreDensity'
      | 'middleDensity'
      | 'dustDensity'
      | 'gather'
      | 'expansion'
      | 'drift'
      | 'pulse'
      | 'swirl'
      | 'speed'
    >
  > = {
    idle: {
      coreDensity: 0.5,
      middleDensity: 0.46,
      dustDensity: 0.18,
      gather: 0.04,
      expansion: 0,
      drift: 0.23,
      pulse: 0.012,
      swirl: 0.025,
      speed: 0.42,
    },
    thinking: {
      coreDensity: 0.62,
      middleDensity: 0.58,
      dustDensity: 0.56,
      gather: 0.25,
      expansion: -0.04,
      drift: 0.25,
      pulse: 0.02,
      swirl: 0.09,
      speed: 0.54,
    },
    listening: {
      coreDensity: 0.64,
      middleDensity: 0.52,
      dustDensity: 0.34,
      gather: 0.34,
      expansion: 0,
      drift: 0.24,
      pulse: 0.024,
      swirl: 0.04,
      speed: 0.58,
    },
    speaking: {
      coreDensity: 0.72,
      middleDensity: 0.66,
      dustDensity: 0.46,
      gather: 0.06,
      expansion: 0.08,
      drift: 0.29,
      pulse: 0.038,
      swirl: 0.05,
      speed: 0.72,
    },
    fading: {
      coreDensity: 0.64,
      middleDensity: 0.62,
      dustDensity: 0.32,
      gather: 0,
      expansion: 0.18,
      drift: 0.25,
      pulse: 0.022,
      swirl: 0.028,
      speed: 0.48,
    },
    playing: {
      coreDensity: 0.58,
      middleDensity: 0.58,
      dustDensity: 0.28,
      gather: 0.04,
      expansion: 0.08,
      drift: 0.27,
      pulse: 0.022,
      swirl: 0.032,
      speed: 0.62,
    },
    paused: {
      coreDensity: 0.34,
      middleDensity: 0.3,
      dustDensity: 0.1,
      gather: 0.04,
      expansion: -0.08,
      drift: 0.13,
      pulse: 0.006,
      swirl: 0.01,
      speed: 0.2,
    },
  }

  const motionScale = reducedMotion ? 0.28 : 1
  const state = stateProfiles[orbState]

  return {
    ...moodProfiles[moodTone],
    ...state,
    drift: state.drift * motionScale,
    pulse: state.pulse * motionScale,
    swirl: state.swirl * motionScale,
    speed: state.speed * (reducedMotion ? 0.45 : 1),
  }
}

function createShaderParticleBuffers(count: number): ShaderParticleBuffers {
  const positions = new Float32Array(count * 3)
  const seeds = new Float32Array(count)
  const phases = new Float32Array(count)
  const sizes = new Float32Array(count)
  const layers = new Float32Array(count)
  const orders = new Float32Array(count)
  const textureUvs = new Float32Array(count * 2)

  for (let index = 0; index < count; index += 1) {
    const seedA = pseudoRandom(index * 7 + 11)
    const seedB = pseudoRandom(index * 13 + 17)
    const seedC = pseudoRandom(index * 19 + 23)
    const layer = seedA < 0.18 ? 0 : seedA < 0.76 ? 1 : 2
    const angle = index * 2.399963 + (seedB - 0.5) * 1.2
    const cluster = Math.floor(pseudoRandom(index * 43 + 31) * 5)
    const clusterAngle = cluster * 1.2566 + pseudoRandom(cluster * 17 + 2) * 0.8
    const clusterRadius = layer === 0 ? 0.18 : layer === 1 ? 0.46 : 0.72
    const radiusBase = layer === 0 ? 1.08 : layer === 1 ? 2.58 : 3.45
    const radiusPower = layer === 0 ? 0.58 : layer === 1 ? 0.43 : 0.18
    const radius = Math.pow(seedC, radiusPower) * radiusBase + (seedB - 0.5) * 0.52
    const oval = 0.92 + pseudoRandom(index * 29 + 5) * 0.56
    const depth = (pseudoRandom(index * 31 + 7) - 0.5) * (layer === 0 ? 1.25 : layer === 1 ? 3.0 : 4.2)
    const offset = index * 3
    const uvOffset = index * 2

    positions[offset] = Math.cos(angle) * radius * oval + Math.cos(clusterAngle) * clusterRadius
    positions[offset + 1] = Math.sin(angle) * radius * (layer === 2 ? 0.56 : 0.86) + Math.sin(clusterAngle) * clusterRadius * 0.44
    positions[offset + 2] = depth + (layer === 0 ? 0.38 : layer === 1 ? 0.02 : -0.42)
    seeds[index] = seedA
    phases[index] = seedB * Math.PI * 2
    sizes[index] = layer === 0 ? 3.0 + seedC * 4.2 : layer === 1 ? 1.85 + seedC * 3.4 : 1.05 + seedC * 2.35
    layers[index] = layer
    orders[index] = pseudoRandom(index * 37 + 3)
    textureUvs[uvOffset] = 0.5 + positions[offset] / 9.4 + (pseudoRandom(index * 47 + 9) - 0.5) * 0.06
    textureUvs[uvOffset + 1] = 0.5 + positions[offset + 1] / 7.2 + (pseudoRandom(index * 53 + 15) - 0.5) * 0.06
  }

  return { positions, seeds, phases, sizes, layers, orders, textureUvs }
}

function pseudoRandom(seed: number): number {
  return Math.abs(Math.sin(seed * 12.9898) * 43758.5453) % 1
}

function hexToRgb(hex: string): string {
  const normalized = hex.replace('#', '').trim()
  const value = normalized.length === 3
    ? normalized.split('').map((character) => character + character).join('')
    : normalized.padEnd(6, 'f').slice(0, 6)
  const numeric = Number.parseInt(value, 16)

  if (Number.isNaN(numeric)) return '141, 223, 240'

  return `${(numeric >> 16) & 255}, ${(numeric >> 8) & 255}, ${numeric & 255}`
}

function createEmotionalTexture(accentColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 96
  canvas.height = 96
  const context = canvas.getContext('2d')

  if (context) {
    const rgb = hexToRgb(accentColor)
    const gradient = context.createRadialGradient(42, 38, 4, 48, 48, 70)
    gradient.addColorStop(0, `rgba(${rgb}, 0.34)`)
    gradient.addColorStop(0.38, 'rgba(87, 76, 142, 0.22)')
    gradient.addColorStop(0.72, 'rgba(26, 72, 88, 0.16)')
    gradient.addColorStop(1, 'rgba(5, 7, 18, 0.02)')
    context.fillStyle = gradient
    context.fillRect(0, 0, canvas.width, canvas.height)

    for (let index = 0; index < 120; index += 1) {
      const x = pseudoRandom(index * 17 + 1) * canvas.width
      const y = pseudoRandom(index * 19 + 5) * canvas.height
      const alpha = 0.018 + pseudoRandom(index * 23 + 9) * 0.035
      context.fillStyle = `rgba(210, 210, 230, ${alpha})`
      context.fillRect(x, y, 1, 1)
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  return texture
}

function canUseWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
  } catch {
    return false
  }
}
