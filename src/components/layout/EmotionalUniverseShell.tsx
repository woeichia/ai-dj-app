import { motion, useReducedMotion } from 'framer-motion'

interface EmotionalUniverseShellProps {
  children: React.ReactNode
}

export function EmotionalUniverseShell({ children }: EmotionalUniverseShellProps) {
  const reduceMotion = useReducedMotion()

  return (
    <main className="universe-shell">
      <div className="universe-noise" />
      <motion.div
        className="universe-aurora aurora-rose"
        animate={reduceMotion ? undefined : { opacity: [0.24, 0.4, 0.24], scale: [1, 1.06, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="universe-aurora aurora-cyan"
        animate={reduceMotion ? undefined : { opacity: [0.16, 0.34, 0.16], y: [0, -14, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
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
