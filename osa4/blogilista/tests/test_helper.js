const Blog = require('../models/blog')

const initialBlogs = [
  {
    'title': 'Älykköploki',
    'author': 'Lare',
    'url': 'jokin-url.fi',
    'likes': 50
  },
  {
    'title': 'Paras blogi',
    'author': 'Lur',
    'url': 'toinen-url.fi',
    'likes': 0
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const nonExistingId = async () => {
  const blog = new Blog({ title: 'soon removed', url: 'soon-removed' })
  await blog.save()
  await blog.deleteOne()
  return blog._id.toString()
}

module.exports = {
  initialBlogs,
  blogsInDb,
  nonExistingId
}