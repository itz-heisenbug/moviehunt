import { useRef } from 'react'
import MovieCard from './MovieCard'
import './MovieRow.css'

export default function MovieRow({ title, movies = [], loading, mediaType = 'movie' }) {
  const rowRef = useRef(null)

  function scroll(dir) {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: dir * 600, behavior: 'smooth' })
    }
  }

  if (loading) {
    return (
      <div className="movie-row">
        <h2 className="movie-row__title">{title}</h2>
        <div className="movie-row__track">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="movie-card-skeleton" />
          ))}
        </div>
      </div>
    )
  }

  if (!movies.length) return null

  return (
    <div className="movie-row">
      <h2 className="movie-row__title">{title}</h2>
      <div className="movie-row__wrapper">
        <button className="movie-row__arrow left" onClick={() => scroll(-1)} aria-label="scroll left">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
        </button>
        <div className="movie-row__track" ref={rowRef}>
          {movies.map(m => (
            <MovieCard key={m.id} movie={m} mediaType={m.media_type || mediaType} />
          ))}
        </div>
        <button className="movie-row__arrow right" onClick={() => scroll(1)} aria-label="scroll right">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
        </button>
      </div>
    </div>
  )
}
