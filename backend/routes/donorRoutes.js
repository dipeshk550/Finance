import { Router } from 'express'
import * as donorController from '../controllers/donorController.js'
import { protect } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import { logActivity } from '../middlewares/activityLogger.js'
import { donorValidator } from '../validators/donorValidator.js'

const router = Router()

router.use(protect, logActivity('donors'))

router.get('/', donorController.listDonors)
router.post('/', donorValidator, validate, donorController.createDonor)
router.get('/:id/donations', donorController.donorDonationHistory)
router.get('/:id', donorController.getDonor)
router.put('/:id', donorValidator, validate, donorController.updateDonor)
router.delete('/:id', donorController.deleteDonor)

export default router
