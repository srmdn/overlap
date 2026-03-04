import { useState } from 'react'
import { ZONES } from '../data/zones'
import { getTimeInZone, getAwakeStatus, AWAKE_CONFIG } from '../utils/timezone'

const LOCAL_TZ = Intl.DateTimeFormat().resolvedOptions().timeZone

const ALL_ZONES = [
  { id: 'local', label: `Local (${LOCAL_TZ})`, tz: LOCAL_TZ, flag: '📍' },
  ...ZONES,
]

export default function TimeConverter() {
  const [time, setTime] = useState('09:00')
  const [fromTz, setFromTz] = useState(LOCAL_TZ)

  // Build a fake Date that represents the selected time in fromTz
  function buildDate(): Date {
    const [h, m] = time.split(':').map(Number)
    const now = new Date()
    const localDateStr = new Intl.DateTimeFormat('en-CA', {
      timeZone: fromTz,
      year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(now)

    // We create a "local" date as if it's in UTC, then offset
    const naive = new Date(`${localDateStr}T${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:00Z`)
    const utcMs  = naive.getTime()
    const tzOffsetMs = getOffset(fromTz, naive)
    return new Date(utcMs + tzOffsetMs)
  }

  function getOffset(tz: string, ref: Date): number {
    const a = new Date(ref.toLocaleString('en-US', { timeZone: 'UTC' }))
    const b = new Date(ref.toLocaleString('en-US', { timeZone: tz }))
    return a.getTime() - b.getTime()
  }

  const converted = buildDate()

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-4">
        Time Converter
      </h2>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-500">Time</label>
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-500">From timezone</label>
          <select
            value={fromTz}
            onChange={e => setFromTz(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
          >
            {ALL_ZONES.map(z => (
              <option key={z.id} value={z.tz}>{z.flag} {z.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ALL_ZONES.filter(z => z.tz !== fromTz).map(zone => {
          const { time: t, dateStr, hour } = getTimeInZone(converted, zone.tz)
          const status = getAwakeStatus(hour)
          const config = AWAKE_CONFIG[status]
          return (
            <div key={zone.id} className="bg-zinc-800 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-lg">{zone.flag}</span>
                <span className="text-xs text-zinc-400">{zone.label}</span>
              </div>
              <p className="text-lg font-semibold text-white">{t}</p>
              <p className="text-xs text-zinc-600 mt-0.5">{dateStr}</p>
              <div className="flex items-center gap-1 mt-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                <span className={`text-xs ${config.text}`}>{config.label}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
