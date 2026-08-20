"use client"

import { useMemo, useState } from "react"
import {
  DollarSign,
  PieChart as PieChartIcon,
  TrendingUp,
  LineChart as LineChartIcon,
  Calendar,
  ChevronDown,
  Download,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import type { ReportsData, RevenuePoint } from "@/lib/reports-data"

interface Props {
  data: ReportsData
}

type Period = 'Daily' | 'Weekly' | 'Monthly'

function formatNaira(value: number, compact = true) {
  if (compact) {
    if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000) return `₦${(value / 1_000).toFixed(0)}K`
    return `₦${value}`
  }
  return `₦${value.toLocaleString()}`
}

function aggregateWeekly(daily: RevenuePoint[]): RevenuePoint[] {
  const weeks: RevenuePoint[] = []
  for (let i = 0; i < daily.length; i += 7) {
    const chunk = daily.slice(i, i + 7)
    const total = chunk.reduce((sum, d) => sum + d.value, 0)
    weeks.push({ label: `Week ${weeks.length + 1}`, value: total })
  }
  return weeks
}

export default function ReportsClient({ data }: Props) {
  const [period, setPeriod] = useState<Period>('Daily')
  const [periodMenuOpen, setPeriodMenuOpen] = useState(false)

  const chartData = useMemo(() => {
    if (period === 'Daily') return data.dailyRevenue
    if (period === 'Weekly') return aggregateWeekly(data.dailyRevenue)
    return data.monthlyRevenue
  }, [period, data])

  const tickInterval = period === 'Daily' ? 4 : 0

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
          <p className="text-gray-600">Monitor your hotel's performance and key metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Calendar size={16} className="text-blue-500" />
            {data.dateRangeLabel}
            <ChevronDown size={16} className="text-gray-400" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
              <DollarSign size={18} className="text-green-600" />
            </div>
            <p className="text-sm text-gray-500">Total Revenue</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{formatNaira(data.stats.totalRevenue.value, false)}</p>
          <p className="flex items-center gap-1 text-xs font-medium text-green-600">
            <ArrowUpRight size={13} />
            {data.stats.totalRevenue.deltaPct}%
            <span className="text-gray-400 font-normal">vs Sep 1 - Sep 30, 2025</span>
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
              <PieChartIcon size={18} className="text-purple-500" />
            </div>
            <p className="text-sm text-gray-500">Occupancy Rate</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{data.stats.occupancyRate.value}%</p>
          <p className="flex items-center gap-1 text-xs font-medium text-green-600">
            <ArrowUpRight size={13} />
            {data.stats.occupancyRate.deltaPct}%
            <span className="text-gray-400 font-normal">vs Sep 1 - Sep 30, 2025</span>
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
              <TrendingUp size={18} className="text-amber-500" />
            </div>
            <p className="text-sm text-gray-500">Average Daily Rate</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{formatNaira(data.stats.adr.value, false)}</p>
          <p className="flex items-center gap-1 text-xs font-medium text-green-600">
            <ArrowUpRight size={13} />
            {data.stats.adr.deltaPct}%
            <span className="text-gray-400 font-normal">vs Sep 1 - Sep 30, 2025</span>
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <LineChartIcon size={18} className="text-blue-500" />
            </div>
            <p className="text-sm text-gray-500">RevPAR</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{formatNaira(data.stats.revpar.value, false)}</p>
          <p className="flex items-center gap-1 text-xs font-medium text-green-600">
            <ArrowUpRight size={13} />
            {data.stats.revpar.deltaPct}%
            <span className="text-gray-400 font-normal">vs Sep 1 - Sep 30, 2025</span>
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Overview */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Revenue Overview</h3>
            <div className="relative">
              <button
                onClick={() => setPeriodMenuOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                {period}
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              {periodMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                  {(['Daily', 'Weekly', 'Monthly'] as Period[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setPeriod(p)
                        setPeriodMenuOpen(false)
                      }}
                      className={`w-full text-left px-3 py-2 text-sm ${
                        p === period ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B5BDB" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#3B5BDB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0F5" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                  interval={tickInterval}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => formatNaira(v)}
                  width={56}
                />
                <Tooltip
                  formatter={(value) => [formatNaira(Number(value ?? 0), false), 'Revenue']}
                  contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3B5BDB"
                  strokeWidth={2}
                  fill="url(#revenueFill)"
                  dot={{ r: 3, stroke: '#3B5BDB', strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Source */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue by Source</h3>

          <div className="relative h-52 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.revenueBySource}
                  dataKey="value"
                  nameKey="source"
                  innerRadius="65%"
                  outerRadius="100%"
                  paddingAngle={2}
                  startAngle={90}
                  endAngle={-270}
                >
                  {data.revenueBySource.map((slice) => (
                    <Cell key={slice.source} fill={slice.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatNaira(Number(value ?? 0), false)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-lg font-bold text-gray-900">{formatNaira(data.stats.totalRevenue.value, false)}</p>
              <p className="text-xs text-gray-500">Total Revenue</p>
            </div>
          </div>

          <div className="space-y-3 flex-1">
            {data.revenueBySource.map((slice) => (
              <div key={slice.source} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
                  <span className="text-gray-700">{slice.source}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-900 font-medium">{formatNaira(slice.value, false)}</span>
                  <span className="text-gray-400 w-12 text-right">{slice.pct}%</span>
                </div>
              </div>
            ))}
          </div>

          <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 mt-4">
            View full report
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}