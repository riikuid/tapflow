import type { AgentResources } from '@/lib/types'

export const RESOURCE_WARN_THRESHOLD = 70
export const RESOURCE_BLOCK_THRESHOLD = 80
/** A report older than this is treated as absent. One value for the QA Session cards and the Host Resources
 *  live head, so a host is not live on one page and stale on the other. */
export const RESOURCE_STALE_MS = 30_000

export type ResourceHealth = 'unknown' | 'healthy' | 'warning' | 'overloaded'

/** The block threshold the relay enforces (`TAPFLOW_RESOURCE_THRESHOLD_PERCENT`, stamped on each report),
 *  or the historical 80% for a relay that does not send it. */
export function blockThresholdOf(res: AgentResources | undefined): number {
  const t = res?.blockThreshold
  return typeof t === 'number' && Number.isFinite(t) ? t : RESOURCE_BLOCK_THRESHOLD
}

export function getResourceHealth(
  res: AgentResources | undefined,
  isStale: boolean,
): ResourceHealth {
  if (!res || isStale) return 'unknown'
  const block = blockThresholdOf(res)
  const warn = Math.min(RESOURCE_WARN_THRESHOLD, block - 10)
  const memPercent = (res.memUsedMB / res.memTotalMB) * 100
  if (res.cpuPercent > block || memPercent > block) return 'overloaded'
  if (res.cpuPercent >= warn || memPercent >= warn) return 'warning'
  return 'healthy'
}
