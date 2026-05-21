import type { CSSProperties, ReactElement } from 'react'

export interface AuroraProps {
  colorStops?: [string, string, string] | string[]
  amplitude?: number
  blend?: number
  speed?: number
  time?: number
  className?: string
  style?: CSSProperties
}

export default function Aurora(props: AuroraProps): ReactElement
