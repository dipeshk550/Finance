import { Income } from '../models/Income.js'

export const incomeRepository = {
  async paginate({ source, category, from, to, page = 1, perPage = 15 }) {
    const query = {}
    if (source) query.source = source
    if (category) query.category = category
    if (from || to) {
      query.date = {}
      if (from) query.date.$gte = new Date(from)
      if (to) query.date.$lte = new Date(to)
    }

    const [data, total] = await Promise.all([
      Income.find(query).sort({ date: -1 }).skip((page - 1) * perPage).limit(Number(perPage)),
      Income.countDocuments(query),
    ])

    return { data, total, page: Number(page), perPage: Number(perPage), lastPage: Math.ceil(total / perPage) }
  },

  findById: (id) => Income.findById(id),
  create: (payload) => Income.create(payload),
  update: (id, payload) => Income.findByIdAndUpdate(id, payload, { new: true, runValidators: true }),
  remove: (id) => Income.findByIdAndDelete(id),
}
