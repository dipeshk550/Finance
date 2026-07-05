const COLORS = {
  active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  paid: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  approved: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  pending: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  inactive: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  rejected: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
  refunded: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
  restricted: 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400',
  unrestricted: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
}

export default function Badge({ value }) {
  const key = String(value || '').toLowerCase()
  const cls = COLORS[key] || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium capitalize ${cls}`}>
      {String(value || '').replace('_', ' ')}
    </span>
  )
}
