const { isRealUser, isLocalNetworkUser, humanizeDuration } = require("./helpers")

 const loginAttempts = {}

function trackLoginAttempts(req, res, next) {
  const ip = req.ip
  const email = req.body.email.toLowerCase().trim() // Normalize email
  const userIdentifier = `${email}-${ip}`

  // Check if this is a real user or local network user and bypass the restriction if it is
  if (isRealUser(ip, email) || isLocalNetworkUser(ip)) {
    return next()
  }

  // Initialize attempts for this user identifier if it doesn't exist
  if (!loginAttempts[userIdentifier]) {
    loginAttempts[userIdentifier] = { attempts: 0, lockUntil: null }
  }

  const now = Date.now()
  let userData = loginAttempts[userIdentifier]

  // Check if user is currently locked out
  if (userData.lockUntil && userData.lockUntil > now) {
    return res
      .status(429)
      .json({ message: `You must wait ${humanizeDuration(userData.lockUntil - now)} before trying again.` })
  }

  // Reset attempts if the lock period has passed
  if (userData.lockUntil && userData.lockUntil < now) {
    userData.attempts = 0
    userData.lockUntil = null
  }

  next()
}

const passwordAttempts = {}

// This function would be called within the login route
function checkFixedPasswordAttempt(email, hashedPassword, ip) {
  const passwordIdentifier = `${hashedPassword}-${ip}`

  if (!passwordAttempts[passwordIdentifier]) {
    passwordAttempts[passwordIdentifier] = { emails: new Set([email]), attempts: 1, lockUntil: null }
  } else {
    let data = passwordAttempts[passwordIdentifier]
    data.emails.add(email)
    data.attempts += 1

    // Check if attempts exceed the threshold
    // if (data.attempts > passwordAttemptThreshold) {
    //   // Apply lockout or notify administrators as necessary
    //   // For example, setting a lockUntil time
    //   data.lockUntil = Date.now() + 10 * 60 * 1000 // Lock for 10 minutes
    // }
  }
}
module.exports = {
  checkFixedPasswordAttempt,
  trackLoginAttempts,
  loginAttempts
}
