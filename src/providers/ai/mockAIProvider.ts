import type { AIProvider } from './AIProvider'
import type { DJRecommendation, EmotionAnalysis, EmotionRequest } from '../../types/ai'
import type { Song } from '../../types/music'
import { rankSongs } from '../../utils/recommendationRanking'

const moodDirections: Record<
  string,
  Pick<EmotionAnalysis, 'desiredEnergy' | 'intensity' | 'recommendationDirection'>
> = {
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
    const textHints = inferSecondaryEmotions(request.text)
    const primaryEmotion = inferPrimaryEmotion(request.text, textHints)
    const moodProfile = moodDirections[primaryEmotion] ?? moodDirections.疲惫
    const analysis: EmotionAnalysis = {
      primaryEmotion,
      secondaryEmotions: textHints,
      desiredEnergy: moodProfile.desiredEnergy,
      intensity: moodProfile.intensity,
      recommendationDirection: moodProfile.recommendationDirection,
    }

    const [song] = rankSongs(songs, analysis, request.preferences)

    return {
      analysis,
      song,
      spokenIntro: buildSpokenIntro(primaryEmotion, song.title),
      reason: buildRecommendationReason(primaryEmotion, song),
    }
  },
}

function inferPrimaryEmotion(text: string, hints: string[]): string {
  if (text.includes('累') || text.includes('疲惫') || text.includes('下班')) {
    return '疲惫'
  }

  const strongMatches = [
    ['想你', '想念'],
    ['想念', '想念'],
    ['怀念', '想念'],
    ['一个人', '孤独'],
    ['孤单', '孤独'],
    ['空', '放空'],
    ['放下', '释然'],
    ['没事了', '释然'],
  ] as const

  const found = strongMatches.find(([keyword]) => text.includes(keyword))

  if (found) return found[1]
  return hints[0] ?? '疲惫'
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

function buildRecommendationReason(mood: string, song: Song): string {
  const languageTexture =
    song.language === 'zh'
      ? '中文人声会更贴近你刚刚说话的语感'
      : '英文人声留白更多，不会把情绪解释得太满'

  const moodReasons: Record<string, string> = {
    疲惫: `我选这首，是因为它的节奏没有急着把你拉起来，而是先给你一点空间。${song.shortReason}${languageTexture}，适合那种累了一天、还不想马上睡去的状态。`,
    想念: `我选这首，是因为它的节奏不急，人声也没有把想念唱得太满，只是轻轻把那部分情绪托住。${song.shortReason}${languageTexture}，适合把没说出口的话慢慢放在夜里。`,
    孤独: `我选这首，是因为它的编曲不拥挤，节奏像有人在旁边安静坐着。${song.shortReason}${languageTexture}，不会打扰你，也不会让房间显得太空。`,
    放空: `我选这首，是因为它的制作风格比较轻，节奏和旋律之间有很多呼吸的位置。${song.shortReason}${languageTexture}，适合让脑子里的噪声慢慢退远。`,
    释然: `我选这首，是因为它的编曲有一点往前走的温度，但节奏没有用力催促你快乐起来。${song.shortReason}${languageTexture}，适合把刚刚松开的那口气延长一点。`,
  }

  return moodReasons[mood] ?? moodReasons.疲惫
}
