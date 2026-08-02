// here we store the data of user 
//for every filr that need the user data we take from here 

import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./userSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
})