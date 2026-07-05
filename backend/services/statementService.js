import { Donation } from '../models/Donation.js'
import { Income } from '../models/Income.js'
import { Expense } from '../models/Expense.js'
import { ApiError } from '../utils/ApiError.js'

const PERIODS = ['today', '7d', '1m', '3m', '6m', '1y', 'custom', 'all']

function resolveRange(period, from, to) {
  const now = new Date()
  const end = now

  if (period === 'custom') {
    if (!from || !to) throw new ApiError(422, 'Custom range requires both "from" and "to" dates.')
    const start = new Date(from)
    const customEnd = new Date(to)
    customEnd.setHours(23, 59, 59, 999)
    return { start, end: customEnd }
  }

  if (period === 'all' || !period) {
    return { start: new Date(0), end }
  }

  const start = new Date(now)
  switch (period) {
    case 'today':
      start.setHours(0, 0, 0, 0)
      break
    case '7d':
      start.setDate(start.getDate() - 7)
      break
    case '1m':
      start.setMonth(start.getMonth() - 1)
      break
    case '3m':
      start.setMonth(start.getMonth() - 3)
      break
    case '6m':
      start.setMonth(start.getMonth() - 6)
      break
    case '1y':
      start.setFullYear(start.getFullYear() - 1)
      break
    default:
      throw new ApiError(422, `Invalid period. Use one of: ${PERIODS.join(', ')}`)
  }

  return { start, end }
}

export const statementService = {
  async generate({ period = '1m', from, to }) {
    const { start, end } = resolveRange(period, from, to)
    const dateMatch = { date: { $gte: start, $lte: end } }

    const [donations, incomeEntries, expenseEntries] = await Promise.all([
      Donation.find(dateMatch).populate('donor', 'fullName email phone').sort({ date: -1 }),
      Income.find(dateMatch).sort({ date: -1 }),
      Expense.find(dateMatch).sort({ date: -1 }),
    ])

    // Per-donor totals: "who gave how much" within the selected range
    const donationsByDonorRaw = await Donation.aggregate([
      { $match: dateMatch },
      {
        $group: {
          _id: '$donor',
          totalAmount: { $sum: '$amount' },
          donationCount: { $sum: 1 },
          lastDonationDate: { $max: '$date' },
        },
      },
      { $sort: { totalAmount: -1 } },
      {
        $lookup: {
          from: 'donors',
          localField: '_id',
          foreignField: '_id',
          as: 'donor',
        },
      },
      { $unwind: { path: '$donor', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          donorId: '$_id',
          donorName: '$donor.fullName',
          donorEmail: '$donor.email',
          totalAmount: 1,
          donationCount: 1,
          lastDonationDate: 1,
        },
      },
    ])

    const donationTotal = donations.reduce((sum, d) => sum + d.amount, 0)
    const otherIncomeTotal = incomeEntries.reduce((sum, i) => sum + i.amount, 0)
    const expenseTotal = expenseEntries.reduce((sum, e) => sum + e.amount, 0)
    const totalIncome = donationTotal + otherIncomeTotal

    const incomeByCategoryRaw = await Income.aggregate([
      { $match: dateMatch },
      { $group: { _id: '$source', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
    ])

    const expenseByCategoryRaw = await Expense.aggregate([
      { $match: dateMatch },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
    ])

    return {
      period,
      range: { from: start, to: end },
      summary: {
        totalIncome,
        donationTotal,
        otherIncomeTotal,
        totalExpenses: expenseTotal,
        netBalance: totalIncome - expenseTotal,
        totalDonors: donationsByDonorRaw.length,
        totalDonations: donations.length,
        totalTransactions: donations.length + incomeEntries.length + expenseEntries.length,
      },
      donationsByDonor: donationsByDonorRaw,
      donations,
      incomeEntries,
      expenseEntries,
      incomeByCategory: incomeByCategoryRaw.map((r) => ({ category: r._id, total: r.total })),
      expenseByCategory: expenseByCategoryRaw.map((r) => ({ category: r._id, total: r.total })),
    }
  },
}
