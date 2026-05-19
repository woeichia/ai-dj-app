import type { SongLanguagePreference } from '../types/music'

interface PreferencePanelProps {
  language: SongLanguagePreference
  selectedGenres: string[]
  onLanguageChange(language: SongLanguagePreference): void
  onGenreToggle(genre: string): void
}

const languageOptions: Array<{ value: SongLanguagePreference; label: string }> = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: '英文' },
  { value: 'any', label: '不限制' },
]

const genres = ['华语流行', '民谣', 'R&B', '独立流行', 'Dream Pop', 'Ambient']

export function PreferencePanel({
  language,
  selectedGenres,
  onLanguageChange,
  onGenreToggle,
}: PreferencePanelProps) {
  return (
    <section className="panel preference-panel">
      <div>
        <div className="section-kicker">歌曲语言偏好</div>
        <div className="segmented" role="group" aria-label="歌曲语言偏好">
          {languageOptions.map((option) => (
            <button
              className={language === option.value ? 'segment active' : 'segment'}
              key={option.value}
              type="button"
              onClick={() => onLanguageChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="section-kicker">音乐偏好</div>
        <div className="genre-grid">
          {genres.map((genre) => (
            <button
              className={selectedGenres.includes(genre) ? 'chip active' : 'chip'}
              key={genre}
              type="button"
              onClick={() => onGenreToggle(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
