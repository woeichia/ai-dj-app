# AGENTS.md

Project rules for agents working on this AI DJ App.

## Project Identity

This app is an AI-assisted DJ experience built with React, TypeScript, Vite, Tailwind CSS, Framer Motion, and lucide-react.

The product should feel like a focused creative tool for mixing, cueing, analyzing, and arranging music. Favor a polished studio-console experience over a generic SaaS dashboard or template landing page.

## Operating Principles

- Read this file before making any changes.
- Check existing files, docs, scripts, and patterns before proposing or editing.
- Do not overwrite user work. If the working tree is dirty, preserve unrelated changes.
- Keep changes small, purposeful, and easy to review.
- Prefer practical implementation over speculative architecture.
- Do not add large dependencies without a clear reason.
- If a change affects UI, audio behavior, routing, data flow, or app state, explain the intended behavior before editing.

## Skills And Workflow

- Use available Superpowers skills when they match the task.
- Use `using-superpowers` at the start of a new work session when available.
- Use planning or design workflows before broad feature work.
- Use systematic debugging before fixing bugs or test failures.
- Use code-review workflows when reviewing PRs, large diffs, or risky changes.
- Use verification-before-completion before claiming work is done.
- If a named skill is unavailable, continue with this file, project docs, and local code as the source of truth.

## Tech Stack Rules

- Use React function components and TypeScript.
- Keep component props typed and explicit.
- Prefer local, readable state until shared state is clearly needed.
- Use Vite conventions for app entry, assets, and development scripts.
- Use lucide-react for standard UI icons.
- Use Framer Motion for meaningful interaction and transition polish, not decoration for its own sake.
- Keep styling consistent with the existing CSS/Tailwind approach in the repo.
- Do not introduce a backend, database, auth system, or AI/audio provider integration unless the task explicitly calls for it.

## Product And UX Direction

- Build the actual DJ workflow first, not a marketing landing page.
- Prioritize fast interaction, scanability, and confident controls.
- DJ controls should be direct and familiar: transport buttons, cue points, sliders, knobs, meters, waveforms, deck states, playlist queues, and mode switches.
- Use icons for tools and transport actions where a familiar icon exists.
- Provide clear states for loading, empty libraries, disabled controls, active decks, sync status, AI suggestions, and errors.
- Avoid UI that explains itself with long instructional copy. Let controls, labels, and layout do the work.
- The app should remain usable on desktop and mobile, but desktop mixing workflows may be denser and more powerful.

## Audio And AI Behavior

- Treat audio-related code as high-risk user-facing behavior.
- Avoid surprising playback, autoplay, volume jumps, or destructive queue changes.
- Any AI recommendation should be inspectable before it changes the mix.
- Clearly separate suggested actions from actions already applied.
- Prefer deterministic fallbacks when AI/audio analysis data is missing.
- Do not fake real model, streaming, licensing, or audio-analysis capabilities. Use mock data only when clearly named as mock/demo behavior.

## UI Quality Bar

- Avoid generic template visuals and one-note color palettes.
- Use stable dimensions for decks, meters, waveforms, toolbars, and buttons so hover or state changes do not shift layout.
- Ensure text fits within controls at mobile and desktop sizes.
- Do not nest cards inside cards.
- Avoid decorative gradient blobs, bokeh, or unrelated visual filler.
- Use visual assets when they help users understand the music, deck, venue, playlist, or performance state.
- Validate meaningful frontend changes in a browser when possible.

## Code Organization

- Keep files focused. Split components when a file becomes difficult to reason about.
- Keep domain concepts named plainly: deck, track, cue, loop, transition, mix, queue, analysis, recommendation.
- Put reusable UI primitives and domain-specific components in clear locations as the app grows.
- Keep mock data separate from production-oriented logic.
- Keep effects narrow and clean up timers, event listeners, animation frames, and audio nodes.

## Testing And Verification

- Before finishing code changes, run the most relevant checks:
  - `npm run lint`
  - `npm run build`
- For UI changes, run the app with `npm run dev` and inspect the affected screens in a browser when practical.
- For bug fixes, reproduce the issue first when possible, then verify the fix.
- If a command cannot be run, state why and describe the remaining risk.

## Documentation

- Update docs when behavior, setup, architecture, or user workflows change.
- Keep README content useful for running and understanding the app.
- Capture larger feature designs in `docs/` before implementation when the scope is broad.

## Communication

- Be concise and specific about what changed and why.
- Surface tradeoffs before making broad decisions.
- Ask only when the answer cannot be inferred safely from the project.
- When reporting completion, include changed files and verification performed.
