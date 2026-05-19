import { ChevronDown } from 'lucide-react'
import type { Song } from '../types/music'

interface PlaylistQueueProps {
  songs: Song[]
}

export function PlaylistQueue({ songs }: PlaylistQueueProps) {
  return (
    <details className="playlist-queue">
      <summary>
        <span>Playlist queue</span>
        <ChevronDown size={16} aria-hidden="true" />
      </summary>
      <div className="queue-list">
        {songs.slice(0, 4).map((song) => (
          <div className="queue-row" key={song.id}>
            <span>{song.title}</span>
            <small>{song.artist}</small>
          </div>
        ))}
      </div>
    </details>
  )
}
