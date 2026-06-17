import { useState } from 'react'
import {
  HiOutlineUsers,
  HiOutlineBuildingStorefront,
  HiOutlineShoppingBag,
  HiOutlineBanknotes,
  HiOutlineBolt,
} from 'react-icons/hi2'
import AdminTopBar from '../../components/admin/AdminTopBar'
import { analyticsStats, growthData, recentActivities } from '../../data/adminData'

const statIcons = {
  users: HiOutlineUsers,
  shops: HiOutlineBuildingStorefront,
  orders: HiOutlineShoppingBag,
  revenue: HiOutlineBanknotes,
  active: HiOutlineBolt,
}

export default function AdminAnalytics() {
  const [period, setPeriod] = useState('Monthly')
  const maxGrowth = Math.max(...growthData.map((d) => d.value))

  return (
    <div>
      <AdminTopBar
        title="Platform Analytics"
        subtitle="Real-time performance metrics for QuickBasket Grocery."
        searchPlaceholder="Search analytics..."
      />

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Stats row */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {analyticsStats.map((stat) => {
            const Icon = statIcons[stat.icon]
            return (
              <div
                key={stat.id}
                className={`rounded-xl border p-4 shadow-sm sm:p-5 ${
                  stat.highlight
                    ? 'border-primary bg-primary text-white'
                    : 'border-neutral-border bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`text-xs sm:text-sm ${stat.highlight ? 'text-white/80' : 'text-text-muted'}`}>
                      {stat.label}
                    </p>
                    <p className={`mt-1 text-xl font-bold sm:text-2xl ${stat.highlight ? 'text-white' : 'text-text-dark'}`}>
                      {stat.value}
                    </p>
                    <p
                      className={`mt-1 text-xs font-semibold ${
                        stat.live
                          ? 'text-tertiary'
                          : stat.highlight
                            ? 'text-secondary'
                            : 'text-tertiary'
                      }`}
                    >
                      {stat.live && (
                        <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-tertiary" />
                      )}
                      {stat.trend}
                    </p>
                  </div>
                  <Icon
                    className={`h-5 w-5 shrink-0 ${stat.highlight ? 'text-white/70' : 'text-text-muted'}`}
                  />
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Growth chart */}
          <div className="rounded-xl border border-neutral-border bg-white p-4 shadow-sm sm:p-6 lg:col-span-2">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-bold text-text-dark">Growth Trends</h2>
              <div className="flex rounded-lg bg-neutral p-1">
                {['Weekly', 'Monthly'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPeriod(p)}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold sm:text-sm ${
                      period === p ? 'bg-white text-primary shadow-sm' : 'text-text-muted'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex h-48 items-end justify-between gap-2 sm:h-56 sm:gap-4">
              {growthData.map((item) => (
                <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full max-w-12 rounded-t-lg bg-primary/80 transition-all sm:max-w-16"
                    style={{ height: `${(item.value / maxGrowth) * 100}%`, minHeight: '8px' }}
                  />
                  <span className="text-xs font-medium text-text-muted">{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activities */}
          <div className="rounded-xl border border-neutral-border bg-white shadow-sm">
            <div className="border-b border-neutral-border px-4 py-4 sm:px-5">
              <h2 className="font-bold text-text-dark">Recent Activities</h2>
            </div>
            <div className="divide-y divide-neutral-border">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex gap-3 p-4">
                  <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${activity.color}`} />
                  <div>
                    <p className="text-sm font-semibold text-text-dark">{activity.title}</p>
                    <p className="text-xs text-text-muted">{activity.description}</p>
                    <p className="mt-1 text-xs text-text-muted">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insight banner */}
        <div className="mt-6 overflow-hidden rounded-2xl bg-primary p-5 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white">
                AI Insight
              </span>
              <h3 className="mt-3 text-xl font-bold text-white sm:text-2xl">
                Revenue is projected to grow by 15% next month
              </h3>
              <p className="mt-2 text-sm text-white/80">
                Based on current vendor onboarding and user registration trends, the platform
                is on track for strong Q2 performance.
              </p>
              <button
                type="button"
                className="mt-4 rounded-lg bg-secondary px-5 py-2.5 text-sm font-bold text-text-dark hover:bg-secondary-dark"
              >
                Download Report
              </button>
            </div>
            <div className="hidden h-32 w-48 shrink-0 rounded-xl bg-white/10 lg:block" />
          </div>
        </div>
      </div>
    </div>
  )
}
