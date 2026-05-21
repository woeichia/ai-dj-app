import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { DJRecommendation } from '../../types/ai'
import type { PlaybackStatus } from '../../types/audio'

interface AIMessageSubtitleProps {
  recommendation: DJRecommendation | null
  status: PlaybackStatus
  listening: boolean
}

export function AIMessageSubtitle({
  recommendation,
  status,
  listening,
}: AIMessageSubtitleProps) {
  const reduceMotion = useReducedMotion()
  const message = getMessage(recommendation, status, listening)

  return (
    <section className="ai-subtitle" aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.p
          key={message}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, filter: 'blur(8px)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {message}
        </motion.p>
      </AnimatePresence>
    </section>
  )
}

function getMessage(
  recommendation: DJRecommendation | null,
  status: PlaybackStatus,
  listening: boolean,
): string {
  if (listening) return '我在听。你可以先把这一刻交给我。'
  if (status === 'understanding') return '我正在把你的情绪放慢一点听。'
  if (status === 'searching') return '我在夜色里找一首能接住你的歌。'
  if (status === 'preparing') return '我会先轻声说几句，再让音乐靠近。'
  if (recommendation?.spokenIntro) return recommendation.spokenIntro
  return '今晚的情绪很轻，说一句你的感觉，我替你找一首慢慢靠近的歌。'
}
