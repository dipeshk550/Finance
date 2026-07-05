import api from '../api/axios'

export const dashboardService = {
  summary: () => api.get('/dashboard/summary'),
  recentActivity: () => api.get('/dashboard/recent-activity'),
  charts: () => api.get('/dashboard/charts'),
}
