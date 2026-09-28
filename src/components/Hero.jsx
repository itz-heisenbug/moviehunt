import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IMG } from '../api/tmdb'
import './Hero.css'

export default function Hero({ movies = [] }) {
  const [current, setCurrent] = useState(0)
  const navigate = useNavigate()
  const featured = movies.slice(0, 5)

  // Auto-rotate
  useEffect(() => {
    if (!featured.length) return
    const id = setInterval(() => {
      setCurrent(c => (c + 1) % featured.length)
    }, 8000)
    return () => clearInterval(id)
  }, [featured.length])

  if (!featured.length) {
    return <div className="hero hero--skeleton" />
  }

  const movie = featured[current]
  const backdrop = IMG.backdrop(movie.backdrop_path)
  const year = movie.release_date?.slice(0, 4)
  const rating = movie.vote_average?.toFixed(1)

  return (
    <div className="hero">
      {/* Backdrop images */}
      {featured.map((m, i) => (
        <div
          key={m.id}
          className={`hero__bg ${i === current ? 'active' : ''}`}
          style={{ backgroundImage: `url(${IMG.backdrop(m.backdrop_path)})` }}
        />
      ))}

      {/* Gradient overlays */}
      <div className="hero__overlay" />

      <div className="hero__content">
        <div className="hero__badge">🔥 Featured</div>
        <h1 className="hero__title">{movie.title}</h1>

        <div className="hero__meta">
          {year && <span>{year}</span>}
          {rating && <span>⭐ {rating}</span>}
          {movie.adult === false && <span className="badge-rating">PG-13</span>}
        </div>

        <p className="hero__overview">
          {movie.overview?.slice(0, 200)}
          {movie.overview?.length > 200 ? '…' : ''}
        </p>

        <div className="hero__actions">
          <button
            className="hero__btn hero__btn--play"
            onClick={() => navigate(`/movie/${movie.id}`)}
          >
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            Play
          </button>
          <button
            className="hero__btn hero__btn--info"
            onClick={() => navigate(`/movie/${movie.id}`)}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
            More Info
          </button>
        </div>
      </div>

      {/* Dots */}
      <div className="hero__dots">
        {featured.map((_, i) => (
          <button
            key={i}
            className={`hero__dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
