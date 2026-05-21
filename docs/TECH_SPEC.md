# Tech Spec

## Stack

- React
- TypeScript
- Vite
- Tailwind-compatible CSS
- Framer Motion
- GSAP
- lucide-react
- Mock AI, voice, and music providers for the current local experience

Future integrations may use OpenAI for reasoning/TTS and NetEase for music, but this phase does not add provider integrations.

## Animation Architecture

- Framer Motion handles React component transitions, hover/tap feedback, AI state changes, and enter/exit animations.
- GSAP handles continuous ambient animation that should not be recreated on every React render.
- Anime.js is inspiration only and is not an official dependency.
- Three.js is intentionally not used in this phase.

## Current State Model

`PlaybackStatus` covers:

- `idle`
- `understanding`
- `searching`
- `preparing`
- `voice-speaking`
- `music-ducked`
- `fading-in`
- `playing`
- `paused`

The UI maps these to emotional states:

- idle / paused: quiet presence
- understanding / searching / preparing: AI thinking
- voice-speaking / music-ducked: AI speaking
- fading-in: music approaching
- playing: emotional rhythm

## Provider Architecture

The app keeps provider boundaries so future integrations can replace mocks:

- `AIProvider`: creates emotional analysis, spoken intro, and recommendation.
- `VoiceProvider`: synthesizes or simulates AI voice.
- `MusicProvider`: provides candidate tracks.
- `AudioMixer`: coordinates voice, ducking, fade-in, pause, and resume behavior.

## UI Components

Current key components:

- `EmotionInput`
- `EmotionalWaveform`
- `VoiceStatus`
- `RecommendationCard`
- `NowPlayingCard`
- `PlayerControls`
- `PlaylistQueue`
- `TimeWeatherCard`

Shared button motion lives in `src/components/motionPresets.ts`.

## Constraints

- Do not implement Daily AI Playlist in this phase.
- Do not add a backend, database, auth system, real OpenAI calls, or NetEase integration unless explicitly requested.
- Do not fake real audio analysis. The waveform is state-driven ambient motion.
- Do not add large dependencies without a clear reason.

## Verification

Before completion:

- `npm run lint`
- `npm run build`

For meaningful UI changes, inspect in browser when practical.
