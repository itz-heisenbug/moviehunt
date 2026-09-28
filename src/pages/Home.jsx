import { useFetch } from '../hooks/useFetch'
import { moviesApi, tvApi } from '../api/tmdb'
import Hero from '../components/Hero'
import MovieRow from '../components/MovieRow'
import './Home.css'

export default function Home() {
  const trending    = useFetch(() => moviesApi.trending('week'), [])
  const popular     = useFetch(() => moviesApi.popular(), [])
  const topRated    = useFetch(() => moviesApi.topRated(), [])
  const nowPlaying  = useFetch(() => moviesApi.nowPlaying(), [])
  const upcoming    = useFetch(() => moviesApi.upcoming(), [])
  const tvTrending  = useFetch(() => tvApi.trending('week'), [])
  const tvPopular   = useFetch(() => tvApi.popular(), [])
  const tvOnAir     = useFetch(() => tvApi.onAir(), [])

  return (
    <div className="home">
      <Hero movies={trending.data?.results || []} />

      <div className="home__rows">
        <MovieRow title="🔥 Trending Movies"     movies={trending.data?.results   || []} loading={trending.loading}   mediaType="movie" />
        <MovieRow title="📺 Trending TV Shows"   movies={tvTrending.data?.results || []} loading={tvTrending.loading}  mediaType="tv"    />
        <MovieRow title="🎬 Now Playing"          movies={nowPlaying.data?.results || []} loading={nowPlaying.loading}  mediaType="movie" />
        <MovieRow title="📡 TV Shows On Air"      movies={tvOnAir.data?.results    || []} loading={tvOnAir.loading}     mediaType="tv"    />
        <MovieRow title="⭐ Top Rated Movies"     movies={topRated.data?.results   || []} loading={topRated.loading}   mediaType="movie" />
        <MovieRow title="🌟 Popular TV Shows"     movies={tvPopular.data?.results  || []} loading={tvPopular.loading}   mediaType="tv"    />
        <MovieRow title="🍿 Popular Movies"       movies={popular.data?.results    || []} loading={popular.loading}    mediaType="movie" />
        <MovieRow title="📅 Upcoming Movies"      movies={upcoming.data?.results   || []} loading={upcoming.loading}   mediaType="movie" />
      </div>
    </div>
  )
}
