const { describe, test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const { usersInDb, setUpUsers, initialUsers } = require('./test_helper')

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await setUpUsers()
  })

  describe('user creation', () => {
    test('succeeds with status code 201 when provided with correct input', async () => {
      const usersAtStart = await usersInDb()
      const newUser = {
        username: 'newuser',
        password: 'password',
      }
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      const usersAtEnd = await usersInDb()
      assert.strictEqual(result.body.username, newUser.username)
      assert.strictEqual(
        usersAtEnd.find(user => user.username === newUser.username).username,
        newUser.username
      )
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    })

    test('fails with status code 400 if username is taken', async () => {
      const usersAtStart = await usersInDb()
      const newUser = {
        username: initialUsers[0].username,
        password: 'salainen',
      }
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      const usersAtEnd = await usersInDb()
      assert(result.body.error.includes('expected `username` to be unique'))
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('fails with status code 400 if username is too short', async () => {
      const usersAtStart = await usersInDb()
      const newUser = {
        username: 'ab',
        password: 'salainen',
      }
      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      const usersAtEnd = await usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('fails with status code 400 if password is too short', async () => {
      const usersAtStart = await usersInDb()
      const newUser = {
        username: 'newuser',
        password: 'ab',
      }
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      const usersAtEnd = await usersInDb()
      assert(
        result.body.error.includes('Password must be at least 3 characters')
      )
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('fails with status code 400 if no username given', async () => {
      const usersAtStart = await usersInDb()
      const newUser = {
        password: 'password',
      }
      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      const usersAtEnd = await usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('fails with status code 400 if no password given', async () => {
      const usersAtStart = await usersInDb()
      const newUser = {
        username: 'newuser',
      }
      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      const usersAtEnd = await usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
  })

  describe('login', () => {
    test('succeeds with correct credentials', async () => {
      const credentials = initialUsers[0]
      const login = await api.post('/api/login').send(credentials).expect(200)
      assert(login.body.token)
    })
    test('fails with incorrect credentials', async () => {
      const credentials = { username: 'random', password: 'randompassword' }
      const login = await api.post('/api/login').send(credentials).expect(401)
      assert(!login.body.token)
    })
  })

  after(async () => {
    await User.deleteMany({})
    await mongoose.connection.close()
  })
})
