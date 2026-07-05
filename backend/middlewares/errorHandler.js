import { ApiError } from '../utils/ApiError.js'

export function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`))
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let statusCode = err instanceof ApiError ? err.statusCode : err.statusCode || 500
  let message = err.message || 'Internal server error'
  let errors = err.errors || null

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 422
    message = 'The given data was invalid.'
    errors = Object.fromEntries(
      Object.entries(err.errors).map(([key, val]) => [key, [val.message]])
    )
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 422
    const field = Object.keys(err.keyPattern || {})[0] || 'field'
    message = 'The given data was invalid.'
    errors = { [field]: [`${field} already exists.`] }
  }

  // Mongoose invalid ObjectId
  if (err.name === 'CastError') {
    statusCode = 404
    message = 'Resource not found.'
  }

  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    console.error(err)
  }

  res.status(statusCode).json({
    message,
    ...(errors ? { errors } : {}),
  })
}
