# GPGPU Fluid Sand Plan

Production plan for Echo Soul's future GPGPU fluid sand particle system.

This document is planning only. Do not implement code from this plan until a dedicated implementation task is created.

## 1. Goal

- Build an emotional fluid sand particle simulation for Echo Soul.
- Treat the album cover as a magnetic target field, not a visible album-art panel.
- Allow particles to disperse, drift, wash, and return to emotionally meaningful formations.
- Make motion feel like fine emotional sand, dust, and soft memory fragments.
- Preserve Echo Soul's calm, cinematic, emotionally adaptive atmosphere.
- Avoid normal particle orb behavior, galaxy wallpaper aesthetics, and EDM visualizer language.

## 2. Why Current Shader Particles Are Not Enough

- No persistent particle memory between frames.
- No velocity texture to store inertia and delayed movement.
- No position feedback loop for true simulation behavior.
- No true image attraction from album cover features.
- No flow-field washing that can scatter and re-form particles organically.
- Current particles can look fluid, but they are still render-shader animation, not a real particle simulation.

## 3. Target Architecture

- Use `GPUComputationRenderer` or an equivalent FBO ping-pong simulation.
- Maintain a `positionTexture` for current particle positions.
- Maintain a `velocityTexture` for inertia, damping, and emotional motion continuity.
- Maintain a `targetPositionTexture` generated from album-cover image features.
- Render particles with a dedicated particle render shader reading simulation textures.
- Use a flow force shader for fluid washing and organic drift.
- Use magnetic attraction force to pull particles toward album-cover target positions.
- Use damping and inertia so particles ease, delay, and settle naturally.
- Add an `audioIntensity` uniform later for music-aware motion control.
- Keep AI state uniforms separate from rendering style: `listening`, `thinking`, `speaking`, `playing`, and `paused`.

## 4. Implementation Phases

### Phase A: Minimal GPGPU Simulation

- Build the smallest working GPGPU simulation with position and velocity textures.
- Start with a low particle count, around `16k`.
- Validate simulation stability before visual polish.
- Keep the prototype isolated from the production emotional stage until verified.
- Current implementation status: Phase A foundation has started as an experimental render path inside `EmotionParticleOrb`.
- Current texture size: `128 x 128`, or `16,384` particles.
- Current simulation data: GPU position texture and GPU velocity texture.
- Current forces: gentle shader-side flow force, damping, and velocity persistence.
- Current fallback: existing shader particle orb remains available when GPGPU is unsupported or reduced motion is enabled.
- Current exclusions: no image attraction, no album-cover magnetic field, no audio-reactive force, and no high particle counts.
- Motion activation note: Phase A uses a temporary motion calibration scale so velocity persistence and position feedback are visibly testable without increasing particle brightness.

### Phase B: Album Cover Target Field

- Extract album-cover image features into target positions.
- Generate a `targetPositionTexture` from those positions.
- Allow particles to return to a cover-influenced emotional shape.
- Keep the cover abstract and non-readable.

### Phase C: Fluid Washing Force

- Add a flow-field force that washes particles away from target positions.
- Let particles scatter and re-form with soft emotional pacing.
- Avoid chaotic turbulence or aggressive visualizer motion.

### Phase D: AI / Voice / Music State Control

- Map Echo Soul states to simulation uniforms.
- `listening`: particles gather inward.
- `thinking`: flow density and magnetic search increase.
- `speaking`: soft radiating emotional waves.
- `playing`: gentle rhythmic flow.
- Add `audioIntensity` later after the simulation is stable.

### Phase E: Final Visual Polish

- Tune density, contrast, opacity, and soft sand rendering.
- Preserve individual particle readability.
- Avoid white burn-out, glowing blobs, and galaxy-like composition.
- Add reduced-motion fallback and mobile-specific quality settings.

## 5. Performance Rules

- Mobile-safe first.
- Start with low particle counts before increasing density.
- Do not attempt `500k` particles until the architecture is stable.
- Avoid CPU per-particle updates.
- Prefer GPU simulation textures and shader-side rendering.
- Reduced-motion fallback is required.
- Quality should come from depth, alpha layering, damping, and spatial design, not brute-force count.

## 6. UI/UX Pro Max Role

Use UI/UX Pro Max principles only for:

- composition
- spacing
- layering
- premium motion pacing

Do not let UI/UX Pro Max change:

- shader architecture
- emotional philosophy
- particle simulation logic
- Echo Soul design direction

## 7. Acceptance Criteria

- Clear technical roadmap exists before implementation.
- No implementation happens from this document alone.
- No layout changes are introduced.
- Documentation is updated and linked from the production roadmap.
- Future implementation follows `ECHO_SOUL_DESIGN_SYSTEM.md`.
