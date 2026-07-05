import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import path from 'path'
import { fileURLToPath } from 'url'

import apiRoutes from './routes/index.js'
import { notFound, errorHandler } from './middlewares/errorHandler.js'
import { swaggerSpec } from './config/swagger.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()

app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }))
app.use(compression())
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 300,
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api', limiter)

// Serve uploaded receipts statically (local storage mode)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use('/api', apiRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
