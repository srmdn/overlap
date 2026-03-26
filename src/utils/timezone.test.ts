import { describe, it, expect } from 'vitest'
import { getAwakeStatus, getTimeInZone } from './timezone'

describe('getAwakeStatus', () => {
  it('returns "working" for standard office hours', () => {
    expect(getAwakeStatus(9)).toBe('working')
    expect(getAwakeStatus(12)).toBe('working')
    expect(getAwakeStatus(17)).toBe('working')
  })

  it('returns "early" for early morning hours', () => {
    expect(getAwakeStatus(7)).toBe('early')
    expect(getAwakeStatus(8)).toBe('early')
  })

  it('returns "late" for after-work hours', () => {
    expect(getAwakeStatus(18)).toBe('late')
    expect(getAwakeStatus(20)).toBe('late')
  })

  it('returns "sleeping" for night hours', () => {
    expect(getAwakeStatus(0)).toBe('sleeping')
    expect(getAwakeStatus(3)).toBe('sleeping')
    expect(getAwakeStatus(6)).toBe('sleeping')
    expect(getAwakeStatus(21)).toBe('sleeping')
    expect(getAwakeStatus(23)).toBe('sleeping')
  })
})

describe('getTimeInZone', () => {
  it('returns time, dateStr, and hour for a valid timezone', () => {
    const now = new Date()
    const result = getTimeInZone(now, 'Asia/Jakarta')
    expect(result.time).toBeTruthy()
    expect(result.dateStr).toBeTruthy()
    expect(result.hour).toBeGreaterThanOrEqual(0)
    expect(result.hour).toBeLessThan(24)
  })

  it('returns different hours for different timezones', () => {
    const now = new Date('2024-01-15T12:00:00Z')
    const jakarta = getTimeInZone(now, 'Asia/Jakarta')   // UTC+7
    const london  = getTimeInZone(now, 'Europe/London')  // UTC+0
    expect(jakarta.hour).not.toBe(london.hour)
  })

  it('returns hour within valid 0-23 range', () => {
    const timezones = ['America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney']
    const now = new Date()
    for (const tz of timezones) {
      const result = getTimeInZone(now, tz)
      expect(result.hour, `hour out of range for ${tz}`).toBeGreaterThanOrEqual(0)
      expect(result.hour, `hour out of range for ${tz}`).toBeLessThan(24)
    }
  })
})
