import api from '../api/axios'

export const statementService = {
  get: (params) => api.get('/statement', { params }),
}
