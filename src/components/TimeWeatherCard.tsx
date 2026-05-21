import { CloudMoon } from 'lucide-react'

interface TimeWeatherCardProps {
  time: string
}

export function TimeWeatherCard({ time }: TimeWeatherCardProps) {
  return (
    <section className="time-weather" aria-label="时间和天气">
      <CloudMoon size={18} aria-hidden="true" />
      <div>
        <strong>{time}</strong>
        <span>夜色微凉</span>
      </div>
    </section>
  )
}
