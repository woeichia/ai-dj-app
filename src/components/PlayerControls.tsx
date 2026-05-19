import { Pause, Play, SkipForward } from 'lucide-react'
import type { PlaybackStatus } from '../types/audio'

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
      <button
        className="round-control primary"
        type="button"
        disabled={disabled}
        onClick={onTogglePlay}
        aria-label={isPlaying ? '暂停' : '播放'}
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </button>
      <button
        className="round-control"
        type="button"
        disabled={disabled}
        onClick={onNext}
        aria-label="下一首"
      >
        <SkipForward size={22} />
      </button>
      <button
        className="next-song"
        type="button"
        disabled={disabled}
        onClick={onNext}
      >
        Next Song
      </button>
    </section>
  )
}
