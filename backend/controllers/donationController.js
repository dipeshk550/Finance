import { donationService } from '../services/donationService.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'

export const listDonations = asyncHandler(async (req, res) => {
  const { donor, fund_type: fundType, status, from, to, page, per_page: perPage } = req.query
  const result = await donationService.list({ donor, fundType, status, from, to, page, perPage })
  res.json(result)
})

export const createDonation = asyncHandler(async (req, res) => {
  const donation = await donationService.create(req.body, req.user._id)
  res.status(201).json(donation)
})

export const getDonation = asyncHandler(async (req, res) => {
  const donation = await donationService.find(req.params.id)
  if (!donation) throw new ApiError(404, 'Donation not found.')
  res.json(donation)
})

export const updateDonation = asyncHandler(async (req, res) => {
  const donation = await donationService.update(req.params.id, req.body)
  res.json(donation)
})

export const deleteDonation = asyncHandler(async (req, res) => {
  await donationService.remove(req.params.id)
  res.json({ message: 'Donation deleted successfully.' })
})
