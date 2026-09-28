import { useList } from '../context/ListContext'
import './ListButtons.css'

/**
 * Renders ❤ Favourite  +  🕐 Watch Later toggle buttons.
 *
 * `item` should be a plain object with at minimum:
 *   { id, mediaType, title, poster_path, vote_average }
 */
export default function ListButtons({ item, size = 'normal' }) {
  const { inFavourites, inWatchLater, toggleFavourite, toggleWatchLater } = useList()

  const isFav  = inFavourites(item.id)
  const isWL   = inWatchLater(item.id)

  function stopProp(e) { e.stopPropagation() }

  return (
    <div className={`list-btns list-btns--${size}`} onClick={stopProp}>
      <button
        className={`list-btn list-btn--fav ${isFav ? 'active' : ''}`}
        onClick={() => toggleFavourite(item)}
        title={isFav ? 'Remove from Favourites' : 'Add to Favourites'}
        aria-label={isFav ? 'Remove from Favourites' : 'Add to Favourites'}
      >
        <svg viewBox="0 0 24 24" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <span>{isFav ? 'Unfav' : 'Favourite'}</span>
      </button>

      <button
        className={`list-btn list-btn--wl ${isWL ? 'active' : ''}`}
        onClick={() => toggleWatchLater(item)}
        title={isWL ? 'Remove from Watch Later' : 'Save to Watch Later'}
        aria-label={isWL ? 'Remove from Watch Later' : 'Save to Watch Later'}
      >
        <svg viewBox="0 0 24 24" fill={isWL ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        <span>{isWL ? 'Saved' : 'Watch Later'}</span>
      </button>
    </div>
  )
}
