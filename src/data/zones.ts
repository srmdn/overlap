export interface Zone {
  id: string
  label: string
  tz: string
  flag: string
}

export const ZONES: Zone[] = [
  { id: 'ny',      label: 'New York', tz: 'America/New_York',   flag: '🇺🇸' },
  { id: 'london',  label: 'London',   tz: 'Europe/London',      flag: '🇬🇧' },
  { id: 'jakarta', label: 'Jakarta',  tz: 'Asia/Jakarta',       flag: '🇮🇩' },
  { id: 'sydney',  label: 'Sydney',   tz: 'Australia/Sydney',   flag: '🇦🇺' },
]
