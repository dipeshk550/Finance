import { Router } from 'express'
import * as incomeController from '../controllers/incomeController.js'
import { protect } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import { logActivity } from '../middlewares/activityLogger.js'
import { incomeValidator } from '../validators/incomeValidator.js'

const router = Router()

router.use(protect, logActivity('income'))

router.get('/', incomeController.listIncome)
router.post('/', incomeValidator, validate, incomeController.createIncome)
router.get('/:id', incomeController.getIncome)
router.put('/:id', incomeValidator, validate, incomeController.updateIncome)
router.delete('/:id', incomeController.deleteIncome)

export default router
