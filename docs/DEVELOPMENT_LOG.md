# Development Log

## 2026-05-22 Fresh GPUComputationRenderer Prototype

### Implemented

- Created `src/components/visual/gpgpu/GpgpuComputeParticles.tsx` as a fresh isolated GPGPU prototype.
- Added local TypeScript declarations for `three/examples/jsm/misc/GPUComputationRenderer.js`.
- Used official `GPUComputationRenderer` style variables: `texturePosition` and `textureVelocity`.
- Kept the prototype at `64 x 64` particles.
- Implemented velocity persistence, damping, and slow internal flow.
- Render shader samples the current computed position texture through `aReference`.
- Did not integrate the prototype into `EmotionParticleOrb` or production UI.

### Verification

- `npm.cmd run build`: passed.
- Build still emits the existing Vite chunk-size warning for the lazy Three/R3F orb chunk.
- No Aurora, layout, lyrics, controls, AI overlay, or production particle behavior changed.

## 2026-05-22 GPGPU Reference Research

### Implemented

- Created `docs/GPGPU_REFERENCE_NOTES.md` with working GPGPU particle references.
- Documented official `GPUComputationRenderer`, Three.js `webgl_gpgpu_birds`, R3F flow-field particles, Codrops GPGPU particles, and `bgstaal/gpuparticles`.
- Recommended rebuilding the future GPGPU path from a proven `GPUComputationRenderer` reference instead of extending the broken manual debug implementation.
- Left app UI and `EmotionParticleOrb` unchanged.

### Verification

- Documentation-only change.
- No app code, Aurora, layout, lyrics, controls, overlays, or particle runtime behavior changed.

## 2026-05-22 Restored Stable Shader Particle Orb

### Implemented

- Stopped rendering the experimental GPGPU debug sandbox from `EmotionParticleOrb`.
- Removed the temporary debug label and red helper dot from the production render path by restoring the stable shader particle stage.
- Left the GPGPU files in `src/components/visual/gpgpu/` as experimental sandbox code only.
- Kept GPGPU planning and shader particle documentation intact for future work.
- Kept Aurora, layout, lyrics, controls, and overlays unchanged.

### Verification

- `npm.cmd run build`: passed.
- Build still emits the existing Vite chunk-size warning for the lazy Three/R3F orb chunk.

## 2026-05-22 Centered GPGPU Debug Cluster

### Implemented

- Tightened `GpgpuParticleDebug` initial particle positions into a centered debug cluster.
- Clamped sampled GPGPU positions to `x: -1.4..1.4`, `y: -0.9..0.9`, `z: -0.6..0.6`.
- Reduced debug texture motion amplitude so particles stay in the central formation.
- Kept cyan/rose debug colors for sampled-position vs fallback-position distinction.
- Kept `GPGPU DEBUG ACTIVE` label and safe fallback behavior.

### Verification

- `npm.cmd run build`: passed.
- Build still emits the existing Vite chunk-size warning for the lazy Three/R3F orb chunk.
- No Aurora, lyrics, controls, AI overlay, or layout changes were made.

## 2026-05-22 Safe Texture Position Fallback Debug

### Implemented

- Added safe `uPositionTexture` sampling guards in `GpgpuParticleDebug`.
- Clamped sampled texture positions into a visible camera range.
- Added fallback to original geometry position when sampled positions are invalid, too far, or unexpectedly near zero.
- Added temporary debug colors: cyan for sampled texture positions and rose for fallback geometry positions.
- Tightened initial debug position texture distribution to stay inside the visible camera range.

### Verification

- `npm.cmd run build`: passed.
- Build still emits the existing Vite chunk-size warning for the lazy Three/R3F orb chunk.
- No Aurora, lyrics, controls, AI overlay, or layout changes were made.

## 2026-05-22 Reconnected GPGPU Texture-Driven Debug Motion

### Implemented

- Reconnected `GpgpuParticleDebug` render vertex shader to sample `uPositionTexture` for particle positions.
- Removed the temporary shader-time geometry-position animation from the render vertex shader.
- Added `GPGPU_DEBUG_TEXTURE_MOTION` to drive visible calm motion inside the position simulation texture.
- Kept the debug label and red helper dot temporarily.
- Kept the particle group from rotating; motion is intended to come from the computed position texture.

### Verification

- `npm.cmd run build`: passed.
- Build still emits the existing Vite chunk-size warning for the lazy Three/R3F orb chunk.
- No Aurora, lyrics, controls, AI overlay, or layout changes were made.

## 2026-05-22 Shader-Time Particle Motion Isolation

### Implemented

- Updated `GpgpuParticleDebug` so particles temporarily ignore `uPositionTexture` for position animation.
- Animated particle positions directly in the vertex shader from static geometry `position` and `uTime`.
- Kept `GPGPU DEBUG ACTIVE` label and red helper dot for mount/useFrame confirmation.
- Preserved the GPGPU compute path in the component for later reconnect testing.

### Verification

- `npm.cmd run build`: passed.
- Build still emits the existing Vite chunk-size warning for the lazy Three/R3F orb chunk.
- No Aurora, lyrics, controls, AI overlay, or layout changes were made.

## 2026-05-22 Lowest-Level GPGPU Debug Visibility

### Implemented

- Added a visible `GPGPU DEBUG ACTIVE` label inside the isolated particle debug sandbox.
- Added a small red helper sphere animated by `useFrame` to confirm the Canvas frame loop is running.
- Added `DEBUG_SHADER_TIME_FALLBACK` so debug particles can animate directly from `uTime` before relying on GPGPU textures.
- Populated the debug geometry `position` attribute with real particle positions for shader-time fallback testing.
- Kept the GPGPU compute passes and `uPositionTexture` sampling path in place for reconnect testing.

### Verification

- `npm.cmd run build`: passed.
- Build still emits the existing Vite chunk-size warning for the lazy Three/R3F orb chunk.
- No Aurora, lyrics, controls, AI overlay, or layout changes were made.

## 2026-05-22 Isolated GPGPU Particle Debug Sandbox

### Implemented

- Created `src/components/visual/gpgpu/GpgpuParticleDebug.tsx` as an isolated minimal GPGPU particle simulation sandbox.
- Added `USE_GPGPU_DEBUG = true` in `EmotionParticleOrb` so the orb renders the debug sandbox temporarily.
- Kept the false toggle path wired to the current production shader orb.
- The debug sandbox uses `64 x 64` particles, GPU position and velocity textures, per-frame compute passes, and a render shader that samples `uPositionTexture`.
- The debug sandbox has no group rotation; motion comes from velocity and position texture updates.

### Verification

- `npm.cmd run build`: passed.
- Build still emits the existing Vite chunk-size warning for the lazy Three/R3F orb chunk.
- No Aurora, lyrics, controls, AI overlay, or layout changes were made.

## 2026-05-22 GPGPU Particle-Level Motion Debug

### Implemented

- Disabled the temporary CPU sanity rotation on the GPGPU points group.
- Kept the GPGPU particle cloud centered instead of rotating the entire group.
- Added particle-level internal drift in the GPGPU render vertex shader after sampling computed `uPositionTexture`.
- Updated the render shader uniforms every frame with `uTime` and `uInternalMotion`.
- Preserved current density, brightness, Aurora, layout, lyrics, controls, and AI overlay.

### Verification

- `npm.cmd run build`: passed.
- Build still emits the existing Vite chunk-size warning for the lazy Three/R3F orb chunk.

## 2026-05-22 Particle Motion Path Sanity Debug

### Implemented

- Added a gentle CPU sanity rotation to the GPGPU points path to verify the Canvas/useFrame path is active.
- Added the same gentle CPU sanity rotation to the shader fallback points path so fallback rendering is not mistaken for a frozen GPGPU pipeline.
- Added a dev-only `ACTIVE_PARTICLE_PATH` console log to identify whether GPGPU, shader fallback, or DOM fallback is active.
- Kept GPGPU render shader texture sampling intact: points still sample the current computed position texture through `uPositionTexture`.
- Kept particle brightness, density, layout, Aurora, lyrics, controls, and AI overlay unchanged.

### Verification

- `npm.cmd run build`: passed.
- Build still emits the existing Vite chunk-size warning for the lazy Three/R3F orb chunk.

## 2026-05-22 GPGPU Pipeline Motion Debug

### Implemented

- Added `GPGPU_DEBUG_MOTION` to prove texture-driven particle positions are moving.
- Added explicit code comments marking the velocity texture update, position texture update, compute pass, and render shader texture sampling.
- Moved compute resources into the GPGPU stage instance instead of relying on a shared global compute scene.
- Added a temporary slow swirl and drift inside the position simulation shader while keeping brightness and particle appearance unchanged.
- Kept the fallback shader particle orb intact.

### Verification

- `npm.cmd run build`: passed.
- Build still emits the existing Vite chunk-size warning for the lazy Three/R3F orb chunk.
- No Aurora, lyrics, controls, AI overlay, or layout changes were made.

## 2026-05-22 GPGPU Motion Activation Calibration

### Implemented

- Tuned the experimental GPGPU Phase A path so particle motion is visibly active.
- Increased flow-force amplitude through a debug-safe Phase A motion calibration scale.
- Added a soft tangential swirl force and subtle vertical drift in the velocity shader.
- Preserved velocity persistence, damping, `THREE.NormalBlending`, density, particle appearance, and current layout.
- Updated `docs/GPGPU_FLUID_SAND_PLAN.md` and `docs/SHADER_PARTICLE_PLAYBOOK.md` with motion calibration notes.

### Verification

- `npm.cmd run build`: passed.
- Build still emits the existing Vite chunk-size warning for the lazy Three/R3F orb chunk.
- No Aurora, lyrics, controls, AI overlay, or layout changes were made.

## 2026-05-22 GPGPU Fluid Sand Phase A Foundation

### Implemented

- Added an experimental GPGPU/FBO ping-pong particle simulation foundation under `src/components/visual/gpgpu/`.
- Created `128 x 128` simulation textures for `16,384` particles.
- Added GPU position and velocity texture simulation with velocity persistence.
- Added damping so particle movement keeps memory and gradually slows.
- Added a gentle shader-side flow force for calm organic motion.
- Integrated the GPGPU path into `EmotionParticleOrb` behind a safe Phase A gate.
- Preserved the existing shader particle orb as fallback when GPGPU is unavailable or reduced motion is enabled.
- Created `docs/SHADER_PARTICLE_PLAYBOOK.md`.
- Updated `docs/GPGPU_FLUID_SAND_PLAN.md` with Phase A implementation status.

### Verification

- `npm.cmd run build`: passed.
- Build still emits the existing Vite chunk-size warning for the lazy Three/R3F orb chunk.
- No Aurora, lyrics, controls, AI overlay, or layout changes were made.

## 2026-05-22 Vibe Motion System Planning Docs

### Implemented

- Created `docs/VIBE_MOTION_SYSTEM.md` to define Echo Soul's system-wide emotional motion rhythm.
- Updated `docs/PRODUCTION_ROADMAP.md` to reference the Vibe Motion System as a near-term production rulebook.
- Documented global motion states for idle, listening, thinking, speaking, music fading in, playing, and paused.

### Verification

- Documentation-only change.
- No app code, layout, Aurora, lyrics, controls, or particle runtime behavior changed.
- Build not run because no runtime code changed.

## 2026-05-22 GPGPU Fluid Sand Planning Docs

### Implemented

- Created `docs/GPGPU_FLUID_SAND_PLAN.md` to define the future production plan for Echo Soul's GPGPU fluid sand particle system.
- Created `docs/PRODUCTION_ROADMAP.md` to connect the particle simulation plan with broader production priorities.
- Documented that the GPGPU fluid sand system is planning-only and should not trigger implementation or layout changes yet.

### Verification

- Documentation-only change.
- No app code, layout, Aurora, lyrics, controls, or particle runtime behavior changed.
- Build not run because no runtime code changed.

## 2026-05-21 Normal Blending Particle Visibility Boost

### Implemented

- Tuned `EmotionParticleOrb` particle visibility for `THREE.NormalBlending`.
- Increased fragment alpha so particles read as solid sand grains instead of a faint smudge.
- Added a moderate luminance boost after texture/color sampling while avoiding pure-white blob behavior.
- Raised the minimum point size to `3.5`.
- Increased mood opacity values for the shader profile.
- Slightly tightened the initial particle radius and depth spread so the 9000 particles form a more recognizable emotional orb/cloud.
- Kept soft circular masks, texture sampling, curl motion, explicit geometry initialization, and layout/Aurora/lyrics/controls unchanged.

### Verification

- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed.
- Browser check at `http://127.0.0.1:5173/`: particle cloud visibly restored with no console errors.
- Build still emits the existing Vite chunk-size warning for the lazy Three/R3F orb chunk.

## 2026-05-21 Restored Safe Fluid Particle Motion

### Implemented

- Removed the temporary red box scene reference.
- Removed visibility calibration debug color and alpha overrides.
- Removed the raw `pointsMaterial` geometry test layer.
- Restored Simplex/Curl shader motion with a reduced displacement scale so particles stay inside the camera frustum.
- Restored emotional color and texture sampling while keeping a safe non-black fallback.
- Kept explicit `THREE.BufferGeometry().setAttribute(...)` initialization from the geometry fix.
- Kept `frustumCulled={false}`, `THREE.NormalBlending`, soft circular masks, and point-size clamp.
- Left Aurora, lyrics, controls, layout, and AI dialogue overlay unchanged.

### Verification

- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed.
- Browser check at `http://127.0.0.1:5173/`: red box removed, fluid particle cloud visible, canvas valid, no console errors.
- Build still emits the existing Vite chunk-size warning for the lazy Three/R3F orb chunk.

## 2026-05-21 Particle Visibility Calibration Mode

### Implemented

- Added `VISIBILITY_CALIBRATION = true` in `EmotionParticleOrb`.
- Added shader calibration uniforms for debug color, base point size, and calibration alpha behavior.
- Temporarily bypassed cover texture influence in calibration mode.
- Set calibration particle color to bright cyan-blue without pure white.
- Forced calibration alpha through the circular particle mask so particles remain clearly visible.
- Added `uBasePointSize` with calibration size `14.0` and a minimum shader point size of `4.0`.
- Disabled frustum culling on the `points` object for visibility sanity checks.
- Kept `THREE.NormalBlending`, soft circular particles, current shader architecture, and all layout/Aurora/lyrics/controls unchanged.

### Verification

- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed.
- Browser check at `http://127.0.0.1:5173/`: calibrated shader canvas mounted with valid dimensions and no console errors.
- Build still emits the existing Vite chunk-size warning for the lazy Three/R3F orb chunk.

## 2026-05-21 Curl Noise Sand Particle Stage

### Implemented

- Refined `EmotionParticleOrb` into a higher-density shader sand field using `THREE.Points` and custom GLSL.
- Increased normal particle count to `9000` with a reduced-motion fallback of `2600`.
- Replaced basic shader noise with 3D Simplex Noise and curl-style flow in the vertex shader.
- Kept particle animation GPU-side with smoothed uniform transitions for gather, drift, pulse, swirl, opacity, and density.
- Switched particle rendering to `THREE.NormalBlending` to avoid additive white burn-out.
- Added soft circular particle gradients, distance-based point attenuation, varied grain sizes, and uneven spatial distribution.
- Added subtle texture sampling from current cover art or fallback emotional texture as a low-strength color influence.
- Preserved low-brightness, darker cyan/violet/rose tones and cinematic restrained motion.
- Left Aurora, lyrics, controls, layout, and AI dialogue overlay unchanged.

### Verification

- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed.
- Browser check at `http://127.0.0.1:5173/`: curl-noise shader canvas and atmosphere layer mounted with valid dimensions and no console errors.
- Build still emits the existing Vite chunk-size warning for the lazy Three/R3F orb chunk.

## 2026-05-21 Softened Shader Particle Stage

### Implemented

- Reduced `EmotionParticleOrb` shader particle count from 980 to 540, and reduced-motion count from 520 to 280.
- Strongly lowered shader point size, alpha, halo glow, aura opacity, and mood profile opacity.
- Added shader-side brightness clamping to avoid white center burn-out.
- Spread particles farther across X/Y/Z so the stage reads as airy emotional dust instead of a glowing blob.
- Shifted mood colors toward darker cyan, violet, rose, and muted warm tones.
- Reduced album-cover/fallback atmosphere texture opacity and brightness so it stays subtle behind particles.
- Kept Aurora, lyrics, controls, layout, and AI dialogue overlay unchanged.

### Verification

- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed.
- Browser check at `http://127.0.0.1:5173/`: softened shader canvas and dimmed atmosphere layer mounted with valid dimensions and no console errors.
- Build still emits the existing Vite chunk-size warning for the lazy Three/R3F orb chunk.

## 2026-05-21 Shader Emotional Particle Stage

### Implemented

- Upgraded `EmotionParticleOrb` from instanced sphere particles to a shader-based `THREE.Points` particle stage.
- Added custom GLSL vertex and fragment shaders for:
  - noise-based organic drift
  - gather/disperse behavior
  - state-driven swirl density
  - soft speaking pulse waves
  - pointillist glow falloff
- Kept layered depth behavior for inner core, middle emotional field, and outer dust.
- Preserved subtle camera/cursor parallax and reduced-motion particle count scaling.
- Kept album-cover/fallback emotional texture support behind the particle field.
- Left Aurora, lyrics, controls, layout, and AI dialogue overlay unchanged.

### Verification

- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed.
- Browser check at `http://127.0.0.1:5173/`: shader particle canvas and atmosphere layer mounted with valid dimensions and no console errors.
- Build still emits the existing Vite chunk-size warning for the lazy Three/R3F orb chunk.

## 2026-05-21 Penderecki Garden Inspired Particle Stage

### Implemented

- Refined the particle stage without redesigning layout, Aurora, lyrics, quote, or controls.
- Rebuilt the orb as a layered 3D emotional particle field:
  - inner emotional core
  - middle floating particle field
  - outer drifting dust
- Added subtle camera/cursor parallax for gentle spatial feedback.
- Added a soft blurred atmosphere texture layer behind the particles.
- Added optional cover-art support for the orb texture, with current song color as the fallback mood source.
- Preserved restrained state behavior for idle, listening, thinking, speaking, playing, fading, and paused states.

### Verification

- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed.
- Browser check at `http://127.0.0.1:5173/`: orb canvas and atmosphere layer mounted with valid dimensions and no console errors.
- Build still emits the existing Vite chunk-size warning for the lazy Three/R3F orb chunk.

## 2026-05-21 Organic Emotion Particle Orb

### Implemented

- Refined only `src/components/visual/EmotionParticleOrb.tsx`; layout, text, controls, and Aurora remain unchanged.
- Replaced the rigid dotted-sphere particle cloud with layered organic particles:
  - inner soft core
  - outer drifting particles
  - subtle orbit dust
- Added distinct restrained motion behavior for idle, listening, thinking, speaking, fading, playing, and paused states.
- Removed hard orbit ring geometry from the orb so the emotional presence reads through particles instead of visible mechanical rings.
- Kept particle counts modest and respected reduced-motion scaling for mobile performance.

### Verification

- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed.
- Browser check at `http://127.0.0.1:5173/`: orb R3F canvas mounted with valid dimensions and no console errors.
- Build still emits the existing Vite chunk-size warning for the lazy Three/R3F orb chunk.

## 2026-05-21 Echo Soul Design System

### Implemented

- Created `docs/ECHO_SOUL_DESIGN_SYSTEM.md` as the permanent creative direction and visual rulebook for Echo Soul.
- Defined concise rules for philosophy, atmosphere, motion, typography, AI behavior, particles, aurora, glassmorphism, layout, voice interaction, interaction hierarchy, technical direction, and future evolution.
- Clarified that Echo Soul is an emotional AI companion for all emotional contexts, not late-night only.

## 2026-05-21 Aurora Gradient Ticker Refinement

### Implemented

- Added a subtle CSS aurora background layer with slow cinematic motion.
- Kept the particle/orb canvas transparent and softened the orb vignette so particles float directly in the emotional scene.
- Changed the daily quote treatment into a ReactBits-inspired star-border frame.
- Changed the daily quote motion to an elegant right-to-left emotional ticker.
- Applied an animated violet/cyan/rose gradient text treatment to the `Echo Soul` title.
- Removed the static fallback AI speech subtitle so the overlay only shows current recommendation speech content.
- Kept subtitle typing character-by-character with clean opacity and no blur effect.

### Verification

- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed.
- Build still emits the existing Vite chunk-size warning for the lazy Three/R3F orb chunk.

## 2026-05-21 Focused Quote Spacing Voice Refinement

### Implemented

- Added a subtle `今日回响` label to the daily emotional quote.
- Made daily quote motion more noticeable while keeping it restrained: slow reveal, shimmer pass, breathing glow, and hover lift.
- Preserved quote hover/click source reveal behavior for sourced quotes.
- Added moderate spacing back between the particle orb and lyrics panel so the stage feels connected without crowding.
- Replaced the circular voice listening overlay with a horizontal floating glass capsule.
- Added a soft waveform strip and breathing capsule glow for the Voice Chat placeholder state.

### Verification

- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed.
- Build still emits the existing Vite chunk-size warning for the lazy Three/R3F orb chunk.

## 2026-05-21 Daily Quote And Listening Overlay Refinement

### Implemented

- Replaced the fixed night-themed support phrase with a daily emotional quote component.
- Added mock daily quote data with optional source/author metadata for future AI-generated daily quotes.
- Added subtle quote animation: soft entrance, gentle glow breathing, and restrained hover lift.
- Added quote hover/click source interaction when source metadata exists.
- Tightened particle orb and lyrics spacing so they read as one emotional stage.
- Repositioned the AI dialogue overlay between the particle area and lyrics area while keeping it on the top visual layer.
- Improved AI dialogue readability with stronger glass opacity, contrast, shadow, and glow.
- Restricted AI dialogue to speaking/fade moments so recommendation text does not stay frozen as a permanent subtitle.
- Changed subtitle reveal to character-by-character typing with no text blur.
- Added a temporary voice listening ripple/aura placeholder when Voice Chat is pressed.

### Verification

- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed.
- Build still emits the existing Vite chunk-size warning for the lazy Three/R3F orb chunk.

## 2026-05-21 Overlay Subtitle And Input Absorption

### Implemented

- Refined AI dialogue into a fixed cinematic overlay layer above the existing orb, lyrics, controls, and drawers.
- Preserved the existing layout structure with a spacer so dialogue visibility does not push or resize the scene.
- Added progressive typewriter-style subtitle reveal with calm timing, subtle blur recovery, and a soft cursor.
- Kept the AI dialogue temporary; it disappears after speaking/fade states complete.
- Changed text submission so the input closes immediately after valid submit.
- Refined the input exit motion into an inward emotional collapse with horizontal compression, glow tightening, opacity fade, and blur.

### Verification

- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed.
- Build still emits the existing Vite chunk-size warning for the lazy Three/R3F orb chunk.

## 2026-05-21 Cinematic Interaction Refinement

### Implemented

- Removed visible volume/status presentation from the app shell while preserving mock audio ducking and fade-in behavior.
- Changed AI communication into a temporary cinematic dialogue card that appears during listening/thinking/speaking/fade moments and fades away for immersive playback.
- Converted the previous now-playing/reason glass card into a lyrics-focused panel with current and next lyric lines.
- Removed the permanent recommendation explanation paragraph from the main music panel.
- Hid the text input by default; it now opens only from the Text Chat control.
- Removed the extra visible voice placeholder wording from the bottom input area.
- Refined control button motion with stronger hover scale, slower easing, tighter tap feedback, and hover/focus-only labels.
- Improved playlist drawer readability with higher glass opacity, stronger contrast, and slower blur/floating motion.

### Verification

- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed.
- Build still emits the existing Vite chunk-size warning for the lazy Three/R3F orb chunk.

### Future Work

- Replace mock lyric timing with real playback-synced lyrics when a real music provider is integrated.
- Implement real voice recording/transcription after the UI architecture is ready.

## 2026-05-21 Cinematic Emotional AI Music Universe

### Implemented

- Rebuilt the main screen into a fullscreen cinematic emotional universe.
- Created new modular components:
  - `src/components/layout/EmotionalUniverseShell.tsx`
  - `src/components/visual/EmotionParticleOrb.tsx`
  - `src/components/player/AIMessageSubtitle.tsx`
  - `src/components/player/NowPlayingGlassCard.tsx`
  - `src/components/player/ControlDock.tsx`
  - `src/components/player/PlaylistDrawer.tsx`
  - `src/components/chat/VoiceTextDock.tsx`
- Replaced the visible waveform/player layout with a lazy-loaded Three.js emotional orb.
- Added mood-aware orb color behavior for calm, happy, sad, romantic, and lonely tones.
- Added cinematic AI subtitle presentation instead of chatbot bubbles.
- Added compact now-playing glass card with emotional recommendation reason.
- Added control dock for play/pause, next song, voice chat placeholder, text chat, and save-as-memory placeholder.
- Added bottom text drawer and central voice placeholder state.
- Added hidden playlist drawer behind `今日歌单`.
- Preserved existing mock AI recommendation, queue, play/pause, next song, now playing, weather/time context, and mock audio state flow.
- Rewrote corrupted visible mock song and mock AI copy into readable Simplified Chinese.
- Removed the old active waveform/player component path from the main UI in favor of the new modular universe components.

### Libraries Used

- React
- TypeScript
- Vite
- Framer Motion
- Three.js
- @react-three/fiber
- @react-three/drei
- lucide-react

### Verification

- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed.
- Build emits a Vite chunk-size warning for the lazy Three/R3F orb chunk.

### Future Work

- Real voice recording and transcription.
- Real OpenAI reasoning/TTS integration.
- NetEase music integration.
- Real audio analysis.
- Daily AI Playlist learning and generation.
- Optional further bundle tuning for the Three/R3F chunk.

## 2026-05-21 Step 8 Three.js Emotional Stage

### Implemented

- Added `src/components/EmotionalStage.tsx` using React Three Fiber and Three.js.
- Kept `EmotionalWaveform.tsx` as a compatibility wrapper so existing app props remain unchanged.
- Replaced the old waveform concept with a controlled emotional particle field:
  - idle: slow breathing particles
  - AI thinking: particles gently gather toward center
  - AI speaking: aura pulses softly
  - music fading in: particles expand outward
  - playing: gentle rhythmic movement
  - paused: low-energy floating
- Added a CSS fallback for environments without WebGL.
- Kept the Three.js scope limited to the central emotional visual stage.
- Added a microphone placeholder button beside the AI input submit button.
- Added placeholder state text: `语音输入即将支持`.
- Did not implement real voice recording, permissions, transcription, or streaming.

### Verification

- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed.
- Build emits a Vite chunk-size warning because Three/R3F increases the client bundle size.

### Known Limitations

- The particle field is still state-driven, not real audio-reactive analysis.
- Voice input remains a placeholder only.
- No postprocessing was added to keep mobile GPU load controlled.

## 2026-05-21 Echo Soul Motion Refinement

### Implemented

- Created root `DESIGN.md` as the Echo Soul design bible.
- Reframed docs around a Chinese AI emotional companion, immersive emotional AI space, cinematic deep-night atmosphere, and emotional resonance.
- Documented Daily AI Playlist as future scope only. No UI, state, provider logic, persistence, or playlist implementation was added.
- Refined shared button motion in `src/components/motionPresets.ts`:
  - subtle hover scale
  - soft glow expansion
  - border brightening
  - press scale-down
  - tighter tactile glow
- Converted the AI input into a minimal horizontal glass input bar with a right-side circular arrow submit button and breathing focus glow.
- Updated visible UI copy to natural Chinese where this phase touched the app.
- Refined `EmotionalWaveform.tsx` using GSAP plus Framer Motion:
  - GSAP controls continuous ambient particles, ribbon drift, and air glow.
  - Framer Motion controls React state-driven stage glow and waveform bar response.
  - States remain mapped to idle, AI thinking, AI speaking, music fading in, playing, and paused.
- Preserved the current mock recommendation, voice timing, and fade-in flow.

### Verification

- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed.
- `npm run lint` and `npm run build` through PowerShell were blocked by the local `npm.ps1` execution policy, so checks were run through `npm.cmd`.

### Known Limitations

- Waveform remains state-driven ambient motion, not real audio analysis.
- Daily AI Playlist is documented only.
- OpenAI and NetEase integrations remain future scope.

## 2026-05-19

### Project Rules

- Created `AGENTS.md` to define project-level rules for agents.
- Established the app as an AI-assisted DJ experience, not a generic Vite template or Spotify clone.
- Captured rules around React, TypeScript, Vite, Tailwind CSS, Framer Motion, lucide-react, Web Audio API, provider architecture, UI quality, and verification.

### Product Direction

- Defined project direction as a personal Chinese AI DJ emotional music companion PWA.
- Confirmed UI language is Simplified Chinese.
- Confirmed AI DJ speaks natural Chinese.
- Confirmed recommended songs may be Chinese or English.
- Confirmed AI must explain recommendations in Chinese.

### MVP Direction

- MVP uses OpenAI for reasoning.
- MVP uses OpenAI TTS for AI voice.
- MVP uses mock songs first.
- Future music integration targets NetEase Cloud Music.
- Audio ducking and fade in will use Web Audio API.

### Documentation Created

- `docs/PROJECT_CONTEXT.md`
- `docs/PRODUCT_SPEC.md`
- `docs/TECH_SPEC.md`
- `docs/AI_BEHAVIOR_GUIDE.md`
- `docs/UI_STYLE_GUIDE.md`
- `docs/IMPLEMENTATION_PLAN.md`

### Current Constraint

- No app code has been written for this phase.
- Next phase should follow `docs/IMPLEMENTATION_PLAN.md`.

## 2026-05-19 Frontend MVP Shell

### Implemented

- Replaced the Vite starter with the first AI DJ frontend MVP shell.
- Added a mobile-first Chinese interface with:
  - 当前情绪区域
  - 情绪选择器
  - 歌曲语言偏好：中文 / 英文 / 不限制
  - AI DJ message card
  - Now Playing card
  - Play / Pause button
  - Next Song button
  - 小型天气 / 时间 placeholder
  - collapsed playlist queue
- Added mock song data with Chinese and English songs, mood tags, language tags, artist, title, and short recommendation reasons.
- Added provider-ready architecture:
  - `AIProvider`
  - `VoiceProvider`
  - `MusicProvider`
  - `AudioMixer`
- Added mock AI recommendation and mock AI voice flow.
- Added mock audio behavior states:
  - AI DJ 正在说话
  - 音乐保持低音量
  - 音乐淡入中
  - 正在播放
- Used Framer Motion for smooth fade, subtle floating, and soft state transitions.

### Verification

- Ran `npm run lint`: passed.
- Ran `npm run build`: passed.
- Opened `http://127.0.0.1:5173` in the browser.
- Verified the shell renders core hero copy, playback controls, and playlist queue.
- Clicked “让 AI DJ 选一首” and verified the UI transitions through AI voice / ducked music / fade or playback states.
- Checked browser console errors: none observed.

### Known Limitations

- Audio is currently simulated with timers and volume state only.
- No real music playback is connected yet.
- No real OpenAI reasoning or OpenAI TTS call is connected yet.
- Weather is a placeholder.
- NetEase MusicProvider remains future scope.

## 2026-05-19 Immersive Emotional UI Refinement

### Implemented

- Refined the visual direction using the provided reference image as inspiration, without copying it directly.
- Reduced the dashboard feeling by replacing the two-column card grid with a single immersive AI stage.
- Made the emotional conversation and AI presence more central than the playback controls.
- Added an animated emotional waveform scene with:
  - layered warm/cool light ribbons
  - subtle particle atmosphere
  - animated waveform bars
  - softer cinematic background lighting
- Reworked playback controls to be smaller, quieter, and more ambient.
- Preserved the existing mock flow:
  - Chinese AI DJ
  - Chinese AI conversation
  - Chinese and English mock songs
  - AI explains song choice in Chinese
  - AI voice before music
  - music ducking while AI speaks
  - music fade-in after AI speaking state

### Verification

- Ran `npm run lint`: passed.
- Ran `npm run build`: passed.
- Opened `http://127.0.0.1:5173` in the browser.
- Verified the immersive visual stage renders.
- Verified no horizontal overflow at the inspected desktop viewport.
- Clicked “让 AI DJ 选一首” and verified the UI transitions through AI speaking / ducked music / fade-in or playing states.
- Browser page console errors from the app: none observed.

### Known Limitations

- Waveform and particles are CSS/Framer Motion visuals, not real audio-reactive analysis yet.
- Audio behavior is still simulated by `MockAudioMixer`.
- Weather remains a placeholder.

## 2026-05-19 Emotional Companion Refinement

### Implemented

- Refined the existing UI without rebuilding the app from scratch.
- Strengthened `EmotionalWaveform.tsx` so the visual responds more emotionally to app state:
  - quiet breathing for idle / paused
  - subtle thinking motion while AI understands the user
  - more active particles and waveform during AI speaking
  - stronger but still soft movement during music fade-in
  - gentle rhythmic motion while playing
- Added explicit AI thinking states:
  - 正在理解你的情绪
  - 正在寻找适合这份心情的声音
  - 正在准备给你的开场白
  - AI DJ 正在说话
  - 音乐正在慢慢靠近
- Changed the emotion input area from a manual recommendation action into an AI listening entry:
  - New framing: “让 Echo Soul 听懂此刻的你”
  - New CTA: “让 Echo Soul 听一听”
- Removed the song language preference UI completely.
- Removed language preference from the local recommendation ranking path so mock AI can choose Chinese or English songs by inferred mood and song texture.
- Updated the mock AI provider to infer emotion from user text instead of requiring a manual mood selection.
- Expanded Chinese recommendation explanations to mention musical details such as rhythm, arrangement, vocal texture, melody, production style, and emotional fit.

### Verification

- Ran `npm run lint`: passed.
- Ran `npm run build`: passed.
- Searched `src/` and confirmed the old language preference UI and old CTA are gone.
- Opened `http://127.0.0.1:5173` in the browser.
- Verified the new Echo Soul input prompt and CTA render.
- Verified the AI thinking flow appears before the AI speaking / music ducking / fade-in states.
- Verified the recommendation explanation appears in Chinese and includes concrete musical reasoning.

### Known Limitations

- Emotional waveform is still state-driven, not real audio-reactive.
- AI reasoning remains mocked.
- Voice playback and music playback remain simulated.

## 2026-05-19 Minimal AI Input And Button Motion Refinement

### Implemented

- Refined the existing UI without rebuilding the app.
- Replaced the large emotion textarea module with a minimal horizontal AI input bar.
- Changed the input placeholder to “今天发生了什么，或现在是什么感觉？”.
- Removed the large “让 Echo Soul 听一听” CTA button.
- Added a small circular submit button with an upward arrow icon.
- Added shared Framer Motion button presets:
  - `buttonMotion`
  - `iconButtonMotion`
  - `pillMotion`
- Applied unified motion behavior to:
  - play / pause
  - next song
  - AI submit
  - playlist queue toggle
  - menu button
- Refined button feedback so hover slightly scales up, adds subtle glow, brightens borders, and shifts gradient softly.
- Refined tap feedback so controls scale down gently with tighter glow.
- Kept the Echo Soul brand, central AI emotional stage, waveform, dark cinematic background, soft glow, and Chinese AI DJ direction intact.

### Verification

- Ran `npm run lint`: passed.
- Ran `npm run build`: passed.
- Searched `src/` and confirmed the old textarea, old large CTA, language preference UI, and `PreferencePanel` references are gone.
- Opened `http://127.0.0.1:5173` in the browser.
- Verified the page renders the new single-line AI input with circular submit button.
- Verified there is no textarea in the DOM.
- Verified submitting from the circular button triggers the AI thinking state.
- Verified no horizontal overflow at the inspected desktop viewport.
- Browser page console errors from the app: none observed.

### Known Limitations

- Button motion is refined for current controls; future controls should reuse the shared motion presets.
- Input remains text-only; voice input is not implemented yet.
