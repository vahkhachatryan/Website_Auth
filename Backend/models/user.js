var mongoose = require('mongoose')
var Schema = mongoose.Schema
const bcrypt = require('bcrypt')


const deviceInfoSchema = new Schema({
  browser: String,
  os: String,
  isMobile: Boolean,
  isTablet: Boolean,
  isDesktop: Boolean,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

;(userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [
      {
        validator: function (value) {
          // Custom validation logic for email format
          return /^\S+@\S+\.\S+$/.test(value)
        },
        message: (props) => `${props.value} is not a valid email address!`
      }
    ]
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        // Custom validation logic for password
        return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{12,}$/.test(value)
      },
      message: (props) => `${props.value} does not meet the password requirements!`
    }
  },
  isActivated: {
    type: Boolean,
    default: false
  },

  username: { type: String, required: true },
  phone: {
    type: String,
    required: true,
    unique: true
  },

  devices: [deviceInfoSchema] 
})),
  userSchema.pre('save', function (next) {
    const user = this

    bcrypt.genSalt(10, function (err, salt) {
      if (err) return next(err)

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err)

        // user.password = hash
        next()
      })
    })
  })

  userSchema.pre('validate', async function (next) {
    // Skip this check if the user is being updated, not created
    if (!this.isNew && !this.isModified('email') && !this.isModified('phone')) {
      return next();
    }
  
    const userExists = await mongoose.models.User.findOne({
      $or: [{ email: this.email }, { phone: this.phone }]
    });
  
    // If the user exists and is not the current user (an update scenario)
    if (userExists && !userExists._id.equals(this._id)) {
      if (userExists.email === this.email) {
        this.invalidate('email', 'Email is already in use');
      }
      if (userExists.phone === this.phone) {
        this.invalidate('phone', 'Phone number is already in use');
      }
    }
    next();
  });
User = mongoose.model('User', userSchema)
module.exports = User
