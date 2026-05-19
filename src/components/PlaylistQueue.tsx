import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { Song } from '../types/music'
import { pillMotion } from './motionPresets'

interface PlaylistQueueProps {
  songs: Song[]
}

export function PlaylistQueue({ songs }: PlaylistQueueProps) {
  return (
    <details className="playlist-queue">
      <motion.summary
        variants={pillMotion}
        initial="rest"
        animate="rest"
        whileHover="hover"
        whileTap="tap"
      >
        <span>Playlist queue</span>
        <ChevronDown size={16} aria-hidden="true" />
      </motion.summary>
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
