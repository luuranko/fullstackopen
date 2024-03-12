const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const initialBlogs = [
  {
    title: 'Älykköploki',
    author: 'Lare',
    url: 'jokin-url.fi',
    likes: 50,
  },
  {
    title: 'Paras blogi',
    author: 'Lur',
    url: 'toinen-url.fi',
    likes: 0,
  },
]

const initialUsers = [
  {
    username: 'eka',
    password: 'password',
  },
  {
    username: 'toka',
    password: '12345',
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'soon removed',
    url: 'soon-removed',
  })
  await blog.save()
  await blog.deleteOne()
  return blog._id.toString()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const setUpUsers = async () => {
  await User.deleteMany({})
  for (const user of initialUsers) {
    const passwordHash = await bcrypt.hash(user.password, 10)
    const userObject = new User({
      username: user.username,
      passwordHash,
    })
    await userObject.save()
  }
}

const setUpBlogs = async () => {
  await Blog.deleteMany({})
  const users = await usersInDb()
  for (let i = 0; i < initialBlogs.length; i++) {
    await new Blog({ ...initialBlogs[i], user: users[i].id }).save()
  }
  return await blogsInDb()
}

module.exports = {
  initialBlogs,
  initialUsers,
  blogsInDb,
  nonExistingId,
  usersInDb,
  setUpUsers,
  setUpBlogs,
}
