require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const app = express()
const Person = require('./models/person')

const cors = require('cors')
app.use(cors())

app.use(express.json())
app.use(express.static('dist'))
morgan.token('body', function (req, res) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    const info = `Phonebook has info for ${persons.length} people`
    const reqTime = new Date()
    res.send(`<p>${info}</p><p>${reqTime}</p>`)
  })
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => res.json(persons))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(req.params.id, person, {new: true})
    .then(updatedPerson => res.json(updatedPerson))
    .catch(error => next(error))
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  if (!body.name) {
    return res.status(400).json({error: 'name missing'})
  } else if (!body.number) {
    return res.status(400).json({error: 'number missing'})
  }
  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
})

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndDelete(req.params.id).then(result => {
    res.status(204).end()
  }).catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})