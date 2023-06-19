const mongoose = require('mongoose')
const imageSchema = new mongoose.Schema({
  name: String,
  imgURL: String,
})

imageSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Image = mongoose.model('Image', imageSchema)
