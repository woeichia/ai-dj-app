import type { VoiceClip } from '../../types/audio'
import type { VoiceProvider } from './VoiceProvider'

export const mockVoiceProvider: VoiceProvider = {
  async synthesize(text: string): Promise<VoiceClip> {
    const durationMs = Math.min(5200, Math.max(2600, text.length * 95))
    return { text, durationMs }
  },
}
