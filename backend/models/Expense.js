import mongoose from 'mongoose'

const ExpenseSchema = new mongoose.Schema(
  {
    expenseNumber: { type: String, unique: true },
    category: {
      type: String,
      enum: [
        'rent', 'salary', 'travel', 'utilities', 'office_supplies',
        'project_materials', 'training', 'marketing', 'transportation',
        'maintenance', 'others',
      ],
      required: true,
    },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    vendor: { type: String },
    amount: { type: Number, required: true, min: 0.01 },
    date: { type: Date, required: true },
    receiptPath: { type: String },
    description: { type: String },
    paymentMethod: {
      type: String,
      enum: ['cash', 'bank_transfer', 'esewa', 'khalti', 'card', 'cheque', 'other'],
      required: true,
    },
    status: { type: String, enum: ['pending', 'approved', 'paid', 'rejected'], default: 'pending' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

ExpenseSchema.pre('validate', async function (next) {
  if (!this.expenseNumber) {
    const count = await mongoose.model('Expense').countDocuments()
    const seq = String(count + 1).padStart(5, '0')
    this.expenseNumber = `EXP-${new Date().getFullYear()}-${seq}`
  }
  next()
})

export const Expense = mongoose.model('Expense', ExpenseSchema)
