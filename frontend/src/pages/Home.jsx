import { signInWithPopup } from 'firebase/auth'
import React from 'react'
import { auth, googleProvider } from '../../utils/firebase'
import api from '../../utils/axios'
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from 'react-redux';
import { setUserdata } from '../redux/userSlice';
import SideBar from '../components/SideBar';
import ChatArea from '../components/ChatArea';
import Artifact from '../components/Artifact';
import { motion, AnimatePresence } from 'motion/react'
import { Sparkles, Zap, Brain, Shield } from 'lucide-react'

function Home() {
    const { userData } = useSelector(state => state.user)
    const dispatch = useDispatch()

    const handleLogin = async (token) => {
        try {
            const { data } = await api.post("/api/auth/login", { token })
            dispatch(setUserdata(data))
        } catch (error) {
            console.log(error)
        }
    }

    const googleLogin = async () => {
        const data = await signInWithPopup(auth, googleProvider)
        const token = await data.user.getIdToken()
        console.log(token)
        await handleLogin(token)
        console.log(data)
    }

    return (
        <div className='h-screen flex bg-[#080a0f] text-white overflow-hidden'>
            <SideBar />
            <ChatArea />
            <Artifact />

            <AnimatePresence>
                {!userData && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className='fixed inset-0 z-50 flex items-center justify-center'
                            style={{
                                background: 'radial-gradient(ellipse at 50% 40%, rgba(99,102,241,0.12) 0%, rgba(8,10,15,0.92) 60%)',
                                backdropFilter: 'blur(20px)',
                            }}
                        >
                            {/* Ambient orbs */}
                            <div className='absolute top-1/4 left-1/4 w-64 h-64 rounded-full pointer-events-none'
                                style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' }}
                            />
                            <div className='absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full pointer-events-none'
                                style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)' }}
                            />

                            {/* Modal card */}
                            <motion.div
                                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 16, scale: 0.96 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className='relative w-[380px] mx-4 rounded-3xl p-8 flex flex-col gap-6 overflow-hidden'
                                style={{
                                    background: 'linear-gradient(145deg, rgba(17,24,39,0.95) 0%, rgba(13,17,23,0.98) 100%)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.06)',
                                }}
                            >
                                {/* Inner gradient highlight */}
                                <div className='absolute top-0 left-0 right-0 h-px'
                                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }}
                                />

                                {/* Logo + branding */}
                                <div className='flex flex-col items-center gap-3'>
                                    <div className='relative'>
                                        <div className='w-14 h-14 rounded-2xl flex items-center justify-center'
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(124,58,237,0.2))',
                                                border: '1px solid rgba(99,102,241,0.3)',
                                                boxShadow: '0 0 24px rgba(99,102,241,0.2)',
                                            }}
                                        >
                                            <Brain size={26} className='text-indigo-400' />
                                        </div>
                                        <div className='absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center'>
                                            <Sparkles size={8} className='text-white' />
                                        </div>
                                    </div>
                                    <div className='text-center'>
                                        <h1 className='text-[22px] font-bold tracking-tight'
                                            style={{
                                                background: 'linear-gradient(135deg, #f1f5f9, #94a3b8)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text',
                                            }}
                                        >
                                            CortexAI
                                        </h1>
                                        <p className='text-[13px] text-slate-500 mt-0.5'>
                                            Your intelligent AI assistant
                                        </p>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className='flex flex-col gap-2.5'>
                                    {[
                                        { icon: Zap, text: 'Multiple AI agents — coding, search, vision, PDF', color: 'text-amber-400' },
                                        { icon: Brain, text: 'Advanced reasoning with artifact generation', color: 'text-indigo-400' },
                                        { icon: Shield, text: 'Secure, private conversations', color: 'text-emerald-400' },
                                    ].map(({ icon: Icon, text, color }, i) => (
                                        <div key={i} className='flex items-center gap-3 px-3 py-2.5 rounded-xl'
                                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                                        >
                                            <Icon size={14} className={color} />
                                            <span className='text-[12px] text-slate-400'>{text}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Divider */}
                                <div className='h-px' style={{ background: 'rgba(255,255,255,0.06)' }} />

                                {/* Google sign-in */}
                                <button
                                    onClick={googleLogin}
                                    className='group relative w-full flex items-center justify-center gap-3 py-3 rounded-2xl text-[14px] font-semibold transition-all duration-200 cursor-pointer overflow-hidden'
                                    style={{
                                        background: 'rgba(255,255,255,0.96)',
                                        color: 'rgba(0,0,0,0.85)',
                                        boxShadow: '0 2px 16px rgba(0,0,0,0.3)',
                                        border: 'none',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,1)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.96)'}
                                >
                                    <FcGoogle size={18} />
                                    Continue with Google
                                </button>

                                <p className='text-center text-[11px] text-slate-600 leading-relaxed'>
                                    By continuing, you agree to our Terms of Service and Privacy Policy.
                                </p>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Home
