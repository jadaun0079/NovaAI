import { signInWithPopup } from 'firebase/auth'
import React from 'react'
import { auth, googleProvider } from '../utils/firebase'

function App() {

  const handleLogin=async(token)=>{
    try {
      const{data}=await api.post("/auth/login",token)
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  
  }


  const googleLogIn=async ()=>{
    const data = await signInWithPopup(auth,googleProvider)
    const token =data.user.getIdToken()
    console.log(token);
    
    await handleLogin(token)
    console.log(data);
    
  }
  return (
    <div className='w-full h-screen bg-black flex items-center justify-center'>
      <button className='w-50 h-24 bg-white ' onClick={googleLogIn}>
        Login with google
      </button>
    </div>
  )
}

export default App
