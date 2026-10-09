import { describe, it, expect } from 'vitest'
import { getResourceHealth, blockThresholdOf } from '@/lib/resource-health'
import type { AgentResources } from '@/lib/types'

const base: AgentResources = {
  cpuPercent: 30,
  memUsedMB: 840,
  memTotalMB: 1000, // 84%
  slotsAvailable: 1,
  slotsTotal: 1,
  reportedAt: Date.now(),
}

describe('getResourceHealth with the relay-stamped threshold', () => {
  it('falls back to 80% for a relay that does not send blockThreshold', () => {
    expect(blockThresholdOf(base)).toBe(80)
    expect(getResourceHealth(base, false)).toBe('overloaded')
  })

  it('follows the relay threshold, so a host the relay still accepts is not greyed out', () => {
    expect(getResourceHealth({ ...base, blockThreshold: 95 }, false)).toBe('warning')
  })

  it('a lower relay threshold also lowers the warning band below it', () => {
    expect(getResourceHealth({ ...base, memUsedMB: 550, blockThreshold: 60 }, false)).toBe('warning')
    expect(getResourceHealth({ ...base, memUsedMB: 650, blockThreshold: 60 }, false)).toBe('overloaded')
  })
})
