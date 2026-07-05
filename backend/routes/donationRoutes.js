import { Router } from 'express'
import * as donationController from '../controllers/donationController.js'
import { protect } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import { logActivity } from '../middlewares/activityLogger.js'
import { donationValidator } from '../validators/donationValidator.js'

const router = Router()

router.use(protect, logActivity('donations'))

router.get('/', donationController.listDonations)
router.post('/', donationValidator, validate, donationController.createDonation)
router.get('/:id', donationController.getDonation)
router.put('/:id', donationValidator, validate, donationController.updateDonation)
router.delete('/:id', donationController.deleteDonation)

export default router
