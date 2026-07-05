import mongoose from 'mongoose'

const DonationSchema = new mongoose.Schema(
  {
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor', required: true },
    amount: { type: Number, required: true, min: 0.01 },
    currency: { type: String, default: 'NPR' },
    date: { type: Date, required: true },
    paymentMethod: {
      type: String,
      enum: ['cash', 'bank_transfer', 'esewa', 'khalti', 'card', 'cheque', 'other'],
      required: true,
    },
    referenceNumber: { type: String },
    fundType: { type: String, enum: ['restricted', 'unrestricted'], default: 'unrestricted' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    campaign: { type: String },
    description: { type: String },
    receiptPath: { type: String },
    status: { type: String, enum: ['pending', 'completed', 'refunded'], default: 'completed' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

export const Donation = mongoose.model('Donation', DonationSchema)
