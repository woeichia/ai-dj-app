import type { DJRecommendation, EmotionRequest } from '../../types/ai'
import type { Song } from '../../types/music'

export interface AIProvider {
  createRecommendation(
    request: EmotionRequest,
    songs: Song[],
  ): Promise<DJRecommendation>
}
