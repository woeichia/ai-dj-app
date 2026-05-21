import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import type { PlaybackStatus } from '../types/audio'

interface EmotionalWaveformProps {
  status: PlaybackStatus
}

const bars = [
  16, 25, 19, 42, 58, 36, 72, 49, 31, 67, 45, 78, 39, 55, 28, 64, 82, 46,
  24, 60, 34, 74, 52, 29,
]

const particleCount = 34

export function EmotionalWaveform({ status }: EmotionalWaveformProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const phase = getPhase(status)
  const movement = getMovement(status)

  useEffect(() => {
    if (!rootRef.current) return

    const profile = getGsapProfile(status)
    const context = gsap.context(() => {
      const particles = gsap.utils.toArray<HTMLElement>('.star-field span')
      const warmRibbon = rootRef.current?.querySelector<HTMLElement>('.ribbon-warm')
      const coolRibbon = rootRef.current?.querySelector<HTMLElement>('.ribbon-cool')
      const airGlow = rootRef.current?.querySelector<HTMLElement>('.air-glow')

      gsap.set(particles, {
        opacity: profile.particleBase,
        scale: profile.particleScale,
        filter: `blur(${profile.particleBlur}px)`,
      })

      particles.forEach((particle, index) => {
        const direction = index % 2 === 0 ? 1 : -1
        gsap.to(particle, {
          x: direction * (profile.particleDrift + (index % 5) * 2),
          y: -profile.particleLift - (index % 6) * 2,
          opacity: profile.particlePeak + (index % 4) * 0.025,
          scale: profile.particleScale + profile.particleScaleLift,
          duration: profile.particleDuration + (index % 7) * 0.34,
          delay: index * 0.06,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      })

      if (warmRibbon) {
        gsap.to(warmRibbon, {
          x: profile.ribbonDrift,
          scaleY: profile.ribbonScale,
          opacity: profile.ribbonOpacity,
          duration: profile.ribbonDuration,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      }

      if (coolRibbon) {
        gsap.to(coolRibbon, {
          x: -profile.ribbonDrift * 0.8,
          scaleY: profile.ribbonScale * 0.92,
          opacity: profile.ribbonOpacity * 0.88,
          duration: profile.ribbonDuration + 0.9,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      }

      if (airGlow) {
        gsap.to(airGlow, {
          scale: profile.airScale,
          opacity: profile.airOpacity,
          duration: profile.airDuration,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      }
    }, rootRef)

    return () => context.revert()
  }, [status])

  return (
    <motion.div
      ref={rootRef}
      className={`emotional-visual phase-${phase}`}
      aria-hidden="true"
      animate={{
        boxShadow: [
          `inset 0 0 0 1px rgba(255,255,255,0.055), inset 0 -60px 120px rgba(10,9,28,.72), 0 0 ${movement.stageGlow}px rgba(149, 205, 229, ${movement.stageOpacity})`,
          `inset 0 0 0 1px rgba(255,255,255,0.075), inset 0 -60px 120px rgba(10,9,28,.72), 0 0 ${movement.stageGlow + 18}px rgba(211, 172, 255, ${movement.stageOpacity + 0.04})`,
          `inset 0 0 0 1px rgba(255,255,255,0.055), inset 0 -60px 120px rgba(10,9,28,.72), 0 0 ${movement.stageGlow}px rgba(149, 205, 229, ${movement.stageOpacity})`,
        ],
      }}
      transition={{ duration: movement.breathDuration, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="air-glow" />
      <div className="star-field">
        {Array.from({ length: particleCount }, (_, index) => (
          <span
            key={index}
            style={{
              left: `${8 + ((index * 19) % 84)}%`,
              top: `${10 + ((index * 31) % 72)}%`,
            }}
          />
        ))}
      </div>

      <div className="wave-ribbon ribbon-warm" />
      <div className="wave-ribbon ribbon-cool" />

      <div className="wave-bars">
        {bars.map((height, index) => (
          <motion.span
            key={`${height}-${index}`}
            style={{ height }}
            animate={{
              scaleY: movement.barScale(index),
              opacity: movement.barOpacity(index),
              filter: movement.barGlow(index),
            }}
            transition={{
              duration: movement.barDuration + (index % 7) * 0.13,
              repeat: Infinity,
              delay: index * movement.barDelay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

function getPhase(status: PlaybackStatus): string {
  if (status === 'paused' || status === 'idle') return 'quiet'
  if (status === 'understanding' || status === 'searching' || status === 'preparing') return 'thinking'
  if (status === 'voice-speaking' || status === 'music-ducked') return 'speaking'
  if (status === 'fading-in') return 'fading'
  return 'playing'
}

function getEnergy(status: PlaybackStatus): number {
  if (status === 'idle' || status === 'paused') return 0.28
  if (status === 'understanding' || status === 'searching' || status === 'preparing') return 0.52
  if (status === 'voice-speaking' || status === 'music-ducked') return 0.84
  if (status === 'fading-in') return 0.72
  if (status === 'playing') return 0.56
  return 0.4
}

function getGsapProfile(status: PlaybackStatus) {
  const energy = getEnergy(status)
  const quiet = status === 'idle' || status === 'paused'
  const speaking = status === 'voice-speaking' || status === 'music-ducked'
  const fading = status === 'fading-in'

  return {
    particleBase: 0.08 + energy * 0.16,
    particlePeak: 0.18 + energy * 0.34,
    particleScale: quiet ? 0.72 : 0.82 + energy * 0.2,
    particleScaleLift: 0.16 + energy * 0.18,
    particleBlur: quiet ? 0.4 : 0.15,
    particleDrift: 4 + energy * 18,
    particleLift: 4 + energy * 20,
    particleDuration: quiet ? 7.6 : speaking ? 4.4 : fading ? 5.4 : 6.4,
    ribbonDrift: 10 + energy * 30,
    ribbonScale: 0.86 + energy * 0.34,
    ribbonOpacity: 0.3 + energy * 0.36,
    ribbonDuration: quiet ? 9.2 : speaking ? 5.4 : fading ? 6.2 : 7.6,
    airScale: 1.05 + energy * 0.18,
    airOpacity: 0.18 + energy * 0.18,
    airDuration: quiet ? 8.4 : speaking ? 4.8 : 6.8,
  }
}

function getMovement(status: PlaybackStatus) {
  const energy = getEnergy(status)
  const quiet = status === 'idle' || status === 'paused'
  const thinking =
    status === 'understanding' || status === 'searching' || status === 'preparing'
  const speaking = status === 'voice-speaking' || status === 'music-ducked'
  const fading = status === 'fading-in'

  return {
    stageGlow: 18 + energy * 40,
    stageOpacity: 0.04 + energy * 0.1,
    breathDuration: quiet ? 7.4 : thinking ? 5.4 : speaking ? 3.8 : fading ? 4.4 : 6,
    barDuration: quiet ? 2.8 : speaking ? 1.35 : fading ? 1.7 : 2.15,
    barDelay: quiet ? 0.035 : speaking ? 0.055 : 0.045,
    barScale: (index: number) => {
      const offset = (index % 5) * 0.08
      const low = 0.34 + energy * 0.22 + offset
      const high = 0.58 + energy * 0.78 - offset * 0.4
      const mid = 0.44 + energy * 0.38
      return [low, high, mid]
    },
    barOpacity: (index: number) => [
      0.2 + energy * 0.26,
      0.38 + energy * 0.5 + (index % 4) * 0.03,
      0.24 + energy * 0.32,
    ],
    barGlow: (index: number) => [
      `drop-shadow(0 0 ${4 + energy * 8}px rgba(205, 174, 255, ${0.18 + energy * 0.12}))`,
      `drop-shadow(0 0 ${8 + energy * 18 + (index % 3) * 4}px rgba(133, 224, 237, ${0.2 + energy * 0.2}))`,
      `drop-shadow(0 0 ${5 + energy * 10}px rgba(244, 180, 220, ${0.16 + energy * 0.14}))`,
    ],
  }
}
