require('dotenv').config()

const compression = require('compression')
const express = require('express')
const expressPino = require('express-pino-logger')
const createError = require('http-errors')
const path = require('path')
const sassMiddleware = require('node-sass-middleware')

const logger = require('./helpers/logger')
const httpsRedirect = require('./helpers/httpsRedirect')

const app = express()
const port = process.env.PORT || 3000

app.locals.title = 'Monzo App'

if (process.env.NODE_ENV !== 'test') {
  app.use(expressPino({ logger }))
}

app.set('views', path.join(__dirname, 'views'), { maxAge: 86400000 })
app.set('view engine', 'pug')
app.use(compression())
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false,
}))
app.use(express.static(path.join(__dirname, 'public')))

app.use(httpsRedirect)
app.get('/', async (req, res, next) => {
  res.render('index')
})

app.use((req, res, next) => {
  next(createError(404))
})

// Custom error handler
app.use((err, req, res, next) => {
  // Set local message scoped to the request in question
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.locals.title = err.message

  res.status(err.status || 500)
  res.render('error')
})

app.listen(port, () => {
  if (process.env.NODE_ENV !== 'test') {
    logger.info(`:) jmes' monzo app listening on port ${port}!`)
  }
})

module.exports = app
