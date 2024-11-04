import AnecdoteForm from './components/AnecdoteForm.jsx'
import Notification from './components/Notification.jsx'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from './requests.js'
import { useNotificationDispatch } from './NotificationContext.jsx'

const App = () => {
  const queryClient = useQueryClient()
  const dispatchNotification = useNotificationDispatch()

  const showNotification = text => {
    dispatchNotification({
      type: 'SET',
      text,
    })
    setTimeout(() => {
      dispatchNotification({
        type: 'UNSET',
      })
    }, 5000)
  }
  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: updatedAnecdote => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      const updatedAnecdotes = anecdotes.map(a =>
        a.id === updatedAnecdote.id ? updatedAnecdote : a
      )
      queryClient.setQueryData(['anecdotes'], updatedAnecdotes)
    },
  })
  const handleVote = anecdote => {
    const newVotes = anecdote.votes + 1
    updateAnecdoteMutation.mutate({ ...anecdote, votes: newVotes })
    showNotification(`Voted anecdote: ${anecdote.content}`)
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1,
    refetchOnWindowFocus: false,
  })

  if (result.isLoading) {
    return <div>Loading data...</div>
  } else if (result.isError) {
    return <div>Anecdote service is not available due to server issues.</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
      <Notification />
      <AnecdoteForm />

      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
