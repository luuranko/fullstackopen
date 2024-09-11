import { createSlice } from '@reduxjs/toolkit'

const initialState = []

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification(state, action) {
      const newNotification = action.payload
      state.push(newNotification)
    },
    clearNotification(state, action) {
      const notificationToRemove = state.find(n => n === action.payload)
      return state.filter(n => n !== notificationToRemove)
    },
  },
})

export const { showNotification, clearNotification } = notificationSlice.actions

export const setNotification = (notification, timeoutSeconds) => {
  return async dispatch => {
    dispatch(showNotification(notification))
    setTimeout(
      () => dispatch(clearNotification(notification)),
      timeoutSeconds * 1000
    )
  }
}
export default notificationSlice.reducer
