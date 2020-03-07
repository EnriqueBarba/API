const cors = require('cors')

const allowedOrigins = [process.env.CORS_ORIGIN, 'http://localhost:3000']

const corsMiddleware = cors({
  origin: (origin, next) => {
    const isAllowed = !origin || allowedOrigins.some(o => o === origin);
    if(isAllowed) {
      next(null,isAllowed);
    } else {
      next(createError(401, "Not allowed by CORS"))
    }
  },
  credentials: true
})

module.exports = corsMiddleware