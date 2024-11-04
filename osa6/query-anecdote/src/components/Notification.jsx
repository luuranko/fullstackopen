import { useNotificationValue } from '../NotificationContext'

const Notification = () => {
  const content = useNotificationValue()
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  }

  if (!content) return null

  return <div style={style}>{content}</div>
}

export default Notification
