import { Donor } from '../models/Donor.js'

export const donorRepository = {
  async paginate({ search, status, country, page = 1, perPage = 15 }) {
    const query = {}
    if (search) query.$text = { $search: search }
    if (status) query.status = status
    if (country) query.country = country

    const [data, total] = await Promise.all([
      Donor.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(Number(perPage)),
      Donor.countDocuments(query),
    ])

    return { data, total, page: Number(page), perPage: Number(perPage), lastPage: Math.ceil(total / perPage) }
  },

  findById: (id) => Donor.findById(id),
  create: (payload) => Donor.create(payload),
  update: (id, payload) => Donor.findByIdAndUpdate(id, payload, { new: true, runValidators: true }),
  remove: (id) => Donor.findByIdAndDelete(id),
  incrementLifetimeAmount: (id, amount) => Donor.findByIdAndUpdate(id, { $inc: { lifetimeDonationAmount: amount } }),
}
