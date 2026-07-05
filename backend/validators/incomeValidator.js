import { body } from 'express-validator'

export const incomeValidator = [
  body('source')
    .isIn(['donation', 'grant', 'membership_fee', 'fundraising', 'investment', 'other'])
    .withMessage('Invalid income source'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
  body('date').notEmpty().withMessage('Date is required').isISO8601().withMessage('Invalid date'),
]
