/* eslint-disable react/prop-types */

import {useEffect, useState} from 'react'
import axios from 'axios'

const Search = ({handleSearchChange}) => {
  return (
    <div>
      find countries <input onChange={handleSearchChange} />
    </div>
  )
}

const Result = ({results}) => {

  const [shownCountry, setShownCountry] = useState(null)

  if (results.length > 10) {
    if (shownCountry !== null) {
      setShownCountry(null)
    }
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  } else if (results.length > 1 & shownCountry !== null) {
    return (
      <div>
        <table>
          <tbody>
            {results.map(country => 
              <tr key={country.id + '_' + country.name.common}>
                <td>
                  {country.name.common}
                </td>
                <td>
                  <button onClick={() => setShownCountry(country)}>
                    show
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <FullCountry country={shownCountry}/>
      </div>
    )
  } else if (results.length > 1) {
    return (
      <table>
        <tbody>
          {results.map(country => 
            <tr key={country.id + '_' + country.name.common}>
              <td>
                {country.name.common}
              </td>
              <td>
                <button onClick={() => setShownCountry(country)}>
                  show
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    )
  } else if (results.length === 1) {
    if (shownCountry !== results[0]) {
      setShownCountry(results[0])
    }
    return (
      <FullCountry country={shownCountry} />
    )
  } else {
    if (shownCountry !== null) {
      setShownCountry(null)
    }
    return(
      <div>
        No results.
      </div>
    )
  }
}

const FullCountry = ({country}) => {

  const capital = 'capital' in country ? country.capital[0] : '-'
  return (
    <div>
      <h1>{country.name.common}</h1>
      <h3>{country.name.official}</h3>
      capital {capital}
      <br/>
      region {country.region}, {country.subregion}
      <h2>languages</h2>
      <ul>
        {Object.values(country.languages).map(l => 
          <li key={country+'_'+l}>{l}</li>
        )}
      </ul>
      <img src={country.flags.png} alt={'Flag of ' + country.name.common}></img>
    </div>
  )
}

const App = () => {
  const [newSearch, setNewSearch] = useState('')
  const [countries, setCountries] = useState([])

  const hook = () => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }
  useEffect(hook, [])

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)
  }

  const results = countries.filter(c =>
    c.name.common.toLowerCase().includes(newSearch.toLowerCase())
  )

  return (
    <div>
      <Search handleSearchChange={handleSearchChange} />
      <Result
          results={results}
        />
    </div>
  );
}

export default App;