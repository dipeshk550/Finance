import { donorRepository } from '../repositories/donorRepository.js'

export const donorService = {
  list: (filters) => donorRepository.paginate(filters),
  find: (id) => donorRepository.findById(id),
  create: (data) => donorRepository.create(data),
  update: (id, data) => donorRepository.update(id, data),
  remove: (id) => donorRepository.remove(id),
}
