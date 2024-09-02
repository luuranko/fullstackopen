import { useSelector, useDispatch } from 'react-redux'
import { voteId } from '../reducers/anecdoteReducer'
const AnecdoteList = () => {
  const anecdotes = useSelector(state => state)
  const dispatch = useDispatch()

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
