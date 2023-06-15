const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')

const mongoose = require('mongoose')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.tokenExtractor)
// app.use(middleware.tokenValidator)

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
// Define a schema for the image
const imageSchema = new mongoose.Schema({
  data: String,
  contentType: String
})
const Image = mongoose.model('Image', imageSchema)

app.post('/api/blogs/image', upload.single('file'), (req, res) => {
  // Convert the image to a Base64 string
  const img = new Buffer.from(req.file.buffer).toString('base64')

  // Create a new image and save it to MongoDB
  const image = new Image({
    data: img,
    contentType: req.file.mimetype
  })
  image.save().then(() => res.send('Success'))
})

app.get('/api/blogs/image/:id', async (req, res) => {
  const image = await Image.findById(req.params.id)

  if (image) {
    res.set('Content-Type', image.contentType)
    res.send(Buffer.from(image.data, 'base64'))
  } else {
    res.status(404).send('Not found')
  }
})



app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
module.exports = app