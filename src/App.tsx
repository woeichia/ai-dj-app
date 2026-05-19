import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import './App.css'
import { MockAudioMixer } from './audio/MockAudioMixer'
import { EmotionalWaveform } from './components/EmotionalWaveform'
import { EmotionInput } from './components/EmotionInput'
import { NowPlayingCard } from './components/NowPlayingCard'
import { PlayerControls } from './components/PlayerControls'
import { PlaylistQueue } from './components/PlaylistQueue'
import { PreferencePanel } from './components/PreferencePanel'
import { RecommendationCard } from './components/RecommendationCard'
import { TimeWeatherCard } from './components/TimeWeatherCard'
import { VoiceStatus } from './components/VoiceStatus'
import { mockAIProvider } from './providers/ai/mockAIProvider'
import { mockMusicProvider } from './providers/music/MockMusicProvider'
import { mockVoiceProvider } from './providers/voice/mockVoiceProvider'
import type { DJRecommendation } from './types/ai'
import type { PlaybackStatus } from './types/audio'
import type { Song, SongLanguagePreference, UserMusicPreferences } from './types/music'

const moods = ['疲惫', '想念', '孤独', '放空', '释然']

function App() {
  const [emotionText, setEmotionText] = useState('今天有点累，但不想马上睡。')
  const [selectedMood, setSelectedMood] = useState('疲惫')
  const [language, setLanguage] = useState<SongLanguagePreference>('any')
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['华语流行'])
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
    mood: selectedMood,
    genres: selectedGenres,
    language,
  }

  async function startRecommendation(offset = 0): Promise<void> {
    if (!emotionText.trim()) {
      setError('先告诉我你现在的感觉。')
      return
    }

    setError(undefined)
    setIsBusy(true)
    setStatus('idle')

    try {
      const songs = await mockMusicProvider.listSongs()
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

  function handleGenreToggle(genre: string): void {
    setSelectedGenres((currentGenres) =>
      currentGenres.includes(genre)
        ? currentGenres.filter((item) => item !== genre)
        : [...currentGenres, genre],
    )
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

    if (status === 'playing' || status === 'fading-in' || status === 'voice-speaking' || status === 'music-ducked') {
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
          <button className="ghost-menu" type="button" aria-label="打开情绪菜单">
            <span />
            <span />
            <span />
          </button>
          <div className="brand-mark">
            <span>Echo Soul</span>
            <small>中文 AI 情绪 DJ</small>
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
            selectedMood={selectedMood}
            moods={moods}
            error={error}
            onChange={setEmotionText}
            onMoodChange={setSelectedMood}
            onSubmit={() => void startRecommendation()}
          />
          <PreferencePanel
            language={language}
            selectedGenres={selectedGenres}
            onLanguageChange={setLanguage}
            onGenreToggle={handleGenreToggle}
          />
        </section>

        <PlaylistQueue songs={queue.length > 0 ? queue : []} />
      </div>
    </main>
  )
}

function rotateSongs(songs: Song[], offset: number): Song[] {
  if (songs.length === 0) return []
  const safeOffset = offset % songs.length
  return [...songs.slice(safeOffset), ...songs.slice(0, safeOffset)]
}

export default App
