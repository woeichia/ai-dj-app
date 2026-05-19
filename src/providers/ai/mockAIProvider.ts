import type { AIProvider } from './AIProvider'
import type { DJRecommendation, EmotionAnalysis, EmotionRequest } from '../../types/ai'
import type { Song } from '../../types/music'
import { rankSongs } from '../../utils/recommendationRanking'

const moodDirections: Record<string, Pick<EmotionAnalysis, 'desiredEnergy' | 'intensity' | 'recommendationDirection'>> = {
  疲惫: {
    desiredEnergy: 'low',
    intensity: 'medium',
    recommendationDirection: '低能量、温柔、不要太悲伤',
  },
  想念: {
    desiredEnergy: 'low',
    intensity: 'medium',
    recommendationDirection: '留白多一点，适合把想念放轻',
  },
  孤独: {
    desiredEnergy: 'medium',
    intensity: 'medium',
    recommendationDirection: '温暖但不喧闹，像有人在旁边坐着',
  },
  放空: {
    desiredEnergy: 'low',
    intensity: 'light',
    recommendationDirection: '氛围感、低 BPM、减少歌词压力',
  },
  释然: {
    desiredEnergy: 'medium',
    intensity: 'light',
    recommendationDirection: '轻一点地往前走，保留温柔的余温',
  },
}

export const mockAIProvider: AIProvider = {
  async createRecommendation(
    request: EmotionRequest,
    songs: Song[],
  ): Promise<DJRecommendation> {
    const moodProfile = moodDirections[request.preferences.mood] ?? moodDirections.疲惫
    const textHints = inferSecondaryEmotions(request.text)
    const analysis: EmotionAnalysis = {
      primaryEmotion: request.preferences.mood,
      secondaryEmotions: textHints,
      desiredEnergy: moodProfile.desiredEnergy,
      intensity: moodProfile.intensity,
      recommendationDirection: moodProfile.recommendationDirection,
    }

    const [song] = rankSongs(songs, analysis, request.preferences)

    return {
      analysis,
      song,
      spokenIntro: buildSpokenIntro(request.preferences.mood, song.title),
      reason: `${song.shortReason} ${formatLanguageReason(song.language)}我选它，是想让你先不用急着变好，只是让声音轻一点地陪你待一会儿。`,
    }
  },
}

function inferSecondaryEmotions(text: string): string[] {
  const hints = [
    ['累', '疲惫'],
    ['想', '想念'],
    ['睡', '安静'],
    ['下班', '放空'],
    ['一个人', '孤独'],
    ['轻松', '轻松'],
  ] as const

  const matched = hints
    .filter(([keyword]) => text.includes(keyword))
    .map(([, emotion]) => emotion)

  return Array.from(new Set(matched)).slice(0, 3)
}

function buildSpokenIntro(mood: string, title: string): string {
  const intros: Record<string, string> = {
    疲惫: `我先把声音放低一点。给你放《${title}》，它不会催你精神起来，只是陪你把今天慢慢放下。`,
    想念: `有些想念不用马上说完。我们先听《${title}》，让它替你把那一点没说出口的部分放轻。`,
    孤独: `今晚不用把自己撑得很满。我给你放《${title}》，像留一盏不刺眼的灯。`,
    放空: `那就先不想太多。我给你放《${title}》，让节奏慢一点，把脑子里的声音往后退。`,
    释然: `我听到你有一点想往前走。先放《${title}》，轻轻的，不打扰这份松开。`,
  }

  return intros[mood] ?? intros.疲惫
}

function formatLanguageReason(language: Song['language']): string {
  return language === 'zh'
    ? '中文歌词会更贴近此刻的语感，'
    : '英文旋律留白更多，反而不会把情绪说得太满，'
}
