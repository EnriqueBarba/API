const cors = require('cors')

const origin = process.env.CORS_ORIGIN

const corsMiddleware = cors({
  origin: origin,
  credentials: true
})

module.exports = corsMiddleware