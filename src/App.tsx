import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import './App.css'
import { MockAudioMixer } from './audio/MockAudioMixer'
import { EmotionalWaveform } from './components/EmotionalWaveform'
import { EmotionInput } from './components/EmotionInput'
import { NowPlayingCard } from './components/NowPlayingCard'
import { PlayerControls } from './components/PlayerControls'
import { PlaylistQueue } from './components/PlaylistQueue'
import { RecommendationCard } from './components/RecommendationCard'
import { TimeWeatherCard } from './components/TimeWeatherCard'
import { VoiceStatus } from './components/VoiceStatus'
import { iconButtonMotion } from './components/motionPresets'
import { mockAIProvider } from './providers/ai/mockAIProvider'
import { mockMusicProvider } from './providers/music/MockMusicProvider'
import { mockVoiceProvider } from './providers/voice/mockVoiceProvider'
import type { DJRecommendation } from './types/ai'
import type { PlaybackStatus } from './types/audio'
import type { Song, UserMusicPreferences } from './types/music'

function App() {
  const [emotionText, setEmotionText] = useState('今天有点累，但不想马上睡。')
  const [recommendation, setRecommendation] = useState<DJRecommendation | null>(null)
  const [queue, setQueue] = useState<Song[]>([])
  const [status, setStatus] = useState<PlaybackStatus>('idle')
  const [musicVolume, setMusicVolume] = useState(0)
  const [error, setError] = useState<string>()
  const [nextOffset, setNextOffset] = useState(0)
  const [isBusy, setIsBusy] = useState(false)

  const mixer = useMemo(
    () =>
      new MockAudioMixer({
        onStatusChange: setStatus,
        onVolumeChange: setMusicVolume,
      }),
    [],
  )

  const currentTime = useMemo(
    () =>
      new Intl.DateTimeFormat('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(new Date()),
    [],
  )

  const preferences: UserMusicPreferences = {
    genres: [],
  }

  async function startRecommendation(offset = 0): Promise<void> {
    if (!emotionText.trim()) {
      setError('先告诉我你现在的感觉。')
      return
    }

    setError(undefined)
    setIsBusy(true)
    setStatus('understanding')

    try {
      await wait(760)
      setStatus('searching')
      const songs = await mockMusicProvider.listSongs()
      await wait(680)
      setStatus('preparing')
      const orderedSongs = rotateSongs(songs, offset)
      const nextRecommendation = await mockAIProvider.createRecommendation(
        {
          text: emotionText,
          preferences,
          localTime: currentTime,
          weather: '夜色微凉',
        },
        orderedSongs,
      )
      const voice = await mockVoiceProvider.synthesize(nextRecommendation.spokenIntro)
      await wait(520)

      setQueue(orderedSongs.filter((song) => song.id !== nextRecommendation.song.id))
      setRecommendation(nextRecommendation)
      await mixer.prepareMusic(nextRecommendation.song)
      await mixer.playVoiceThenFadeMusic(voice)
    } catch {
      setError('我刚刚没能完整接住你的话。先给你放一首安静一点的。')
      setStatus('idle')
    } finally {
      setIsBusy(false)
    }
  }

  function handleTogglePlay(): void {
    if (!recommendation) {
      void startRecommendation()
      return
    }

    if (status === 'paused') {
      mixer.resume()
      return
    }

    if (
      status === 'playing' ||
      status === 'fading-in' ||
      status === 'voice-speaking' ||
      status === 'music-ducked'
    ) {
      mixer.pause()
      return
    }

    void startRecommendation(nextOffset)
  }

  function handleNextSong(): void {
    const next = nextOffset + 1
    setNextOffset(next)
    void startRecommendation(next)
  }

  return (
    <main className="app-shell">
      <div className="grain-layer" />
      <motion.div
        className="ambient-glow glow-one"
        animate={{ opacity: [0.45, 0.78, 0.45], scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="ambient-glow glow-two"
        animate={{ opacity: [0.36, 0.62, 0.36], y: [0, -18, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="experience-frame">
        <header className="topbar">
          <motion.button
            className="ghost-menu"
            type="button"
            aria-label="打开情绪菜单"
            variants={iconButtonMotion}
            initial="rest"
            animate="rest"
            whileHover="hover"
            whileTap="tap"
          >
            <span />
            <span />
            <span />
          </motion.button>
          <div className="brand-mark">
            <span>Echo Soul</span>
            <small>中文 AI 情绪陪伴</small>
          </div>
          <TimeWeatherCard time={currentTime} />
        </header>

        <motion.section
          className="ai-stage"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <VoiceStatus status={status} volume={musicVolume} />
          <EmotionalWaveform status={status} />
          <AnimatePresence mode="wait">
            <RecommendationCard recommendation={recommendation} />
          </AnimatePresence>
          <NowPlayingCard song={recommendation?.song ?? null} />
          <PlayerControls
            status={status}
            disabled={isBusy}
            onTogglePlay={handleTogglePlay}
            onNext={handleNextSong}
          />
        </motion.section>

        <section className="conversation-dock">
          <EmotionInput
            value={emotionText}
            error={error}
            onChange={setEmotionText}
            onSubmit={() => void startRecommendation()}
          />
        </section>

        <PlaylistQueue songs={queue.length > 0 ? queue : []} />
      </div>
    </main>
  )
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function rotateSongs(songs: Song[], offset: number): Song[] {
  if (songs.length === 0) return []
  const safeOffset = offset % songs.length
  return [...songs.slice(safeOffset), ...songs.slice(0, safeOffset)]
}

export default App
