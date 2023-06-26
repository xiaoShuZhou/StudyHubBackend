const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const blog = require('../models/blog')
const cloudinary = require('../utils/cloudinary')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

// get all blogs from a specific user
blogsRouter.get('/user/:id', async (request, response) => {
  const blogs = await Blog.find({ user: request.params.id }).populate('user', { username: 1, name: 1 })
  if (blogs) {
    response.json(blogs)
  } else {
    response.status(404).end()
  }
})


blogsRouter.post('/', upload.single('image'), async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  if (!body.title) {
    return response.status(400).end()
  }

  const user = await User.findById(decodedToken.id)

  // Upload the file to Cloudinary
  let imageUrl = ''
  if (request.file) {
    const result = await cloudinary.uploader.upload(request.file.path)
    imageUrl = result.secure_url
  }

  const blog = new Blog({
    title: body.title,
    author: user.name,
    content: body.content,
    imageurl: imageUrl,
    user : user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.json(savedBlog)
})



blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  const blog = await Blog.findById(request.params.id)
  if (blog.user.toString() !== decodedToken.id.toString()) {
    return response.status(401).json({ error: 'token invalid' })
  }

  if (!blog) {
    return response.status(204).end()
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

// updating the information of an individual blog post.The application mostly needs to update the number of likes for a blog post
blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})



module.exports = blogsRouter
