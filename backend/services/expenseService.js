import { expenseRepository } from '../repositories/expenseRepository.js'

export const expenseService = {
  list: (filters) => expenseRepository.paginate(filters),
  find: (id) => expenseRepository.findById(id),

  create(data, userId, file) {
    const payload = { ...data, createdBy: userId }
    if (file) payload.receiptPath = `/uploads/receipts/${file.filename}`
    return expenseRepository.create(payload)
  },

  update(id, data, file) {
    const payload = { ...data }
    if (file) payload.receiptPath = `/uploads/receipts/${file.filename}`
    return expenseRepository.update(id, payload)
  },

  remove: (id) => expenseRepository.remove(id),
}
