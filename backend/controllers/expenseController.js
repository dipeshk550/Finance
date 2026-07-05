import path from 'path'
import { fileURLToPath } from 'url'
import { expenseService } from '../services/expenseService.js'
import { expenseRepository } from '../repositories/expenseRepository.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const listExpenses = asyncHandler(async (req, res) => {
  const { category, status, project, from, to, search, page, per_page: perPage } = req.query
  const result = await expenseService.list({ category, status, project, from, to, search, page, perPage })
  res.json(result)
})

export const createExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.create(req.body, req.user._id, req.file)
  res.status(201).json(expense)
})

export const getExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.find(req.params.id)
  if (!expense) throw new ApiError(404, 'Expense not found.')
  res.json(expense)
})

export const updateExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.update(req.params.id, req.body, req.file)
  if (!expense) throw new ApiError(404, 'Expense not found.')
  res.json(expense)
})

export const deleteExpense = asyncHandler(async (req, res) => {
  await expenseService.remove(req.params.id)
  res.json({ message: 'Expense deleted successfully.' })
})

export const downloadReceipt = asyncHandler(async (req, res) => {
  const expense = await expenseService.find(req.params.id)
  if (!expense || !expense.receiptPath) throw new ApiError(404, 'Receipt not found.')

  const filePath = path.join(__dirname, '..', expense.receiptPath.replace(/^\//, ''))
  res.download(filePath)
})

export const approveExpense = asyncHandler(async (req, res) => {
  const expense = await expenseRepository.update(req.params.id, { status: 'approved' })
  if (!expense) throw new ApiError(404, 'Expense not found.')
  res.json({ message: 'Expense approved.', data: expense })
})
