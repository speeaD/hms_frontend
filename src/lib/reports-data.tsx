export interface RevenuePoint {
  label: string
  value: number
}

export interface RevenueSourceSlice {
  source: string
  value: number
  pct: number
  color: string
}

export interface ReportsData {
  dateRangeLabel: string
  stats: {
    totalRevenue: { value: number; deltaPct: number }
    occupancyRate: { value: number; deltaPct: number }
    adr: { value: number; deltaPct: number }
    revpar: { value: number; deltaPct: number }
  }
  dailyRevenue: RevenuePoint[]
  monthlyRevenue: RevenuePoint[]
  revenueBySource: RevenueSourceSlice[]
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// TODO: replace with real analytics/DB aggregation, e.g. `return db.reports.forRange(...)`.
// Kept async + same return shape so swapping the implementation is a one-line change.
export async function getReportsData(): Promise<ReportsData> {
  const daysInMonth = 31
  const dailyRevenue: RevenuePoint[] = Array.from({ length: daysInMonth }, (_, i) => {
    const base = 550000
    const wave = Math.sin(i / 2.3) * 220000
    const noise = (seededRandom(i + 1) - 0.5) * 180000
    const value = Math.max(150000, Math.round(base + wave + noise))
    return { label: `Oct ${i + 1}`, value }
  })

  const monthlyRevenue: RevenuePoint[] = [
    { label: 'May', value: 6120000 },
    { label: 'Jun', value: 6540000 },
    { label: 'Jul', value: 7010000 },
    { label: 'Aug', value: 7480000 },
    { label: 'Sep', value: 7290000 },
    { label: 'Oct', value: 8645000 },
  ]

  const totalRevenue = dailyRevenue.reduce((sum, d) => sum + d.value, 0)

  const revenueBySource: RevenueSourceSlice[] = [
    { source: 'Walk-in', value: 3245000, pct: 37.5, color: '#3B5BDB' },
    { source: 'Online', value: 2867000, pct: 33.1, color: '#8B5CF6' },
    { source: 'Phone', value: 1456000, pct: 16.8, color: '#F59E0B' },
    { source: 'OTA', value: 1077000, pct: 12.5, color: '#60A5FA' },
  ]

  return {
    dateRangeLabel: 'Oct 1, 2025 – Oct 31, 2025',
    stats: {
      totalRevenue: { value: totalRevenue, deltaPct: 18.6 },
      occupancyRate: { value: 72.4, deltaPct: 8.3 },
      adr: { value: 72500, deltaPct: 11.2 },
      revpar: { value: 52490, deltaPct: 21.7 },
    },
    dailyRevenue,
    monthlyRevenue,
    revenueBySource,
  }
}