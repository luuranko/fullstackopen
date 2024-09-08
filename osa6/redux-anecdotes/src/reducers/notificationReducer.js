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
export default notificationSlice.reducer
