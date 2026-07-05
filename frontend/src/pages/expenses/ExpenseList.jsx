import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { LuPlus, LuPencil, LuTrash2, LuDownload } from 'react-icons/lu'
import { expenseService } from '../../services/expenseService'
import DataTable from '../../components/ui/DataTable'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import ExpenseForm from './ExpenseForm'

function formatCurrency(n) {
  return new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(n || 0)
}

export default function ExpenseList() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: () => expenseService.list().then((r) => r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => expenseService.remove(id),
    onSuccess: () => {
      toast.success('Expense deleted')
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      setDeleteTarget(null)
    },
    onError: () => toast.error('Failed to delete expense'),
  })

  const columns = [
    { key: 'expenseNumber', label: t('expenses.expense_number') },
    { key: 'category', label: t('expenses.category'), render: (r) => <span className="capitalize">{r.category?.replace('_', ' ')}</span> },
    { key: 'vendor', label: t('expenses.vendor'), render: (r) => r.vendor || '—' },
    { key: 'amount', label: t('common.amount'), render: (r) => formatCurrency(r.amount) },
    { key: 'date', label: t('common.date'), render: (r) => new Date(r.date).toLocaleDateString() },
    { key: 'status', label: t('common.status'), render: (r) => <Badge value={r.status} /> },
    {
      key: 'receipt',
      label: t('expenses.receipt'),
      render: (r) =>
        r.receiptPath ? (
          <a href={expenseService.receiptUrl(r._id)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-brand-600 hover:underline">
            <LuDownload className="h-4 w-4" /> {t('common.download')}
          </a>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      key: 'actions',
      label: t('common.actions'),
      render: (r) => (
        <div className="flex gap-2">
          <button onClick={() => { setEditing(r); setModalOpen(true) }} className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40">
            <LuPencil className="h-4 w-4" />
          </button>
          <button onClick={() => setDeleteTarget(r)} className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40">
            <LuTrash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold">{t('expenses.title')}</h1>
        <button onClick={() => { setEditing(null); setModalOpen(true) }} className="btn-primary shrink-0">
          <LuPlus className="h-4 w-4" /> {t('common.add_new')}
        </button>
      </div>

      <DataTable columns={columns} rows={data?.data || []} loading={isLoading} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t('common.edit') : t('common.add_new')} wide>
        <ExpenseForm expense={editing} onSuccess={() => setModalOpen(false)} onCancel={() => setModalOpen(false)} />
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title={t('common.delete')}>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">{t('common.confirm_delete')}</p>
        <div className="flex justify-end gap-2">
          <button className="btn-secondary" onClick={() => setDeleteTarget(null)}>{t('common.cancel')}</button>
          <button className="btn-primary bg-red-600 hover:bg-red-700" onClick={() => deleteMutation.mutate(deleteTarget._id)}>{t('common.yes_delete')}</button>
        </div>
      </Modal>
    </div>
  )
}
