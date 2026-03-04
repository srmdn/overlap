import type { Zone } from '../data/zones'
import { getTimeInZone, getAwakeStatus, AWAKE_CONFIG } from '../utils/timezone'

interface Props {
  zone: Zone
  date: Date
  isLocal?: boolean
}

export default function ZoneCard({ zone, date, isLocal }: Props) {
  const { time, dateStr, hour } = getTimeInZone(date, zone.tz)
  const status = getAwakeStatus(hour)
  const config = AWAKE_CONFIG[status]

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-3 hover:border-zinc-700 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{zone.flag}</span>
          <div>
            <p className="text-sm font-medium text-zinc-300">{zone.label}</p>
            {isLocal && <p className="text-xs text-zinc-600">Your timezone</p>}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${config.dot}`} />
          <span className={`text-xs font-medium ${config.text}`}>{config.label}</span>
        </div>
      </div>

      <div>
        <p className="text-3xl font-semibold text-white tracking-tight">{time}</p>
        <p className="text-sm text-zinc-500 mt-0.5">{dateStr}</p>
      </div>
    </div>
  )
}
