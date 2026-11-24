import { useEffect, useState } from 'react'
import Tracker from './Tracker'
import Fraud from './Fraud'

export default function App() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const on = () => setHash(window.location.hash)
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return hash.startsWith('#/fraud') ? <Fraud /> : <Tracker />
}
