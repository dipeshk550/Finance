import { donationRepository } from '../repositories/donationRepository.js'
import { donorRepository } from '../repositories/donorRepository.js'
import { ApiError } from '../utils/ApiError.js'

export const donationService = {
  list: (filters) => donationRepository.paginate(filters),
  find: (id) => donationRepository.findById(id),

  async create(data, userId) {
    const donation = await donationRepository.create({ ...data, createdBy: userId })
    await donorRepository.incrementLifetimeAmount(data.donor, data.amount)

    // In production: dispatch sendThankYouEmail(donation) + generateReceiptPdf(donation) here.

    return donationRepository.findById(donation._id)
  },

  async update(id, data) {
    const existing = await donationRepository.findById(id)
    if (!existing) throw new ApiError(404, 'Donation not found.')

    const oldAmount = existing.amount
    const updated = await donationRepository.update(id, data)

    if (data.amount !== undefined && Number(data.amount) !== oldAmount) {
      const diff = Number(data.amount) - oldAmount
      await donorRepository.incrementLifetimeAmount(data.donor || existing.donor, diff)
    }

    return updated
  },

  async remove(id) {
    const existing = await donationRepository.findById(id)
    if (!existing) throw new ApiError(404, 'Donation not found.')

    await donorRepository.incrementLifetimeAmount(existing.donor._id || existing.donor, -existing.amount)
    return donationRepository.remove(id)
  },
}
