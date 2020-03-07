
module.exports.isAuthenticated = (req, res, next) => {
  console.log('Sesion user ', req.session.user)
  if (req.session.user) {
    next()
  } else {
    next(res.status(401).json())
  }
}

module.exports.isNotAuthenticated = (req, _, next) => {
  console.log('Sesion user ', req.session.user)
  if (req.session.user) {
    next(res.status(403).json())
  } else {
    next()
  }
}