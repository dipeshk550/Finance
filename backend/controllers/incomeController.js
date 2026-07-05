import { incomeService } from '../services/incomeService.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'

export const listIncome = asyncHandler(async (req, res) => {
  const { source, category, from, to, page, per_page: perPage } = req.query
  const result = await incomeService.list({ source, category, from, to, page, perPage })
  res.json(result)
})

export const createIncome = asyncHandler(async (req, res) => {
  const income = await incomeService.create(req.body, req.user._id)
  res.status(201).json(income)
})

export const getIncome = asyncHandler(async (req, res) => {
  const income = await incomeService.find(req.params.id)
  if (!income) throw new ApiError(404, 'Income record not found.')
  res.json(income)
})

export const updateIncome = asyncHandler(async (req, res) => {
  const income = await incomeService.update(req.params.id, req.body)
  if (!income) throw new ApiError(404, 'Income record not found.')
  res.json(income)
})

export const deleteIncome = asyncHandler(async (req, res) => {
  await incomeService.remove(req.params.id)
  res.json({ message: 'Income record deleted successfully.' })
})
