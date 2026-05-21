import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { useEffect, useMemo, useState } from 'react'
import type { DJRecommendation } from '../../types/ai'
import type { PlaybackStatus } from '../../types/audio'

interface AIMessageSubtitleProps {
  recommendation: DJRecommendation | null
  status: PlaybackStatus
  listening: boolean
}

const speakingStatuses: PlaybackStatus[] = ['voice-speaking', 'music-ducked', 'fading-in']

export function AIMessageSubtitle({
  recommendation,
  status,
  listening,
}: AIMessageSubtitleProps) {
  const reduceMotion = useReducedMotion()
  const speaking = speakingStatuses.includes(status)
  const dialogue = useMemo(() => getDialogue(recommendation), [recommendation])
  const [heldDialogue, setHeldDialogue] = useState(speaking && dialogue ? dialogue : null)

  useEffect(() => {
    if (speaking && dialogue) {
      const timer = window.setTimeout(() => setHeldDialogue(dialogue), 0)
      return () => window.clearTimeout(timer)
    }

    const timer = window.setTimeout(() => setHeldDialogue(null), 850)
    return () => window.clearTimeout(timer)
  }, [dialogue, speaking])

  return (
    <section className="ai-dialogue-stage" aria-live="polite">
      <div className="ai-dialogue-spacer" aria-hidden="true" />
      <AnimatePresence mode="wait">
        {listening ? (
          <motion.div
            key="voice-listening"
            className="voice-listening-overlay"
            initial={{ opacity: 0, x: '-50%', y: 12, scale: 0.96 }}
            animate={{ opacity: 1, x: '-50%', y: 0, scale: 1 }}
            exit={{ opacity: 0, x: '-50%', y: -8, scale: 0.92 }}
            transition={{ duration: 0.66, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="voice-listening-card">
              <span className="voice-capsule-glow" aria-hidden="true" />
              <div className="voice-wave-strip" aria-hidden="true">
                {Array.from({ length: 13 }, (_, index) => (
                  <span key={index} style={{ '--i': index } as CSSProperties & Record<'--i', number>} />
                ))}
              </div>
              <p>我在听</p>
            </div>
          </motion.div>
        ) : heldDialogue ? (
          <motion.div
            key={heldDialogue.title}
            className="ai-dialogue-overlay"
            initial={
              reduceMotion
                ? { opacity: 0, x: '-50%' }
                : { opacity: 0, x: '-50%', y: 14, scale: 0.98 }
            }
            animate={{ opacity: 1, x: '-50%', y: 0, scale: 1 }}
            exit={
              reduceMotion
                ? { opacity: 0, x: '-50%' }
                : { opacity: 0, x: '-50%', y: -10, scale: 0.985 }
            }
            transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="ai-dialogue-card">
              <ProgressiveSubtitle text={heldDialogue.title} reduceMotion={Boolean(reduceMotion)} />
              {heldDialogue.detail ? (
                <motion.span
                  initial={{ opacity: 0, y: 7 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: reduceMotion ? 0 : 0.55,
                    duration: 0.62,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {heldDialogue.detail}
                </motion.span>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}

function ProgressiveSubtitle({
  text,
  reduceMotion,
}: {
  text: string
  reduceMotion: boolean
}) {
  const [visibleCount, setVisibleCount] = useState(reduceMotion ? text.length : 0)

  useEffect(() => {
    if (reduceMotion) return undefined

    const resetTimer = window.setTimeout(() => setVisibleCount(0), 0)
    const stepMs = Math.min(92, Math.max(44, 2600 / Math.max(text.length, 1)))
    const timer = window.setInterval(() => {
      setVisibleCount((current) => {
        if (current >= text.length) {
          window.clearInterval(timer)
          return current
        }

        return current + 1
      })
    }, stepMs)

    return () => {
      window.clearTimeout(resetTimer)
      window.clearInterval(timer)
    }
  }, [reduceMotion, text])

  return (
    <p>
      <motion.span
        key={visibleCount}
        initial={{ opacity: 0.86 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        {text.slice(0, visibleCount)}
      </motion.span>
      {visibleCount < text.length && !reduceMotion ? <i aria-hidden="true" /> : null}
    </p>
  )
}

function getDialogue(recommendation: DJRecommendation | null): {
  title: string
  detail?: string
} | null {
  if (recommendation) {
    return {
      title: recommendation.spokenIntro,
      detail: recommendation.reason,
    }
  }

  return null
}
