import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import api, { IMG } from '../api/tmdb'
import MovieCard from '../components/MovieCard'
import ListButtons from '../components/ListButtons'
import './MoviePlayer.css'


export default function MoviePlayer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [playerActive, setPlayerActive] = useState(false)

  const { data: movie, loading, error } = useFetch(() => api.details(id), [id])

  if (loading) return (
    <div className="player-page player-page--loading">
      <div className="spinner" />
    </div>
  )

  if (error || !movie) return (
    <div className="player-page player-page--error">
      <h2>😕 Movie not found</h2>
      <button onClick={() => navigate('/')}>Go Home</button>
    </div>
  )

  const backdrop = IMG.backdrop(movie.backdrop_path, 'original')
  const poster   = IMG.poster(movie.poster_path, 'w500')
  const year     = movie.release_date?.slice(0, 4)
  const rating   = movie.vote_average?.toFixed(1)
  const runtime  = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null
  const genres   = movie.genres?.map(g => g.name).join(' • ')
  const cast      = movie.credits?.cast?.slice(0, 8) || []
  const similar   = [
    ...(movie.recommendations?.results || []),
    ...(movie.similar?.results || [])
  ].slice(0, 16)

  // IMDb-style tt ID from TMDB external ID isn't available in basic call
  // Use movie ID with vidsrc's TMDB support
  const embedUrl = `https://vidsrc.sh/embed/movie/${movie.imdb_id || id}`

  return (
    <div className="player-page">
      {/* ── Player / Backdrop ── */}
      <div className="player-section">
        {playerActive ? (
          <div className="player-embed">
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; fullscreen"
              title={movie.title}
            />
          </div>
        ) : (
          <div
            className="player-thumbnail"
            style={{ backgroundImage: `url(${backdrop})` }}
            onClick={() => setPlayerActive(true)}
          >
            <div className="player-thumbnail__overlay" />
            <button className="player-thumbnail__play" onClick={() => setPlayerActive(true)}>
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </button>
            <div className="player-thumbnail__label">Click to Watch</div>
          </div>
        )}
      </div>

      {/* ── Details ── */}
      <div className="player-details">
        <div className="player-details__poster-col">
          <img
            src={poster}
            alt={movie.title}
            className="player-details__poster"
            onError={e => { e.target.src = 'https://via.placeholder.com/500x750?text=No+Image' }}
          />
        </div>

        <div className="player-details__info">
          <h1 className="player-details__title">{movie.title}</h1>

          {movie.tagline && (
            <p className="player-details__tagline">"{movie.tagline}"</p>
          )}

          <div className="player-details__meta">
            {year && <span className="tag">{year}</span>}
            {runtime && <span className="tag">{runtime}</span>}
            {rating && <span className="tag tag--accent">⭐ {rating} / 10</span>}
          </div>

          {genres && <p className="player-details__genres">{genres}</p>}

          <p className="player-details__overview">{movie.overview}</p>

          <div className="player-details__actions">
            <button
              className="player-details__watch-btn"
              onClick={() => {
                setPlayerActive(true)
                document.querySelector('.player-section')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              {playerActive ? 'Now Playing' : 'Watch Now'}
            </button>

            <ListButtons item={{
              id: movie.id,
              mediaType: 'movie',
              title: movie.title,
              poster_path: movie.poster_path,
              vote_average: movie.vote_average,
              release_date: movie.release_date,
            }} />
          </div>

          {/* Cast */}

          {cast.length > 0 && (
            <div className="player-cast">
              <h3>Cast</h3>
              <div className="player-cast__list">
                {cast.map(c => (
                  <div key={c.id} className="player-cast__item">
                    {c.profile_path ? (
                      <img
                        src={IMG.profile(c.profile_path)}
                        alt={c.name}
                        onError={e => { e.target.style.display = 'none' }}
                      />
                    ) : (
                      <div className="player-cast__avatar">{c.name[0]}</div>
                    )}
                    <span className="player-cast__name">{c.name}</span>
                    <span className="player-cast__char">{c.character}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Similar / Recommended ── */}
      {similar.length > 0 && (
        <div className="player-similar">
          <h2>You May Also Like</h2>
          <div className="player-similar__grid">
            {similar.map(m => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
