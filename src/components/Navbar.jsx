import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useList } from '../context/ListContext'
import './Navbar.css'

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [searchOpen,  setSearchOpen]  = useState(false)
  const [query,       setQuery]       = useState('')
  const searchRef = useRef(null)
  const navigate  = useNavigate()
  const location  = useLocation()

  const { watchLater, favourites } = useList()
  const myListCount = watchLater.length + favourites.length

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus()
  }, [searchOpen])

  useEffect(() => { setMenuOpen(false) }, [location])

  function handleSearch(e) {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setSearchOpen(false)
      setQuery('')
    }
  }

  function isActive(path) {
    return location.pathname === path ? 'active' : ''
  }

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__left">
        <Link to="/" className="navbar__logo">
          <span className="logo-icon">🎬</span>
          <span className="logo-text">MovieHunt</span>
        </Link>
        <ul className={`navbar__links ${menuOpen ? 'open' : ''}`}>
          <li><Link to="/"         className={isActive('/')}>Home</Link></li>
          <li><Link to="/tvshows"  className={isActive('/tvshows')}>TV Shows</Link></li>
          <li><Link to="/trending" className={isActive('/trending')}>Trending</Link></li>
          <li>
            <Link to="/mylist" className={`mylist-link ${isActive('/mylist')}`}>
              My List
              {myListCount > 0 && (
                <span className="navbar__badge">{myListCount}</span>
              )}
            </Link>
          </li>
        </ul>
      </div>

      <div className="navbar__right">
        <form
          className={`navbar__search ${searchOpen ? 'navbar__search--open' : ''}`}
          onSubmit={handleSearch}
        >
          <input
            ref={searchRef}
            type="text"
            placeholder="Movies, shows, people..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button type="submit" aria-label="search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/>
            </svg>
          </button>
        </form>

        {!searchOpen && (
          <button className="navbar__search-toggle" onClick={() => setSearchOpen(true)} aria-label="open search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/>
            </svg>
          </button>
        )}

        <button
          className={`navbar__burger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}
