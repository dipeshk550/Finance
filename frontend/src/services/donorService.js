import api from '../api/axios'

export const donorService = {
  list: (params) => api.get('/donors', { params }),
  get: (id) => api.get(`/donors/${id}`),
  create: (data) => api.post('/donors', data),
  update: (id, data) => api.put(`/donors/${id}`, data),
  remove: (id) => api.delete(`/donors/${id}`),
  history: (id) => api.get(`/donors/${id}/donations`),
}
