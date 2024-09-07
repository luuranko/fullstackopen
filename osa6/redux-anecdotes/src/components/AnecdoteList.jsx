import { useSelector, useDispatch } from 'react-redux'
import { voteId } from '../reducers/anecdoteReducer'
const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => {
    if (state.filter) {
      return state.anecdotes.filter(a => a.content.includes(state.filter))
    }
    return state.anecdotes
  })

  const vote = id => {
    dispatch(voteId(id))
  }

  const anecdoteComparer = (a, b) => {
    if (a.votes - b.votes === 0) return a.content.localeCompare(b.content)
    return b.votes - a.votes
  }

  return (
    <div>
      {anecdotes.toSorted(anecdoteComparer).map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
