# Tech Spec

## Stack

- React
- TypeScript
- Vite
- Framer Motion
- Three.js
- @react-three/fiber
- @react-three/drei
- lucide-react
- CSS glassmorphism and SVG details
- Mock AI, voice, music, and audio mixer providers

## Current Architecture

The app preserves the existing mock recommendation flow:

- `AIProvider` creates emotion analysis and recommendation.
- `VoiceProvider` simulates AI voice duration.
- `MusicProvider` provides mock songs.
- `MockAudioMixer` simulates voice, ducking, fade-in, playing, pause, and resume states.

## New UI Component Structure

- `src/components/layout/EmotionalUniverseShell.tsx`
- `src/components/visual/EmotionParticleOrb.tsx`
- `src/components/player/AIMessageSubtitle.tsx`
- `src/components/player/NowPlayingGlassCard.tsx`
- `src/components/player/ControlDock.tsx`
- `src/components/player/PlaylistDrawer.tsx`
- `src/components/chat/VoiceTextDock.tsx`

The previous waveform/player components were removed from the active UI path. The main screen uses the new cinematic universe components.

## Visual Runtime

`EmotionParticleOrb` is lazy-loaded to split Three/R3F out of the main app bundle.

Performance rules:

- controlled particle count
- instanced meshes
- no heavy postprocessing
- low-power WebGL preference
- no camera controls
- CSS fallback if WebGL fails
- reduced-motion support

## State Mapping

Existing `PlaybackStatus` maps into visual states:

- `idle`: idle
- `understanding`, `searching`, `preparing`: thinking
- voice placeholder active: listening
- `voice-speaking`, `music-ducked`: speaking
- `fading-in`: fading
- `playing`: playing
- `paused`: paused

UI treatment for these states is intentionally quiet:

- `MockAudioMixer` still emits volume changes for ducking and fade-in simulation.
- `App` does not display volume, ducking percentages, or audio status labels.
- AI dialogue is visible only during listening, thinking, speaking, ducked, and fade-in moments.
- Once playback settles into `playing` or `paused`, the temporary AI dialogue leaves and the lyrics panel becomes the primary surface.

## Lyrics Panel

`NowPlayingGlassCard` now behaves as a cinematic lyrics display rather than a permanent recommendation reason card.

- mock lyric lines are selected from the recommended song
- current lyric line is prominent
- next lyric line is quieter
- lines transition with Framer Motion fade, blur, and vertical movement
- recommendation reasoning stays in the temporary AI dialogue card

## Daily Quote

`DailyEmotionalQuote` selects one mock emotional quote per calendar day. The data shape supports:

- quote text
- original AI copy vs sourced quote
- optional source/author metadata

Future AI generation can replace the local quote selection without changing the visual position.

## Overlay And Voice Placeholder

- `AIMessageSubtitle` renders the AI speaking subtitle as a fixed overlay between the orb and lyrics.
- The overlay does not push or resize the layout.
- Subtitle reveal is character-by-character with no text blur.
- Voice Chat uses the same overlay layer for a temporary listening ripple placeholder.
- No real recording, permission prompt, transcription, or speech provider is implemented.

## Future Voice Architecture

The UI prepares these future voice states:

- idle
- listening
- thinking
- speaking

No real microphone access, recording, transcription, streaming, or voice API integration is implemented yet.

## Future Daily AI Playlist

Only the drawer and documentation prepare the concept. No daily generation, persistence, preference profile, OpenAI integration, or NetEase integration is implemented.

## Verification

Run:

- `npm.cmd run lint`
- `npm.cmd run build`

PowerShell may block `npm run ...` through `npm.ps1`, so `npm.cmd` is the reliable local command on this machine.
