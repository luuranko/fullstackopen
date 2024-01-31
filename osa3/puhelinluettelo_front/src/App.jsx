/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

const Filter = ({nameFilter, handleNameFilterChange}) => {
  return (
    <div>
      filter shown with <input value={nameFilter} onChange={handleNameFilterChange}/>
    </div>
  )
}

const AddPersonForm = ({addPerson, newName, newNumber, handleNameChange, handleNumberChange}) => {
  return (
    <div>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

const ContactList = ({persons, handleDeletePerson}) => {
  return (
    <div>{persons.map((person) => 
    <div key={person.id}>
      <Person person={person} handleDeletePerson={handleDeletePerson}/>
    </div>
    )}
    </div>
  )
}

const Person = ({person, handleDeletePerson}) => {
  return (
    <div>{person.name} {person.number} <button onClick={() => handleDeletePerson(person)}>delete</button> </div>
  )
}

const Notification = ({message, showError}) => {
  if (!message) return null;
  const classes = showError ? 'message error' : 'message'
  return (
    <div className={classes}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [message, setMessage] = useState('')
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    personService.getAll().then(res => setPersons(res))
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleNameFilterChange = (event) => {
    setNameFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const name = newName.trim()
    const number = newNumber.trim()
    const existingPerson = persons.find(person => person.name === name)
    if (!name || !number) {
      alert('Provide a name and a number')
      return;
    }
    if (existingPerson) {
      updateNumber(existingPerson, number)
    } else {
      const newPerson = { name: name, number: number }
      personService
        .create(newPerson)
        .then(res => {
          setPersons(persons.concat(res))
          setNewName('')
          setNewNumber('')
          showMessage(`Added ${res.name}`)
        })
    }
  }

  const updateNumber = (person, newNumber) => {
    if (!confirm (`${person.name} is already added to phonebook, replace the old number with a new one?`)) {
      return
    }
    const updatedPerson = { ...person, number: newNumber}
    personService
      .update(person.id, updatedPerson)
      .then(res => {
        setPersons(persons.map(p => p.id !== person.id ? p : res))
        setNewName('')
        setNewNumber('')
        showMessage(`Updated number of ${res.name}`)
      })
      .catch(() => {
        showMessage(`Error: ${person.name} has already been removed from server`, true)
        setPersons(persons.filter(p => p.id !== person.id))
      })
  }

  const handleDeletePerson = person => {
    if (confirm(`Delete ${person.name}?`)) {
      const id = person.id
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          showMessage(`Deleted ${person.name}`)
        })
        .catch(() => {
          showMessage(`Error: ${person.name} has already been removed from server`, true)
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const showMessage = (msg, isError = false) => {
    setMessage(msg)
    if (isError) setShowError(true)
    setTimeout(() => {
      setMessage(null)
      setShowError(false)
    }, 5000)
  }

  const filteredPersons = () => {
    return persons.filter(
      (person) => person.name.toLowerCase().includes(nameFilter.toLowerCase())
    )
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} showError={showError}/>
      <Filter
        nameFilter={nameFilter}
        handleNameFilterChange={handleNameFilterChange}
      />
      <h3>Add a new</h3>
      <AddPersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <ContactList persons={filteredPersons()} handleDeletePerson={handleDeletePerson}/>
    </div>
  )

}

export default App