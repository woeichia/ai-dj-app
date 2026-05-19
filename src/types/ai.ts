import type { Song, UserMusicPreferences } from './music'

export type EmotionIntensity = 'light' | 'medium' | 'heavy'
export type DesiredEnergy = 'low' | 'medium' | 'high'

export interface EmotionRequest {
  text: string
  preferences: UserMusicPreferences
  localTime: string
  weather: string
}

export interface EmotionAnalysis {
  primaryEmotion: string
  secondaryEmotions: string[]
  intensity: EmotionIntensity
  desiredEnergy: DesiredEnergy
  recommendationDirection: string
}

export interface DJRecommendation {
  analysis: EmotionAnalysis
  song: Song
  spokenIntro: string
  reason: string
}
