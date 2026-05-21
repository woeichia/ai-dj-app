import { lazy, Suspense, useMemo, useState } from 'react'
import './App.css'
import { MockAudioMixer } from './audio/MockAudioMixer'
import { VoiceTextDock } from './components/chat/VoiceTextDock'
import { EmotionalUniverseShell } from './components/layout/EmotionalUniverseShell'
import { AIMessageSubtitle } from './components/player/AIMessageSubtitle'
import { ControlDock } from './components/player/ControlDock'
import { DailyEmotionalQuote } from './components/player/DailyEmotionalQuote'
import { NowPlayingGlassCard } from './components/player/NowPlayingGlassCard'
import { PlaylistDrawer } from './components/player/PlaylistDrawer'
import { mockAIProvider } from './providers/ai/mockAIProvider'
import { mockMusicProvider } from './providers/music/MockMusicProvider'
import { mockVoiceProvider } from './providers/voice/mockVoiceProvider'
import type { DJRecommendation } from './types/ai'
import type { PlaybackStatus } from './types/audio'
import type { Song, UserMusicPreferences } from './types/music'

const EmotionParticleOrb = lazy(() =>
  import('./components/visual/EmotionParticleOrb').then((module) => ({
    default: module.EmotionParticleOrb,
  })),
)

const weatherLabel = '夜色微凉'

function App() {
  const [emotionText, setEmotionText] = useState('今天有点累，但不想马上睡。')
  const [recommendation, setRecommendation] = useState<DJRecommendation | null>(null)
  const [queue, setQueue] = useState<Song[]>([])
  const [status, setStatus] = useState<PlaybackStatus>('idle')
  const [error, setError] = useState<string>()
  const [nextOffset, setNextOffset] = useState(0)
  const [isBusy, setIsBusy] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [textDockOpen, setTextDockOpen] = useState(false)
  const [memorySaved, setMemorySaved] = useState(false)

  const mixer = useMemo(
    () =>
      new MockAudioMixer({
        onStatusChange: setStatus,
        onVolumeChange: () => undefined,
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
      setTextDockOpen(true)
      return
    }

    setError(undefined)
    setIsListening(false)
    setMemorySaved(false)
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
          weather: weatherLabel,
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
      setTextDockOpen(true)
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

  function handleTextSubmit(): void {
    if (emotionText.trim()) {
      setTextDockOpen(false)
    }

    void startRecommendation()
  }

  function handleVoicePlaceholder(): void {
    setIsListening(true)
    setTextDockOpen(false)
    window.setTimeout(() => {
      setIsListening(false)
    }, 2200)
  }

  function handleSaveMemory(): void {
    setMemorySaved(true)
    window.setTimeout(() => setMemorySaved(false), 2400)
  }

  return (
    <EmotionalUniverseShell>
      <div className="universe-copy">
        <h1>Echo Soul</h1>
        <DailyEmotionalQuote />
      </div>

      <div className="orb-stage">
        <Suspense fallback={<div className="orb-loading" aria-hidden="true" />}>
          <EmotionParticleOrb
            status={status}
            mood={recommendation?.analysis.primaryEmotion}
            listening={isListening}
            coverUrl={recommendation?.song.coverUrl}
            accentColor={recommendation?.song.color}
          />
        </Suspense>
      </div>

      <AIMessageSubtitle
        recommendation={recommendation}
        status={status}
        listening={isListening}
      />

      <NowPlayingGlassCard recommendation={recommendation} status={status} />

      <ControlDock
        status={status}
        disabled={isBusy}
        listening={isListening}
        textOpen={textDockOpen}
        memorySaved={memorySaved}
        onTogglePlay={handleTogglePlay}
        onNext={handleNextSong}
        onVoice={handleVoicePlaceholder}
        onToggleText={() => setTextDockOpen((current) => !current)}
        onSaveMemory={handleSaveMemory}
      />

      <VoiceTextDock
        value={emotionText}
        error={error}
        open={textDockOpen}
        onChange={setEmotionText}
        onSubmit={handleTextSubmit}
      />

      <PlaylistDrawer songs={queue} />
    </EmotionalUniverseShell>
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
