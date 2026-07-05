import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { LuPlus, LuPencil, LuTrash2 } from 'react-icons/lu'
import { incomeService } from '../../services/incomeService'
import DataTable from '../../components/ui/DataTable'
import Modal from '../../components/ui/Modal'
import IncomeForm from './IncomeForm'

function formatCurrency(n) {
  return new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(n || 0)
}

export default function IncomeList() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['income'],
    queryFn: () => incomeService.list().then((r) => r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => incomeService.remove(id),
    onSuccess: () => {
      toast.success('Income record deleted')
      queryClient.invalidateQueries({ queryKey: ['income'] })
      setDeleteTarget(null)
    },
    onError: () => toast.error('Failed to delete'),
  })

  const columns = [
    { key: 'source', label: t('income.source'), render: (r) => <span className="capitalize">{r.source?.replace('_', ' ')}</span> },
    { key: 'category', label: t('income.category'), render: (r) => r.category || '—' },
    { key: 'amount', label: t('common.amount'), render: (r) => formatCurrency(r.amount) },
    { key: 'date', label: t('common.date'), render: (r) => new Date(r.date).toLocaleDateString() },
    { key: 'description', label: 'Description', render: (r) => r.description || '—' },
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
        <h1 className="text-xl font-bold">{t('income.title')}</h1>
        <button onClick={() => { setEditing(null); setModalOpen(true) }} className="btn-primary shrink-0">
          <LuPlus className="h-4 w-4" /> {t('common.add_new')}
        </button>
      </div>

      <DataTable columns={columns} rows={data?.data || []} loading={isLoading} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t('common.edit') : t('common.add_new')} wide>
        <IncomeForm income={editing} onSuccess={() => setModalOpen(false)} onCancel={() => setModalOpen(false)} />
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
