import { useNavigate } from 'react-router-dom'
import { IMG } from '../api/tmdb'
import { useList } from '../context/ListContext'
import './MovieCard.css'

export default function MovieCard({ movie, mediaType = 'movie' }) {
  const navigate = useNavigate()
  const { inFavourites, inWatchLater, toggleFavourite, toggleWatchLater } = useList()

  const title    = movie.title || movie.name
  const poster   = IMG.poster(movie.poster_path)
  const year     = (movie.release_date || movie.first_air_date)?.slice(0, 4)
  const rating   = movie.vote_average?.toFixed(1)
  const type     = movie.media_type || mediaType

  const isFav = inFavourites(movie.id)
  const isWL  = inWatchLater(movie.id)

  const listItem = {
    id: movie.id,
    mediaType: type,
    title,
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
    release_date: movie.release_date || movie.first_air_date,
  }

  function go(e) {
    e.stopPropagation()
    navigate(type === 'tv' ? `/tv/${movie.id}` : `/movie/${movie.id}`)
  }

  function onFav(e) { e.stopPropagation(); toggleFavourite(listItem) }
  function onWL(e)  { e.stopPropagation(); toggleWatchLater(listItem) }

  return (
    <div className="movie-card" onClick={go}>
      <div className="movie-card__poster">
        <img
          src={poster || 'https://via.placeholder.com/342x513?text=No+Image'}
          alt={title}
          loading="lazy"
          onError={e => { e.target.src = 'https://via.placeholder.com/342x513?text=No+Image' }}
        />

        {/* Type badge */}
        {type === 'tv' && <span className="movie-card__type-badge">TV</span>}

        <div className="movie-card__overlay">
          <button className="movie-card__play" onClick={go} aria-label="Play">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </button>

          {/* Quick-action icons */}
          <div className="movie-card__actions">
            <button
              className={`movie-card__icon-btn ${isFav ? 'active-fav' : ''}`}
              onClick={onFav}
              title={isFav ? 'Remove from Favourites' : 'Favourite'}
            >
              <svg viewBox="0 0 24 24" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
            <button
              className={`movie-card__icon-btn ${isWL ? 'active-wl' : ''}`}
              onClick={onWL}
              title={isWL ? 'Remove from Watch Later' : 'Watch Later'}
            >
              <svg viewBox="0 0 24 24" fill={isWL ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </button>
          </div>

          <div className="movie-card__info">
            <h4 className="movie-card__title">{title}</h4>
            <div className="movie-card__meta">
              {year && <span>{year}</span>}
              {rating && <span className="movie-card__rating">⭐ {rating}</span>}
            </div>
            <p className="movie-card__overview">
              {movie.overview?.slice(0, 100)}{movie.overview?.length > 100 ? '…' : ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
