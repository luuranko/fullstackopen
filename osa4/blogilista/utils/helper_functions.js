const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = blogs => {
  return blogs.slice().sort((a, b) => b.likes - a.likes)[0]
}

const mostBlogs = blogs => {
  const blogsByAuthor = []
  blogs.forEach(blog => {
    const authorAdded = blogsByAuthor.find(el => el.author === blog.author)
    if (authorAdded) {
      authorAdded.blogs += 1
    } else {
      blogsByAuthor.push({
        author: blog.author,
        blogs: 1,
      })
    }
  })
  return blogsByAuthor.slice().sort((a, b) => b.blogs - a.blogs)[0]
}

const mostLikes = blogs => {
  const blogsByAuthor = []
  blogs.forEach(blog => {
    const authorAdded = blogsByAuthor.find(el => el.author === blog.author)
    if (authorAdded) {
      authorAdded.likes += blog.likes
    } else {
      blogsByAuthor.push({
        author: blog.author,
        likes: blog.likes,
      })
    }
  })
  return blogsByAuthor.slice().sort((a, b) => b.likes - a.likes)[0]
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
