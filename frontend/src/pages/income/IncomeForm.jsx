import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { incomeService } from '../../services/incomeService'

export default function IncomeForm({ income, onSuccess, onCancel }) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: income
      ? { ...income, date: income.date?.substring(0, 10) }
      : { source: 'donation', amount: '', date: new Date().toISOString().substring(0, 10), category: '', description: '' },
  })

  const mutation = useMutation({
    mutationFn: (values) => (income ? incomeService.update(income._id, values) : incomeService.create(values)),
    onSuccess: () => {
      toast.success(income ? 'Income updated' : 'Income recorded')
      queryClient.invalidateQueries({ queryKey: ['income'] })
      onSuccess()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })

  return (
    <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label className="label">{t('income.source')} *</label>
        <select className="input" {...register('source', { required: true })}>
          <option value="donation">Donation</option>
          <option value="grant">Grant</option>
          <option value="membership_fee">Membership Fee</option>
          <option value="fundraising">Fundraising</option>
          <option value="investment">Investment</option>
          <option value="other">Other</option>
        </select>
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
        <label className="label">{t('income.category')}</label>
        <input className="input" {...register('category')} />
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
