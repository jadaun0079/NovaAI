import { signInWithPopup } from 'firebase/auth'
import React, { useEffect } from 'react';
import { auth, googleProvider } from '../utils/firebase'
import api from '../utils/axios'
import Home from './pages/Home'
import getCurrentUser from './features/getCurrentUser.js'

function App() {
useEffect(()=>{
  const getUser=async () => {
  const data = await getCurrentUser()
  }
  getUser()
},[])

  return (
    <>
    <Home />
    </>
  )
}

export default App
