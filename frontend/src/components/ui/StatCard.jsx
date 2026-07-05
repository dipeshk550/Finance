export default function StatCard({ label, value, icon: Icon, accent = 'brand', sub }) {
  const accentClasses = {
    brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400',
    green: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400',
  }

  return (
    <div className="card flex items-center gap-4 p-4">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${accentClasses[accent]}`}>
        {Icon && <Icon className="h-6 w-6" />}
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className="truncate text-lg font-semibold">{value}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  )
}
