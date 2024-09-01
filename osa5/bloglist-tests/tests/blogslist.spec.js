const { test, describe, expect, beforeEach } = require('@playwright/test')
const {
  loginWith,
  createBlogWith,
  expectErrorMessageWithText,
  expectMessageWithText,
  findBlog,
  postBlog,
} = require('./helper')

const NAME = 'Tero Testaaja'
const USERNAME = 'testaaja'
const PASSWORD = 'salainen'

describe('Bloglist', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: NAME,
        username: USERNAME,
        password: PASSWORD,
      },
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to bloglist')).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
  })

  describe('Login', () => {
    test('user cannot log in with wrong credentials', async ({ page }) => {
      await loginWith(page, USERNAME, 'wrongpassword')
      await expectErrorMessageWithText(page, 'Wrong username or password')
      await expect(page.getByText(`${NAME} logged in`)).not.toBeVisible()
    })
    test('user can log in with correct credentials', async ({ page }) => {
      await loginWith(page, USERNAME, PASSWORD)
      await expect(page.getByText(`${NAME} logged in`)).toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
      await expectMessageWithText(page, `Logged in as ${USERNAME}`)
    })
  })

  describe('when logged in', () => {
    const title = 'Blogname'
    const author = 'Authorname'
    const url = 'blogurl'
    beforeEach(async ({ page }) => {
      await loginWith(page, USERNAME, PASSWORD)
    })
    test('user can log out', async ({ page }) => {
      await page.getByRole('button', { name: 'logout' }).click()
      await expectMessageWithText(page, `Logged out`)
      await expect(page.getByText('Log in to bloglist')).toBeVisible()
    })
    test('a new blog can be created', async ({ page }) => {
      await createBlogWith(page, title, author, url)
      const blog = await findBlog(page, title, author)
      await expectMessageWithText(
        page,
        `Added a new blog: ${title} by ${author}`
      )
      await expect(blog).toBeVisible()
      await expect(blog.getByTestId('show-details-button')).toBeVisible()
    })
    test('blogs can be liked', async ({ page }) => {
      await createBlogWith(page, title, author, url)
      const blog = await findBlog(page, title, author)
      await blog.getByTestId('show-details-button').click()
      await expect(blog.getByTestId('blog-likes')).toContainText('0')
      await blog.getByTestId('like-button').click()
      await expect(blog.getByTestId('blog-likes')).toContainText('1')
    })
    test('user who added the blog can delete it', async ({ page }) => {
      await createBlogWith(page, title, author, url)
      const blog = await findBlog(page, title, author)
      await blog.getByTestId('show-details-button').click()
      page.on('dialog', dialog => dialog.accept())
      await blog.getByTestId('delete-button').click()
      await expect(blog).not.toBeVisible()
      await expect(page.locator('.blog')).not.toBeVisible()
    })
    test('blog deletion button is not visible to users who did not create the blog', async ({
      page,
      request,
    }) => {
      await request.post('/api/users', {
        data: {
          name: 'Another user',
          username: 'seconduser',
          password: 'secondpassword',
        },
      })
      await createBlogWith(page, title, author, url)
      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'seconduser', 'secondpassword')
      const blog = await findBlog(page, title, author)
      await blog.getByTestId('show-details-button').click()
      await expect(blog.getByTestId('delete-button')).not.toBeVisible()
    })
    test('blogs are ordered by likes in descending order', async ({
      page,
      request,
    }) => {
      await postBlog(page, request, 'Yksi', 'Author 1', 'URL 1')
      await postBlog(page, request, 'Kaksi', 'Author 2', 'URL 2')
      await postBlog(page, request, 'Kolme', 'Author 3', 'URL 3')
      await page.reload()
      const blogs = await page.getByTestId('blog')
      await expect(blogs).toHaveCount(3)
      await expect(blogs.first()).toContainText('Yksi')
      const blog2 = await findBlog(page, 'Kaksi', 'Author 2')
      await blog2.getByTestId('show-details-button').click()
      const blog3 = await findBlog(page, 'Kolme', 'Author 3')
      await blog3.getByTestId('show-details-button').click()
      await blog3.getByTestId('like-button').click()
      await expect(blog3.getByTestId('blog-likes')).toContainText('1')
      await expect(blogs.first()).toContainText('Kolme')
      await blog2.getByTestId('like-button').click()
      await expect(blog2.getByTestId('blog-likes')).toContainText('1')
      await blog2.getByTestId('like-button').click()
      await expect(blog2.getByTestId('blog-likes')).toContainText('2')
      await expect(blogs.first()).toContainText('Kaksi')
    })
  })
})
