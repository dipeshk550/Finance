import { Router } from 'express'
import * as expenseController from '../controllers/expenseController.js'
import { protect, authorize } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import { logActivity } from '../middlewares/activityLogger.js'
import { uploadReceipt } from '../middlewares/upload.js'
import { expenseValidator } from '../validators/expenseValidator.js'

const router = Router()

router.use(protect, logActivity('expenses'))

router.get('/', expenseController.listExpenses)
router.post('/', uploadReceipt, expenseValidator, validate, expenseController.createExpense)
router.get('/:id/receipt', expenseController.downloadReceipt)
router.patch('/:id/approve', authorize('super_admin', 'admin', 'accountant'), expenseController.approveExpense)
router.get('/:id', expenseController.getExpense)
router.put('/:id', uploadReceipt, expenseValidator, validate, expenseController.updateExpense)
router.delete('/:id', expenseController.deleteExpense)

export default router
