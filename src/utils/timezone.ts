export type AwakeStatus = 'working' | 'early' | 'late' | 'sleeping'

export function getTimeInZone(date: Date, tz: string) {
  const time = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)

  const dateStr = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date)

  const hourStr = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: 'numeric',
    hour12: false,
  }).format(date)

  const hour = parseInt(hourStr) % 24

  return { time, dateStr, hour }
}

export function getAwakeStatus(hour: number): AwakeStatus {
  if (hour >= 9 && hour < 18) return 'working'
  if (hour >= 7 && hour < 9)  return 'early'
  if (hour >= 18 && hour < 21) return 'late'
  return 'sleeping'
}

export const AWAKE_CONFIG: Record<AwakeStatus, { label: string; dot: string; text: string }> = {
  working:  { label: 'Likely working',  dot: 'bg-emerald-400', text: 'text-emerald-400' },
  early:    { label: 'Early hours',     dot: 'bg-yellow-400',  text: 'text-yellow-400'  },
  late:     { label: 'After work',      dot: 'bg-orange-400',  text: 'text-orange-400'  },
  sleeping: { label: 'Likely sleeping', dot: 'bg-red-500',     text: 'text-red-400'     },
}

export function convertTime(timeStr: string, fromTz: string, toTz: string): string {
  const [hourStr, minuteStr] = timeStr.split(':')
  const hour = parseInt(hourStr)
  const minute = parseInt(minuteStr)

  const now = new Date()
  // Build a date in the source timezone at the given time
  const sourceFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: fromTz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const [year, month, day] = sourceFormatter.format(now).split('-').map(Number)

  // Create a UTC date that corresponds to the given local time in fromTz
  const utcDate = new Date(`${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}T${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}:00`)

  const offsetFrom = getTimezoneOffset(fromTz, utcDate)
  const adjusted = new Date(utcDate.getTime() - offsetFrom)

  return new Intl.DateTimeFormat('en-US', {
    timeZone: toTz,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(adjusted)
}

function getTimezoneOffset(tz: string, date: Date): number {
  const utcStr = date.toLocaleString('en-US', { timeZone: 'UTC' })
  const tzStr  = date.toLocaleString('en-US', { timeZone: tz })
  return new Date(utcStr).getTime() - new Date(tzStr).getTime()
}
