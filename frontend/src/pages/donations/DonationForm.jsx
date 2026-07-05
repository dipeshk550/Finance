import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { donationService } from '../../services/donationService'
import { donorService } from '../../services/donorService'

export default function DonationForm({ donation, onSuccess, onCancel }) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const { data: donorsData } = useQuery({
    queryKey: ['donors', 'for-select'],
    queryFn: () => donorService.list({ per_page: 100 }).then((r) => r.data),
  })

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: donation
      ? { ...donation, donor: donation.donor?._id || donation.donor, date: donation.date?.substring(0, 10) }
      : {
          donor: '', amount: '', currency: 'NPR', date: new Date().toISOString().substring(0, 10),
          paymentMethod: 'cash', fundType: 'unrestricted', referenceNumber: '', campaign: '', description: '', status: 'completed',
        },
  })

  const mutation = useMutation({
    mutationFn: (values) => (donation ? donationService.update(donation._id, values) : donationService.create(values)),
    onSuccess: () => {
      toast.success(donation ? 'Donation updated' : 'Donation recorded')
      queryClient.invalidateQueries({ queryKey: ['donations'] })
      queryClient.invalidateQueries({ queryKey: ['donors'] })
      onSuccess()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong'),
  })

  return (
    <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="label">{t('donations.donor')} *</label>
        <select className="input" {...register('donor', { required: true })}>
          <option value="">Select donor</option>
          {(donorsData?.data || []).map((d) => <option key={d._id} value={d._id}>{d.fullName}</option>)}
        </select>
        {errors.donor && <p className="mt-1 text-xs text-red-500">Required</p>}
      </div>

      <div>
        <label className="label">{t('common.amount')} *</label>
        <input type="number" step="0.01" className="input" {...register('amount', { required: true, min: 0.01 })} />
      </div>

      <div>
        <label className="label">Currency</label>
        <input className="input" {...register('currency')} />
      </div>

      <div>
        <label className="label">{t('common.date')} *</label>
        <input type="date" className="input" {...register('date', { required: true })} />
      </div>

      <div>
        <label className="label">{t('donations.payment_method')} *</label>
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
        <label className="label">{t('donations.fund_type')} *</label>
        <select className="input" {...register('fundType', { required: true })}>
          <option value="unrestricted">{t('donations.unrestricted')}</option>
          <option value="restricted">{t('donations.restricted')}</option>
        </select>
      </div>

      <div>
        <label className="label">Reference Number</label>
        <input className="input" {...register('referenceNumber')} />
      </div>

      <div>
        <label className="label">Campaign</label>
        <input className="input" {...register('campaign')} />
      </div>

      <div>
        <label className="label">{t('common.status')}</label>
        <select className="input" {...register('status')}>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="refunded">Refunded</option>
        </select>
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
