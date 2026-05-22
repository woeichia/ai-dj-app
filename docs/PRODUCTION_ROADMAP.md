# Production Roadmap

Roadmap for moving Echo Soul from emotional frontend MVP toward a production-grade emotional AI music companion.

## 1. Product Direction

- Keep Echo Soul centered on emotional AI companionship.
- Preserve atmosphere before interface.
- Avoid dashboard, generic music app, chat app, and EDM visualizer patterns.
- Keep Chinese AI conversation and Chinese explanations as core product behavior.

## 2. Current Foundation

- React, TypeScript, Vite, Tailwind CSS, and Framer Motion frontend shell.
- Cinematic dark-first atmosphere with Aurora background.
- Emotional particle stage using shader-based particles.
- Mock AI recommendation, mock voice flow, and mock music provider.
- Provider-oriented architecture prepared for `AIProvider`, `VoiceProvider`, `MusicProvider`, and `AudioMixer`.

## 3. Near-Term Production Priorities

- Stabilize the emotional particle stage across mobile and desktop.
- Keep Aurora subtle, cinematic, and behind all emotional UI.
- Preserve readable AI dialogue and lyric-like emotional copy.
- Improve reduced-motion behavior.
- Keep visual tuning consistent with `ECHO_SOUL_DESIGN_SYSTEM.md`.

## 4. GPGPU Fluid Sand System

- Use `docs/GPGPU_FLUID_SAND_PLAN.md` as the production plan for the future particle simulation.
- Build the system only in a dedicated implementation phase.
- Start with a minimal position and velocity texture simulation.
- Add album-cover target fields only after the simulation is stable.
- Add AI, voice, and music intensity controls after the visual system is reliable.

## 5. Provider Evolution

- Keep mock songs until the frontend experience is stable.
- Add OpenAI reasoning only after product states and fallback behavior are clear.
- Add OpenAI TTS only after voice timing, ducking, and subtitle behavior are defined.
- Add NetEase or other music providers only after licensing and playback constraints are explicit.

## 6. Performance And Accessibility Gates

- Mobile-safe first.
- Avoid CPU-heavy per-particle updates.
- Require reduced-motion fallback for ambient, shader, and particle effects.
- Avoid autoplay, sudden volume jumps, or unexpected queue changes.
- Verify frontend changes with `npm run build` and browser inspection when runtime behavior changes.

## 7. Documentation Gates

- Update `DEVELOPMENT_LOG.md` after meaningful changes.
- Update technical docs before implementing broad architecture changes.
- Keep creative and visual decisions aligned with `ECHO_SOUL_DESIGN_SYSTEM.md`.
