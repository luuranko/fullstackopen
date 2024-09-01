import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import NewBlogForm from './components/NewBlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState('')
  const [errorNotification, setErrorNotification] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs => handleSetBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      // check if token has expired
      if (user.exp * 1000 > Date.now()) {
        setUser(user)
        blogService.setToken(user.token)
      }
    }
  }, [])

  const handleSetBlogs = blogs => {
    setBlogs(blogs.sort((a, b) => b.likes - a.likes))
  }

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
      handleError(error)
    }
  }

  const handleLogout = async event => {
    event?.preventDefault()
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
    blogService.setToken(null)
    setNotification('Logged out')
    hideNotification()
  }

  const handleAddBlog = async blog => {
    try {
      const newBlog = await blogService.create(blog)
      handleSetBlogs(blogs.concat(newBlog))
      setNotification(`Added a new blog: ${newBlog.title} by ${newBlog.author}`)
      hideNotification()
      newBlogFormRef.current.toggleVisibility()
      return true
    } catch (error) {
      return handleError(error)
    }
  }

  const handleLike = async blog => {
    try {
      const updatedBlog = await blogService.update({
        ...blog,
        likes: blog.likes + 1,
      })
      handleSetBlogs(blogs.map(b => (b.id !== blog.id ? b : updatedBlog)))
    } catch (error) {
      handleError(error)
    }
  }

  const handleDelete = async blog => {
    if (confirm(`Delete blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)
        handleSetBlogs(blogs.filter(b => b.id !== blog.id))
        setNotification(`Deleted ${blog.title} by ${blog.author}`)
        hideNotification()
      } catch (error) {
        handleError(error)
      }
    }
  }

  const handleError = error => {
    const msg = error.response.data.error
    console.error(error.response.status, msg)
    if (msg === 'token has expired') {
      setErrorNotification('Your session has expired, logging out')
      handleLogout()
      hideNotification(true)
      return true
    } else if (msg === 'invalid or missing token') {
      setErrorNotification('You must be logged in to add blogs')
      hideNotification(true)
      return true
    } else if (msg === 'invalid username or password') {
      setErrorNotification('Wrong username or password')
      hideNotification(true)
      return true
    } else if (msg === 'You may only delete blogs you created') {
      setErrorNotification(
        'Deletion failed: cannot delete blogs created by another account'
      )
      hideNotification(true)
      return false
    } else if (msg.includes('Blog validation failed')) {
      setErrorNotification('Blog is missing needed information')
      hideNotification(true)
      return false
    } else {
      setErrorNotification(msg)
      hideNotification(true)
      return false
    }
  }

  const hideNotification = (isError = false) => {
    if (isError) {
      setTimeout(() => {
        setErrorNotification('')
      }, 4000)
    } else {
      setTimeout(() => {
        setNotification('')
      }, 4000)
    }
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
              data-testid='username'
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div className='form-field'>
            password
            <input
              type='password'
              value={password}
              name='Password'
              data-testid='password'
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type='submit'>login</button>
        </form>
      </div>
    )
  }

  const newBlogFormRef = useRef()

  const bloglist = () => {
    return (
      <div>
        <h2>blogs</h2>
        <Notification text={notification} error={errorNotification} />
        <p>
          {user.name} logged in <button onClick={handleLogout}>logout</button>{' '}
        </p>
        <Togglable buttonLabel='new blog' ref={newBlogFormRef}>
          <NewBlogForm handleAddBlog={handleAddBlog} />
        </Togglable>
        <br />
        {blogs.map(blog => (
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={handleLike}
            handleDelete={handleDelete}
            allowDeletion={user.username === blog.user.username}
          />
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
