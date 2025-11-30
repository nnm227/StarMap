import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'dotenv/config'

import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import markerRoutes from './routes/markers.js'
import commentRoutes from './routes/comments.js'

// create the app
const app = express()

// it's nice to set the port number so it's always the same
app.set('port', process.env.PORT || 3000)

// middleware
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
)

// base route
app.get('/', (req, res) => {
  res.send('Welcome to the StarMap API!!!')
})

app.get('/up', (req, res) => {
  res.json({ status: 'up' })
})

// mount API routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/markers', markerRoutes)
app.use('/api/comments', commentRoutes)

app.listen(app.get('port'), () => {
  console.log(
    'App is running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('env')
  )
  console.log('  Press CTRL-C to stop\n')
})