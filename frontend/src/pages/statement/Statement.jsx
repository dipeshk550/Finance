import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { LuDownload, LuPrinter, LuWallet, LuTrendingDown, LuScale, LuUsers, LuHandCoins } from 'react-icons/lu'
import { statementService } from '../../services/statementService'
import StatCard from '../../components/ui/StatCard'
import DataTable from '../../components/ui/DataTable'

const PERIODS = [
  { key: 'today', label: '1 Day' },
  { key: '7d', label: '1 Week' },
  { key: '1m', label: '1 Month' },
  { key: '3m', label: '3 Months' },
  { key: '6m', label: '6 Months' },
  { key: '1y', label: '1 Year' },
  { key: 'all', label: 'All Time' },
  { key: 'custom', label: 'Custom' },
]

function formatCurrency(n) {
  return new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(n || 0)
}

function formatDate(d) {
  return d ? new Date(d).toLocaleDateString() : '—'
}

export default function Statement() {
  const { t } = useTranslation()
  const [period, setPeriod] = useState('1m')
  const [customFrom, setCustomFrom] = useState(new Date(Date.now() - 30 * 86400000).toISOString().substring(0, 10))
  const [customTo, setCustomTo] = useState(new Date().toISOString().substring(0, 10))

  const isCustom = period === 'custom'

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['statement', period, isCustom ? customFrom : null, isCustom ? customTo : null],
    queryFn: () =>
      statementService
        .get({ period, ...(isCustom ? { from: customFrom, to: customTo } : {}) })
        .then((r) => r.data),
  })

  const donorColumns = [
    { key: 'donorName', label: 'Donor', render: (r) => r.donorName || 'Unknown Donor' },
    { key: 'donationCount', label: 'Donations' },
    { key: 'totalAmount', label: 'Total Given', render: (r) => formatCurrency(r.totalAmount) },
    { key: 'lastDonationDate', label: 'Last Donation', render: (r) => formatDate(r.lastDonationDate) },
  ]

  const incomeColumns = [
    { key: 'date', label: t('common.date'), render: (r) => formatDate(r.date) },
    { key: 'source', label: t('income.source'), render: (r) => <span className="capitalize">{r.source?.replace('_', ' ')}</span> },
    { key: 'category', label: t('income.category'), render: (r) => r.category || '—' },
    { key: 'amount', label: t('common.amount'), render: (r) => formatCurrency(r.amount) },
  ]

  const expenseColumns = [
    { key: 'date', label: t('common.date'), render: (r) => formatDate(r.date) },
    { key: 'category', label: t('expenses.category'), render: (r) => <span className="capitalize">{r.category?.replace('_', ' ')}</span> },
    { key: 'vendor', label: t('expenses.vendor'), render: (r) => r.vendor || '—' },
    { key: 'amount', label: t('common.amount'), render: (r) => formatCurrency(r.amount) },
  ]

  function exportCsv() {
    if (!data) return
    const rows = [
      ['Financial Statement'],
      [`Period: ${data.range.from.substring ? data.range.from : new Date(data.range.from).toLocaleDateString()} - ${new Date(data.range.to).toLocaleDateString()}`],
      [],
      ['Summary'],
      ['Total Income', data.summary.totalIncome],
      ['Total Expenses', data.summary.totalExpenses],
      ['Net Balance', data.summary.netBalance],
      ['Total Donations', data.summary.donationTotal],
      ['Total Donors', data.summary.totalDonors],
      [],
      ['Donations by Donor'],
      ['Donor', 'Donations', 'Total Amount', 'Last Donation'],
      ...data.donationsByDonor.map((d) => [d.donorName || 'Unknown', d.donationCount, d.totalAmount, formatDate(d.lastDonationDate)]),
    ]
    const csv = rows.map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `statement-${period}-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold">Financial Statement</h1>
        <div className="flex gap-2">
          <button onClick={exportCsv} disabled={!data} className="btn-secondary">
            <LuDownload className="h-4 w-4" /> Export CSV
          </button>
          <button onClick={() => window.print()} className="btn-secondary">
            <LuPrinter className="h-4 w-4" /> Print
          </button>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex flex-wrap gap-2">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`rounded-xl px-3 py-1.5 text-sm font-medium transition ${
                period === p.key
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {isCustom && (
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <div>
              <label className="label">From</label>
              <input type="date" className="input" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} />
            </div>
            <div>
              <label className="label">To</label>
              <input type="date" className="input" value={customTo} onChange={(e) => setCustomTo(e.target.value)} />
            </div>
          </div>
        )}
      </div>

      {isLoading && <div className="py-16 text-center text-gray-400">{t('common.loading')}</div>}

      {isError && (
        <div className="card p-4 text-sm text-red-600">
          {error?.response?.data?.message || 'Failed to load statement.'}
        </div>
      )}

      {data && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <StatCard icon={LuWallet} accent="green" label="Total Income" value={formatCurrency(data.summary.totalIncome)} />
            <StatCard icon={LuTrendingDown} accent="red" label="Total Expenses" value={formatCurrency(data.summary.totalExpenses)} />
            <StatCard icon={LuScale} accent="blue" label="Net Balance" value={formatCurrency(data.summary.netBalance)} />
            <StatCard icon={LuHandCoins} accent="purple" label="Total Donations" value={formatCurrency(data.summary.donationTotal)} sub={`${data.summary.totalDonations} donations`} />
            <StatCard icon={LuUsers} accent="brand" label="Donors Who Gave" value={data.summary.totalDonors} />
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Donations by Donor — who gave how much</h2>
            <DataTable columns={donorColumns} rows={data.donationsByDonor} emptyMessage="No donations in this period" />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Income entries</h2>
              <DataTable columns={incomeColumns} rows={data.incomeEntries} emptyMessage="No income entries in this period" />
            </div>
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Expense entries</h2>
              <DataTable columns={expenseColumns} rows={data.expenseEntries} emptyMessage="No expenses in this period" />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
