/* eslint-disable react/prop-types */
import { useState } from 'react'

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

const ContactList = ({persons}) => {
  return (
    <div>{persons.map((person) => <Person key={person.name} person={person}/>)}</div>
  )
}

const Person = ({person}) => {
  return (
    <p>{person.name} {person.number}</p>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')

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
    if (persons.some((person) => person.name === name)) {
      window.alert(`${name} is already added to phonebook`)
      return
    }
    if (!name || !number) {
      return;
    }
    const newPerson = { id: persons.length + 1, name: name, number: number }
    setPersons([...persons, newPerson])
    setNewName('')
    setNewNumber('')
  }

  const filteredPersons = () => {
    return persons.filter(
      (person) => person.name.toLowerCase().includes(nameFilter.toLowerCase())
    )
  }

  return (
    <div>
      <h2>Phonebook</h2>
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
      <ContactList persons={filteredPersons()}/>
    </div>
  )

}

export default App