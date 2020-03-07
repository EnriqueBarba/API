
module.exports.isAuthenticated = (req, res, next) => {
  console.log('Session ', req.session)
  if (req.session.user) {
    next()
  } else {
    next(res.status(401).json())
  }
}

module.exports.isNotAuthenticated = (req, _, next) => {
  if (req.session.user) {
    next(res.status(403).json())
  } else {
    next()
  }
}