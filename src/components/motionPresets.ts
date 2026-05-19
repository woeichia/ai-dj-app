import type { Variants } from 'framer-motion'

export const buttonMotion: Variants = {
  rest: {
    scale: 1,
    boxShadow: '0 0 0 rgba(190, 164, 255, 0)',
    backgroundPosition: '0% 50%',
  },
  hover: {
    scale: 1.025,
    borderColor: 'rgba(226, 209, 255, 0.34)',
    boxShadow: '0 0 24px rgba(190, 164, 255, 0.18)',
    backgroundPosition: '100% 50%',
    transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
  },
  tap: {
    scale: 0.97,
    boxShadow: '0 0 12px rgba(190, 164, 255, 0.12)',
    transition: { duration: 0.12, ease: [0.22, 1, 0.36, 1] },
  },
}

export const iconButtonMotion: Variants = {
  rest: {
    scale: 1,
    boxShadow: '0 0 18px rgba(190, 164, 255, 0.08)',
  },
  hover: {
    scale: 1.06,
    borderColor: 'rgba(226, 209, 255, 0.36)',
    boxShadow: '0 0 26px rgba(190, 164, 255, 0.22)',
    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
  },
  tap: {
    scale: 0.94,
    boxShadow: '0 0 10px rgba(190, 164, 255, 0.12)',
    transition: { duration: 0.1, ease: [0.22, 1, 0.36, 1] },
  },
}

export const pillMotion: Variants = {
  rest: {
    scale: 1,
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
  },
  hover: {
    scale: 1.018,
    borderColor: 'rgba(226, 209, 255, 0.28)',
    boxShadow:
      'inset 0 1px 0 rgba(255,255,255,0.08), 0 0 20px rgba(190, 164, 255, 0.12)',
    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
  },
  tap: {
    scale: 0.975,
    boxShadow:
      'inset 0 1px 0 rgba(255,255,255,0.05), 0 0 10px rgba(190, 164, 255, 0.08)',
    transition: { duration: 0.1, ease: [0.22, 1, 0.36, 1] },
  },
}
