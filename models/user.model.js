const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const SALT_WORK_FACTOR = 10;

const COUNTRIES = []

const userSchema = new mongooseSchema({

    fullName: {
        type: String,
        required: [true, 'Full Name is required'],
        minlength: [3, 'Full Name needs at last 3 characters'],
        trim: true},
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [EMAIL_PATTERN, 'Email format is invalid']
        },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password needs at last 8 chars']
    },
    address: {
        country:{
            type: String,
            uppercase: true,
            required: [true, 'Specify a valid Country'],
            enum: COUNTRIES
        },
        postalCode:{
            type: String,
            required: [true, 'Provide a postal code']
        },
        street: {
            type: String,
            required: [true, 'Street field can not be empty']
        }
    }
    /*,
    billingDetails: ''
    */
},
{
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (db, ret) => {
        ret.id = db._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
      }
    }

})




userSchema.pre('save', function (next) {
    const user = this;
  
    if (user.isModified('password')) {
      bcrypt.genSalt(SALT_WORK_FACTOR)
        .then(salt => {
          return bcrypt.hash(user.password, salt)
            .then(hash => {
              user.password = hash;
              next();
            });
        })
        .catch(error => next(error));
    } else {
      next();
    }
  });
  
  userSchema.methods.checkPassword = function (password) {
    return bcrypt.compare(password, this.password);
  }

  const User = mongoose.model('User', userSchema);

module.exports = User;