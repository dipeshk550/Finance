import { statementService } from '../services/statementService.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const getStatement = asyncHandler(async (req, res) => {
  const { period, from, to } = req.query
  const statement = await statementService.generate({ period, from, to })
  res.json(statement)
})
