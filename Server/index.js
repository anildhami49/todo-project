const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const TodoModel = require('./Models/Todo')

const app = express()
app.use(cors())
app.use(express.json())

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'public')))

// MongoDB connection with retry logic and better error handling
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/TodoList'

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        })
        console.log('MongoDB Connected Successfully')
    } catch (err) {
        console.error('MongoDB Connection Error:', err)
        // Retry connection after 5 seconds
        setTimeout(connectDB, 5000)
    }
}

connectDB()

// Handle MongoDB connection errors after initial connection
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err)
})

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected. Attempting to reconnect...')
})

// Health check endpoint for Azure
app.get('/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    if (mongoose.connection.readyState === 1) {
        res.status(200).json({ status: 'healthy', database: dbStatus })
    } else {
        res.status(503).json({ status: 'unhealthy', database: dbStatus })
    }
})

app.get('/get', (req, res) => {
    TodoModel.find()
    .then(result => res.json(result))
    .catch(err => res.json(err))
})

app.put('/update/:id', (req, res) => {
    const {id} = req.params;
    TodoModel.findByIdAndUpdate({_id: id}, {done: true})
    .then(result => res.json(result))
    .catch(err => res.json(err))
})

app.delete('/delete/:id', (req, res) => {
    const {id} = req.params;
    TodoModel.findByIdAndDelete({_id: id})
    .then(result => res.json(result))
    .catch(err => res.json(err))
})

app.post('/add', (req, res) => {
    const task =req.body.task;
    TodoModel.create({
        task: task
    }).then(result => res.json(result))
    .catch(err => res.json(err))
})

// Serve React app for any other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})