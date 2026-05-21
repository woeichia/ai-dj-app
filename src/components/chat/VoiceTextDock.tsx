import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, Mic } from 'lucide-react'
import { iconButtonMotion, inputBarMotion } from '../motionPresets'

interface VoiceTextDockProps {
  value: string
  error?: string
  open: boolean
  listening: boolean
  onChange(value: string): void
  onSubmit(): void
  onVoice(): void
}

export function VoiceTextDock({
  value,
  error,
  open,
  listening,
  onChange,
  onSubmit,
  onVoice,
}: VoiceTextDockProps) {
  return (
    <section className="voice-text-dock">
      <button className={`voice-presence${listening ? ' listening' : ''}`} type="button" onClick={onVoice}>
        <Mic size={18} aria-hidden="true" />
        <span>{listening ? '正在聆听' : '语音对话即将支持'}</span>
      </button>
      <AnimatePresence>
        {open ? (
          <motion.form
            className="text-drawer"
            variants={inputBarMotion}
            initial={{ opacity: 0, y: 26, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
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
