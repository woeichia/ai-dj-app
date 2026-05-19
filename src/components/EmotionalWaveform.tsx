import { motion } from 'framer-motion'
import type { PlaybackStatus } from '../types/audio'

interface EmotionalWaveformProps {
  status: PlaybackStatus
}

const bars = [18, 28, 22, 44, 60, 38, 72, 54, 34, 66, 48, 74, 40, 52, 30, 64, 76, 44]

export function EmotionalWaveform({ status }: EmotionalWaveformProps) {
  const active =
    status === 'voice-speaking' ||
    status === 'music-ducked' ||
    status === 'fading-in' ||
    status === 'playing'

  return (
    <div className="emotional-visual" aria-hidden="true">
      <div className="star-field">
        {Array.from({ length: 22 }, (_, index) => (
          <motion.span
            key={index}
            style={{
              left: `${8 + ((index * 19) % 84)}%`,
              top: `${10 + ((index * 31) % 72)}%`,
            }}
            animate={{ opacity: [0.15, 0.72, 0.15], scale: [0.8, 1.15, 0.8] }}
            transition={{
              duration: 4 + (index % 5),
              repeat: Infinity,
              delay: index * 0.16,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <motion.div
        className="wave-ribbon ribbon-warm"
        animate={{
          x: active ? [-16, 12, -16] : [-8, 5, -8],
          opacity: active ? [0.48, 0.82, 0.48] : [0.28, 0.46, 0.28],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="wave-ribbon ribbon-cool"
        animate={{
          x: active ? [18, -12, 18] : [8, -5, 8],
          opacity: active ? [0.42, 0.78, 0.42] : [0.24, 0.42, 0.24],
        }}
        transition={{ duration: 6.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="wave-bars">
        {bars.map((height, index) => (
          <motion.span
            key={`${height}-${index}`}
            style={{ height }}
            animate={{
              scaleY: active ? [0.56, 1.18, 0.72] : [0.46, 0.72, 0.52],
              opacity: active ? [0.48, 1, 0.58] : [0.26, 0.48, 0.32],
            }}
            transition={{
              duration: 1.6 + (index % 5) * 0.24,
              repeat: Infinity,
              delay: index * 0.045,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  )
}
