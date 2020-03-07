const User = require('../models/user.model');
const createError = require('http-errors');

module.exports.new = (req,res,next) => {
    
    const data = req.body;
    const user = new User({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        address:{
            country: data.country,
            postalCode: data.postalCode,
            street: data.street
        }
    })

    user.save()
    .then(user => res.status(201).json(user))
    .catch(next)
}

module.exports.login = (req,res,next) => {
    const { email,password } = req.body;
    
    if (!email || !password) {
        throw createError(400, 'Missing Credentials')
    }

    User.findOne({ email: email })
    .then(user => {
      if (!user) {
        throw createError(400, 'Invalid user or password');
      } else {
        return user.checkPassword(password)
          .then(match => {
            if (!match) {
              throw createError(400, 'Invalid user or password');
            } else {
              req.session.user = JSON.stringify(user);
              res.json(user);
            }
          })
      }
    })
    .catch(next);
}

module.exports.logout = (req, res) => {
  req.session.destroy();
  res.status(204).json();
}

module.exports.updateProfile = (req, res, next) => {

  User.findById(req.session.user.id)
		.then(
			user => {
				if (!user) {
					throw createError(404, 'User not found');
				} else {
          user.fullName = req.body.fullName
          user.email = req.body.email
          user.password = req.body.password
          user.address.country = req.body.country
          user.address.postalCode = req.body.postalCode
          user.address.street = req.body.street
          user.save().then(u => res.json(u))
					
				}
			}
		)
		.catch(next);
}