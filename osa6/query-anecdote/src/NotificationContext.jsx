import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.text
    case 'UNSET':
      return ''
  }
}

const NotificationContext = createContext()

export const useNotificationValue = () => useContext(NotificationContext)[0]
export const useNotificationDispatch = () => useContext(NotificationContext)[1]

export const NotificationContextProvider = props => {
  const [notification, setNotification] = useReducer(notificationReducer, '')
  return (
    <NotificationContext.Provider value={[notification, setNotification]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext
