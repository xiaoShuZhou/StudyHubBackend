const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')

const Blog = require('../models/blog')


// describe('the blog list application returns the correct amount of blog posts in the JSON format.', () => {


const testBlogs= [
  {
    title: '10 Tips for Better Time Management',
    author: 'John Doe',
    url: 'https://example.com/10-tips-for-better-time-management',
    likes: 500
  },
  {
    title: 'The Benefits of Meditation',
    author: 'Jane Smith',
    url: 'https://example.com/the-benefits-of-meditation',
    likes: 1000
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(testBlogs[0])
  await blogObject.save()
  blogObject = new Blog(testBlogs[1])
  await blogObject.save()
})


test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(2)
})


test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('verifies that the unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})


describe('addition of a new blog', () => {
  const newBlog = {
    title: 'The Top 10 Destinations for Solo Travelers',
    author: 'Emily Jones',
    url: 'https://example.com/top-10-destinations-for-solo-travelers',
    likes: 1200
  }

  test('verify that the total number of blogs in the system is increased by one', async () => {
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(testBlogs.length + 1)
  }
  )

  test('verify that the title of the new blog post is correct', async () => {
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body[2].title).toBe('The Top 10 Destinations for Solo Travelers')
  }
  )

  test('if the likes property is missing from the request, it will default to the value 0', async () => {
    const newBlogWithoutLikes = {
      title: 'there is no likes',
      author: 'Gugu',
      url: 'https://example.com/nolikes',
    }

    await api.post('/api/blogs').send(newBlogWithoutLikes).expect(200).expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    expect(response.body[2].likes).toBe(0)
  })

  test('if the title is missing from the request data, the backend responds to the request with the status code 400 Bad Request', async () => {
    const newBlogWithoutTitle = {
      author: 'Michael Johnson',
      url: 'https://example.com/wireless-bluetooth-earbuds',
      likes: 1500
    }
    await api.post('/api/blogs').send(newBlogWithoutTitle).expect(400)
  })

  test('if the url is missing from the request data, the backend responds to the request with the status code 400 Bad Request', async () => {
    const newBlogWithoutUrl =  {
      title: 'The Girl on the Train',
      author: 'Paula Hawkins',
      likes: 2200
    }
    await api.post('/api/blogs').send(newBlogWithoutUrl).expect(400)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogAtStart = await api.get('/api/blogs')
    const blogToDelete = blogAtStart.body[0]
    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)
    const blogAtEnd = await api.get('/api/blogs')
    expect(blogAtEnd.body).toHaveLength(blogAtStart.body.length - 1)
  })

  test('delete a blog that doesn\'t exist', async () => {
    const nonExistId = await helper.nonExistingId()
    await api
      .delete(`/api/blogs/${nonExistId}`)
      .expect(204)
  }, 100000
  )
})

describe('updating a blog', () => {
  test('put data with likes changed', async () => {
    const currentBlogsInDb = await helper.blogsInDb()
    const blogToUpdate = currentBlogsInDb[0]
    blogToUpdate.likes = 1000

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)

    const blogsAfterUpdate = await helper.blogsInDb()
    const contents = blogsAfterUpdate.map(response => response.likes)

    expect(contents).toContain(1000)
  }, 10000)

})

afterAll(async () => {
  await mongoose.connection.close()
})