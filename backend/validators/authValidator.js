import { body } from 'express-validator'

export const loginValidator = [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
]

export const changePasswordValidator = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
]

export const forgotPasswordValidator = [
  body('email').isEmail().withMessage('Enter a valid email'),
]

export const resetPasswordValidator = [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('token').notEmpty().withMessage('Token is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
]
