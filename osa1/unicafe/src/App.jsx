/* eslint-disable react/prop-types */
import { useState } from 'react'

const Button = ({text, clickHandler}) => {
  return (
    <button onClick={clickHandler}>{text}</button>
  )
}

const StatisticLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({good, neutral, bad, total}) => {
  if (total === 0) return (
      <p>No feedback given</p>
  )
  const average = (good - bad) / total
  const positive = `${good / total * 100}%`
  return (
    <table>
      <tbody>
        <StatisticLine text={"good"} value={good} />
        <StatisticLine text={"neutral"} value={neutral} />
        <StatisticLine text={"bad"} value={bad} />
        <StatisticLine text={"all"} value={total} />
        <StatisticLine text={"average"} value={average} />
        <StatisticLine text={"positive"} value={positive} />
      </tbody>
    </table>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)

  const increaseGood = () => {
    const newGood = good + 1
    setGood(newGood)
    setTotal(total + 1)
  }

  const increaseNeutral = () => {
    const newNeutral = neutral + 1
    setNeutral(newNeutral)
    setTotal(total + 1)
  }

  const increaseBad = () => {
    const newBad = bad + 1
    setBad(newBad)
    setTotal(total +1)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button text={"good"} clickHandler={() => increaseGood()} />
      <Button text={"neutral"} clickHandler={() => increaseNeutral()} />
      <Button text={"bad"} clickHandler={() => increaseBad()} />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} total={total} />
    </div>
  )
}

export default App
