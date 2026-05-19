import { mockSongs } from '../../data/mockSongs'
import type { Song } from '../../types/music'
import type { MusicProvider } from './MusicProvider'

export const mockMusicProvider: MusicProvider = {
  async listSongs(): Promise<Song[]> {
    return mockSongs
  },

  async getPlayableSong(songId: string): Promise<Song> {
    const song = mockSongs.find((candidate) => candidate.id === songId)

    if (!song) {
      throw new Error(`Song not found: ${songId}`)
    }

    return song
  },
}
