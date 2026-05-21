# Echo Soul Design Bible

Echo Soul is a cinematic Chinese emotional AI music universe. It should feel like an emotional AI presence that understands feelings and communicates through music, not like a dashboard, SaaS product, Spotify clone, productivity app, or normal chatbot.

## Core Feeling

- Immersive late-night atmosphere.
- Poetic emotional space.
- Intimate AI music experience.
- One continuous emotional scene, not separate boxes.
- AI presence first; music controls second.

## Visual Universe

The app lives in a fullscreen emotional environment:

- near black, deep navy, dark purple
- low-saturation cinematic color
- soft blurred aurora lights
- subtle grain and star texture
- slow ambient motion
- floating glass panels only where information needs a surface

Avoid generic dashboards, top navigation bars, large playlists, ranking views, and stacked cards.

## Emotional Orb

`EmotionParticleOrb` is the primary visual centerpiece. It replaces waveform/bar visualizer language with a breathing emotional energy field.

State behavior:

- idle: soft breathing
- thinking: particles gather inward
- listening: orbit ring activates
- speaking: soft pulse aura
- fading: particles expand slowly
- playing: gentle rhythmic movement
- paused: low-energy floating

Mood reactions:

- calm: soft blue/cyan particles
- happy: warmer gold and rose glow
- sad: slower dim blue particles
- romantic: rose/violet glow
- lonely: sparse drifting particles

Avoid nightclub visualizers, EDM bars, gaming RGB, cyberpunk overload, aggressive motion, or dense particle storms.

## Motion Stack

- Three.js / React Three Fiber: emotional orb, particle universe, energy field.
- Drei: lightweight R3F support only where useful.
- Framer Motion: subtitle transitions, panel entrance, drawer motion, hover/tap states, mode switching.
- CSS/SVG: orbit lines, small decorative rings, glass depth, reduced-motion fallback.
- GSAP: optional only for complex sequencing; do not overuse.

Respect `prefers-reduced-motion`. Motion should become quieter, not broken.

## AI Subtitle

AI communication should look like cinematic subtitles, not chat bubbles.

- centered
- poetic
- warm
- blur/fade entrance
- short Chinese text
- no assistant-style message boxes

Example tone:

> 今晚的情绪很轻，说一句你的感觉，我替你找一首慢慢靠近的歌。

## Glass Information Panels

Use glass panels sparingly:

- now playing
- recommendation reason
- text drawer
- playlist drawer

Panels should be translucent, compact, softly glowing, and layered into the scene. Do not build a grid dashboard.

## Controls

Controls live in a compact cinematic dock:

- Play / Pause
- Next Song
- Voice Chat
- Text Chat
- Save as Memory

Buttons are circular glass controls with subtle glow, tactile press feedback, and calm labels. Voice is important but not loud.

## Voice + Text Conversation

Voice conversation is future scope, but the UI prepares for it:

- voice interaction feels central
- text input is minimal
- text drawer slides from bottom
- placeholder voice state: `语音对话即将支持`
- no real recording, permission request, transcription, or streaming yet

## Playlist Drawer

The playlist is hidden by default behind `今日歌单`.

Future Daily AI Playlist direction:

- AI learns emotional habits over time.
- AI learns favorite song patterns.
- AI generates daily playlists automatically.
- Songs may be Chinese or English.
- AI explains why today’s playlist was chosen.

Do not fully implement Daily AI Playlist yet.

## Mobile Quality

- Mobile-first.
- Fullscreen scene stays centered.
- Text must fit.
- Controls must remain tappable.
- Particle count must stay controlled.
- No heavy postprocessing.
- WebGL fallback must be graceful.
