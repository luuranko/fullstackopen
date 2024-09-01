import { useState } from 'react'
import PropTypes from 'prop-types'

const NewBlogForm = ({ handleAddBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setURL] = useState('')

  const addBlog = async event => {
    event.preventDefault()
    const resetFields = await handleAddBlog({
      title,
      author,
      url,
    })
    if (resetFields) {
      setTitle('')
      setAuthor('')
      setURL('')
    }
  }

  return (
    <div>
      <h2>create a new blog</h2>
      <form onSubmit={addBlog}>
        <p>
          title:{' '}
          <input
            type='text'
            value={title}
            name='Title'
            data-testid='title-input'
            onChange={({ target }) => setTitle(target.value)}
          />
        </p>
        <p>
          author:{' '}
          <input
            type='text'
            value={author}
            name='Author'
            data-testid='author-input'
            onChange={({ target }) => setAuthor(target.value)}
          />
        </p>
        <p>
          url:{' '}
          <input
            type='text'
            value={url}
            name='URL'
            data-testid='url-input'
            onChange={({ target }) => setURL(target.value)}
          />
        </p>
        <button type='submit' data-testid='create-blog-button'>
          create
        </button>
      </form>
    </div>
  )
}

NewBlogForm.propTypes = {
  handleAddBlog: PropTypes.func.isRequired,
}

NewBlogForm.displayName = 'NewBlogForm'

export default NewBlogForm
