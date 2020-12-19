//configure database connection
const mongoose = require('mongoose')
const DB_URI = process.env.MONGO_URI

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
})

mongoose.connection.on('connected', () => console.log('mongo connected'))
mongoose.connection.on('error', err => console.log(err))
mongoose.connection.on('disconnected', () => console.log('disconnected'))

const gracefulShutdown = (msg, callback) => {
  mongoose.connection.close(() => {
    console.log('disconnected')
    callback()
  })
}

process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart', () => {
    process.kill(process.pid, 'SIGUSR2')
  })
})

process.once('SIGINT', () => {
  gracefulShutdown('app terminated', () => {
    process.exit(0)
  })
})

process.on('SIGTERM', () => {
  gracefulShutdown('app shutdown', () => {
    process.exit(0)
  })
})

require('../Model/Index')
