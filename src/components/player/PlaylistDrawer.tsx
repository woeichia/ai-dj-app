import { AnimatePresence, motion } from 'framer-motion'
import { ChevronUp, Sparkles } from 'lucide-react'
import { useState } from 'react'
import type { Song } from '../../types/music'
import { pillMotion } from '../motionPresets'

interface PlaylistDrawerProps {
  songs: Song[]
}

export function PlaylistDrawer({ songs }: PlaylistDrawerProps) {
  const [open, setOpen] = useState(false)

  return (
    <section className="playlist-drawer-shell">
      <motion.button
        className="playlist-pill"
        type="button"
        variants={pillMotion}
        initial="rest"
        animate="rest"
        whileHover="hover"
        whileTap="tap"
        onClick={() => setOpen((current) => !current)}
      >
        <Sparkles size={16} aria-hidden="true" />
        今日歌单
        <ChevronUp size={16} aria-hidden="true" />
      </motion.button>
      <AnimatePresence>
        {open ? (
          <motion.div
            className="playlist-drawer"
            initial={{ opacity: 0, y: 34, scale: 0.965, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 28, scale: 0.98, filter: 'blur(8px)' }}
            transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
          >
            <div>
              <span className="panel-kicker">未来 Daily AI Playlist</span>
              <p>以后 Echo Soul 会根据近期情绪、喜欢/跳过和播放习惯，慢慢生成每天的歌单。</p>
            </div>
            <div className="playlist-items">
              {(songs.length ? songs : []).slice(0, 5).map((song) => (
                <div className="playlist-item" key={song.id}>
                  <span>{song.title}</span>
                  <small>{song.artist}</small>
                </div>
              ))}
              {songs.length === 0 ? <small>下一次推荐后，这里会出现候选歌曲。</small> : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
