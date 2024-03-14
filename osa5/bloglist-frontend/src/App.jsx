import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setURL] = useState('')
  const [notification, setNotification] = useState('')
  const [errorNotification, setErrorNotification] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification(`Logged in as ${user.username}`)
      hideNotification()
    } catch (error) {
      console.error(error)
      setErrorNotification(`Wrong username or password`)
      hideNotification()
    }
  }

  const handleLogout = async event => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
    blogService.setToken(null)
    setNotification(`Logged out`)
    hideNotification()
  }

  const handleAddBlog = async event => {
    event.preventDefault()
    try {
      const blog = {
        title,
        author,
        url,
      }
      const newBlog = await blogService.create(blog)
      setBlogs(blogs.concat(newBlog))
      setTitle('')
      setAuthor('')
      setURL('')
      setNotification(`Added a new blog: ${newBlog.title} by ${newBlog.author}`)
      hideNotification()
    } catch (error) {
      console.error(error)
      setErrorNotification(`Blog is missing needed information`)
      hideNotification()
    }
  }

  const hideNotification = () => {
    setTimeout(() => {
      setNotification('')
      setErrorNotification('')
    }, 3000)
  }

  const loginForm = () => {
    return (
      <div>
        <h2>Log in to bloglist</h2>
        <Notification text={notification} error={errorNotification} />
        <form onSubmit={handleLogin}>
          <div className='form-field'>
            username{' '}
            <input
              type='text'
              value={username}
              name='Username'
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div className='form-field'>
            password
            <input
              type='password'
              value={password}
              name='Password'
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type='submit'>login</button>
        </form>
      </div>
    )
  }

  const bloglist = () => {
    return (
      <div>
        <h2>blogs</h2>
        <Notification text={notification} error={errorNotification} />
        <p>
          {user.name} logged in <button onClick={handleLogout}>logout</button>{' '}
        </p>
        <div>
          <h2>create a new blog</h2>
          <form onSubmit={handleAddBlog}>
            <p>
              title:{' '}
              <input
                type='text'
                value={title}
                name='Title'
                onChange={({ target }) => setTitle(target.value)}
              />
            </p>
            <p>
              author:{' '}
              <input
                type='text'
                value={author}
                name='Author'
                onChange={({ target }) => setAuthor(target.value)}
              />
            </p>
            <p>
              url:{' '}
              <input
                type='text'
                value={url}
                name='URL'
                onChange={({ target }) => setURL(target.value)}
              />
            </p>
            <button type='submit'>create</button>
          </form>
        </div>
        <br />
        {blogs.map(blog => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    )
  }

  return (
    <div>
      {!user && loginForm()}
      {user && bloglist()}
    </div>
  )
}

export default App
