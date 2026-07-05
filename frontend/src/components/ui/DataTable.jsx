import { useTranslation } from 'react-i18next'

export default function DataTable({ columns, rows, loading, emptyMessage }) {
  const { t } = useTranslation()

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="whitespace-nowrap px-4 py-3 font-medium text-gray-600 dark:text-gray-300">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading && (
              <tr><td colSpan={columns.length} className="px-4 py-8 text-center text-gray-400">{t('common.loading')}</td></tr>
            )}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={columns.length} className="px-4 py-8 text-center text-gray-400">{emptyMessage || t('common.no_data')}</td></tr>
            )}
            {!loading &&
              rows.map((row, idx) => (
                <tr key={row._id ?? row.id ?? idx} className="hover:bg-gray-50 dark:hover:bg-gray-900/40">
                  {columns.map((col) => (
                    <td key={col.key} className="whitespace-nowrap px-4 py-3">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
