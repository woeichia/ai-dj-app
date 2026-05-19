import type { Song } from '../../types/music'

export interface MusicProvider {
  listSongs(): Promise<Song[]>
  getPlayableSong(songId: string): Promise<Song>
}
