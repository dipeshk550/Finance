import { Router } from 'express'
import * as dashboardController from '../controllers/dashboardController.js'
import { protect } from '../middlewares/auth.js'

const router = Router()

router.use(protect)
router.get('/summary', dashboardController.getSummary)
router.get('/recent-activity', dashboardController.getRecentActivity)
router.get('/charts', dashboardController.getCharts)

export default router
