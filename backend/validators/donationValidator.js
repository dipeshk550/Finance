import { body } from 'express-validator'

export const donationValidator = [
  body('donor').notEmpty().withMessage('Donor is required').isMongoId().withMessage('Invalid donor'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
  body('date').notEmpty().withMessage('Date is required').isISO8601().withMessage('Invalid date'),
  body('paymentMethod')
    .isIn(['cash', 'bank_transfer', 'esewa', 'khalti', 'card', 'cheque', 'other'])
    .withMessage('Invalid payment method'),
  body('fundType').isIn(['restricted', 'unrestricted']).withMessage('Invalid fund type'),
  body('status').optional().isIn(['pending', 'completed', 'refunded']),
]
