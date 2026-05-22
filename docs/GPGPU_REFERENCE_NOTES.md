# GPGPU Reference Notes

Research notes for rebuilding Echo Soul's future GPGPU fluid sand particle system from proven references.

This document is research only. Do not change `EmotionParticleOrb` from these notes until a new implementation task is created.

## 1. Reference: Three.js `GPUComputationRenderer`

Link: https://threejs.org/docs/pages/GPUComputationRenderer.html

Technique:
- Official helper for GPU computation with framebuffer textures.
- Stores simulation state in render targets.
- Uses variables with dependencies to manage ping-pong updates.
- Common pattern for `texturePosition` and `textureVelocity`.

Pros:
- Proven Three.js primitive.
- Removes much of the manual FBO wiring risk.
- Good fit for position/velocity feedback loops.

Cons:
- Vanilla Three.js API, not React-specific.
- Requires careful lifecycle handling inside React Three Fiber.

Echo Soul use:
- Use as the core simulation engine instead of hand-rolled render-target swapping.
- Wrap initialization, compute, and disposal in a dedicated R3F component.

## 2. Reference: Three.js `webgl_gpgpu_birds`

Link: https://github.com/mrdoob/three.js/blob/dev/examples/webgl_gpgpu_birds.html

Technique:
- Uses `GPUComputationRenderer`.
- Maintains position and velocity textures.
- Calls compute each frame.
- Vertex shader samples the computed position texture for rendering.

Pros:
- Canonical working example.
- Clear position/velocity texture architecture.
- Directly matches Echo Soul Phase A needs.

Cons:
- Bird-specific behavior and geometry.
- Not visually aligned with Echo Soul.
- Needs simplification into neutral particle points.

Echo Soul use:
- Use the compute architecture, not the bird behavior.
- Replace bird geometry with `THREE.Points`.
- Replace flocking forces with calm flow, damping, and future target attraction.

## 3. Reference: R3F Flow Field Particles

Link: https://gist.github.com/sebastien-lempens/16c1e8562120fe05f602055cdaac7195

Technique:
- React Three Fiber particle field using `GPUComputationRenderer`.
- Uses simulation textures for particle positions.
- Demonstrates R3F lifecycle patterns around GPGPU compute.

Pros:
- Closest match to Echo Soul's stack.
- Shows how to use GPGPU compute inside R3F.
- Easier to adapt than a pure vanilla example.

Cons:
- Flow-field visual language may need restraint.
- Must verify dependency versions against current Three/R3F versions.

Echo Soul use:
- Best first implementation reference.
- Start from this lifecycle shape, then apply Echo Soul particle styling rules.

## 4. Reference: Codrops Dreamy Particle Effect With Three.js And GPGPU

Link: https://tympanus.net/codrops/2024/12/19/crafting-a-dreamy-particle-effect-with-three-js-and-gpgpu/

Technique:
- GPGPU particle simulation with image/model-derived particle targets.
- Uses texture-based particle data and shader-driven rendering.
- Demonstrates particles returning toward source form.

Pros:
- Strong reference for future album-cover target fields.
- Useful for Phase B and Phase C concepts.
- Visual direction is closer to emotional particle atmosphere than technical demos.

Cons:
- More complex than Phase A.
- Includes creative choices that should not be copied directly.
- Needs simplification and darker Echo Soul tuning.

Echo Soul use:
- Use later for album-cover target extraction and reforming behavior.
- Do not use as the first Phase A rebuild.

## 5. Reference: `bgstaal/gpuparticles`

Link: https://github.com/bgstaal/gpuparticles

Technique:
- Small Three.js GPGPU particle tutorial repository.
- Focuses on GPU particle data and rendering flow.

Pros:
- Minimal and easier to inspect.
- Useful for understanding the core data path.
- Good fallback reference if `GPUComputationRenderer` abstraction feels opaque.

Cons:
- Not R3F-native.
- May require modernization for current Three.js.

Echo Soul use:
- Use as a learning/reference aid, not the primary implementation base.

## Recommended Implementation Path

1. Stop extending the current broken manual GPGPU debug path.
2. Build a fresh isolated `GpgpuComputeParticles` prototype using `GPUComputationRenderer`.
3. Start from the R3F flow-field reference for lifecycle and from `webgl_gpgpu_birds` for canonical position/velocity texture architecture.
4. Use `64 x 64` first, then `128 x 128` after stability.
5. Render with `THREE.Points` only.
6. Keep one clear data path:
   - initialize position texture
   - initialize velocity texture
   - call `gpuCompute.compute()` inside `useFrame`
   - read current position texture
   - pass it to the particle render shader
   - sample `uPositionTexture` using `aReference`
7. Do not add album-cover attraction until Phase A works.
8. Use Codrops only after Phase A to guide image-target behavior.
9. Keep the current stable shader orb as production fallback until the new GPGPU prototype is visibly stable.

## Echo Soul Constraints

- No EDM visualizer behavior.
- No galaxy wallpaper.
- No bright debug visuals in production.
- No group rotation as the main motion.
- Particles must stay centered, calm, readable, and emotionally restrained.
- Reduced-motion fallback remains required.
