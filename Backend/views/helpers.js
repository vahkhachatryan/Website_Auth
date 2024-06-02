const knownEmailDomains = ['trusteddomain.com']
const knownIPs = ['192.168.1.1'] // Example of known real user IPs

function isRealUser(ip, email) {
  const emailDomain = email.split('@')[1]
  return knownEmailDomains.includes(emailDomain) || knownIPs.includes(ip)
}

function isLocalNetworkUser(ip) {
  // Simple regex patterns for private IP ranges. For more comprehensive checks, consider using a library.
  const localIPPatterns = [
    /^192\.168\.\d{1,3}\.\d{1,3}$/, // Matches 192.168.x.x
    /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, // Matches 10.x.x.x
    /^172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3}$/ // Matches 172.16.x.x to 172.31.x.x
  ]

  return localIPPatterns.some((pattern) => pattern.test(ip))
}

function humanizeDuration(duration) {
  const seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

  const hoursPart = hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''} ` : ''
  const minutesPart = minutes > 0 ? `${minutes} minute${minutes > 1 ? 's' : ''} ` : ''
  const secondsPart = seconds > 0 ? `${seconds} second${seconds > 1 ? 's' : ''}` : ''

  return (hoursPart + minutesPart + secondsPart).trim()
}

module.exports = {
  isRealUser,
  isLocalNetworkUser,
  humanizeDuration
}
