# Product Spec

## Product Direction

Echo Soul is a cinematic Chinese emotional AI music companion. It understands a user’s feeling, speaks softly through poetic Chinese subtitle copy, and communicates through music.

It is not:

- dashboard UI
- SaaS layout
- generic music player
- Spotify clone
- productivity app
- normal chatbot

## Core Experience

1. User opens a fullscreen emotional universe.
2. The emotional orb breathes in a late-night atmosphere.
3. User speaks through future voice UI or writes a short text message.
4. Echo Soul enters thinking states.
5. AI subtitle responds with a short emotional intro.
6. The recommended song appears in a compact glass card.
7. Music ducking and fade-in state are preserved through the mock mixer.
8. User can play/pause, request next song, open text chat, trigger voice placeholder, save memory placeholder, or open the playlist drawer.

## Current Scope

- Cinematic fullscreen UI.
- Lazy-loaded Three.js emotional particle orb.
- Cinematic AI subtitle.
- Now playing glass card.
- Control dock.
- Voice/text dock.
- Playlist drawer.
- Existing mock recommendation logic.
- Existing mock playback state flow.

## Non-Goals

- No real voice recording.
- No microphone permission request.
- No transcription.
- No OpenAI or NetEase integration.
- No real audio analysis.
- No real Daily AI Playlist generation.
- No backend, database, auth, or persistence.

## Future Voice Conversation

Future voice interaction should feel like talking to an emotional AI DJ. The current UI only prepares the interaction language with a calm voice button and listening placeholder.

## Future Daily AI Playlist

Future concept:

- AI learns recent emotional habits.
- AI learns favorite song patterns.
- AI generates daily playlists automatically.
- Songs can be Chinese or English.
- AI explains why it chose today’s playlist.

Current implementation only provides a drawer surface and explanatory copy.
