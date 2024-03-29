import { useState } from 'react'
const Blog = ({ blog, handleLike, handleDelete, allowDeletion }) => {
  const [showingDetails, setShowingDetails] = useState(false)

  const blogStyle = {
    border: '1px solid black',
    margin: '0.5rem',
    padding: '0.5rem',
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={() => setShowingDetails(!showingDetails)}>
          {showingDetails ? 'hide' : 'view'}
        </button>
      </div>
      <div style={{ display: showingDetails ? '' : 'none' }}>
        {blog.url}
        <br />
        likes {blog.likes}{' '}
        <button onClick={() => handleLike(blog)}>like</button>
        <br />
        {blog.user.name}
        <br />
        {allowDeletion && (
          <button onClick={() => handleDelete(blog)}>delete</button>
        )}
      </div>
    </div>
  )
}

export default Blog
