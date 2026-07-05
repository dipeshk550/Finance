import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'accountant', 'staff'],
      default: 'staff',
    },
    phone: { type: String },
    avatar: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    refreshToken: { type: String, select: false },
  },
  { timestamps: true }
)

export const User = mongoose.model('User', UserSchema)
