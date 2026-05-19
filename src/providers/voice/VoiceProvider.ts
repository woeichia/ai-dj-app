import type { VoiceClip } from '../../types/audio'

export interface VoiceProvider {
  synthesize(text: string): Promise<VoiceClip>
}
