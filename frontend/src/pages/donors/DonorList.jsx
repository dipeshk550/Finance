import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { LuPlus, LuPencil, LuTrash2, LuSearch } from 'react-icons/lu'
import { donorService } from '../../services/donorService'
import DataTable from '../../components/ui/DataTable'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import DonorForm from './DonorForm'

export default function DonorList() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['donors', search],
    queryFn: () => donorService.list({ search }).then((r) => r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => donorService.remove(id),
    onSuccess: () => {
      toast.success('Donor deleted')
      queryClient.invalidateQueries({ queryKey: ['donors'] })
      setDeleteTarget(null)
    },
    onError: () => toast.error('Failed to delete donor'),
  })

  const columns = [
    { key: 'fullName', label: t('donors.full_name') },
    { key: 'email', label: t('auth.email'), render: (r) => r.email || '—' },
    { key: 'phone', label: t('donors.phone'), render: (r) => r.phone || '—' },
    { key: 'country', label: t('donors.country'), render: (r) => r.country || '—' },
    {
      key: 'lifetimeDonationAmount',
      label: t('donors.lifetime_donation'),
      render: (r) => new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(r.lifetimeDonationAmount || 0),
    },
    { key: 'status', label: t('common.status'), render: (r) => <Badge value={r.status} /> },
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
        <h1 className="text-xl font-bold">{t('donors.title')}</h1>
        <div className="flex gap-2">
          <div className="relative">
            <LuSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input className="input pl-9" placeholder={t('common.search')} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button onClick={() => { setEditing(null); setModalOpen(true) }} className="btn-primary shrink-0">
            <LuPlus className="h-4 w-4" /> {t('common.add_new')}
          </button>
        </div>
      </div>

      <DataTable columns={columns} rows={data?.data || []} loading={isLoading} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t('common.edit') : t('common.add_new')} wide>
        <DonorForm donor={editing} onSuccess={() => setModalOpen(false)} onCancel={() => setModalOpen(false)} />
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
