import type { Song } from './music'

export type PlaybackStatus =
  | 'idle'
  | 'voice-speaking'
  | 'music-ducked'
  | 'fading-in'
  | 'playing'
  | 'paused'

export interface VoiceClip {
  text: string
  durationMs: number
}

export interface AudioMixOptions {
  duckingVolume: number
  targetMusicVolume: number
  fadeInMs: number
}

export interface AudioMixerEvents {
  onStatusChange(status: PlaybackStatus): void
  onVolumeChange(volume: number): void
}

export interface AudioMixer {
  prepareMusic(song: Song): Promise<void>
  playVoiceThenFadeMusic(voice: VoiceClip, options?: AudioMixOptions): Promise<void>
  pause(): void
  resume(): void
  stop(): void
}
