import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { User } from './models/User.js'

// This script only creates the login accounts needed to access the system.
// It intentionally does NOT insert any sample donors, donations, income, or
// expenses — all of that data should come from real usage against MongoDB.
async function seed() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  const passwordHash = await bcrypt.hash('Password@123', 10)

  await User.findOneAndUpdate(
    { email: 'admin@satsangparivar.org' },
    { name: 'Super Admin', password: passwordHash, role: 'super_admin', status: 'active' },
    { upsert: true, new: true }
  )

  await User.findOneAndUpdate(
    { email: 'accountant@satsangparivar.org' },
    { name: 'Finance Accountant', password: passwordHash, role: 'accountant', status: 'active' },
    { upsert: true, new: true }
  )

  console.log('Seeded login accounts only (no sample donors/donations/income/expenses):')
  console.log('  Super Admin:  admin@satsangparivar.org / Password@123')
  console.log('  Accountant:   accountant@satsangparivar.org / Password@123')
  console.log('All donor, donation, income, and expense data will come from what you enter in the app.')

  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
