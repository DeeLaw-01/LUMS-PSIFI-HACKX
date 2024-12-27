import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import postRoutes from './routes/postRoutes.js'
// import messageRoutes from './routes/messageRoutes.js'
// import searchRoutes from './routes/searchRoutes.js'
import startupRoutes from './routes/startupRoutes.js'
import userRoutes from './routes/userRoutes.js'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:5173']
  })
)

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGO_URI)

const db = mongoose.connection

db.once('open', () => {
  console.log('MongoDB connected')
})

db.on('error', error => {
  console.log(error)
})

db.on('disconnected', () => {
  console.log('MongoDB disconnected')
})

// ROUTES

app.use('/auth', authRoutes)
app.use('/posts', postRoutes)
// app.use('/messages', messageRoutes)
// app.use('/search', searchRoutes)

app.get('/', (req, res) => {
  res.send('Server is running!')
})

app.use('/api/users', userRoutes)
app.use('/api/startups', startupRoutes)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
})
