const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  imageurl: String,
  content: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,  // This is the option for Mongoose to manage createdAt and updatedAt fields
})

blogSchema.index({
  'title': 'text',
  'author': 'text',
  'content': 'text'
}, {
  weights: {
    title: 5,
    author: 3,
    content: 1
  },
  name: 'SearchIndex'
})


blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)
