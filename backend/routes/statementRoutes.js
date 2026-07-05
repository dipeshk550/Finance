import { Router } from 'express'
import * as statementController from '../controllers/statementController.js'
import { protect } from '../middlewares/auth.js'

const router = Router()

router.use(protect)
router.get('/', statementController.getStatement)

export default router
