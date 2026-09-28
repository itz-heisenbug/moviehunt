import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useList } from '../context/ListContext'
import { IMG } from '../api/tmdb'
import './MyList.css'

const TABS = ['All', 'Favourites', 'Watch Later']

export default function MyList() {
  const [tab, setTab] = useState('All')
  const { watchLater, favourites, toggleWatchLater, toggleFavourite, inFavourites, inWatchLater } = useList()
  const navigate = useNavigate()

  // Merge and de-duplicate for "All" tab
  const allItems = [
    ...favourites.map(x => ({ ...x, _isFav: true })),
    ...watchLater.filter(w => !favourites.some(f => f.id === w.id)).map(x => ({ ...x, _isWL: true })),
  ]

  const items =
    tab === 'Favourites'   ? favourites.map(x => ({ ...x, _isFav: true })) :
    tab === 'Watch Later'  ? watchLater.map(x => ({ ...x, _isWL: true }))  :
    allItems

  return (
    <div className="mylist-page">
      <div className="mylist-page__header">
        <h1>My List</h1>
        <p>{allItems.length} item{allItems.length !== 1 ? 's' : ''} saved</p>
      </div>

      {/* Tabs */}
      <div className="mylist-tabs">
        {TABS.map(t => (
          <button
            key={t}
            className={`mylist-tab ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'Favourites'  && '❤ '}
            {t === 'Watch Later' && '🕐 '}
            {t}
            <span className="mylist-tab__count">
              {t === 'Favourites'  ? favourites.length  :
               t === 'Watch Later' ? watchLater.length  :
               allItems.length}
            </span>
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="mylist-empty">
          <span>{tab === 'Favourites' ? '❤️' : tab === 'Watch Later' ? '🕐' : '🎬'}</span>
          <h2>Nothing here yet</h2>
          <p>
            {tab === 'Favourites'  ? 'Heart movies and shows to save them here.' :
             tab === 'Watch Later' ? 'Tap the clock icon on any title to save it for later.' :
             'Browse movies and shows and start saving your favourites!'}
          </p>
          <button onClick={() => navigate('/')}>Browse Now</button>
        </div>
      ) : (
        <div className="mylist-grid">
          {items.map(item => {
            const isFav = inFavourites(item.id)
            const isWL  = inWatchLater(item.id)
            const route = item.mediaType === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`

            return (
              <div key={`${item.id}-${item.mediaType}`} className="mylist-card" onClick={() => navigate(route)}>
                <div className="mylist-card__img-wrap">
                  <img
                    src={IMG.poster(item.poster_path) || 'https://via.placeholder.com/342x513?text=No+Image'}
                    alt={item.title}
                    loading="lazy"
                    onError={e => { e.target.src = 'https://via.placeholder.com/342x513?text=No+Image' }}
                  />
                  <div className="mylist-card__badges">
                    {item.mediaType === 'tv' && <span className="badge-type tv">TV</span>}
                    {isFav && <span className="badge-type fav">❤</span>}
                    {isWL  && <span className="badge-type wl">🕐</span>}
                  </div>
                  <div className="mylist-card__overlay">
                    <button className="mylist-card__play">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    </button>
                  </div>
                </div>

                <div className="mylist-card__info">
                  <h3 className="mylist-card__title">{item.title}</h3>
                  <div className="mylist-card__meta">
                    {item.release_date?.slice(0,4) && <span>{item.release_date.slice(0,4)}</span>}
                    {item.vote_average > 0 && <span>⭐ {item.vote_average.toFixed(1)}</span>}
                  </div>
                  <div className="mylist-card__actions" onClick={e => e.stopPropagation()}>
                    <button
                      className={`mylist-action-btn ${isFav ? 'fav-active' : ''}`}
                      onClick={() => toggleFavourite(item)}
                      title={isFav ? 'Remove from Favourites' : 'Add to Favourites'}
                    >
                      <svg viewBox="0 0 24 24" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </button>
                    <button
                      className={`mylist-action-btn ${isWL ? 'wl-active' : ''}`}
                      onClick={() => toggleWatchLater(item)}
                      title={isWL ? 'Remove from Watch Later' : 'Watch Later'}
                    >
                      <svg viewBox="0 0 24 24" fill={isWL ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                    </button>
                    <button
                      className="mylist-action-btn remove-btn"
                      onClick={() => {
                        if (isFav) toggleFavourite(item)
                        if (isWL)  toggleWatchLater(item)
                      }}
                      title="Remove from all lists"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
