import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { iconButtonMotion } from '../motionPresets'

interface VoiceTextDockProps {
  value: string
  error?: string
  open: boolean
  onChange(value: string): void
  onSubmit(): void
}

export function VoiceTextDock({
  value,
  error,
  open,
  onChange,
  onSubmit,
}: VoiceTextDockProps) {
  return (
    <section className="voice-text-dock">
      <AnimatePresence>
        {open ? (
          <motion.form
            className="text-drawer"
            initial={{ opacity: 0, y: 30, scale: 0.97, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{
              opacity: 0,
              y: -10,
              scaleX: 0.34,
              scaleY: 0.82,
              filter: 'blur(14px)',
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.1), 0 0 52px rgba(190,164,255,0.18)',
            }}
            transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'center center' }}
            onSubmit={(event) => {
              event.preventDefault()
              onSubmit()
            }}
          >
            <label className="sr-only" htmlFor="emotion-input">
              今天发生了什么，或现在是什么感觉？
            </label>
            <input
              id="emotion-input"
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder="把此刻说给 Echo Soul"
              autoComplete="off"
            />
            <motion.button
              className="text-submit"
              type="submit"
              aria-label="发送给 Echo Soul"
              variants={iconButtonMotion}
              initial="rest"
              animate="rest"
              whileHover="hover"
              whileTap="tap"
            >
              <ArrowUp size={18} aria-hidden="true" />
            </motion.button>
          </motion.form>
        ) : null}
      </AnimatePresence>
      {error ? <p className="field-error">{error}</p> : null}
    </section>
  )
}
