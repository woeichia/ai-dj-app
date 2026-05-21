import { motion, useReducedMotion } from 'framer-motion'
import type { PlaybackStatus } from '../../types/audio'

interface EmotionalUniverseShellProps {
  status: PlaybackStatus
  volume: number
  time: string
  children: React.ReactNode
}

const statusText: Record<PlaybackStatus, string> = {
  idle: '等待情绪信号',
  understanding: '正在理解你',
  searching: '正在寻找声音',
  preparing: '正在准备开场白',
  'voice-speaking': 'Echo Soul 正在说话',
  'music-ducked': '音乐低声陪底',
  'fading-in': '音乐慢慢靠近',
  playing: '正在播放',
  paused: '已暂停',
}

export function EmotionalUniverseShell({
  status,
  volume,
  time,
  children,
}: EmotionalUniverseShellProps) {
  const reduceMotion = useReducedMotion()

  return (
    <main className="universe-shell">
      <div className="universe-noise" />
      <motion.div
        className="universe-aurora aurora-rose"
        animate={reduceMotion ? undefined : { opacity: [0.28, 0.46, 0.28], scale: [1, 1.08, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="universe-aurora aurora-cyan"
        animate={reduceMotion ? undefined : { opacity: [0.18, 0.38, 0.18], y: [0, -18, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="universe-stars" />

      <header className="universe-status" aria-label="Echo Soul 状态">
        <div>
          <span>Echo Soul</span>
          <strong>{statusText[status]}</strong>
        </div>
        <div>
          <span>{time}</span>
          <strong>音量 {Math.round(volume * 100)}%</strong>
        </div>
      </header>

      <motion.section
        className="universe-scene"
        initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.section>
    </main>
  )
}
