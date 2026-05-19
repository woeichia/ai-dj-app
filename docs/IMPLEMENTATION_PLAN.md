# AI DJ MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the MVP of a personal Chinese AI DJ emotional music companion PWA with mock songs, OpenAI reasoning, OpenAI TTS, and Web Audio API ducking/fade behavior.

**Architecture:** Implement provider contracts first, then build a small orchestration layer that turns user emotion input into a recommendation and audio sequence. Keep UI, provider logic, mock data, and audio mixing separate so mock music can later be replaced by NetEase without rewriting the experience.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, Framer Motion, lucide-react, OpenAI API, OpenAI TTS, Web Audio API.

---

## File Structure

Planned files for implementation:

- Modify: `package.json` for any required scripts or dependencies only if needed.
- Modify: `src/App.tsx` to replace the Vite starter with the AI DJ app shell.
- Modify: `src/index.css` and `src/App.css` or migrate styling into Tailwind-compatible structure.
- Create: `src/types/music.ts` for song and preference types.
- Create: `src/types/ai.ts` for emotion analysis and recommendation types.
- Create: `src/types/audio.ts` for voice clip and mixer option types.
- Create: `src/data/mockSongs.ts` for MVP songs.
- Create: `src/utils/recommendationRanking.ts` for deterministic fallback ranking.
- Create: `src/providers/ai/AIProvider.ts` for the provider interface.
- Create: `src/providers/ai/OpenAIProvider.ts` for OpenAI reasoning.
- Create: `src/providers/ai/fallbackAIProvider.ts` for local fallback behavior.
- Create: `src/providers/voice/VoiceProvider.ts` for the TTS interface.
- Create: `src/providers/voice/OpenAITTSProvider.ts` for OpenAI TTS.
- Create: `src/providers/voice/fallbackVoiceProvider.ts` for text-only fallback.
- Create: `src/providers/music/MusicProvider.ts` for the music interface.
- Create: `src/providers/music/MockMusicProvider.ts` for mock songs.
- Create: `src/audio/AudioMixer.ts` for voice/music playback coordination.
- Create: `src/audio/volumeCurves.ts` for fade curve helpers.
- Create: `src/components/EmotionInput.tsx` for user mood input.
- Create: `src/components/PreferencePanel.tsx` for genre and language preferences.
- Create: `src/components/RecommendationCard.tsx` for song and AI reason.
- Create: `src/components/PlayerControls.tsx` for playback actions.
- Create: `src/components/VoiceStatus.tsx` for audio state display.
- Create: `src/components/AppShell.tsx` for mobile-first layout composition.

## Task 1: Establish Domain Types

**Files:**

- Create: `src/types/music.ts`
- Create: `src/types/ai.ts`
- Create: `src/types/audio.ts`

- [ ] **Step 1: Create music types**

Create `src/types/music.ts`:

```ts
export type SongLanguage = 'zh' | 'en'
export type SongLanguagePreference = 'zh' | 'en' | 'any'
export type SongEnergy = 'low' | 'medium' | 'high'

export interface UserMusicPreferences {
  genres: string[]
  language: SongLanguagePreference
}

export interface Song {
  id: string
  title: string
  artist: string
  language: SongLanguage
  moodTags: string[]
  genres: string[]
  energy: SongEnergy
  bpm?: number
  reasonTags: string[]
  audioUrl?: string
  coverUrl?: string
}
```

- [ ] **Step 2: Create AI types**

Create `src/types/ai.ts`:

```ts
import type { Song } from './music'
import type { UserMusicPreferences } from './music'

export type EmotionIntensity = 'light' | 'medium' | 'heavy'
export type DesiredEnergy = 'low' | 'medium' | 'high'

export interface EmotionRequest {
  text: string
  preferences: UserMusicPreferences
  localTime?: string
  weather?: {
    condition: string
    temperatureC?: number
  }
}

export interface EmotionAnalysis {
  primaryEmotion: string
  secondaryEmotions: string[]
  intensity: EmotionIntensity
  desiredEnergy: DesiredEnergy
  recommendationDirection: string
}

export interface DJRecommendation {
  analysis: EmotionAnalysis
  song: Song
  spokenIntro: string
  reason: string
}
```

- [ ] **Step 3: Create audio types**

Create `src/types/audio.ts`:

```ts
import type { Song } from './music'

export interface VoiceClip {
  url?: string
  durationMs?: number
  text: string
}

export interface AudioMixOptions {
  duckingVolume: number
  targetMusicVolume: number
  fadeInMs: number
}

export interface AudioMixer {
  prepareMusic(song: Song): Promise<void>
  playVoiceThenFadeMusic(voice: VoiceClip, options?: AudioMixOptions): Promise<void>
  stop(): void
}
```

- [ ] **Step 4: Verify TypeScript build**

Run: `npm run build`

Expected: build succeeds or fails only because later tasks have not yet replaced starter imports. Resolve type-only issues before continuing.

## Task 2: Add Mock Songs And Fallback Ranking

**Files:**

- Create: `src/data/mockSongs.ts`
- Create: `src/utils/recommendationRanking.ts`

- [ ] **Step 1: Create mock songs**

Create `src/data/mockSongs.ts` with 8 to 12 songs. Include both Chinese and English songs, and include local placeholder `audioUrl` values only when real safe demo audio files exist in `public/`.

Minimum shape per song:

```ts
import type { Song } from '../types/music'

export const mockSongs: Song[] = [
  {
    id: 'mock-quiet-night-zh',
    title: '夜里的一盏灯',
    artist: 'Mock Artist',
    language: 'zh',
    moodTags: ['疲惫', '孤独', '放松'],
    genres: ['民谣', '流行'],
    energy: 'low',
    bpm: 72,
    reasonTags: ['低能量', '温柔', '适合深夜'],
    audioUrl: undefined,
    coverUrl: undefined,
  },
]
```

- [ ] **Step 2: Implement ranking**

Create `src/utils/recommendationRanking.ts`:

```ts
import type { EmotionAnalysis } from '../types/ai'
import type { Song, UserMusicPreferences } from '../types/music'

export function rankSongs(
  songs: Song[],
  analysis: EmotionAnalysis,
  preferences: UserMusicPreferences,
): Song[] {
  return [...songs].sort((left, right) => {
    return (
      scoreSong(right, analysis, preferences) -
      scoreSong(left, analysis, preferences)
    )
  })
}

function scoreSong(
  song: Song,
  analysis: EmotionAnalysis,
  preferences: UserMusicPreferences,
): number {
  let score = 0

  if (song.moodTags.includes(analysis.primaryEmotion)) score += 10
  if (song.energy === analysis.desiredEnergy) score += 6
  if (preferences.language === song.language) score += 5
  if (preferences.language === 'any') score += 2

  for (const genre of preferences.genres) {
    if (song.genres.includes(genre)) score += 3
  }

  for (const emotion of analysis.secondaryEmotions) {
    if (song.moodTags.includes(emotion)) score += 2
  }

  return score
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`

Expected: TypeScript compiles.

## Task 3: Implement Provider Interfaces And Fallbacks

**Files:**

- Create: `src/providers/ai/AIProvider.ts`
- Create: `src/providers/ai/fallbackAIProvider.ts`
- Create: `src/providers/voice/VoiceProvider.ts`
- Create: `src/providers/voice/fallbackVoiceProvider.ts`
- Create: `src/providers/music/MusicProvider.ts`
- Create: `src/providers/music/MockMusicProvider.ts`

- [ ] **Step 1: Create AI provider interface**

Create `src/providers/ai/AIProvider.ts`:

```ts
import type { DJRecommendation, EmotionRequest } from '../../types/ai'
import type { Song } from '../../types/music'

export interface AIProvider {
  createRecommendation(
    request: EmotionRequest,
    songs: Song[],
  ): Promise<DJRecommendation>
}
```

- [ ] **Step 2: Create fallback AI provider**

Create `src/providers/ai/fallbackAIProvider.ts` using `rankSongs` and a warm Chinese fallback intro. It must always return a valid `DJRecommendation` when at least one song exists.

- [ ] **Step 3: Create voice provider interface**

Create `src/providers/voice/VoiceProvider.ts`:

```ts
import type { VoiceClip } from '../../types/audio'

export interface VoiceProvider {
  synthesize(text: string): Promise<VoiceClip>
}
```

- [ ] **Step 4: Create fallback voice provider**

Create `src/providers/voice/fallbackVoiceProvider.ts`:

```ts
import type { VoiceClip } from '../../types/audio'
import type { VoiceProvider } from './VoiceProvider'

export const fallbackVoiceProvider: VoiceProvider = {
  async synthesize(text: string): Promise<VoiceClip> {
    return { text }
  },
}
```

- [ ] **Step 5: Create music provider interface and mock implementation**

Create `src/providers/music/MusicProvider.ts` and `src/providers/music/MockMusicProvider.ts` so UI can call `listSongs()` and `getPlayableSong(songId)`.

- [ ] **Step 6: Verify build**

Run: `npm run build`

Expected: TypeScript compiles.

## Task 4: Add OpenAI Providers

**Files:**

- Create: `src/providers/ai/OpenAIProvider.ts`
- Create: `src/providers/voice/OpenAITTSProvider.ts`
- Modify: `.env.example` if environment documentation is added.

- [ ] **Step 1: Implement OpenAI reasoning provider**

Create an OpenAI provider that sends the user request and candidate mock songs, asks for structured JSON, validates required fields, and falls back locally on invalid output.

- [ ] **Step 2: Implement OpenAI TTS provider**

Create an OpenAI TTS provider that converts `spokenIntro` into a `VoiceClip` URL. The provider should return a text-only clip when the request fails.

- [ ] **Step 3: Document local env variables**

Add environment variable documentation:

```text
VITE_OPENAI_API_KEY=
VITE_OPENAI_REASONING_MODEL=
VITE_OPENAI_TTS_MODEL=
VITE_OPENAI_TTS_VOICE=
```

- [ ] **Step 4: Verify fallback behavior without keys**

Run: `npm run build`

Expected: build succeeds without requiring real env values.

## Task 5: Implement AudioMixer

**Files:**

- Create: `src/audio/volumeCurves.ts`
- Create: `src/audio/AudioMixer.ts`

- [ ] **Step 1: Create volume curve helper**

Create a helper that interpolates volume from a start value to an end value over a duration.

- [ ] **Step 2: Implement browser audio mixer**

Implement music preparation, voice playback, ducking volume, fade in, and cleanup. Use Web Audio API when possible and basic `HTMLAudioElement.volume` fallback when needed.

- [ ] **Step 3: Handle autoplay restrictions**

Expose errors in a way the UI can turn into “点一下开始播放”.

- [ ] **Step 4: Verify build**

Run: `npm run build`

Expected: TypeScript compiles.

## Task 6: Build Mobile-First UI

**Files:**

- Create: `src/components/AppShell.tsx`
- Create: `src/components/EmotionInput.tsx`
- Create: `src/components/PreferencePanel.tsx`
- Create: `src/components/RecommendationCard.tsx`
- Create: `src/components/PlayerControls.tsx`
- Create: `src/components/VoiceStatus.tsx`
- Modify: `src/App.tsx`
- Modify: `src/index.css`
- Modify: `src/App.css`

- [ ] **Step 1: Replace starter app shell**

Replace the Vite starter with a Chinese AI DJ interface. The first screen should contain the actual mood input and recommendation flow.

- [ ] **Step 2: Add preference controls**

Add genre chips and a segmented language preference control: 中文、英文、不限制.

- [ ] **Step 3: Add recommendation display**

Show song title, artist, language, AI reason, and current audio state.

- [ ] **Step 4: Add player controls**

Add play, pause, stop, and “再来一首” controls with lucide-react icons and accessible names.

- [ ] **Step 5: Apply UI style guide**

Use warm, cinematic, minimal, Chinese-friendly styling. Avoid Spotify clone layout and generic template sections.

- [ ] **Step 6: Verify browser UI**

Run: `npm run dev`

Open the local Vite URL and inspect desktop and mobile widths.

Expected: no overlapping text, core flow visible on first screen, controls readable on mobile.

## Task 7: Orchestrate The Recommendation Flow

**Files:**

- Modify: `src/App.tsx`
- Modify: `src/components/*`
- Use: provider and audio modules from earlier tasks.

- [ ] **Step 1: Add app state machine**

Represent states: idle, invalid-input, analyzing, recommended, voice-playing, fading-in, playing, error.

- [ ] **Step 2: Wire submit flow**

On submit: validate input, list mock songs, call AI provider, synthesize voice, prepare music, play voice then fade music.

- [ ] **Step 3: Wire fallback paths**

If AI fails, use fallback AI. If TTS fails, show text and allow music. If audio fails, show Chinese error state.

- [ ] **Step 4: Verify core flow manually**

Run: `npm run dev`

Expected: entering Chinese mood text produces a recommendation and a coherent state transition.

## Task 8: PWA Basics

**Files:**

- Modify: `public/manifest.webmanifest`
- Modify: `index.html`
- Add or update PWA icons in `public/` if needed.

- [ ] **Step 1: Add manifest**

Create a manifest with Chinese app name, theme color, background color, and icons.

- [ ] **Step 2: Link manifest**

Update `index.html` to link the manifest and set mobile-friendly metadata.

- [ ] **Step 3: Verify build**

Run: `npm run build`

Expected: Vite build succeeds and manifest is included in output.

## Task 9: Final Verification

**Files:**

- Review all changed files.

- [ ] **Step 1: Run lint**

Run: `npm run lint`

Expected: no lint errors.

- [ ] **Step 2: Run build**

Run: `npm run build`

Expected: production build succeeds.

- [ ] **Step 3: Browser verification**

Run: `npm run dev`

Verify:

- Chinese UI text appears correctly.
- Empty input is handled.
- Mock recommendation appears.
- AI DJ copy is Chinese.
- Language preference affects recommendation.
- TTS failure does not block visible recommendation.
- Audio state messages are understandable.
- Mobile layout has no overlapping text.

- [ ] **Step 4: Update development log**

Append implementation summary to `docs/DEVELOPMENT_LOG.md`, including verification commands and any known limitations.

## Self-Review Notes

- The plan covers product docs, provider architecture, mock songs, OpenAI reasoning, OpenAI TTS, Web Audio API audio behavior, mobile-first Chinese UI, and PWA basics.
- The plan deliberately keeps NetEase Cloud Music as a future provider, not MVP scope.
- The plan avoids app code in the current documentation phase.
- Implementation should proceed task by task, with verification after each major slice.
