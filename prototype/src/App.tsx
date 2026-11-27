import { useEffect, useState } from 'react'
import Hub from './Hub'
import Tracker from './Tracker'
import Fraud from './Fraud'

export default function App() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const on = () => {
      setHash(window.location.hash)
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  if (hash.startsWith('#/fraud')) return <Fraud />
  if (hash.startsWith('#/tracker')) return <Tracker />
  return <Hub />
}
