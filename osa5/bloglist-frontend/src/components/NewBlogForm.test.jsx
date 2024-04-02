import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewBlogForm from './NewBlogForm'

describe('NewBlogForm', () => {
  test('calls onSubmit function with correct params', async () => {
    const user = userEvent.setup()
    const handleAddBlog = vi.fn()
    render(<NewBlogForm handleAddBlog={handleAddBlog} />)
    const inputs = screen.getAllByRole('textbox')
    expect(inputs).to.have.length(3)
    const titleInput = inputs.find(i => i.name === 'Title')
    const authorInput = inputs.find(i => i.name === 'Author')
    const urlInput = inputs.find(i => i.name === 'URL')
    await user.type(titleInput, 'testing title')
    await user.type(authorInput, 'The TestAuthor')
    await user.type(urlInput, 'testurl dot com')
    const submitButton = screen.getByRole('button', { name: 'create' })
    await user.click(submitButton)
    expect(handleAddBlog.mock.calls).toHaveLength(1)
    const { title, author, url } = handleAddBlog.mock.calls[0][0]
    expect(title).to.equal('testing title')
    expect(author).to.equal('The TestAuthor')
    expect(url).to.equal('testurl dot com')
  })
})
