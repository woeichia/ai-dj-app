import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import type { DJRecommendation } from '../../types/ai'
import type { PlaybackStatus } from '../../types/audio'

interface NowPlayingGlassCardProps {
  recommendation: DJRecommendation | null
  status: PlaybackStatus
}

const idleLyrics = [
  '说一句此刻的感觉',
  '夜会把声音慢慢放轻',
  '音乐会从很远的地方靠近',
]

const lyricSets: Record<string, string[]> = {
  'zh-late-window': [
    '窗边的雨慢下来',
    '房间里只剩一盏温柔的灯',
    '你不用急着变回白天的样子',
    '让这首歌先替你安静一会儿',
  ],
  'zh-blue-hour': [
    '天色在心里缓缓变蓝',
    '有些话不用马上说出口',
    '旋律会替你把夜推开一点',
    '等情绪自己找到落点',
  ],
  'en-soft-distance': [
    'Stay with the quiet for a little longer',
    'The room is breathing in a softer key',
    'Nothing has to hurry back to brightness',
    'Let the echo hold the edge of night',
  ],
  'en-afterglow': [
    'The afterglow stays quiet on the wall',
    'Your thoughts can move at their own speed',
    'A soft voice keeps the room from closing',
    'Tonight does not ask you to be brighter',
  ],
  'zh-soft-rnb': [
    '低一点的鼓点贴近心口',
    '情绪在旋律里慢慢松开',
    '不用把疲惫藏得很好',
    '这一刻可以只属于你',
  ],
  'en-moon-room': [
    'Moonlight gathers at the edge of the room',
    'The silence turns warm before it fades',
    'A melody waits without asking why',
    'You can stay here until the night softens',
  ],
  'zh-warm-drive': [
    '路灯把夜色拉得很长',
    '风里有一点迟来的温柔',
    '这首歌不急着抵达',
    '只陪你慢慢穿过此刻',
  ],
  'en-blue-coast': [
    'Blue light folds itself into the shore',
    'The rhythm keeps a small flame alive',
    'Every wave returns a little softer',
    'Let the distance breathe beside you',
  ],
  default: [
    '夜色轻轻落在声音上',
    '有一段旋律正在靠近',
    '它不催促你快乐',
    '只把此刻慢慢照亮',
  ],
}

export function NowPlayingGlassCard({ recommendation, status }: NowPlayingGlassCardProps) {
  const reduceMotion = useReducedMotion()
  const songId = recommendation?.song.id ?? 'idle'
  const [lyricCursor, setLyricCursor] = useState({ songId, lineIndex: 0 })
  const lyrics = useMemo(() => {
    if (!recommendation) return idleLyrics
    return lyricSets[recommendation.song.id] ?? lyricSets.default
  }, [recommendation])
  const lineIndex = lyricCursor.songId === songId ? lyricCursor.lineIndex : 0
  const currentLine = lyrics[lineIndex % lyrics.length]
  const nextLine = lyrics[(lineIndex + 1) % lyrics.length]

  useEffect(() => {
    if (reduceMotion || !recommendation || status === 'paused') return undefined

    const interval = window.setInterval(() => {
      setLyricCursor((current) => ({
        songId,
        lineIndex: current.songId === songId ? (current.lineIndex + 1) % lyrics.length : 1,
      }))
    }, status === 'playing' ? 3600 : 4300)

    return () => window.clearInterval(interval)
  }, [lyrics.length, recommendation, reduceMotion, songId, status])

  return (
    <motion.section
      className={`now-glass-card lyrics-panel${recommendation ? '' : ' empty'}`}
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
    >
      {recommendation ? (
        <div className="song-aura" style={{ background: recommendation.song.color }} />
      ) : null}

      <div className="lyrics-song">
        <span>{recommendation ? recommendation.song.title : 'Echo Soul'}</span>
        <small>{recommendation ? recommendation.song.artist : 'late night'}</small>
      </div>

      <div className="lyric-lines">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentLine}
            className="current-lyric"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -16, filter: 'blur(10px)' }}
            transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
          >
            {currentLine}
          </motion.p>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.span
            key={nextLine}
            className="next-lyric"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
          >
            {nextLine}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.section>
  )
}
