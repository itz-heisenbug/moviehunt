// TMDB API configuration
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE = 'https://image.tmdb.org/t/p'

// Free public demo key – replace with your own at https://www.themoviedb.org/settings/api
const API_KEY = '8265bd1679663a7ea12ac168da84d2e8'

export const IMG = {
  poster:   (path, size = 'w342')  => path ? `${IMAGE_BASE}/${size}${path}` : null,
  backdrop: (path, size = 'w1280') => path ? `${IMAGE_BASE}/${size}${path}` : null,
  profile:  (path, size = 'w185')  => path ? `${IMAGE_BASE}/${size}${path}` : null,
}

async function tmdb(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`)
  url.searchParams.set('api_key', API_KEY)
  url.searchParams.set('language', 'en-US')
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url)
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`)
  return res.json()
}

// ── Movies ───────────────────────────────────────────────────────────────────
export const moviesApi = {
  trending:   (time = 'week') => tmdb(`/trending/movie/${time}`),
  popular:    (page = 1)      => tmdb('/movie/popular',    { page }),
  topRated:   (page = 1)      => tmdb('/movie/top_rated',  { page }),
  nowPlaying: (page = 1)      => tmdb('/movie/now_playing',{ page }),
  upcoming:   (page = 1)      => tmdb('/movie/upcoming',   { page }),
  details:    (id)            => tmdb(`/movie/${id}`, { append_to_response: 'credits,videos,similar,recommendations' }),
  search:     (query, page=1) => tmdb('/search/movie', { query, page }),
  genres:     ()              => tmdb('/genre/movie/list'),
  byGenre:    (genreId, page=1) => tmdb('/discover/movie', { with_genres: genreId, sort_by: 'popularity.desc', page }),
}

// ── TV Shows ─────────────────────────────────────────────────────────────────
export const tvApi = {
  trending:  (time = 'week') => tmdb(`/trending/tv/${time}`),
  popular:   (page = 1)      => tmdb('/tv/popular',    { page }),
  topRated:  (page = 1)      => tmdb('/tv/top_rated',  { page }),
  onAir:     (page = 1)      => tmdb('/tv/on_the_air', { page }),
  airingToday:(page = 1)     => tmdb('/tv/airing_today',{ page }),
  details:   (id)            => tmdb(`/tv/${id}`, { append_to_response: 'credits,similar,recommendations' }),
  season:    (id, num)       => tmdb(`/tv/${id}/season/${num}`),
  search:    (query, page=1) => tmdb('/search/tv', { query, page }),
}

// ── Multi-search & All ───────────────────────────────────────────────────────
export const multiSearch = (query, page = 1) => tmdb('/search/multi', { query, page })
export const allTrending = (time = 'week') => tmdb(`/trending/all/${time}`)

// Legacy default export for backward compatibility
const api = {
  ...moviesApi,
  trending: moviesApi.trending,
}
export default api

