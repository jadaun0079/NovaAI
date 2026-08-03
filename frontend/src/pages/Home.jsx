import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import api from '../../utils/axios';
import { auth, googleProvider } from '../../utils/firebase';
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice.js'
function Home() {

  //const {userData,setUserData}=useState("Jatin Pratap SIngh")
  // setUserData()
  const {userData}=useSelector(state=>state.user)
  const dispatch=useDispatch()
  const handleLogin = async (token) => {
    try {
      const { data } = await api.post("/api/auth/login", { token });
      dispatch(setUserData(data))
    } catch (error) {
      console.log(error);
    }
  };
  const handleLogout = async () => {
  try {
    const { data } = await api.post("/api/auth/logout")
    console.log(data)
  } catch (error) {
    console.log(error)
  }
};

  const googleLogIn = async () => {
    const data = await signInWithPopup(auth, googleProvider);
    const token = await data.user.getIdToken();

    console.log(token);

    await handleLogin(token);

    console.log(data);
  };

  return (
    <div className='h-screen flex bg-[#0d0f14] text-white overflow-hidden'>
       {!userData && <div className='fixed inset-0 z-50 flex items-center justify-center 
      bg-black/60 backdrop-blur'>
        <div className='w-[349px] bg-[#13151c] border border-white/[0.08]
         rounded-2xl p-7 flex flex-col gap-5'>
            <div className='flex flex-col gap-1'>
                <h2 className='text-[17px] font-semibold text-slate-100 tracking-tight'>Welcome to NovaAI</h2>
                <p className='text-[13px] text-slate-500'>Please login to continue using the app</p>

            </div>
            <button className='w-full flex items-center justify-center gap-3 py-[11px] rounded-xl
                              text-sm font-medium text-black bg-white
                              hover:bg-gray-100 active:bg-gray-200
                              border border-gray-300 shadow-lg shadow-gray-200/50
                              transition-all duration-150 cursor-pointer'onClick={googleLogIn}>
              <FcGoogle size={15} className='text-white'/>
              Continue With Google
            </button>
            <button onClick={handleLogout}
                 className='w-full py-[11px] rounded-xl bg-red-500 text-white mt-2 cursor-pointer'>
                 Logout
                 </button>

        </div>


      </div>}
      
    </div>
  );
}

export default Home;