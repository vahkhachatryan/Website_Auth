var express = require('express')
var env = require('dotenv').config()
var ejs = require('ejs')
var path = require('path')
var cors = require('cors')
var app = express()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
const cookieParser = require('cookie-parser')

mongoose.connect(
  'mongodb://127.0.0.1:27017/employee',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (err) => {
    if (!err) {
      console.log('MongoDB Connection Succeeded.')
    } else {
      console.log('Error in DB connection : ' + err)
    }
  }
)

var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {})

app.use(
  session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db
    })
  })
)

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with the domain of your frontend app
  credentials: true, // To allow cookies to be sent and received
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.static(__dirname + '/views'))

var index = require('./routes/index')
app.use('/', index)

app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.send(err.message)
})



// Fetch s  essions for a user
app.get('/sessions', (req, res) => {
  
  try {
    // In a real application, authenticate the user
    const userId = req.userId // Simplified: use a real authentication mechanism
    const sessions = users[userId]?.sessions || []
    res.json(sessions)
  } catch (error) {
    console.error('Failed to fetch sessions:', error)
    res.status(500).send('Internal Server Error')
  }
})

// Delete a specific session for a user
app.delete('/sessions/:sessionId', (req, res) => {
   try {
    // In a real application, authenticate the user
    const userId = req.userId // Simplified: use a real authentication mechanism
    const { sessionId } = req.params
    const userSessions = users[userId]?.sessions

    if (userSessions) {
      users[userId].sessions = userSessions.filter((session) => session.id !== sessionId)
      res.status(204).send()
    } else {
      res.status(404).send('Session not found')
    }
  } catch (error) {
    console.error('Failed to delete session:', error)
    res.status(500).send('Internal Server Error')
  }
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found')
  err.status = 404
  next(err)
})

const PORT = process.env.PORT || 3003
app.listen(PORT, function () {
  console.log('Server is started on http://127.0.0.1:' + PORT)
})
