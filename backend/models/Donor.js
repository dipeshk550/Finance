import mongoose from 'mongoose'

const DonorSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    country: { type: String },
    profilePhoto: { type: String },
    preferredContact: { type: String, enum: ['email', 'phone', 'sms'], default: 'email' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    notes: { type: String },
    lifetimeDonationAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
)

DonorSchema.index({ fullName: 'text', email: 'text', phone: 'text' })

export const Donor = mongoose.model('Donor', DonorSchema)
