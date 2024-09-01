import { useState } from 'react'
const Blog = ({ blog, handleLike, handleDelete, allowDeletion }) => {
  const [showingDetails, setShowingDetails] = useState(false)

  const blogStyle = {
    border: '1px solid black',
    margin: '0.5rem',
    padding: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    width: 'max-content',
  }

  const rowStyle = {
    display: 'flex',
    gap: '1rem',
  }

  return (
    <div style={blogStyle} className='blog' data-testid='blog'>
      <div style={rowStyle}>
        <div data-testid='blog-title'>{blog.title}</div>
        <div data-testid='blog-author'>{blog.author}</div>
        <button
          onClick={() => setShowingDetails(!showingDetails)}
          data-testid='show-details-button'>
          {showingDetails ? 'hide' : 'view'}
        </button>
      </div>
      <div style={{ display: showingDetails ? '' : 'none' }}>
        <div style={rowStyle} data-testid='blog-url'>
          {blog.url}
        </div>
        <div style={rowStyle}>
          <div>likes</div>
          <div data-testid='blog-likes'>{blog.likes}</div>
          <button onClick={() => handleLike(blog)} data-testid='like-button'>
            like
          </button>
        </div>
        <div style={rowStyle} data-testid='blog-user'>
          {blog.user.name}
        </div>
        <div style={rowStyle}>
          {allowDeletion && (
            <button
              onClick={() => handleDelete(blog)}
              data-testid='delete-button'>
              delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Blog
