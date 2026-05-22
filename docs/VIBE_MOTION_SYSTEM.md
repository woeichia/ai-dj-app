# Vibe Motion System

System-wide emotional motion rhythm for Echo Soul.

This document is planning and rules only. Do not implement code from this document until a dedicated implementation task is created.

## 1. Goal

- Make all motion feel connected across Echo Soul.
- Particle, aurora, subtitle, quote, overlay, voice state, and controls should share one emotional rhythm.
- Motion should support emotional presence before interface behavior.
- The system should feel alive without feeling busy.

## 2. Motion Philosophy

Motion should feel:

- calm
- cinematic
- breathing
- emotionally restrained
- premium
- soft
- intentional

Motion should not feel:

- flashy
- SaaS-like
- gaming-driven
- hyperactive
- decorative for its own sake
- disconnected between components

## 3. Global States

### Idle

- Slow breathing rhythm.
- Subtle aurora movement.
- Gentle particle drift.
- Quote or emotional line moves slowly.
- Controls remain quiet.

### Listening

- Voice panel appears softly.
- Particles gather slightly toward the emotional center.
- Aurora calms and darkens slightly.
- UI becomes more focused with fewer competing movements.
- Controls visually recede.

### Thinking

- Particles swirl inward with moderate density.
- Subtitle area waits without nervous loading motion.
- Aurora stays restrained.
- Controls stay quiet and stable.

### Speaking

- AI overlay appears softly and temporarily.
- Subtitle reveals character by character at a human rhythm.
- Music ducks while voice is active.
- Particles pulse softly from the emotional center.
- Controls remain secondary.

### Music Fading In

- Particle motion gradually strengthens.
- Aurora gains a subtle lift without brightening aggressively.
- Lyrics or emotional text begins to breathe.
- Controls stay elegant and low-emphasis.

### Playing

- Lyrics breathe gently.
- Particles flow with soft rhythmic motion.
- Aurora remains supportive.
- UI stays calm and readable.
- Motion suggests emotional continuity, not performance energy.

### Paused

- Lower overall motion energy.
- Particles drift sparsely.
- Aurora slows.
- Overlays and controls remain still, soft, and readable.

## 4. State Examples

Idle:

- slow breathing
- subtle aurora
- gentle particle drift
- quote moves slowly

Listening:

- voice panel appears
- particles gather slightly
- aurora calms
- UI becomes focused

Thinking:

- particles swirl inward
- subtitle area waits
- controls stay quiet

Speaking:

- AI overlay appears
- subtitle types character by character
- music ducks
- particles pulse softly

Playing:

- lyrics breathe
- particles flow gently
- UI remains calm

Paused:

- lower motion energy
- particles drift sparsely

## 5. Timing Rules

- Avoid abrupt transitions.
- Use slow cinematic easing.
- Avoid aggressive bounce.
- Avoid spring behavior that feels playful or game-like.
- Motion must feel alive but not busy.
- Overlays should appear softly and disappear softly.
- State changes should crossfade, interpolate, or ease rather than snap.
- Button feedback should feel tactile but restrained.

## 6. UI/UX Pro Max Role

Use UI/UX Pro Max principles only for:

- spacing
- motion hierarchy
- premium interaction timing
- panel layering
- button feedback

Do not let it create:

- dashboard layout
- SaaS hero section
- generic app UI
- productivity-app motion
- visual hierarchy that overpowers emotional atmosphere

## 7. Acceptance Criteria

- `docs/VIBE_MOTION_SYSTEM.md` exists.
- No code implementation happens from this document alone.
- No layout changes are introduced.
- `docs/PRODUCTION_ROADMAP.md` references the motion system.
- `docs/DEVELOPMENT_LOG.md` records the documentation update.
- Future motion work follows `ECHO_SOUL_DESIGN_SYSTEM.md`.
