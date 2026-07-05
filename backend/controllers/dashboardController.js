import { dashboardService } from '../services/dashboardService.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const getSummary = asyncHandler(async (req, res) => {
  res.json(await dashboardService.summary())
})

export const getRecentActivity = asyncHandler(async (req, res) => {
  res.json(await dashboardService.recentActivity())
})

export const getCharts = asyncHandler(async (req, res) => {
  res.json(await dashboardService.charts())
})
