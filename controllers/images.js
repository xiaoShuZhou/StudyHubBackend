const imagesRouter = require('express').Router()
const cloudinary = require('../utils/cloudinary')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

imagesRouter.post('/', upload.single('image'), (req, res) => {
  // Upload the file to Cloudinary
  cloudinary.uploader.upload(req.file.path, (error, result) => {
    if (error) {
      return res.status(500).send(error)
    }
    // Return the public URL of the uploaded file
    res.send(result.secure_url)
  })
})

module.exports = imagesRouter