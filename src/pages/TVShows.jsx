import { useFetch } from '../hooks/useFetch'
import { tvApi } from '../api/tmdb'
import MovieCard from '../components/MovieCard'
import MovieRow from '../components/MovieRow'
import './TVShows.css'

export default function TVShows() {
  const popular   = useFetch(() => tvApi.popular(), [])
  const trending  = useFetch(() => tvApi.trending('week'), [])
  const topRated  = useFetch(() => tvApi.topRated(), [])
  const onAir     = useFetch(() => tvApi.onAir(), [])
  const today     = useFetch(() => tvApi.airingToday(), [])

  return (
    <div className="tvshows-page">
      <div className="tvshows-page__hero">
        <h1>📺 TV Shows</h1>
        <p>Discover trending series, top-rated dramas, and must-watch shows.</p>
      </div>

      <div className="tvshows-page__rows">
        <MovieRow
          title="🔥 Trending This Week"
          movies={trending.data?.results || []}
          loading={trending.loading}
          mediaType="tv"
        />
        <MovieRow
          title="📡 Currently On Air"
          movies={onAir.data?.results || []}
          loading={onAir.loading}
          mediaType="tv"
        />
        <MovieRow
          title="☀️ Airing Today"
          movies={today.data?.results || []}
          loading={today.loading}
          mediaType="tv"
        />
        <MovieRow
          title="⭐ Top Rated"
          movies={topRated.data?.results || []}
          loading={topRated.loading}
          mediaType="tv"
        />
        <MovieRow
          title="🌟 Popular Shows"
          movies={popular.data?.results || []}
          loading={popular.loading}
          mediaType="tv"
        />
      </div>
    </div>
  )
}
