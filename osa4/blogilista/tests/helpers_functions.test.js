const { test, describe } = require('node:test')
const assert = require('node:assert')
const {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
} = require('../utils/helper_functions')
const { blogList } = require('./testing_material')

test('dummy returns one', () => {
  const blogs = []

  const result = dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithOneBlog = [blogList[1]] // djikstra, likes 5
  const listWithThreeBlogs = blogList.slice(0, 3) // likes 24

  test('of empty list is zero', () => {
    assert.strictEqual(totalLikes([]), 0)
  })
  test('when list has only one blog equals the likes of that', () => {
    const result = totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
  test('of a bigger list is calculated correctly', () => {
    assert.strictEqual(totalLikes(listWithThreeBlogs), 24)
    assert.strictEqual(totalLikes(blogList), 36)
  })
})

describe('favoriteBlog', () => {
  const listWithOneBlog = [blogList[1]] // djikstra, likes 5
  const listWithThreeBlogs = blogList.slice(3)

  test('when list has only one blog equals that blog', () => {
    assert.strictEqual(favoriteBlog(listWithOneBlog).likes, 5)
  })
  test('is calculated correctly', () => {
    assert.strictEqual(favoriteBlog(listWithThreeBlogs).likes, 10)
    assert.strictEqual(favoriteBlog(blogList).likes, 12)
  })
  test('is undefined when list is empty', () => {
    assert.strictEqual(favoriteBlog([]), undefined)
  })
})

describe('mostBlogs', () => {
  const listWithOneBlog = [blogList[0]]
  const listWithFourBlogs = blogList.slice(0, 4)

  test('when list has only one blog has an author with blog count 1', () => {
    assert.strictEqual(mostBlogs(listWithOneBlog).blogs, 1)
  })
  test('of a bigger list is calculated correctly', () => {
    assert.strictEqual(mostBlogs(listWithFourBlogs).blogs, 2)
    assert.strictEqual(mostBlogs(blogList).blogs, 3)
  })
  test('is undefined when list is empty', () => {
    assert.strictEqual(mostBlogs([]), undefined)
  })
})

describe('mostLikes', () => {
  const listWithOneBlog = [blogList[0]]
  const listWithFourBlogs = blogList.slice(0, 4)

  test('when list has only one blog has an author with the like count of that blog', () => {
    assert.strictEqual(mostLikes(listWithOneBlog).likes, 7)
  })
  test('of a bigger list is calculated correctly', () => {
    assert.strictEqual(mostLikes(listWithFourBlogs).likes, 17)
    assert.strictEqual(mostLikes(blogList).likes, 17)
  })
  test('is undefined when list is empty', () => {
    assert.strictEqual(mostLikes([]), undefined)
  })
})
