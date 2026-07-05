import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { donorService } from '../../services/donorService'

export default function DonorForm({ donor, onSuccess, onCancel }) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: donor || {
      fullName: '', email: '', phone: '', address: '', country: '',
      preferredContact: 'email', status: 'active', notes: '',
    },
  })

  const mutation = useMutation({
    mutationFn: (values) => (donor ? donorService.update(donor._id, values) : donorService.create(values)),
    onSuccess: () => {
      toast.success(donor ? 'Donor updated' : 'Donor created')
      queryClient.invalidateQueries({ queryKey: ['donors'] })
      onSuccess()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })

  return (
    <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="label">{t('donors.full_name')} *</label>
        <input className="input" {...register('fullName', { required: true })} />
        {errors.fullName && <p className="mt-1 text-xs text-red-500">Required</p>}
      </div>

      <div>
        <label className="label">{t('auth.email')}</label>
        <input type="email" className="input" {...register('email')} />
      </div>

      <div>
        <label className="label">{t('donors.phone')}</label>
        <input className="input" {...register('phone')} />
      </div>

      <div className="sm:col-span-2">
        <label className="label">Address</label>
        <input className="input" {...register('address')} />
      </div>

      <div>
        <label className="label">{t('donors.country')}</label>
        <input className="input" {...register('country')} />
      </div>

      <div>
        <label className="label">Preferred Contact</label>
        <select className="input" {...register('preferredContact')}>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
          <option value="sms">SMS</option>
        </select>
      </div>

      <div>
        <label className="label">{t('common.status')}</label>
        <select className="input" {...register('status')}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="sm:col-span-2">
        <label className="label">Notes</label>
        <textarea className="input" rows={3} {...register('notes')} />
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
