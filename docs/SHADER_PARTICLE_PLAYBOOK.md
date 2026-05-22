# Shader Particle Playbook

Rules for Echo Soul's shader-based emotional particle systems.

## 1. Creative Direction

- Particles represent emotional atmosphere, not technical decoration.
- Motion should feel like calm sand, dust, breath, and memory.
- Avoid EDM, nightclub, gaming RGB, galaxy wallpaper, and hard sci-fi visuals.
- Preserve the dark-first cinematic environment defined in `ECHO_SOUL_DESIGN_SYSTEM.md`.

## 2. Rendering Rules

- Prefer `THREE.NormalBlending` for readable sand-like grains.
- Avoid heavy `AdditiveBlending` unless explicitly used for a tiny supporting aura.
- Use soft circular point masks with `smoothstep`.
- Keep particles individually readable.
- Avoid white center burn-out and merged glowing blobs.
- Use subdued cyan, violet, rose, muted blue, and cover-influenced tones.

## 3. Motion Rules

- Motion should be slow, organic, and emotionally restrained.
- Use damping and inertia whenever possible.
- Avoid snapping, hard resets, and abrupt state changes.
- State transitions should interpolate.
- Reduced-motion mode must lower or disable ambient simulation.

## 4. Current Production Shader Path

- `EmotionParticleOrb.tsx` keeps the existing shader particle stage as a stable fallback.
- The fallback path uses attribute-based particles, shader-side curl/simplex motion, texture color influence, and soft point rendering.
- This path must remain available if experimental GPGPU simulation is unsupported or disabled.

## 5. GPGPU Phase A Rules

- Phase A may use an experimental GPGPU/FBO ping-pong simulation.
- Particle positions and velocities must live in GPU textures.
- Start with `128 x 128` simulation textures, or `16,384` particles.
- Velocity must persist between frames.
- Damping must gradually slow motion.
- Flow force must stay gentle, calm, and organic.
- If motion appears static, tune simulation force scale and position integration scale before changing visual brightness.
- Debug motion calibration may temporarily increase flow amplitude while preserving NormalBlending and the current particle appearance.
- Do not add album-cover magnetic fields, image attraction, audio-reactive force, or high particle counts in Phase A.

## 6. Fallback Rules

- GPGPU must never be the only render path during Phase A.
- If float/half-float render targets are unavailable, render the existing shader particle orb.
- If reduced motion is enabled, prefer the stable lightweight shader fallback.
- Runtime failures should degrade quietly without changing layout.

## 7. Acceptance Criteria

- Visual style stays close to the current emotional particle appearance.
- Architecture supports future position and velocity feedback loops.
- Build succeeds.
- Documentation records whether the GPGPU path is active or experimental.
