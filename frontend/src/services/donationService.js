import api from '../api/axios'

export const donationService = {
  list: (params) => api.get('/donations', { params }),
  get: (id) => api.get(`/donations/${id}`),
  create: (data) => api.post('/donations', data),
  update: (id, data) => api.put(`/donations/${id}`, data),
  remove: (id) => api.delete(`/donations/${id}`),
}
