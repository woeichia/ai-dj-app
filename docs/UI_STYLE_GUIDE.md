# UI Style Guide

Echo Soul should feel like a cinematic emotional AI music universe: intimate, late-night, poetic, and premium. It must not read as a dashboard, SaaS layout, Spotify clone, generic player, productivity app, or normal chatbot.

## Layout

- Fullscreen emotional scene.
- No traditional top navigation.
- Center the emotional orb and AI subtitle.
- Keep music information in one compact floating glass card.
- Keep controls in a small circular dock.
- Hide secondary surfaces behind drawers or pills.

## Background

- Near black base.
- Deep navy and dark purple depth.
- Low-saturation aurora lights.
- Subtle grain/noise texture.
- Minimal star texture.
- Slow ambient motion.

## Typography

- UI language is Simplified Chinese.
- Use Chinese-friendly system sans for controls.
- Use serif/Songti-like styling only for cinematic AI subtitle and large emotional title.
- Keep Chinese prose short and breathable.
- No negative letter spacing.

## Emotional Orb

The orb is the visual soul of the app.

- Use Three.js / React Three Fiber.
- Keep particles optimized for mobile.
- Avoid postprocessing unless absolutely necessary.
- Use WebGL fallback.
- Mood colors are subtle: cyan, violet, rose, warm gold.
- Avoid EDM, gaming RGB, cyberpunk overload, and aggressive motion.

## Motion

- Framer Motion for UI transitions, hover/tap, drawers, subtitle changes.
- Three.js/R3F for particles, aura, orbit rings.
- CSS/SVG for small rings and decorative motion.
- GSAP only if a sequence cannot be expressed simply.
- Respect `prefers-reduced-motion`.

## Controls

- Circular glass buttons.
- Soft glow on hover.
- Slight scale-down on press.
- Calm icon labels.
- Voice button may show a listening ring when active.

## Conversation

- No chat bubbles.
- AI speech appears as cinematic subtitle.
- Text input lives in a bottom drawer.
- Voice interaction is prepared but not implemented.
- Placeholder: `语音对话即将支持`.

## Playlist

- Hidden by default.
- Open upward from a `今日歌单` pill.
- Floating glass panel.
- Minimal song rows.
- Future Daily AI Playlist remains documented only.
