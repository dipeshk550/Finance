import { donorService } from '../services/donorService.js'
import { Donation } from '../models/Donation.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'

export const listDonors = asyncHandler(async (req, res) => {
  const { search, status, country, page, per_page: perPage } = req.query
  const result = await donorService.list({ search, status, country, page, perPage })
  res.json(result)
})

export const createDonor = asyncHandler(async (req, res) => {
  const donor = await donorService.create(req.body)
  res.status(201).json(donor)
})

export const getDonor = asyncHandler(async (req, res) => {
  const donor = await donorService.find(req.params.id)
  if (!donor) throw new ApiError(404, 'Donor not found.')
  res.json(donor)
})

export const updateDonor = asyncHandler(async (req, res) => {
  const donor = await donorService.update(req.params.id, req.body)
  if (!donor) throw new ApiError(404, 'Donor not found.')
  res.json(donor)
})

export const deleteDonor = asyncHandler(async (req, res) => {
  const donor = await donorService.find(req.params.id)
  if (!donor) throw new ApiError(404, 'Donor not found.')
  await donorService.remove(req.params.id)
  res.json({ message: 'Donor deleted successfully.' })
})

export const donorDonationHistory = asyncHandler(async (req, res) => {
  const donor = await donorService.find(req.params.id)
  if (!donor) throw new ApiError(404, 'Donor not found.')

  const donations = await Donation.find({ donor: req.params.id }).sort({ date: -1 })
  res.json({ donor, donations })
})
