import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { verifyAccessToken } from '../utils/tokens.js'
import { User } from '../models/User.js'

export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    throw new ApiError(401, 'Unauthenticated.')
  }

  const token = header.split(' ')[1]

  let payload
  try {
    payload = verifyAccessToken(token)
  } catch {
    throw new ApiError(401, 'Invalid or expired token.')
  }

  const user = await User.findById(payload.id)
  if (!user) throw new ApiError(401, 'Unauthenticated.')
  if (user.status === 'inactive') throw new ApiError(403, 'Your account has been deactivated.')

  req.user = user
  next()
})

export function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, 'You do not have permission to perform this action.')
    }
    next()
  }
}
