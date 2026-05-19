export function easeOutCubic(progress: number): number {
  return 1 - Math.pow(1 - progress, 3)
}

export function interpolateVolume(
  startVolume: number,
  endVolume: number,
  progress: number,
): number {
  const safeProgress = Math.min(1, Math.max(0, progress))
  return startVolume + (endVolume - startVolume) * easeOutCubic(safeProgress)
}
