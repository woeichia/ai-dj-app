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

## Current Interaction Refinements

- Do not show music volume, ducking percentages, sound level labels, or audio status text.
- AI speech is a temporary cinematic card, not a permanent paragraph or chat message.
- The main glass panel is now lyrics-first: current line prominent, next line subtle, with soft blur/fade/upward transitions.
- Control labels are hidden by default and appear only on hover or keyboard focus.
- Button hover may scale a little more than standard UI, but easing must remain slow, soft, and cinematic.
- Text input is hidden by default and should only slide/fade in after the Text Chat button is pressed.
- Playlist drawer glass should be readable over the orb: higher opacity, stronger text contrast, and slower drawer motion.

## Daily Quote And Voice Refinements

- Replace fixed night-themed support copy with a daily emotional quote.
- Daily quote animation should feel alive but restrained: fade, slight float, and soft glow breathing.
- Quote source metadata may appear on hover or click when available.
- AI dialogue overlay belongs between the particle orb and lyrics, visually above both without affecting layout.
- AI subtitle typing is character-by-character with no text blur and no aggressive cursor.
- Voice Chat uses a temporary listening ripple/aura overlay, not a recorder popup.
