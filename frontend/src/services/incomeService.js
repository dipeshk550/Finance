import api from '../api/axios'

export const incomeService = {
  list: (params) => api.get('/income', { params }),
  get: (id) => api.get(`/income/${id}`),
  create: (data) => api.post('/income', data),
  update: (id, data) => api.put(`/income/${id}`, data),
  remove: (id) => api.delete(`/income/${id}`),
}
