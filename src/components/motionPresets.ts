import type { Variants } from 'framer-motion'

const emotionalEase = [0.22, 1, 0.36, 1] as const

export const buttonMotion: Variants = {
  rest: {
    scale: 1,
    borderColor: 'rgba(223, 205, 255, 0.14)',
    backgroundPosition: '0% 50%',
    boxShadow:
      'inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 rgba(190,164,255,0)',
    transition: { duration: 0.36, ease: emotionalEase },
  },
  hover: {
    scale: 1.028,
    borderColor: 'rgba(234, 220, 255, 0.38)',
    backgroundPosition: '100% 50%',
    boxShadow:
      'inset 0 1px 0 rgba(255,255,255,0.1), 0 0 28px rgba(190,164,255,0.2), 0 0 52px rgba(117,215,226,0.08)',
    transition: { duration: 0.26, ease: emotionalEase },
  },
  tap: {
    scale: 0.965,
    borderColor: 'rgba(234, 220, 255, 0.28)',
    boxShadow:
      'inset 0 2px 10px rgba(12,8,24,0.34), 0 0 14px rgba(190,164,255,0.14)',
    transition: { duration: 0.12, ease: emotionalEase },
  },
}

export const iconButtonMotion: Variants = {
  rest: {
    scale: 1,
    borderColor: 'rgba(226, 209, 255, 0.16)',
    boxShadow:
      'inset 0 1px 0 rgba(255,255,255,0.06), 0 0 18px rgba(190,164,255,0.08)',
    transition: { duration: 0.34, ease: emotionalEase },
  },
  hover: {
    scale: 1.085,
    borderColor: 'rgba(236, 222, 255, 0.42)',
    boxShadow:
      'inset 0 1px 0 rgba(255,255,255,0.12), 0 0 34px rgba(190,164,255,0.28), 0 0 58px rgba(109,218,228,0.11)',
    transition: { duration: 0.34, ease: emotionalEase },
  },
  tap: {
    scale: 0.91,
    borderColor: 'rgba(236, 222, 255, 0.3)',
    boxShadow:
      'inset 0 2px 12px rgba(12,8,24,0.4), 0 0 12px rgba(190,164,255,0.16)',
    transition: { duration: 0.14, ease: emotionalEase },
  },
}

export const pillMotion: Variants = {
  rest: {
    scale: 1,
    borderColor: 'rgba(225, 207, 255, 0.1)',
    boxShadow:
      'inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 rgba(190,164,255,0)',
    transition: { duration: 0.34, ease: emotionalEase },
  },
  hover: {
    scale: 1.035,
    borderColor: 'rgba(226, 209, 255, 0.34)',
    boxShadow:
      'inset 0 1px 0 rgba(255,255,255,0.1), 0 0 28px rgba(190,164,255,0.18)',
    transition: { duration: 0.34, ease: emotionalEase },
  },
  tap: {
    scale: 0.968,
    borderColor: 'rgba(226, 209, 255, 0.24)',
    boxShadow:
      'inset 0 2px 10px rgba(12,8,24,0.28), 0 0 10px rgba(190,164,255,0.1)',
    transition: { duration: 0.1, ease: emotionalEase },
  },
}

export const inputBarMotion: Variants = {
  rest: {
    scale: 1,
    borderColor: 'rgba(225, 207, 255, 0.12)',
    boxShadow:
      'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -18px 42px rgba(0,0,0,0.14), 0 18px 52px rgba(5,7,24,0.16)',
    transition: { duration: 0.42, ease: emotionalEase },
  },
  hover: {
    scale: 1.006,
    borderColor: 'rgba(225, 207, 255, 0.24)',
    boxShadow:
      'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -18px 42px rgba(0,0,0,0.12), 0 0 34px rgba(184,154,255,0.13)',
    transition: { duration: 0.32, ease: emotionalEase },
  },
  focus: {
    scale: 1.01,
    borderColor: 'rgba(213, 195, 255, 0.44)',
    boxShadow:
      'inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -18px 42px rgba(0,0,0,0.12), 0 0 0 4px rgba(192,166,255,0.08), 0 0 42px rgba(147,217,229,0.14)',
    transition: { duration: 0.34, ease: emotionalEase },
  },
}
