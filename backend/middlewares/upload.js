import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { ApiError } from '../utils/ApiError.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads', 'receipts'))
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${unique}${path.extname(file.originalname)}`)
  },
})

const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']

function fileFilter(req, file, cb) {
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new ApiError(422, 'Only JPG, PNG, and PDF files are allowed.'))
  }
  cb(null, true)
}

export const uploadReceipt = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single('receipt')
