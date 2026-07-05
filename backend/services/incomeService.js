import { incomeRepository } from '../repositories/incomeRepository.js'

export const incomeService = {
  list: (filters) => incomeRepository.paginate(filters),
  find: (id) => incomeRepository.findById(id),
  create: (data, userId) => incomeRepository.create({ ...data, createdBy: userId }),
  update: (id, data) => incomeRepository.update(id, data),
  remove: (id) => incomeRepository.remove(id),
}
