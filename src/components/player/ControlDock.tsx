import { motion } from 'framer-motion'
import { Bookmark, MessageCircle, Mic, Pause, Play, SkipForward } from 'lucide-react'
import type { PlaybackStatus } from '../../types/audio'
import { iconButtonMotion } from '../motionPresets'

interface ControlDockProps {
  status: PlaybackStatus
  disabled: boolean
  listening: boolean
  textOpen: boolean
  memorySaved: boolean
  onTogglePlay(): void
  onNext(): void
  onVoice(): void
  onToggleText(): void
  onSaveMemory(): void
}

export function ControlDock({
  status,
  disabled,
  listening,
  textOpen,
  memorySaved,
  onTogglePlay,
  onNext,
  onVoice,
  onToggleText,
  onSaveMemory,
}: ControlDockProps) {
  const isPlaying =
    status === 'voice-speaking' ||
    status === 'music-ducked' ||
    status === 'fading-in' ||
    status === 'playing'

  return (
    <section className="control-dock" aria-label="情绪音乐控制">
      <DockButton
        label={isPlaying ? '暂停' : '播放'}
        active={isPlaying}
        disabled={disabled}
        onClick={onTogglePlay}
      >
        {isPlaying ? <Pause size={22} aria-hidden="true" /> : <Play size={22} aria-hidden="true" />}
      </DockButton>
      <DockButton label="下一首" disabled={disabled} onClick={onNext}>
        <SkipForward size={21} aria-hidden="true" />
      </DockButton>
      <DockButton label="语音对话" active={listening} onClick={onVoice}>
        <Mic size={21} aria-hidden="true" />
        <span className="listening-ring" />
      </DockButton>
      <DockButton label="文字对话" active={textOpen} onClick={onToggleText}>
        <MessageCircle size={21} aria-hidden="true" />
      </DockButton>
      <DockButton label={memorySaved ? '已存为记忆' : '存为记忆'} active={memorySaved} onClick={onSaveMemory}>
        <Bookmark size={20} aria-hidden="true" />
      </DockButton>
    </section>
  )
}

function DockButton({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: {
  label: string
  active?: boolean
  disabled?: boolean
  onClick(): void
  children: React.ReactNode
}) {
  return (
    <motion.button
      className={`dock-button${active ? ' active' : ''}`}
      type="button"
      aria-label={label}
      disabled={disabled}
      variants={iconButtonMotion}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
    >
      {children}
      <small>{label}</small>
    </motion.button>
  )
}
