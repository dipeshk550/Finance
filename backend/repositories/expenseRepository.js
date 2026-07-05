import { Expense } from '../models/Expense.js'

export const expenseRepository = {
  async paginate({ category, status, project, from, to, search, page = 1, perPage = 15 }) {
    const query = {}
    if (category) query.category = category
    if (status) query.status = status
    if (project) query.project = project
    if (from || to) {
      query.date = {}
      if (from) query.date.$gte = new Date(from)
      if (to) query.date.$lte = new Date(to)
    }
    if (search) {
      query.$or = [
        { vendor: { $regex: search, $options: 'i' } },
        { expenseNumber: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    const [data, total] = await Promise.all([
      Expense.find(query).sort({ date: -1 }).skip((page - 1) * perPage).limit(Number(perPage)),
      Expense.countDocuments(query),
    ])

    return { data, total, page: Number(page), perPage: Number(perPage), lastPage: Math.ceil(total / perPage) }
  },

  findById: (id) => Expense.findById(id),
  create: (payload) => Expense.create(payload),
  update: (id, payload) => Expense.findByIdAndUpdate(id, payload, { new: true, runValidators: true }),
  remove: (id) => Expense.findByIdAndDelete(id),
}
