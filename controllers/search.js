const express = require('express')
const blog = require('../models/blog')
const Blog = require('../models/blog')
const searchRouter = require('express').Router()

searchRouter.get('/', async (req, res) => {
  const searchQuery = req.query.query
  if (!searchQuery) {
    return res.status(400).json({ error: 'Missing query parameter' })
  }

  try {
    const blogs = await Blog.find({
      $text: { $search: searchQuery }
    }, {
      score: { $meta: 'textScore' }
    })
      .sort({ score: { $meta: 'textScore' } })
      .exec()

    res.json(blogs)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = searchRouter
