import { useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { allTrending } from '../api/tmdb'
import MovieCard from '../components/MovieCard'
import './Trending.css'

const TABS = [
  { label: '📅 This Week', value: 'week' },
  { label: '☀️ Today', value: 'day' },
]

export default function Trending() {
  const [window, setWindow] = useState('week')
  const { data, loading } = useFetch(() => allTrending(window), [window])
  const items = data?.results?.filter(m => m.media_type !== 'person') || []

  return (
    <div className="trending-page">
      <div className="trending-page__header">
        <h1>Trending Now</h1>
        <div className="trending-page__tabs">
          {TABS.map(t => (
            <button
              key={t.value}
              className={`tab-btn ${window === t.value ? 'active' : ''}`}
              onClick={() => setWindow(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="trending-page__grid">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="movie-card-skeleton trending-skeleton" />
          ))}
        </div>
      ) : (
        <div className="trending-page__grid">
          {items.map((m, i) => (
            <div key={m.id} className="trending-item">
              <span className="trending-rank">{i + 1}</span>
              <MovieCard movie={m} mediaType={m.media_type} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
