import { createContext, useContext, useState, useCallback } from 'react'

const ListContext = createContext(null)

function load(key) {
  try { return JSON.parse(localStorage.getItem(key)) || [] }
  catch { return [] }
}

function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

export function ListProvider({ children }) {
  const [watchLater,  setWL]  = useState(() => load('mh_watchLater'))
  const [favourites,  setFav] = useState(() => load('mh_favourites'))

  /* ── helpers ── */
  const inWatchLater  = useCallback(id => watchLater.some(x => x.id === id),  [watchLater])
  const inFavourites  = useCallback(id => favourites.some(x => x.id === id),  [favourites])

  const toggleWatchLater = useCallback(item => {
    setWL(prev => {
      const next = prev.some(x => x.id === item.id)
        ? prev.filter(x => x.id !== item.id)
        : [item, ...prev]
      save('mh_watchLater', next)
      return next
    })
  }, [])

  const toggleFavourite = useCallback(item => {
    setFav(prev => {
      const next = prev.some(x => x.id === item.id)
        ? prev.filter(x => x.id !== item.id)
        : [item, ...prev]
      save('mh_favourites', next)
      return next
    })
  }, [])

  return (
    <ListContext.Provider value={{ watchLater, favourites, inWatchLater, inFavourites, toggleWatchLater, toggleFavourite }}>
      {children}
    </ListContext.Provider>
  )
}

export function useList() {
  const ctx = useContext(ListContext)
  if (!ctx) throw new Error('useList must be used inside <ListProvider>')
  return ctx
}
