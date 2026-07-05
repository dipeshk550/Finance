import { Router } from 'express'
import authRoutes from './authRoutes.js'
import dashboardRoutes from './dashboardRoutes.js'
import donorRoutes from './donorRoutes.js'
import donationRoutes from './donationRoutes.js'
import incomeRoutes from './incomeRoutes.js'
import expenseRoutes from './expenseRoutes.js'
import statementRoutes from './statementRoutes.js'

const router = Router()

router.get('/', (req, res) => {
  res.json({
    app: 'Finance Management System API',
    organization: 'Om Satsang Parivar',
    status: 'running',
  })
})

router.use('/auth', authRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/donors', donorRoutes)
router.use('/donations', donationRoutes)
router.use('/income', incomeRoutes)
router.use('/expenses', expenseRoutes)
router.use('/statement', statementRoutes)

export default router
