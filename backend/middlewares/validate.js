import { validationResult } from 'express-validator'
import { ApiError } from '../utils/ApiError.js'

export function validate(req, res, next) {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    const errors = {}
    result.array().forEach((err) => {
      if (!errors[err.path]) errors[err.path] = []
      errors[err.path].push(err.msg)
    })
    throw new ApiError(422, 'The given data was invalid.', errors)
  }
  next()
}
