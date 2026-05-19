import type {
  AudioMixOptions,
  AudioMixer,
  AudioMixerEvents,
  PlaybackStatus,
  VoiceClip,
} from '../types/audio'
import type { Song } from '../types/music'
import { interpolateVolume } from './volumeCurves'

const defaultOptions: AudioMixOptions = {
  duckingVolume: 0.16,
  targetMusicVolume: 0.76,
  fadeInMs: 2200,
}

export class MockAudioMixer implements AudioMixer {
  private timers: number[] = []
  private readonly events: AudioMixerEvents

  constructor(events: AudioMixerEvents) {
    this.events = events
  }

  async prepareMusic(song: Song): Promise<void> {
    void song
    this.clearTimers()
    this.setVolume(0)
    this.setStatus('idle')
  }

  async playVoiceThenFadeMusic(
    voice: VoiceClip,
    options: AudioMixOptions = defaultOptions,
  ): Promise<void> {
    this.clearTimers()
    this.setStatus('voice-speaking')
    this.setVolume(options.duckingVolume)

    await this.wait(700)
    this.setStatus('music-ducked')
    await this.wait(Math.max(1200, voice.durationMs - 700))
    this.setStatus('fading-in')
    await this.fadeTo(options.duckingVolume, options.targetMusicVolume, options.fadeInMs)
    this.setStatus('playing')
  }

  pause(): void {
    this.clearTimers()
    this.setStatus('paused')
  }

  resume(): void {
    this.setStatus('playing')
  }

  stop(): void {
    this.clearTimers()
    this.setVolume(0)
    this.setStatus('idle')
  }

  private setStatus(status: PlaybackStatus): void {
    this.events.onStatusChange(status)
  }

  private setVolume(volume: number): void {
    this.events.onVolumeChange(Number(volume.toFixed(2)))
  }

  private wait(ms: number): Promise<void> {
    return new Promise((resolve) => {
      const timer = window.setTimeout(resolve, ms)
      this.timers.push(timer)
    })
  }

  private async fadeTo(startVolume: number, endVolume: number, durationMs: number): Promise<void> {
    const startedAt = performance.now()

    await new Promise<void>((resolve) => {
      const tick = () => {
        const elapsed = performance.now() - startedAt
        const progress = elapsed / durationMs
        this.setVolume(interpolateVolume(startVolume, endVolume, progress))

        if (progress >= 1) {
          resolve()
          return
        }

        const timer = window.setTimeout(tick, 80)
        this.timers.push(timer)
      }

      tick()
    })
  }

  private clearTimers(): void {
    for (const timer of this.timers) {
      window.clearTimeout(timer)
    }
    this.timers = []
  }
}
