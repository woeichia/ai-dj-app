# Development Log

## 2026-05-19

### Project Rules

- Created `AGENTS.md` to define project-level rules for agents.
- Established the app as an AI-assisted DJ experience, not a generic Vite template or Spotify clone.
- Captured rules around React, TypeScript, Vite, Tailwind CSS, Framer Motion, lucide-react, Web Audio API, provider architecture, UI quality, and verification.

### Product Direction

- Defined project direction as a personal Chinese AI DJ emotional music companion PWA.
- Confirmed UI language is Simplified Chinese.
- Confirmed AI DJ speaks natural Chinese.
- Confirmed recommended songs may be Chinese or English.
- Confirmed AI must explain recommendations in Chinese.

### MVP Direction

- MVP uses OpenAI for reasoning.
- MVP uses OpenAI TTS for AI voice.
- MVP uses mock songs first.
- Future music integration targets NetEase Cloud Music.
- Audio ducking and fade in will use Web Audio API.

### Documentation Created

- `docs/PROJECT_CONTEXT.md`
- `docs/PRODUCT_SPEC.md`
- `docs/TECH_SPEC.md`
- `docs/AI_BEHAVIOR_GUIDE.md`
- `docs/UI_STYLE_GUIDE.md`
- `docs/IMPLEMENTATION_PLAN.md`

### Current Constraint

- No app code has been written for this phase.
- Next phase should follow `docs/IMPLEMENTATION_PLAN.md`.

## 2026-05-19 Frontend MVP Shell

### Implemented

- Replaced the Vite starter with the first AI DJ frontend MVP shell.
- Added a mobile-first Chinese interface with:
  - 当前情绪区域
  - 情绪选择器
  - 歌曲语言偏好：中文 / 英文 / 不限制
  - AI DJ message card
  - Now Playing card
  - Play / Pause button
  - Next Song button
  - 小型天气 / 时间 placeholder
  - collapsed playlist queue
- Added mock song data with Chinese and English songs, mood tags, language tags, artist, title, and short recommendation reasons.
- Added provider-ready architecture:
  - `AIProvider`
  - `VoiceProvider`
  - `MusicProvider`
  - `AudioMixer`
- Added mock AI recommendation and mock AI voice flow.
- Added mock audio behavior states:
  - AI DJ 正在说话
  - 音乐保持低音量
  - 音乐淡入中
  - 正在播放
- Used Framer Motion for smooth fade, subtle floating, and soft state transitions.

### Verification

- Ran `npm run lint`: passed.
- Ran `npm run build`: passed.
- Opened `http://127.0.0.1:5173` in the browser.
- Verified the shell renders core hero copy, playback controls, and playlist queue.
- Clicked “让 AI DJ 选一首” and verified the UI transitions through AI voice / ducked music / fade or playback states.
- Checked browser console errors: none observed.

### Known Limitations

- Audio is currently simulated with timers and volume state only.
- No real music playback is connected yet.
- No real OpenAI reasoning or OpenAI TTS call is connected yet.
- Weather is a placeholder.
- NetEase MusicProvider remains future scope.

## 2026-05-19 Immersive Emotional UI Refinement

### Implemented

- Refined the visual direction using the provided reference image as inspiration, without copying it directly.
- Reduced the dashboard feeling by replacing the two-column card grid with a single immersive AI stage.
- Made the emotional conversation and AI presence more central than the playback controls.
- Added an animated emotional waveform scene with:
  - layered warm/cool light ribbons
  - subtle particle atmosphere
  - animated waveform bars
  - softer cinematic background lighting
- Reworked playback controls to be smaller, quieter, and more ambient.
- Preserved the existing mock flow:
  - Chinese AI DJ
  - Chinese AI conversation
  - Chinese and English mock songs
  - AI explains song choice in Chinese
  - AI voice before music
  - music ducking while AI speaks
  - music fade-in after AI speaking state

### Verification

- Ran `npm run lint`: passed.
- Ran `npm run build`: passed.
- Opened `http://127.0.0.1:5173` in the browser.
- Verified the immersive visual stage renders.
- Verified no horizontal overflow at the inspected desktop viewport.
- Clicked “让 AI DJ 选一首” and verified the UI transitions through AI speaking / ducked music / fade-in or playing states.
- Browser page console errors from the app: none observed.

### Known Limitations

- Waveform and particles are CSS/Framer Motion visuals, not real audio-reactive analysis yet.
- Audio behavior is still simulated by `MockAudioMixer`.
- Weather remains a placeholder.
