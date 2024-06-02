var express = require('express')
const nodeMailer = require('nodemailer')
var router = express.Router()
var User = require('../models/user')
const jwt = require('jsonwebtoken')
const emailjs = require('@emailjs/nodejs')
const JWT_SECRET_KEY = 'jwt-pass-for-task'
const bcrypt = require('bcrypt')
const useragent = require('express-useragent')
const { trackLoginAttempts, checkFixedPasswordAttempt, loginAttempts } = require('../views/midlware')

router.use(useragent.express())

router.get('/', function (req, res, next) {
  return res.render('index.ejs')
})

router.get('/activation', async (req, res, next) => {
  jwt.verify(req.query.token, JWT_SECRET_KEY, async (err, decoded) => {
    if (err) {
      console.error('Failed to decode JWT token:', err.message)
      return res.sendStatus(400)
    } else {
      console.log('Decoded JWT token:', decoded)
      if (decoded && decoded.uID && decoded.email) {
        await User.findOneAndUpdate({ _id: decoded.uID }, { isActivated: true })
        return res.send({ Success: 'Success!' })
      } else {
        return res.sendStatus(400)
      }
    }
  })
})

router.post('/login', trackLoginAttempts, async (req, res) => {
  const { email, password } = req.body
  const userIdentifier = `${email}-${req.ip}`

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({ message: 'Invalid email' })
    }
    if (!user.isActivated) {
      return res.status(500).json({ message: 'Account is not verified' })
    }
    console.log(password, user.password, '55555555555555')
    // const passwordMatch = await bcrypt.compare(password, user.password)
    const passwordMatch = password === user.password

console.log();
    if (passwordMatch) {
      loginAttempts[userIdentifier].attempts++
      const lockoutMultiplier = Math.pow(2, loginAttempts[userIdentifier].attempts) // Exponential increase
      const lockoutDuration = lockoutMultiplier * 5 * 60 * 1000 // Base time in milliseconds, e.g., 5 minutes
      loginAttempts[userIdentifier].lockUntil = Date.now() + lockoutDuration

      const currentDeviceInfo = {
        browser: req.useragent.browser,
        os: req.useragent.os,
        isMobile: req.useragent.isMobile,
        isTablet: req.useragent.isTablet,
        isDesktop: req.useragent.isDesktop
      }
      console.log(user, '7777777777777', currentDeviceInfo)
      // Check if the device is already registered
      const deviceExists = user.devices.some(
        (device) =>
          device.browser === currentDeviceInfo.browser &&
          device.os === currentDeviceInfo.os &&
          device.isMobile === currentDeviceInfo.isMobile &&
          device.isTablet === currentDeviceInfo.isTablet &&
          device.isDesktop === currentDeviceInfo.isDesktop
      )
      console.log(deviceExists)
      // If the device is not registered, add it to the user's devices array
      if (!deviceExists) {
        user.devices.push(currentDeviceInfo)
        await user.save() // Save the updated user document
      }
      
      const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY)
      res.cookie('jwt_token', token, { httpOnly: true })

      return res.status(200).json({ message: 'Login successful', token })
    } else {
      checkFixedPasswordAttempt(email, password, req.ip) // Check for brute force with fixed password
      return res.status(401).json({ message: 'Invalid email or password' })
    }
  } catch (error) {
    console.error('Error:', error.message)
    res.status(500).json({ message: error })
  }
})

router.get('/protected', (req, res) => {
  // Retrieve JWT token from cookie
  const token = req.cookies.jwt_token
  if (token) {
    // Verify JWT token
    jwt.verify(token, JWT_SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized' })
      } else {
        const user = await User.findOne({ _id: decoded.userId })
        return res.status(200).json({ message: 'Protected resource accessed', user })
      }
    })
  } else {
    return res.status(401).json({ message: 'Unauthorized' })
  }
})

router.post('/register', async (req, res, next) => {
  const { email, phone, username, password, confirm } = req.body
  console.log(email, phone, username, password, confirm)
  if (password !== confirm) {
    return res.status(400).json({ error: 'Passwords do not match' })
  }

  const deviceInfo = {
    browser: req.useragent.browser + ' ' + req.useragent.version,
    os: req.useragent.os,
    isMobile: req.useragent.isMobile,
    isTablet: req.useragent.isTablet,
    isDesktop: req.useragent.isDesktop
  }

  var user = new User({
    email,
    username,
    phone,
    password,
    devices: [deviceInfo] // Add the device info here
  })
  //////////////////////////

  //////////////////////

  try {
    const newUser = await user.save()
    const token = jwt.sign({ email, uID: newUser._id }, JWT_SECRET_KEY, { expiresIn: '1h' })
    // console.log(token, '88888888888888888888888888888888888888888888')
    const activationLink = `http://127.0.0.1:3003/activation?token=${token}`
    console.log(activationLink)

    const transporter = nodeMailer.createTransport({
      service: 'gmail', // Use your email service provider
      auth: {
        user: 'vahekhachatryan000@gmail.com', // Your email address
        pass: 'sqpv cecp sbvz uqyh' // Your email password or app-specific password
      }
    })

    // Define email options
    const mailOptions = {
      from: 'vahekhachatryan000@gmail.com', // Sender's email address
      to: email, // Receiver's email address
      subject: 'Test Email', // Subject of the email
      html: `<p>Click the following link to activate your account:</p><p><a href="${activationLink}">${activationLink}</a></p>`
    }

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error:', error)
      } else {
        console.log('Email sent:', info.response)
      }
    })

    return res.send(200, '/login')
  } catch (err) {
    return res.send({ Error: err })
  }
})

// router.get('/login', function (req, res, next) {
//   console.log('9999999999999999999999999999999999999999')
//   return res.render('login.ejs')
// })

// router.get('/profile', function (req, res, next) {
//   console.log('profile')
//   User.findOne({ unique_id: req.session.userId }, function (err, data) {
//     console.log('data')
//     console.log(data)
//     if (!data) {
//       res.redirect('/')
//     } else {
//       //console.log("found");
//       return res.render('data.ejs', { name: data.username, email: data.email })
//     }
//   })
// })

router.get('/logout', function (req, res, next) {
  console.log('logout')
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err)
      } else {
        return res.redirect('/')
      }
    })
  }
})

router.get('/forgetpass', function (req, res, next) {
  res.render('forget.ejs')
})

router.post('/forgetpass', function (req, res, next) {
  //console.log('req.body');
  //console.log(req.body);
  User.findOne({ email: req.body.email }, function (err, data) {
    console.log(data)
    if (!data) {
      res.send({ Success: 'This Email Is not regestered!' })
    } else {
      // res.send({"Success":"Success!"});
      if (req.body.password == req.body.passwordConf) {
        data.password = req.body.password
        data.passwordConf = req.body.passwordConf

        data.save(function (err, Person) {
          if (err) console.log(err)
          else console.log('Success')
          res.send({ Success: 'Password changed!' })
        })
      } else {
        res.send({ Success: 'Password does not matched! Both Password should be same.' })
      }
    }
  })
})

module.exports = router
