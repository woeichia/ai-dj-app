import { AnimatePresence, motion } from 'framer-motion'
import { Radio } from 'lucide-react'
import type { PlaybackStatus } from '../types/audio'

interface VoiceStatusProps {
  status: PlaybackStatus
  volume: number
}

const statusText: Record<PlaybackStatus, string> = {
  idle: '等待你的情绪信号',
  'voice-speaking': 'AI DJ 正在说话',
  'music-ducked': '音乐保持低音量',
  'fading-in': '音乐淡入中',
  playing: '正在播放',
  paused: '已暂停',
}

export function VoiceStatus({ status, volume }: VoiceStatusProps) {
  return (
    <section className="voice-status" aria-live="polite">
      <motion.div
        className="status-orb"
        animate={{
          scale: status === 'idle' || status === 'paused' ? 1 : [1, 1.08, 1],
          opacity: status === 'idle' ? 0.52 : 1,
        }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Radio size={18} aria-hidden="true" />
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          <strong>{statusText[status]}</strong>
          <span>音乐音量 {Math.round(volume * 100)}%</span>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
