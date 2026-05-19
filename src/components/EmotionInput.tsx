import { motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { iconButtonMotion } from './motionPresets'

interface EmotionInputProps {
  value: string
  error?: string
  onChange(value: string): void
  onSubmit(): void
}

export function EmotionInput({
  value,
  error,
  onChange,
  onSubmit,
}: EmotionInputProps) {
  return (
    <motion.section
      className="emotion-panel"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <form
        className="ai-input-bar"
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
          placeholder="今天发生了什么，或现在是什么感觉？"
        />
        <motion.button
          className="ai-submit"
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
      </form>
      {error ? <p className="field-error">{error}</p> : null}
    </motion.section>
  )
}
