import { useEffect, useState } from 'react'
import { ZONES } from './data/zones'
import { getTimeInZone } from './utils/timezone'
import ZoneCard from './components/ZoneCard'
import TimeConverter from './components/TimeConverter'

const LOCAL_TZ = Intl.DateTimeFormat().resolvedOptions().timeZone

export default function App() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const { time: localTime, dateStr: localDate } = getTimeInZone(now, LOCAL_TZ)

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-white tracking-tight">Overlap</h1>
          <p className="text-zinc-500 text-sm mt-1">See what time it is for your global team — right now.</p>
        </div>

        {/* Local time hero */}
        <div className="mb-8">
          <p className="text-6xl font-bold text-white tracking-tighter">{localTime}</p>
          <p className="text-zinc-500 mt-1">{localDate} · {LOCAL_TZ}</p>
        </div>

        {/* Zone cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {ZONES.map(zone => (
            <ZoneCard key={zone.id} zone={zone} date={now} />
          ))}
        </div>

        {/* Time converter */}
        <TimeConverter />

        {/* Footer */}
        <p className="text-center text-zinc-700 text-xs mt-10">
          Open source ·{' '}
          <a href="https://github.com/srmdn/overlap" className="hover:text-zinc-500 transition-colors">
            github.com/srmdn/overlap
          </a>
        </p>
      </div>
    </div>
  )
}
