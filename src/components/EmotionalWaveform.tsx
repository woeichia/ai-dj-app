import { motion } from 'framer-motion'
import type { PlaybackStatus } from '../types/audio'

interface EmotionalWaveformProps {
  status: PlaybackStatus
}

const bars = [
  16, 25, 19, 42, 58, 36, 72, 49, 31, 67, 45, 78, 39, 55, 28, 64, 82, 46,
  24, 60, 34, 74, 52, 29,
]

const particleCount = 30

export function EmotionalWaveform({ status }: EmotionalWaveformProps) {
  const phase = getPhase(status)
  const movement = getMovement(status)

  return (
    <motion.div
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
      <div className="star-field">
        {Array.from({ length: particleCount }, (_, index) => (
          <motion.span
            key={index}
            style={{
              left: `${8 + ((index * 19) % 84)}%`,
              top: `${10 + ((index * 31) % 72)}%`,
            }}
            animate={{
              x: movement.particleX(index),
              y: movement.particleY(index),
              opacity: movement.particleOpacity(index),
              scale: movement.particleScale(index),
            }}
            transition={{
              duration: movement.particleDuration + (index % 6) * 0.32,
              repeat: Infinity,
              delay: index * 0.11,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <motion.div
        className="wave-ribbon ribbon-warm"
        animate={{
          x: [-movement.ribbonDrift, movement.ribbonDrift * 0.75, -movement.ribbonDrift],
          scaleY: movement.ribbonScale,
          opacity: movement.ribbonOpacity,
        }}
        transition={{ duration: movement.ribbonDuration, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="wave-ribbon ribbon-cool"
        animate={{
          x: [movement.ribbonDrift * 0.85, -movement.ribbonDrift, movement.ribbonDrift * 0.85],
          scaleY: movement.ribbonScaleAlt,
          opacity: movement.ribbonOpacityAlt,
        }}
        transition={{ duration: movement.ribbonDuration + 0.8, repeat: Infinity, ease: 'easeInOut' }}
      />

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

function getMovement(status: PlaybackStatus) {
  const quiet = status === 'idle' || status === 'paused'
  const thinking =
    status === 'understanding' || status === 'searching' || status === 'preparing'
  const speaking = status === 'voice-speaking' || status === 'music-ducked'
  const fading = status === 'fading-in'
  const playing = status === 'playing'

  const energy = quiet ? 0.28 : thinking ? 0.52 : speaking ? 0.92 : fading ? 0.78 : playing ? 0.58 : 0.4

  return {
    stageGlow: 18 + energy * 40,
    stageOpacity: 0.04 + energy * 0.1,
    breathDuration: quiet ? 7.4 : thinking ? 5.4 : speaking ? 3.8 : fading ? 4.4 : 6,
    ribbonDrift: 8 + energy * 26,
    ribbonDuration: quiet ? 9 : thinking ? 7.5 : speaking ? 5.2 : fading ? 6 : 7.8,
    ribbonScale: [0.82, 0.96 + energy * 0.22, 0.86],
    ribbonScaleAlt: [0.72, 0.9 + energy * 0.2, 0.76],
    ribbonOpacity: [0.2 + energy * 0.22, 0.34 + energy * 0.46, 0.22 + energy * 0.2],
    ribbonOpacityAlt: [0.18 + energy * 0.2, 0.3 + energy * 0.42, 0.18 + energy * 0.2],
    particleDuration: quiet ? 7.5 : speaking ? 4.2 : fading ? 5.2 : 6.2,
    particleX: (index: number) => [
      0,
      (index % 2 === 0 ? 1 : -1) * (3 + energy * 10 + (index % 4)),
      0,
    ],
    particleY: (index: number) => [
      0,
      -1 * (2 + energy * 12 + (index % 5)),
      0,
    ],
    particleOpacity: (index: number) => [
      0.1 + energy * 0.18,
      0.22 + energy * 0.56 + (index % 3) * 0.03,
      0.1 + energy * 0.16,
    ],
    particleScale: (index: number) => [
      0.72,
      0.94 + energy * 0.42 + (index % 4) * 0.04,
      0.78,
    ],
    barDuration: quiet ? 2.8 : speaking ? 1.35 : fading ? 1.7 : 2.15,
    barDelay: quiet ? 0.035 : speaking ? 0.055 : 0.045,
    barScale: (index: number) => {
      const offset = (index % 5) * 0.08
      const low = 0.34 + energy * 0.22 + offset
      const high = 0.58 + energy * 0.9 - offset * 0.4
      const mid = 0.44 + energy * 0.38
      return [low, high, mid]
    },
    barOpacity: (index: number) => [
      0.2 + energy * 0.26,
      0.38 + energy * 0.55 + (index % 4) * 0.03,
      0.24 + energy * 0.32,
    ],
    barGlow: (index: number) => [
      `drop-shadow(0 0 ${4 + energy * 8}px rgba(205, 174, 255, ${0.18 + energy * 0.12}))`,
      `drop-shadow(0 0 ${8 + energy * 20 + (index % 3) * 4}px rgba(133, 224, 237, ${0.2 + energy * 0.22}))`,
      `drop-shadow(0 0 ${5 + energy * 10}px rgba(244, 180, 220, ${0.16 + energy * 0.14}))`,
    ],
  }
}
