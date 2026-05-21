# Echo Soul Design Bible

Echo Soul is a Chinese AI emotional companion that happens to recommend music. The experience should feel like entering a private late-night emotional space: cinematic, quiet, intimate, and responsive to the user's mood. It is not a dashboard, not a Spotify clone, and not a productivity app.

## Emotional Atmosphere

- Deep night, low light, soft air, and restrained glow.
- The AI presence is central; playback controls are secondary.
- Music appears as emotional resonance, not as a catalog.
- UI copy stays in natural Simplified Chinese, short and companion-like.
- Empty states should feel like quiet invitation, not instruction.

## Motion Principles

- Official stack: GSAP and Framer Motion.
- GSAP owns continuous ambient motion: waveform drift, particles, glow breathing, slow atmospheric loops.
- Framer Motion owns React state transitions: entering, exiting, hover, tap, and state changes.
- Motion should feel soft, weighted, and cinematic. Avoid springy, bouncy, gaming, EDM, or nightclub behavior.
- Every motion should either express AI presence, emotional pacing, or tactile control feedback.

## Cinematic Pacing

- AI thinking should unfold in short stages rather than instant replacement.
- Speaking and music fade-in states should feel like sound entering the room.
- Transitions should favor 400-900ms for UI changes and 4-10s for ambient loops.
- Avoid abrupt scale, rotation, or color jumps.

## Chinese Typography Direction

- Use a Chinese-friendly system stack: `PingFang SC`, `Microsoft YaHei`, `Noto Sans CJK SC`, system sans.
- Use Songti/serif accents only for emotional hero-level text, track titles, or spoken copy.
- Keep Chinese line height generous: 1.55-1.9 for prose.
- Do not use negative letter spacing.
- Avoid long paragraph blocks in the main stage.

## Spacing Philosophy

- The stage should breathe, but not feel like a marketing landing page.
- Controls should stay close to the emotional center.
- Mobile spacing should preserve one-handed input and stable tap targets.
- Do not nest cards inside cards. Use panels only when framing repeated items or focused controls.

## Glow Language

- Glow is emotional atmosphere, not decoration.
- Use warm amber, muted rose, lunar blue-green, and soft violet in low saturation.
- Hover glow expands softly; press glow tightens inward.
- Avoid neon RGB, cyberpunk overload, hard outlines, and aggressive gradients.

## Ambient Motion

- Background glows should move slowly and almost imperceptibly.
- Particles should feel like dust in sound, not stars in a game scene.
- Waveform bars should breathe and ripple, not bounce like a club visualizer.
- Idle and paused states remain alive but quiet.

## Button Interaction

All buttons, chips, pills, and icon controls share one tactile language:

- Hover: subtle scale up, soft outer glow, slightly brighter border, smooth easing.
- Press/tap: slight scale down, glow tightens, fast tactile response, soft recovery.
- Disabled controls keep shape and spacing stable.
- Familiar transport actions use lucide-react icons.

## AI Input Interaction

- The input is a minimal horizontal AI companion bar, not a form.
- Single-line text entry only.
- Dark glassmorphism surface with a soft breathing glow.
- Right-side circular arrow submit button.
- Focus should feel like Echo Soul is listening: border brightens, glow breathes, no loud CTA.
- Mobile-first sizing: stable 40-44px submit target and no textarea behavior.

## Waveform Behavior

Required states:

- `idle`: quiet breathing, low particles, deep night stillness.
- `understanding/searching/preparing`: AI thinking, slightly denser motion, soft signal gathering.
- `voice-speaking/music-ducked`: warm pulses and articulate waveform response, like speech moving through air.
- `fading-in`: wider glow and slow lift, music approaching.
- `playing`: steady emotional rhythm, calm movement.
- `paused`: dimmed but still present.

## AI Emotional Rhythm

- The AI should feel like it listens before it recommends.
- Thinking transitions are part of the emotional experience, not loading decoration.
- AI speaking should visually calm the space and draw attention to the spoken copy.
- Music fade-in should make the recommendation feel applied gently, not triggered mechanically.

## Emotional Transitions

- Idle to thinking: input glow and waveform density increase.
- Thinking to speaking: stage glow warms, particles slow slightly, text appears with calm weight.
- Speaking to fade-in: waveform widens and glow opens outward.
- Playing to paused: motion softens and volume/status language quiets.

## Future Daily AI Playlist

Daily AI Playlist is future scope only and must not be implemented in this phase.

Design direction:

- On the first app open each day, AI may eventually generate a recommended playlist for that day.
- The playlist should learn from recent emotions, interaction content, liked/skipped songs, and playback history.
- AI can explain why today's playlist was recommended.
- The user can tell AI through conversation whether they like or dislike a song.
- Echo Soul should gradually build a personal music preference profile.
- Playlists may include Chinese and English songs.
- Future implementation depends on OpenAI plus NetEase integration.
- Until then, document the concept only. Do not add UI, data models, storage, or recommendation logic for it yet.
