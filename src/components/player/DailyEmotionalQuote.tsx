import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'

interface DailyQuote {
  text: string
  source?: string
  kind: 'ai' | 'quote'
}

const dailyQuotes: DailyQuote[] = [
  { text: '把今天交给音乐。', kind: 'ai' },
  { text: '慢一点也没关系。', kind: 'ai' },
  { text: '让音乐替你整理一下心情。', kind: 'ai' },
  { text: '今天先不用急着变好。', kind: 'ai' },
  { text: '先把呼吸放轻一点。', kind: 'ai' },
  { text: '你可以不用马上回答生活。', kind: 'ai' },
  { text: '凡是过往，皆为序章。', source: '莎士比亚', kind: 'quote' },
]

export function DailyEmotionalQuote() {
  const [sourceVisible, setSourceVisible] = useState(false)
  const quote = useMemo(() => selectDailyQuote(new Date()), [])
  const hasSource = Boolean(quote.source)

  return (
    <motion.button
      className={`daily-quote${hasSource ? ' has-source' : ''}`}
      type="button"
      aria-label={hasSource ? `${quote.text} 来源：${quote.source}` : quote.text}
      onClick={() => {
        if (hasSource) setSourceVisible((current) => !current)
      }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.012 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <em>今日回响</em>
      <motion.span
        className="daily-quote-text"
        initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
        animate={{
          opacity: [0.72, 0.98, 0.72],
          clipPath: 'inset(0 0% 0 0)',
          textShadow: [
            '0 0 16px rgba(219,190,255,0.12)',
            '0 0 24px rgba(160,224,235,0.2)',
            '0 0 16px rgba(219,190,255,0.12)',
          ],
        }}
        transition={{
          opacity: { duration: 5.8, repeat: Infinity, ease: 'easeInOut' },
          textShadow: { duration: 5.8, repeat: Infinity, ease: 'easeInOut' },
          clipPath: { duration: 1.35, ease: [0.22, 1, 0.36, 1] },
        }}
      >
        {quote.text}
      </motion.span>
      {hasSource ? <small className={sourceVisible ? 'visible' : ''}>{quote.source}</small> : null}
    </motion.button>
  )
}

function selectDailyQuote(date: Date): DailyQuote {
  const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  let hash = 0

  for (const char of key) {
    hash = (hash * 31 + char.charCodeAt(0)) % dailyQuotes.length
  }

  return dailyQuotes[hash]
}
