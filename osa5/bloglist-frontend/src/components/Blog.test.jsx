import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog', () => {
  const blog = {
    title: 'Testable blog',
    author: 'Tester',
    url: 'test_url',
    likes: 0,
    user: { username: 'testusername', name: 'TestUser' },
  }

  test('renders title and author', () => {
    render(<Blog blog={blog} />)
    const title = screen.getByText('Testable blog', { exact: false })
    expect(title).toBeVisible()
    const author = screen.getByText('Tester', { exact: false })
    expect(author).toBeVisible()
    const url = screen.queryByText('test_url', { exact: false })
    expect(url).not.toBeVisible()
    const likes = screen.queryByText('0', { exact: false })
    expect(likes).not.toBeVisible()
  })

  test('blog is shown in full upon button press', async () => {
    render(<Blog blog={blog} />)
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    const url = screen.queryByText('test_url', { exact: false })
    expect(url).toBeVisible()
    const likes = screen.queryByText('0', { exact: false })
    expect(likes).toBeVisible()
    const username = screen.getByText('TestUser', { exact: false })
    expect(username).toBeVisible()
  })

  test('event handler called twice when like button clicked twice', async () => {
    const eventHandler = vi.fn()
    render(<Blog blog={blog} handleLike={eventHandler} />)
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(eventHandler.mock.calls).toHaveLength(2)
  })
})
