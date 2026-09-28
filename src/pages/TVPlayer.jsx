import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { tvApi, IMG } from '../api/tmdb'
import { useList } from '../context/ListContext'
import ListButtons from '../components/ListButtons'
import MovieCard from '../components/MovieCard'
import './TVPlayer.css'

export default function TVPlayer() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const { data: show, loading, error } = useFetch(() => tvApi.details(id), [id])

  const [selectedSeason,  setSelectedSeason]  = useState(1)
  const [selectedEpisode, setSelectedEpisode] = useState(1)
  const [playerActive,    setPlayerActive]    = useState(false)
  const [seasonData,      setSeasonData]      = useState(null)
  const [seasonLoading,   setSeasonLoading]   = useState(false)

  // When show loads, default to first real season (skip season 0 "Specials")
  useEffect(() => {
    if (!show) return
    const firstSeason = show.seasons?.find(s => s.season_number > 0)
    if (firstSeason) setSelectedSeason(firstSeason.season_number)
  }, [show])

  // Fetch season details whenever season changes
  useEffect(() => {
    if (!id || !selectedSeason) return
    setSeasonLoading(true)
    setSelectedEpisode(1)
    setPlayerActive(false)
    tvApi.season(id, selectedSeason)
      .then(data => setSeasonData(data))
      .catch(() => setSeasonData(null))
      .finally(() => setSeasonLoading(false))
  }, [id, selectedSeason])

  if (loading) return (
    <div className="tv-page tv-page--loading"><div className="spinner" /></div>
  )
  if (error || !show) return (
    <div className="tv-page tv-page--error">
      <h2>😕 Show not found</h2>
      <button onClick={() => navigate('/tvshows')}>Browse TV Shows</button>
    </div>
  )

  const backdrop   = IMG.backdrop(show.backdrop_path, 'original')
  const poster     = IMG.poster(show.poster_path, 'w500')
  const year       = show.first_air_date?.slice(0, 4)
  const rating     = show.vote_average?.toFixed(1)
  const genres     = show.genres?.map(g => g.name).join(' • ')
  const cast       = show.credits?.cast?.slice(0, 8) || []
  const realSeasons = show.seasons?.filter(s => s.season_number > 0) || []
  const episodes   = seasonData?.episodes || []
  const similar    = [
    ...(show.recommendations?.results || []),
    ...(show.similar?.results || []),
  ].slice(0, 16)

  // vidsrc.sh embed format: /embed/tv/{id}/{season}/{episode}
  const embedUrl = `https://vidsrc.sh/embed/tv/${id}/${selectedSeason}/${selectedEpisode}`

  const listItem = {
    id: show.id,
    mediaType: 'tv',
    title: show.name,
    poster_path: show.poster_path,
    vote_average: show.vote_average,
    release_date: show.first_air_date,
  }

  function handleEpisodeClick(epNum) {
    setSelectedEpisode(epNum)
    setPlayerActive(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="tv-page">
      {/* ── Player ── */}
      <div className="tv-player-section">
        {playerActive ? (
          <div className="tv-embed">
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; fullscreen"
              title={`${show.name} S${selectedSeason}E${selectedEpisode}`}
            />
          </div>
        ) : (
          <div
            className="tv-thumbnail"
            style={{ backgroundImage: `url(${backdrop})` }}
            onClick={() => setPlayerActive(true)}
          >
            <div className="tv-thumbnail__overlay" />
            <button className="tv-thumbnail__play">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </button>
            <div className="tv-thumbnail__label">
              S{selectedSeason} · E{selectedEpisode} — Click to Watch
            </div>
          </div>
        )}

        {/* Season / Episode selectors overlaid at the bottom */}
        <div className="tv-selectors">
          <label>
            <span>Season</span>
            <select
              value={selectedSeason}
              onChange={e => setSelectedSeason(Number(e.target.value))}
            >
              {realSeasons.map(s => (
                <option key={s.season_number} value={s.season_number}>
                  Season {s.season_number} {s.name && s.name !== `Season ${s.season_number}` ? `— ${s.name}` : ''}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Episode</span>
            <select
              value={selectedEpisode}
              onChange={e => { setSelectedEpisode(Number(e.target.value)); setPlayerActive(true) }}
            >
              {episodes.map(ep => (
                <option key={ep.episode_number} value={ep.episode_number}>
                  E{ep.episode_number} — {ep.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* ── Show Details ── */}
      <div className="tv-details">
        <div className="tv-details__poster-col">
          <img
            src={poster}
            alt={show.name}
            onError={e => { e.target.src = 'https://via.placeholder.com/500x750?text=No+Image' }}
          />
        </div>

        <div className="tv-details__info">
          <div className="tv-details__badge">
            <span className="badge-tv">TV Show</span>
            {show.status && <span className="badge-status">{show.status}</span>}
          </div>

          <h1>{show.name}</h1>

          {show.tagline && <p className="tv-tagline">"{show.tagline}"</p>}

          <div className="tv-meta">
            {year && <span className="tag">{year}</span>}
            {show.number_of_seasons && (
              <span className="tag">{show.number_of_seasons} Season{show.number_of_seasons > 1 ? 's' : ''}</span>
            )}
            {show.number_of_episodes && (
              <span className="tag">{show.number_of_episodes} Episodes</span>
            )}
            {rating && <span className="tag tag--accent">⭐ {rating}</span>}
          </div>

          {genres && <p className="tv-genres">{genres}</p>}
          <p className="tv-overview">{show.overview}</p>

          <div className="tv-actions">
            <button
              className="tv-watch-btn"
              onClick={() => { setPlayerActive(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              {playerActive ? 'Now Playing' : `Watch S${selectedSeason}E${selectedEpisode}`}
            </button>
            <ListButtons item={listItem} />
          </div>

          {/* Cast */}
          {cast.length > 0 && (
            <div className="tv-cast">
              <h3>Cast</h3>
              <div className="tv-cast__list">
                {cast.map(c => (
                  <div key={c.id} className="tv-cast__item">
                    {c.profile_path ? (
                      <img src={IMG.profile(c.profile_path)} alt={c.name}
                        onError={e => { e.target.style.display = 'none' }} />
                    ) : (
                      <div className="tv-cast__avatar">{c.name[0]}</div>
                    )}
                    <span className="tv-cast__name">{c.name}</span>
                    <span className="tv-cast__char">{c.character}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Episode List ── */}
      <div className="tv-episodes">
        <div className="tv-episodes__header">
          <h2>Season {selectedSeason} Episodes</h2>
          {seasonLoading && <div className="spinner-sm" />}
        </div>

        {!seasonLoading && episodes.length > 0 && (
          <div className="tv-episodes__grid">
            {episodes.map(ep => (
              <div
                key={ep.episode_number}
                className={`ep-card ${selectedEpisode === ep.episode_number && playerActive ? 'ep-card--active' : ''}`}
                onClick={() => handleEpisodeClick(ep.episode_number)}
              >
                <div className="ep-card__thumb">
                  {ep.still_path ? (
                    <img
                      src={IMG.backdrop(ep.still_path, 'w300')}
                      alt={ep.name}
                      loading="lazy"
                    />
                  ) : (
                    <div className="ep-card__no-thumb">🎬</div>
                  )}
                  <div className="ep-card__play-overlay">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                  <span className="ep-card__num">E{ep.episode_number}</span>
                </div>
                <div className="ep-card__info">
                  <strong className="ep-card__title">{ep.name}</strong>
                  {ep.runtime && <span className="ep-card__runtime">{ep.runtime}m</span>}
                  {ep.vote_average > 0 && (
                    <span className="ep-card__rating">⭐ {ep.vote_average.toFixed(1)}</span>
                  )}
                  <p className="ep-card__overview">
                    {ep.overview?.slice(0, 120)}{ep.overview?.length > 120 ? '…' : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Similar Shows ── */}
      {similar.length > 0 && (
        <div className="tv-similar">
          <h2>You May Also Like</h2>
          <div className="tv-similar__grid">
            {similar.map(m => (
              <MovieCard key={m.id} movie={m} mediaType="tv" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
