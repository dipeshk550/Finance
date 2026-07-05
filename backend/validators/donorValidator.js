import { body } from 'express-validator'

export const donorValidator = [
  body('fullName').trim().notEmpty().withMessage('Full name is required').isLength({ max: 150 }),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Enter a valid email'),
  body('phone').optional({ checkFalsy: true }).isLength({ max: 30 }),
  body('preferredContact').optional().isIn(['email', 'phone', 'sms']),
  body('status').optional().isIn(['active', 'inactive']),
]
