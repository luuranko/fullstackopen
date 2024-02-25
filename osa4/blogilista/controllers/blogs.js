const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  const blog = new Blog({
    'title': req.body.title,
    'author': req.body.author,
    'url': req.body.url,
    'likes': req.body.likes || 0
  })
  const savedBlog = await blog.save()
  res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
  const blog = {
    title: req.body.title,
    url: req.body.url,
    author: req.body.author,
    likes: req.body.likes
  }
  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    blog,
    { new: true, runValidators: true, context: 'query' })
  res.status(200).json(updatedBlog)
})

module.exports = blogsRouter