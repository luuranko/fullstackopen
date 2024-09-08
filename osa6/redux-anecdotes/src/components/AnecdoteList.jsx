import { useSelector, useDispatch } from 'react-redux'
import { voteId } from '../reducers/anecdoteReducer'
import {
  clearNotification,
  showNotification,
} from '../reducers/notificationReducer'
const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => {
    if (state.filter) {
      return state.anecdotes.filter(a => a.content.includes(state.filter))
    }
    return state.anecdotes
  })

  const vote = anecdote => {
    dispatch(voteId(anecdote.id))
    const notification = `you voted anecdote '${anecdote.content}'`
    dispatch(showNotification(notification))
    setTimeout(() => dispatch(clearNotification(notification)), 5000)
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
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
