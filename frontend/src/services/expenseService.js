import api from '../api/axios'

function toFormData(data) {
  const fd = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'receipt') {
      if (value && value.length > 0) fd.append('receipt', value[0])
      return
    }
    if (value === undefined || value === null) return
    fd.append(key, value)
  })
  return fd
}

export const expenseService = {
  list: (params) => api.get('/expenses', { params }),
  get: (id) => api.get(`/expenses/${id}`),
  create: (data) =>
    api.post('/expenses', toFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) =>
    api.put(`/expenses/${id}`, toFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove: (id) => api.delete(`/expenses/${id}`),
  approve: (id) => api.patch(`/expenses/${id}/approve`),
  receiptUrl: (id) => `${api.defaults.baseURL}/expenses/${id}/receipt`,
}
