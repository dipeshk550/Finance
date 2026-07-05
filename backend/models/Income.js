import mongoose from 'mongoose'

const IncomeSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      enum: ['donation', 'grant', 'membership_fee', 'fundraising', 'investment', 'other'],
      required: true,
    },
    category: { type: String },
    amount: { type: Number, required: true, min: 0.01 },
    date: { type: Date, required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    description: { type: String },
    attachmentPath: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

export const Income = mongoose.model('Income', IncomeSchema)
