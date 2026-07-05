import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { expenseService } from '../../services/expenseService'

const CATEGORIES = ['rent', 'salary', 'travel', 'utilities', 'office_supplies', 'project_materials', 'training', 'marketing', 'transportation', 'maintenance', 'others']

export default function ExpenseForm({ expense, onSuccess, onCancel }) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: expense
      ? { ...expense, date: expense.date?.substring(0, 10) }
      : {
          category: 'office_supplies', vendor: '', amount: '', date: new Date().toISOString().substring(0, 10),
          paymentMethod: 'cash', status: 'pending', description: '',
        },
  })

  const mutation = useMutation({
    mutationFn: (values) => {
      const { receipt, ...rest } = values
      const payload = { ...rest, receipt }
      return expense ? expenseService.update(expense._id, payload) : expenseService.create(payload)
    },
    onSuccess: () => {
      toast.success(expense ? 'Expense updated' : 'Expense recorded')
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      onSuccess()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })

  return (
    <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label className="label">{t('expenses.category')} *</label>
        <select className="input" {...register('category', { required: true })}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
        </select>
      </div>

      <div>
        <label className="label">{t('expenses.vendor')}</label>
        <input className="input" {...register('vendor')} />
      </div>

      <div>
        <label className="label">{t('common.amount')} *</label>
        <input type="number" step="0.01" className="input" {...register('amount', { required: true, min: 0.01 })} />
        {errors.amount && <p className="mt-1 text-xs text-red-500">Required</p>}
      </div>

      <div>
        <label className="label">{t('common.date')} *</label>
        <input type="date" className="input" {...register('date', { required: true })} />
      </div>

      <div>
        <label className="label">Payment Method *</label>
        <select className="input" {...register('paymentMethod', { required: true })}>
          <option value="cash">Cash</option>
          <option value="bank_transfer">Bank Transfer</option>
          <option value="esewa">eSewa</option>
          <option value="khalti">Khalti</option>
          <option value="card">Card</option>
          <option value="cheque">Cheque</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="label">{t('common.status')}</label>
        <select className="input" {...register('status')}>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="paid">Paid</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="sm:col-span-2">
        <label className="label">{t('expenses.receipt')} (image or PDF, max 5MB)</label>
        <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="input" {...register('receipt')} />
      </div>

      <div className="sm:col-span-2">
        <label className="label">Description</label>
        <textarea className="input" rows={2} {...register('description')} />
      </div>

      <div className="flex justify-end gap-2 sm:col-span-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>{t('common.cancel')}</button>
        <button type="submit" disabled={mutation.isPending} className="btn-primary">
          {mutation.isPending ? t('common.loading') : t('common.save')}
        </button>
      </div>
    </form>
  )
}
