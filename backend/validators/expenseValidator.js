import { body } from 'express-validator'

export const expenseValidator = [
  body('category')
    .isIn([
      'rent', 'salary', 'travel', 'utilities', 'office_supplies',
      'project_materials', 'training', 'marketing', 'transportation',
      'maintenance', 'others',
    ])
    .withMessage('Invalid expense category'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
  body('date').notEmpty().withMessage('Date is required').isISO8601().withMessage('Invalid date'),
  body('paymentMethod')
    .isIn(['cash', 'bank_transfer', 'esewa', 'khalti', 'card', 'cheque', 'other'])
    .withMessage('Invalid payment method'),
  body('status').optional().isIn(['pending', 'approved', 'paid', 'rejected']),
]
