import { Donation } from '../models/Donation.js'
import { Donor } from '../models/Donor.js'
import { Expense } from '../models/Expense.js'
import { Income } from '../models/Income.js'

function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

function startOfMonth() {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

async function sum(Model, match) {
  const result = await Model.aggregate([
    { $match: match },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ])
  return result[0]?.total ?? 0
}

export const dashboardService = {
  async summary() {
    const todayStart = startOfToday()
    const monthStart = startOfMonth()

    const [
      donationIncome, otherIncome, totalExpenses,
      restrictedFunds, unrestrictedFunds,
      todayDonations, todayIncome, todayExpense,
      monthlyDonations, monthlyIncome, monthlyExpense,
      totalDonors,
    ] = await Promise.all([
      sum(Donation, { status: 'completed' }),
      sum(Income, {}),
      sum(Expense, { status: { $in: ['approved', 'paid'] } }),
      sum(Donation, { fundType: 'restricted' }),
      sum(Donation, { fundType: 'unrestricted' }),
      sum(Donation, { date: { $gte: todayStart } }),
      sum(Income, { date: { $gte: todayStart } }),
      sum(Expense, { date: { $gte: todayStart } }),
      sum(Donation, { date: { $gte: monthStart } }),
      sum(Income, { date: { $gte: monthStart } }),
      sum(Expense, { date: { $gte: monthStart } }),
      Donor.countDocuments(),
    ])

    const totalIncome = donationIncome + otherIncome

    return {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      restrictedFunds,
      unrestrictedFunds,
      todayIncome: todayDonations + todayIncome,
      todayExpense,
      monthlyIncome: monthlyDonations + monthlyIncome,
      monthlyExpense,
      totalDonors,
    }
  },

  async recentActivity() {
    const [recentDonations, recentExpenses] = await Promise.all([
      Donation.find().populate('donor', 'fullName').sort({ date: -1 }).limit(5),
      Expense.find().sort({ date: -1 }).limit(5),
    ])
    return { recentDonations, recentExpenses }
  },

  async charts() {
    const months = 6
    const monthlyTrend = []

    for (let i = months - 1; i >= 0; i--) {
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59)

      const [donationTotal, incomeTotal, expenseTotal] = await Promise.all([
        sum(Donation, { date: { $gte: monthStart, $lte: monthEnd } }),
        sum(Income, { date: { $gte: monthStart, $lte: monthEnd } }),
        sum(Expense, { date: { $gte: monthStart, $lte: monthEnd } }),
      ])

      monthlyTrend.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        income: donationTotal + incomeTotal,
        expense: expenseTotal,
      })
    }

    const expenseByCategoryRaw = await Expense.aggregate([
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
    ])
    const expenseByCategory = expenseByCategoryRaw.map((r) => ({ category: r._id, total: r.total }))

    return { monthlyTrend, expenseByCategory }
  },
}
