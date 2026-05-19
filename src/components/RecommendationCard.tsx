import { motion } from 'framer-motion'
import type { DJRecommendation } from '../types/ai'

interface RecommendationCardProps {
  recommendation: DJRecommendation | null
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  if (!recommendation) {
    return (
      <section className="panel message-card empty-card">
        <div className="section-kicker">AI DJ message</div>
        <p>说一句你现在的感觉，我来帮你放一首适合此刻的歌。</p>
      </section>
    )
  }

  return (
    <motion.section
      className="panel message-card"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="section-kicker">AI DJ message</div>
      <p className="spoken-copy">{recommendation.spokenIntro}</p>
      <p className="reason-copy">{recommendation.reason}</p>
    </motion.section>
  )
}
