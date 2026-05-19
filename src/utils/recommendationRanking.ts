import type { EmotionAnalysis } from '../types/ai'
import type { Song, UserMusicPreferences } from '../types/music'

export function rankSongs(
  songs: Song[],
  analysis: EmotionAnalysis,
  preferences: UserMusicPreferences,
): Song[] {
  return [...songs].sort(
    (left, right) =>
      scoreSong(right, analysis, preferences) -
      scoreSong(left, analysis, preferences),
  )
}

function scoreSong(
  song: Song,
  analysis: EmotionAnalysis,
  preferences: UserMusicPreferences,
): number {
  let score = 0

  if (song.moodTags.includes(preferences.mood)) score += 14
  if (song.moodTags.includes(analysis.primaryEmotion)) score += 10
  if (song.energy === analysis.desiredEnergy) score += 6
  if (preferences.language === song.language) score += 5
  if (preferences.language === 'any') score += 2

  for (const genre of preferences.genres) {
    if (song.genres.includes(genre)) score += 3
  }

  for (const emotion of analysis.secondaryEmotions) {
    if (song.moodTags.includes(emotion)) score += 2
  }

  return score
}
