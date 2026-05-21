import { motion } from 'framer-motion'
import type { DJRecommendation } from '../../types/ai'

interface NowPlayingGlassCardProps {
  recommendation: DJRecommendation | null
  time: string
  weather: string
}

export function NowPlayingGlassCard({
  recommendation,
  time,
  weather,
}: NowPlayingGlassCardProps) {
  if (!recommendation) {
    return (
      <motion.section
        className="now-glass-card empty"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="panel-kicker">等待第一首歌</span>
        <h2>还没有播放的声音</h2>
        <p>告诉 Echo Soul 你现在的心情，它会先理解，再把音乐放到你身边。</p>
        <small>{time} · {weather}</small>
      </motion.section>
    )
  }

  const { song, reason } = recommendation

  return (
    <motion.section
      className="now-glass-card"
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="song-aura" style={{ background: song.color }} />
      <div className="now-card-main">
        <span className="panel-kicker">Now resonating</span>
        <h2>{song.title}</h2>
        <p>{song.artist}</p>
      </div>
      <p className="now-reason">{reason}</p>
      <div className="now-meta">
        <span>{song.language === 'zh' ? '中文歌' : '英文歌'}</span>
        <span>{song.bpm} BPM</span>
        <span>{song.duration}</span>
        <span>{time} · {weather}</span>
      </div>
    </motion.section>
  )
}
