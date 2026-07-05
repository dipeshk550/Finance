import { Router } from 'express'
import * as authController from '../controllers/authController.js'
import { protect } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
  loginValidator, changePasswordValidator, forgotPasswordValidator, resetPasswordValidator,
} from '../validators/authValidator.js'

const router = Router()

router.post('/login', loginValidator, validate, authController.login)
router.post('/refresh', authController.refresh)
router.post('/forgot-password', forgotPasswordValidator, validate, authController.forgotPassword)
router.post('/reset-password', resetPasswordValidator, validate, authController.resetPassword)

router.use(protect)
router.post('/logout', authController.logout)
router.get('/me', authController.me)
router.put('/profile', authController.updateProfile)
router.put('/change-password', changePasswordValidator, validate, authController.changePassword)

export default router
