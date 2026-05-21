import { motion } from 'framer-motion'
import { Pause, Play, SkipForward } from 'lucide-react'
import type { PlaybackStatus } from '../types/audio'
import { buttonMotion, iconButtonMotion } from './motionPresets'

interface PlayerControlsProps {
  status: PlaybackStatus
  disabled: boolean
  onTogglePlay(): void
  onNext(): void
}

export function PlayerControls({
  status,
  disabled,
  onTogglePlay,
  onNext,
}: PlayerControlsProps) {
  const isPlaying =
    status === 'voice-speaking' ||
    status === 'music-ducked' ||
    status === 'fading-in' ||
    status === 'playing'

  return (
    <section className="player-controls" aria-label="播放控制">
      <motion.button
        className="round-control primary"
        type="button"
        disabled={disabled}
        onClick={onTogglePlay}
        aria-label={isPlaying ? '暂停' : '播放'}
        variants={iconButtonMotion}
        initial="rest"
        animate="rest"
        whileHover="hover"
        whileTap="tap"
      >
        {isPlaying ? <Pause size={24} aria-hidden="true" /> : <Play size={24} aria-hidden="true" />}
      </motion.button>
      <motion.button
        className="round-control"
        type="button"
        disabled={disabled}
        onClick={onNext}
        aria-label="下一首"
        variants={iconButtonMotion}
        initial="rest"
        animate="rest"
        whileHover="hover"
        whileTap="tap"
      >
        <SkipForward size={22} aria-hidden="true" />
      </motion.button>
      <motion.button
        className="next-song"
        type="button"
        disabled={disabled}
        onClick={onNext}
        variants={buttonMotion}
        initial="rest"
        animate="rest"
        whileHover="hover"
        whileTap="tap"
      >
        换一首
      </motion.button>
    </section>
  )
}
