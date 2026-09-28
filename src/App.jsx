import { Routes, Route } from 'react-router-dom'
import { ListProvider } from './context/ListContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import MoviePlayer from './pages/MoviePlayer'
import TVPlayer from './pages/TVPlayer'
import TVShows from './pages/TVShows'
import Search from './pages/Search'
import Trending from './pages/Trending'
import MyList from './pages/MyList'
import './App.css'

function App() {
  return (
    <ListProvider>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/movie/:id" element={<MoviePlayer />} />
          <Route path="/tv/:id"    element={<TVPlayer />} />
          <Route path="/tvshows"   element={<TVShows />} />
          <Route path="/search"    element={<Search />} />
          <Route path="/trending"  element={<Trending />} />
          <Route path="/mylist"    element={<MyList />} />
        </Routes>
      </div>
    </ListProvider>
  )
}

export default App
