import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'
import { ActivityLog } from '../models/ActivityLog.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/tokens.js'

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    avatar: user.avatar,
    status: user.status,
  }
}

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(401, 'The provided credentials are incorrect.')
  }
  if (user.status === 'inactive') {
    throw new ApiError(403, 'Your account has been deactivated. Contact an administrator.')
  }

  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)

  user.refreshToken = refreshToken
  await user.save()

  await ActivityLog.create({
    user: user._id,
    action: 'login',
    module: 'auth',
    description: `${user.name} logged in`,
    ipAddress: req.ip,
  })

  res.json({ user: formatUser(user), accessToken, refreshToken })
})

export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) throw new ApiError(401, 'Refresh token required.')

  let payload
  try {
    payload = verifyRefreshToken(refreshToken)
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh token.')
  }

  const user = await User.findById(payload.id).select('+refreshToken')
  if (!user || user.refreshToken !== refreshToken) {
    throw new ApiError(401, 'Invalid refresh token.')
  }

  const accessToken = generateAccessToken(user)
  res.json({ accessToken })
})

export const logout = asyncHandler(async (req, res) => {
  req.user.refreshToken = undefined
  await req.user.save()

  await ActivityLog.create({
    user: req.user._id,
    action: 'logout',
    module: 'auth',
    description: `${req.user.name} logged out`,
    ipAddress: req.ip,
  })

  res.json({ message: 'Logged out successfully.' })
})

export const me = asyncHandler(async (req, res) => {
  res.json({ user: formatUser(req.user) })
})

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body
  if (name !== undefined) req.user.name = name
  if (phone !== undefined) req.user.phone = phone
  await req.user.save()
  res.json({ user: formatUser(req.user) })
})

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body

  const user = await User.findById(req.user._id).select('+password')
  if (!(await bcrypt.compare(currentPassword, user.password))) {
    throw new ApiError(422, 'Current password is incorrect.', { currentPassword: ['Current password is incorrect.'] })
  }

  user.password = await bcrypt.hash(newPassword, 10)
  await user.save()
  res.json({ message: 'Password changed successfully.' })
})

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email })

  // Always return the same response to avoid leaking which emails exist.
  // In production: generate a signed token, store its hash, and email a reset link via Nodemailer.
  if (user) {
    // await sendPasswordResetEmail(user)
  }

  res.json({ message: 'If that account exists, a reset link has been sent.' })
})

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // In production: verify the reset token against a stored hash before proceeding.
  const user = await User.findOne({ email })
  if (!user) throw new ApiError(400, 'Invalid or expired reset link.')

  user.password = await bcrypt.hash(password, 10)
  await user.save()

  res.json({ message: 'Password has been reset. You can now log in.' })
})
