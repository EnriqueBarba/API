const cors = require('cors')

const corsMiddleware = cors({
  origin: process.env.CORS_ORIGIN,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ['Content-Type', 'Origin', 'Access-Control-Allow-Origin'],
  credentials: true
})

module.exports = corsMiddleware