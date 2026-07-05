import mongoose from 'mongoose'

const ActivityLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, enum: ['login', 'logout', 'create', 'update', 'delete', 'export', 'import'], required: true },
    module: { type: String, required: true },
    description: { type: String },
    ipAddress: { type: String },
  },
  { timestamps: true }
)

export const ActivityLog = mongoose.model('ActivityLog', ActivityLogSchema)
