const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

blogsRouter.post('/', userExtractor, async (req, res) => {
  const user = await User.findById(req.user.id)
  const blog = new Blog({
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes || 0,
    user: user._id,
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (blog.user.toString() === req.user.id.toString()) {
    await blog.deleteOne()
    res.status(204).end()
  } else {
    res.status(400).json({ error: 'You may only delete blogs you created' })
  }
})

blogsRouter.put('/:id', async (req, res) => {
  const blog = {
    title: req.body.title,
    url: req.body.url,
    author: req.body.author,
    likes: req.body.likes,
  }
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
    new: true,
    runValidators: true,
    context: 'query',
  })
  res.status(200).json(updatedBlog)
})

module.exports = blogsRouter
