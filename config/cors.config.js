const cors = require('cors')

const corsMiddleware = cors({
  origin: process.env.CORS_ORIGIN,
  allowedHeaders: ['Content-Type', 'Origin'],
  credentials: true
})

module.exports = corsMiddleware