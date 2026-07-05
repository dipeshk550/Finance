import { Donation } from '../models/Donation.js'

export const donationRepository = {
  async paginate({ donor, fundType, status, from, to, page = 1, perPage = 15 }) {
    const query = {}
    if (donor) query.donor = donor
    if (fundType) query.fundType = fundType
    if (status) query.status = status
    if (from || to) {
      query.date = {}
      if (from) query.date.$gte = new Date(from)
      if (to) query.date.$lte = new Date(to)
    }

    const [data, total] = await Promise.all([
      Donation.find(query)
        .populate('donor', 'fullName')
        .sort({ date: -1 })
        .skip((page - 1) * perPage)
        .limit(Number(perPage)),
      Donation.countDocuments(query),
    ])

    return { data, total, page: Number(page), perPage: Number(perPage), lastPage: Math.ceil(total / perPage) }
  },

  findById: (id) => Donation.findById(id).populate('donor', 'fullName'),
  create: (payload) => Donation.create(payload),
  update: (id, payload) => Donation.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).populate('donor', 'fullName'),
  remove: (id) => Donation.findByIdAndDelete(id),
}
