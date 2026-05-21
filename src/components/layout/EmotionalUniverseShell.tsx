import { motion, useReducedMotion } from 'framer-motion'
import Aurora from '../background/Aurora'

interface EmotionalUniverseShellProps {
  children: React.ReactNode
}

export function EmotionalUniverseShell({ children }: EmotionalUniverseShellProps) {
  const reduceMotion = useReducedMotion()

  return (
    <main className="universe-shell">
      <div className="universe-aurora-layer" aria-hidden="true">
        <Aurora
          colorStops={['#7dd3fc', '#c084fc', '#f472b6']}
          amplitude={reduceMotion ? 0.38 : 0.78}
          blend={0.58}
          speed={reduceMotion ? 0 : 0.38}
        />
      </div>
      <div className="universe-noise" />
      <div className="universe-stars" />

      <motion.section
        className="universe-scene"
        initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.section>
    </main>
  )
}
