const { describe, test, after, beforeEach, before } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const {
  initialBlogs,
  initialUsers,
  blogsInDb,
  nonExistingId,
  setUpUsers,
  setUpBlogs,
} = require('./test_helper')
const User = require('../models/user')

const getToken = async (username = initialUsers[0].username) => {
  const login = await api
    .post('/api/login')
    .send(initialUsers.find(user => user.username === username))
    .expect(200)
  return `Bearer ${login.body.token}`
}

describe('when there are initially some saved blogs', async () => {
  before(async () => {
    await setUpUsers()
  })
  beforeEach(async () => {
    await setUpBlogs()
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('the blogs have an "id" field as the identifier', async () => {
    const response = await api.get('/api/blogs')
    const firstBlogKeys = Object.keys(response.body[0])
    assert.strictEqual(firstBlogKeys.includes('id'), true)
    assert.strictEqual(firstBlogKeys.includes('_id'), false)
  })

  describe('posting a new blog', async () => {
    test('fails with status code 400 if user is not logged in', async () => {
      const newBlog = {
        title: 'Lisätty blogi',
        author: 'Lare',
        url: 'kolmas-url.fi',
        likes: 9999,
      }
      await api.post('/api/blogs').send(newBlog).expect(400)
      const res = await api.get('/api/blogs')
      assert.strictEqual(res.body.length, initialBlogs.length)
    })
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'Lisätty blogi',
        author: 'Lare',
        url: 'kolmas-url.fi',
        likes: 9999,
      }
      const token = await getToken()
      await api
        .post('/api/blogs')
        .set('Authorization', token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      const res = await api.get('/api/blogs')
      assert.strictEqual(res.body.length, initialBlogs.length + 1)
      const addedBlog = res.body.find(blog => blog.title === 'Lisätty blogi')
      assert.strictEqual(addedBlog.url, 'kolmas-url.fi')
    })

    test('the blog contains information of the user which posted it', async () => {
      const newBlog = {
        title: 'Lisätty blogi',
        author: 'Lare',
        url: 'kolmas-url.fi',
        likes: 9999,
      }
      const token = await getToken()
      await api
        .post('/api/blogs')
        .set('Authorization', token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      const res = await api.get('/api/blogs')
      const addedBlog = res.body.find(blog => blog.title === 'Lisätty blogi')
      const user = await User.findById(addedBlog.user.id)
      assert.strictEqual(initialUsers[0].username, user.username)
    })

    test('if not provided with another value, a new blog has 0 likes', async () => {
      const newBlog = {
        title: 'Lisätty blogi',
        author: 'Lare',
        url: 'kolmas-url.fi',
      }
      const token = await getToken()
      await api
        .post('/api/blogs')
        .set('Authorization', token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      const res = await api.get('/api/blogs')
      const addedBlog = res.body.find(blog => blog.title === 'Lisätty blogi')
      assert.strictEqual(addedBlog.likes, 0)
    })

    test('fails with status code 400 if blog does not have a title', async () => {
      const newBlog = {
        author: 'Lare',
        url: 'blog without title',
        likes: 1,
      }
      const token = await getToken()
      await api
        .post('/api/blogs')
        .set('Authorization', token)
        .send(newBlog)
        .expect(400)
      const res = await api.get('/api/blogs')
      assert.strictEqual(res.body.length, initialBlogs.length)
    })

    test('fails with status code 400 if blog does not have an URL', async () => {
      const newBlog = {
        title: 'blog without URL',
        author: 'Lare',
        likes: 1,
      }
      const token = await getToken()
      await api
        .post('/api/blogs')
        .set('Authorization', token)
        .send(newBlog)
        .expect(400)
      const res = await api.get('/api/blogs')
      assert.strictEqual(res.body.length, initialBlogs.length)
    })
  })

  describe('deletion of a blog', async () => {
    test('succeeds with status code 204 if id is valid and the same used added the blog', async () => {
      const blogsAtStart = await blogsInDb()
      const blogToDelete = blogsAtStart[0]
      const user = await User.findById(blogToDelete.user)
      const token = await getToken(user.username)
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', token)
        .expect(204)
      const blogsAtEnd = await blogsInDb()
      const urls = blogsAtEnd.map(blog => blog.url)
      assert(!urls.includes(blogToDelete.url))
      assert.strictEqual(blogsAtEnd.length, initialBlogs.length - 1)
    })
    test('fails with status code 401 if not logged in', async () => {
      const blogsAtStart = await blogsInDb()
      const blogToDelete = blogsAtStart[0]
      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(400)
      const blogsAtEnd = await blogsInDb()
      const urls = blogsAtEnd.map(blog => blog.url)
      assert(urls.includes(blogToDelete.url))
      assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
    })
    test('fails with status code 401 if user did not add the blog', async () => {
      const blogsAtStart = await blogsInDb()
      const blogToDelete = blogsAtStart[0]
      const user = await User.findById(blogsAtStart[1].user) // different blog with different user
      const token = await getToken(user.username)
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', token)
        .expect(400)
      const blogsAtEnd = await blogsInDb()
      const urls = blogsAtEnd.map(blog => blog.url)
      assert(urls.includes(blogToDelete.url))
      assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
    })
    test('fails with status code 400 if blog with that id does not exist', async () => {
      const token = await getToken()
      await api
        .delete(`/api/blogs/${nonExistingId}`)
        .set('Authorization', token)
        .expect(400)
      const blogsAtEnd = await blogsInDb()
      assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
    })
  })

  describe('making changes to a blog', async () => {
    test('succeeds with status code 200 if id and fields are valid', async () => {
      const blogs = await blogsInDb()
      const blogToModify = blogs[0]
      const modifiedBlog = {
        ...blogToModify,
        title: 'new title',
        url: 'new url',
        likes: 1,
        author: 'new author',
      }
      await api
        .put(`/api/blogs/${blogToModify.id}`)
        .send(modifiedBlog)
        .expect(200)
      const updatedBlogs = await blogsInDb()
      const updatedBlog = updatedBlogs.find(blog => blog.id === blogToModify.id)
      assert.deepStrictEqual(modifiedBlog, updatedBlog)
    })
    test('succeeds with status code 200 when only changing number of likes', async () => {
      const blogs = await blogsInDb()
      const blogToModify = blogs[0]
      const modifiedBlog = {
        ...blogToModify,
        likes: 99,
      }
      await api
        .put(`/api/blogs/${blogToModify.id}`)
        .send(modifiedBlog)
        .expect(200)
      const updatedBlogs = await blogsInDb()
      const updatedBlog = updatedBlogs.find(blog => blog.id === blogToModify.id)
      assert.deepStrictEqual(modifiedBlog, updatedBlog)
    })
    test('fails with status code 400 if blog with that id does not exist', async () => {
      const modifiedBlog = {
        title: 'new title',
        url: 'new url',
        likes: 1,
        author: 'new author',
      }
      await api
        .put(`/api/blogs/${nonExistingId}`)
        .send(modifiedBlog)
        .expect(400)
      const blogs = await blogsInDb()
      const blogsAtEnd = blogs.map(blog => {
        return {
          title: blog.title,
          author: blog.author,
          likes: blog.likes,
          url: blog.url,
        }
      })
      assert.deepStrictEqual(initialBlogs, blogsAtEnd)
    })
    test('fails with status code 400 if provided with invalid fields', async () => {
      const modifiedBlog = {
        likes: 'this is a string',
        author: 'new author',
      }
      await api
        .put(`/api/blogs/${nonExistingId}`)
        .send(modifiedBlog)
        .expect(400)
      const blogs = await blogsInDb()
      const blogsAtEnd = blogs.map(blog => {
        return {
          title: blog.title,
          author: blog.author,
          likes: blog.likes,
          url: blog.url,
        }
      })
      assert.deepStrictEqual(initialBlogs, blogsAtEnd)
    })
  })

  after(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    await mongoose.connection.close()
  })
})
