import { motion } from 'framer-motion'

interface EmotionInputProps {
  value: string
  selectedMood: string
  moods: string[]
  error?: string
  onChange(value: string): void
  onMoodChange(mood: string): void
  onSubmit(): void
}

export function EmotionInput({
  value,
  selectedMood,
  moods,
  error,
  onChange,
  onMoodChange,
  onSubmit,
}: EmotionInputProps) {
  return (
    <motion.section
      className="panel emotion-panel"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="section-kicker">当前情绪</div>
      <label className="emotion-label" htmlFor="emotion-input">
        今晚，你想让音乐怎么陪你？
      </label>
      <textarea
        id="emotion-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="比如：今天有点累，但不想马上睡。"
        rows={4}
      />
      {error ? <p className="field-error">{error}</p> : null}

      <div className="mood-picker" aria-label="情绪选择器">
        {moods.map((mood) => (
          <button
            className={mood === selectedMood ? 'chip active' : 'chip'}
            key={mood}
            type="button"
            onClick={() => onMoodChange(mood)}
          >
            {mood}
          </button>
        ))}
      </div>

      <button className="primary-action" type="button" onClick={onSubmit}>
        让 AI DJ 选一首
      </button>
    </motion.section>
  )
}
