import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { LuWallet, LuTrendingDown, LuScale, LuLock, LuLockOpen, LuCalendarDays, LuUsers } from 'react-icons/lu'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { dashboardService } from '../services/dashboardService'
import StatCard from '../components/ui/StatCard'
import Badge from '../components/ui/Badge'

const COLORS = ['#f97316', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444', '#f59e0b', '#06b6d4', '#ec4899', '#84cc16', '#6366f1']

function formatCurrency(n) {
  return new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(n || 0)
}

export default function Dashboard() {
  const { t } = useTranslation()

  const { data: summary, isLoading } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: () => dashboardService.summary().then((r) => r.data),
  })

  const { data: charts } = useQuery({
    queryKey: ['dashboard-charts'],
    queryFn: () => dashboardService.charts().then((r) => r.data),
  })

  const { data: activity } = useQuery({
    queryKey: ['dashboard-activity'],
    queryFn: () => dashboardService.recentActivity().then((r) => r.data),
  })

  if (isLoading) {
    return <div className="py-20 text-center text-gray-400">{t('common.loading')}</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">{t('dashboard.title')}</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard icon={LuWallet} accent="green" label={t('dashboard.total_income')} value={formatCurrency(summary?.totalIncome)} />
        <StatCard icon={LuTrendingDown} accent="red" label={t('dashboard.total_expenses')} value={formatCurrency(summary?.totalExpenses)} />
        <StatCard icon={LuScale} accent="blue" label={t('dashboard.net_balance')} value={formatCurrency(summary?.netBalance)} />
        <StatCard icon={LuUsers} accent="purple" label={t('dashboard.total_donors')} value={summary?.totalDonors ?? 0} />
        <StatCard icon={LuLock} accent="purple" label={t('dashboard.restricted_funds')} value={formatCurrency(summary?.restrictedFunds)} />
        <StatCard icon={LuLockOpen} accent="blue" label={t('dashboard.unrestricted_funds')} value={formatCurrency(summary?.unrestrictedFunds)} />
        <StatCard icon={LuCalendarDays} accent="green" label={t('dashboard.today_income')} value={formatCurrency(summary?.todayIncome)} />
        <StatCard icon={LuCalendarDays} accent="red" label={t('dashboard.today_expense')} value={formatCurrency(summary?.todayExpense)} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card p-4">
          <h2 className="mb-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('dashboard.income_vs_expense')}</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={charts?.monthlyTrend || []}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name={t('dashboard.total_income')} />
              <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} name={t('dashboard.total_expenses')} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-4">
          <h2 className="mb-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('dashboard.expense_by_category')}</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={charts?.expenseByCategory || []} dataKey="total" nameKey="category" innerRadius={60} outerRadius={95} paddingAngle={2}>
                {(charts?.expenseByCategory || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card p-4">
          <h2 className="mb-3 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('dashboard.recent_donations')}</h2>
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {(activity?.recentDonations || []).map((d) => (
              <li key={d._id} className="flex items-center justify-between py-2.5 text-sm">
                <div>
                  <p className="font-medium">{d.donor?.fullName || '—'}</p>
                  <p className="text-xs text-gray-400">{new Date(d.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(d.amount)}</p>
                  <Badge value={d.status} />
                </div>
              </li>
            ))}
            {(!activity?.recentDonations || activity.recentDonations.length === 0) && (
              <p className="py-4 text-center text-sm text-gray-400">{t('common.no_data')}</p>
            )}
          </ul>
        </div>

        <div className="card p-4">
          <h2 className="mb-3 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('dashboard.recent_expenses')}</h2>
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {(activity?.recentExpenses || []).map((e) => (
              <li key={e._id} className="flex items-center justify-between py-2.5 text-sm">
                <div>
                  <p className="font-medium capitalize">{e.category?.replace('_', ' ')}</p>
                  <p className="text-xs text-gray-400">{new Date(e.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(e.amount)}</p>
                  <Badge value={e.status} />
                </div>
              </li>
            ))}
            {(!activity?.recentExpenses || activity.recentExpenses.length === 0) && (
              <p className="py-4 text-center text-sm text-gray-400">{t('common.no_data')}</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
