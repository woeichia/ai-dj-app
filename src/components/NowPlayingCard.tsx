import { motion } from 'framer-motion'
import type { Song } from '../types/music'

interface NowPlayingCardProps {
  song: Song | null
}

export function NowPlayingCard({ song }: NowPlayingCardProps) {
  if (!song) {
    return (
      <section className="panel now-playing empty-card">
        <div className="section-kicker">正在靠近的声音</div>
        <p>还没有选择歌曲。</p>
      </section>
    )
  }

  return (
    <motion.section
      className="panel now-playing"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="cover-aura"
        style={{ background: song.color }}
        animate={{ y: [0, -7, 0], rotate: [0, 1.5, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="track-meta">
        <div className="section-kicker">正在播放</div>
        <h2>{song.title}</h2>
        <p>{song.artist}</p>
      </div>
      <div className="track-details">
        <span>{song.language === 'zh' ? '中文歌' : '英文歌'}</span>
        <span>{song.bpm} BPM</span>
        <span>{song.duration}</span>
      </div>
    </motion.section>
  )
}
