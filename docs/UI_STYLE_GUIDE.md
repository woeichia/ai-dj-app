# UI Style Guide

Echo Soul is a Chinese late-night emotional AI space. The UI should feel cinematic, intimate, and emotionally responsive. It must not read as a dashboard, Spotify clone, productivity tool, or generic SaaS interface.

## Visual Direction

- Deep dark atmosphere with soft amber, rose, violet, and lunar blue-green light.
- The AI emotional stage is the center of the product.
- Playback controls are present but quiet.
- Avoid large catalog lists, ranking surfaces, analytics panels, and productivity card grids.
- Keep the interface usable on mobile first, with denser desktop refinement only where it helps.

## Layout

- First screen is the actual Echo Soul experience, not a landing page.
- Put the emotional AI presence, waveform, current recommendation, controls, and input in one immersive flow.
- Avoid nested cards.
- Use full-width atmospheric sections and small focused panels.
- Stable dimensions are required for buttons, waveform, transport controls, and input.

## Typography

- UI language is Simplified Chinese.
- Use system Chinese sans fonts for controls and interface text.
- Use Songti/serif accents sparingly for emotional spoken copy and track titles.
- Keep line-height generous for Chinese prose.
- Do not use negative letter spacing or viewport-width font scaling.

## Color And Glow

- Primary background: deep warm night, not pure black.
- Emotional glow: muted rose, amber, violet, and blue-green.
- Glow should breathe softly and respond to state.
- Do not use neon RGB, nightclub visualizers, cyberpunk overload, or decorative gradient blobs.

## Motion

- Official animation stack: GSAP and Framer Motion.
- GSAP is used for continuous ambient motion.
- Framer Motion is used for component transitions, state changes, hover, and tap.
- Motion should be smooth, slow, and emotionally weighted.
- Avoid aggressive bounce, rapid flashing, and EDM-style equalizer behavior.

## Buttons

All buttons, pills, chips, queue toggles, play/pause, next, and submit controls share one premium system:

- Hover: subtle scale up, soft glow, border brightening, smooth easing.
- Press/tap: slight scale down, glow tightens, tactile response, soft recovery.
- Disabled: preserve size, spacing, and readable contrast.
- Use lucide-react icons for familiar transport and tool actions.

## AI Input

- Minimal horizontal AI input bar.
- Single-line input, no textarea presentation.
- Dark glassmorphism surface with soft breathing glow.
- Right-side circular arrow submit button.
- Focus state should feel like the AI is listening.
- No giant CTA button.

## Waveform

The waveform represents emotional resonance and AI presence, not raw audio analysis yet.

Required states:

- idle
- AI thinking
- AI speaking
- music fading in
- playing
- paused

The waveform should feel like sound moving through air in a deep night room. Avoid nightclub, gaming RGB, cyberpunk, or EDM visualizer language.

## Future Daily AI Playlist

Daily AI Playlist is future scope only. It should be documented as a future emotional companion feature and not implemented yet.
