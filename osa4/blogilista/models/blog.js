const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    minlength: 1,
    required: [true, 'Title required']
  },
  author: String,
  url: {
    type: String,
    minlength: 1,
    required: [true, 'URL required']
  },
  likes: {
    type: Number,
    required: [true, 'Number of likes required']
  }
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog