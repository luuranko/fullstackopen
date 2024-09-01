const { expect } = require('@playwright/test')
export const loginWith = async (page, username, password) => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

export const createBlogWith = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByTestId('title-input').fill(title)
  await page.getByTestId('author-input').fill(author)
  await page.getByTestId('url-input').fill(url)
  await page.getByTestId('create-blog-button').click()
}

export const findBlog = async (page, title, author) => {
  const blog = await page
    .getByTestId('blog')
    .filter({ hasText: title })
    .filter({ hasText: author })
  return blog
}

export const expectMessageWithText = async (page, text) => {
  const messageContainer = await page.locator('.message')
  await expect(messageContainer).toContainText(text)
}

export const expectErrorMessageWithText = async (page, text) => {
  const errorContainer = await page.locator('.error')
  await expect(errorContainer).toContainText(text)
}

// Post blogs directly and refresh to save testing time as posting blogs is not important only their presence
export const postBlog = async (page, request, title, author, url) => {
  await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
  const loggedIn = await page.evaluate(() =>
    localStorage.getItem('loggedBloglistUser')
  )
  const token = JSON.parse(loggedIn).token
  console.log(token)
  await request.post('/api/blogs', {
    data: { title, author, url },
    headers: { Authorization: `Bearer ${token}` },
  })
}
