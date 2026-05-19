# Tech Spec

## 技术栈

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- lucide-react
- OpenAI API for AI reasoning
- OpenAI TTS for AI voice
- Web Audio API for audio ducking and fade in
- Mock songs for MVP music source

## 架构原则

核心架构目标是可替换 provider。MVP 用 mock songs 和 OpenAI，后续可以替换或新增网易云音乐 provider，而不重写 UI 和音频衔接逻辑。

主要模块：

- `AIProvider`
- `VoiceProvider`
- `MusicProvider`
- `AudioMixer`
- app state / session orchestration
- UI components

## 建议目录结构

后续实现时建议逐步演进为：

```text
src/
  app/
    App.tsx
  components/
    EmotionInput.tsx
    PreferencePanel.tsx
    RecommendationCard.tsx
    PlayerControls.tsx
    VoiceStatus.tsx
  data/
    mockSongs.ts
  providers/
    ai/
      AIProvider.ts
      OpenAIProvider.ts
      fallbackAIProvider.ts
    voice/
      VoiceProvider.ts
      OpenAITTSProvider.ts
      fallbackVoiceProvider.ts
    music/
      MusicProvider.ts
      MockMusicProvider.ts
      NetEaseMusicProvider.ts
  audio/
    AudioMixer.ts
    volumeCurves.ts
  types/
    ai.ts
    audio.ts
    music.ts
    preferences.ts
  utils/
    recommendationRanking.ts
```

实际实施时应尊重当前项目结构，分阶段迁移，避免一次性大改。

## Domain Types

建议核心类型：

```ts
type SongLanguage = 'zh' | 'en'
type SongLanguagePreference = 'zh' | 'en' | 'any'

type EmotionIntensity = 'light' | 'medium' | 'heavy'

interface UserMusicPreferences {
  genres: string[]
  language: SongLanguagePreference
}

interface EmotionRequest {
  text: string
  preferences: UserMusicPreferences
  localTime?: string
  weather?: {
    condition: string
    temperatureC?: number
  }
}

interface EmotionAnalysis {
  primaryEmotion: string
  secondaryEmotions: string[]
  intensity: EmotionIntensity
  desiredEnergy: 'low' | 'medium' | 'high'
  recommendationDirection: string
}

interface Song {
  id: string
  title: string
  artist: string
  language: SongLanguage
  moodTags: string[]
  genres: string[]
  energy: 'low' | 'medium' | 'high'
  bpm?: number
  reasonTags: string[]
  audioUrl?: string
  coverUrl?: string
}

interface DJRecommendation {
  analysis: EmotionAnalysis
  song: Song
  spokenIntro: string
  reason: string
}
```

## Provider Contracts

### AIProvider

Responsibilities:

- Analyze user emotion.
- Rank or select a song from available songs.
- Generate Chinese DJ copy.
- Return structured data that UI and audio flow can consume.

Contract:

```ts
interface AIProvider {
  createRecommendation(request: EmotionRequest, songs: Song[]): Promise<DJRecommendation>
}
```

MVP:

- OpenAI provider for reasoning.
- Local fallback provider when OpenAI fails.

### VoiceProvider

Responsibilities:

- Convert `spokenIntro` to playable audio.
- Return object URL, blob, or audio buffer depending on implementation.
- Fail gracefully.

Contract:

```ts
interface VoiceProvider {
  synthesize(text: string): Promise<VoiceClip>
}

interface VoiceClip {
  url: string
  durationMs?: number
}
```

MVP:

- OpenAI TTS provider.
- Fallback mode displays text only.

### MusicProvider

Responsibilities:

- Provide candidate songs.
- Resolve playable URL for selected song.
- Later support NetEase integration behind the same interface.

Contract:

```ts
interface MusicProvider {
  listSongs(): Promise<Song[]>
  getPlayableSong(songId: string): Promise<Song>
}
```

MVP:

- Mock songs in local data.

Future:

- NetEase provider with search, metadata mapping, and playable source handling.

### AudioMixer

Responsibilities:

- Own Web Audio graph where needed.
- Coordinate voice and music levels.
- Apply ducking during voice playback.
- Fade music in after voice ends.
- Clean up audio nodes and timers.

Contract:

```ts
interface AudioMixer {
  prepareMusic(song: Song): Promise<void>
  playVoiceThenFadeMusic(voice: VoiceClip, options?: AudioMixOptions): Promise<void>
  stop(): void
}

interface AudioMixOptions {
  duckingVolume: number
  targetMusicVolume: number
  fadeInMs: number
}
```

## OpenAI Integration

OpenAI reasoning should request structured JSON, not loose prose only. The app should validate that required fields exist before using the result.

Reasoning prompt must specify:

- UI and AI DJ language is Simplified Chinese.
- DJ voice should be warm, calm, emotional, slightly poetic.
- Do not sound like customer support.
- Do not overclaim mental-health expertise.
- Recommend from the provided song list only during MVP.
- Explain the recommendation in Chinese.

TTS prompt/input should use the generated `spokenIntro`, with SSML-like markup only if supported by the chosen TTS API.

## Environment Variables

Likely environment variables:

```text
VITE_OPENAI_API_KEY=
VITE_OPENAI_REASONING_MODEL=
VITE_OPENAI_TTS_MODEL=
VITE_OPENAI_TTS_VOICE=
```

Security note: client-side API keys are not safe for production. Because this is a personal MVP, this may be acceptable for local use, but a production deployment should route OpenAI calls through a minimal server or edge function.

## Error Handling

Required fallbacks:

- OpenAI reasoning fails: choose from mock songs using local ranking.
- TTS fails: show DJ text and allow music playback.
- Music playback fails: keep recommendation visible and show a gentle Chinese error.
- Browser blocks autoplay: ask user to tap play.
- Web Audio unavailable: fall back to basic HTML audio volume changes.

## Testing Strategy

Minimum checks after implementation:

- `npm run lint`
- `npm run build`

Recommended tests when test tooling is added:

- Recommendation ranking respects language preference.
- Empty input does not call providers.
- AI fallback returns a valid recommendation.
- AudioMixer applies ducking then fade in.
- TTS failure does not block music playback.

## Privacy Notes

User emotion input can be sensitive. Avoid logging full user messages to console in production-oriented code. If telemetry is added later, it must be opt-in and documented.
