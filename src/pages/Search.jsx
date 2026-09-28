import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { multiSearch } from '../api/tmdb'
import MovieCard from '../components/MovieCard'
import './Search.css'

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [input, setInput] = useState(query)

  const { data, loading } = useFetch(
    () => query ? multiSearch(query) : Promise.resolve({ results: [] }),
    [query]
  )

  const results = data?.results?.filter(m => m.media_type !== 'person' && m.poster_path) || []

  function handleSubmit(e) {
    e.preventDefault()
    if (input.trim()) setSearchParams({ q: input.trim() })
  }

  return (
    <div className="search-page">
      <div className="search-page__header">
        <h1>Search</h1>
        <form className="search-form" onSubmit={handleSubmit}>
          <input

            type="text"
            placeholder="Search for movies..."
            value={input}
            onChange={e => setInput(e.target.value)}
            autoFocus
          />
          <button type="submit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="22" y2="22" />
            </svg>
          </button>
        </form>
      </div>

      {loading && (
        <div className="search-page__grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="movie-card-skeleton search-skeleton" />
          ))}
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <div className="search-page__empty">
          <span>😕</span>
          <p>No results for "<strong>{query}</strong>"</p>
          <p>Try a different title or keyword.</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          <p className="search-page__count">
            {results.length} result{results.length !== 1 ? 's' : ''} for "<strong>{query}</strong>"
          </p>
          <div className="search-page__grid">
            {results.map(m => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        </>
      )}

      {!query && !loading && (
        <div className="search-page__empty">
          <span>🎬</span>
          <p>Search for any movie to get started</p>
        </div>
      )}
    </div>
  )
}
