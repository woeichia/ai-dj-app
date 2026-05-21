# Product Spec

## Product Direction

Echo Soul is a Chinese AI emotional companion that recommends music as part of an intimate late-night emotional experience. The user describes how they feel; Echo Soul listens, responds in natural Chinese, recommends a song, and lets the music enter gently.

It is not a dashboard, not a Spotify clone, not a productivity app, and not a generic chatbot.

## Core Experience

1. User opens Echo Soul.
2. The app presents an immersive emotional stage.
3. User writes one short emotional message in a minimal AI input bar.
4. Echo Soul enters AI thinking states.
5. Echo Soul speaks in Chinese through a short companion-like intro.
6. Music stays quiet under the AI voice.
7. Music fades in softly after the AI finishes speaking.
8. The user can pause, resume, or request the next recommendation.

## AI Tone

- Simplified Chinese.
- Warm, calm, restrained, slightly poetic.
- Companion-like, not assistant-like.
- No clinical diagnosis, no overpromising, no customer-service phrasing.

## Current MVP Scope

- Mock emotional recommendation flow.
- Mock songs with Chinese and English tracks.
- Mock voice timing.
- Mock audio ducking and fade-in states.
- State-driven emotional waveform.
- Premium button and input motion.

## Non-Goals For This Phase

- Do not implement Daily AI Playlist.
- Do not integrate OpenAI.
- Do not integrate NetEase.
- Do not add auth, backend, database, or persistent preference profile.
- Do not add real audio analysis or Three.js.

## Future Daily AI Playlist

Daily AI Playlist is a future feature only:

- 每天第一次打开 app 时，AI 会主动生成当天推荐歌单。
- 歌单根据用户近期情绪、互动内容、喜欢/跳过记录、播放历史慢慢学习。
- AI 可以解释今天为什么推荐这个歌单。
- 用户可以通过对话告诉 AI 喜欢或不喜欢某首歌。
- AI 会逐渐建立个人音乐偏好画像。
- 歌单可以包含中文和英文歌曲。
- 未来接入 OpenAI + NetEase 后实现。

This phase must only document the direction. Do not add UI, storage, data models, or recommendation logic for it yet.
