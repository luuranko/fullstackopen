/* eslint-disable react/prop-types */
const Header = (props) => {
  return (
    <h2>{props.course}</h2>
  )
}

const Part = (props) => {
  return (
    <p>
      {props.name} {props.count}
    </p>
  )
}

const Content = ({parts}) => {
  return (
    <div>
      {parts.map(part => 
        <Part key={part.id} name={part.name} count={part.exercises} />
      )}
    </div>
  )
}

const Total = ({parts}) => {
  const total = parts.reduce((accum, part) => accum + part.exercises, 0)
  return (
    <p>
     <b>total of {total} exercises</b>
    </p>
  )
}

const Course = ({course}) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default Course