export type SongLanguage = 'zh' | 'en'
export type SongEnergy = 'low' | 'medium' | 'high'

export interface UserMusicPreferences {
  genres: string[]
}

export interface Song {
  id: string
  title: string
  artist: string
  language: SongLanguage
  moodTags: string[]
  genres: string[]
  energy: SongEnergy
  bpm?: number
  shortReason: string
  reasonTags: string[]
  color: string
  duration: string
}
