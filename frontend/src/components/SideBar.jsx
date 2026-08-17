import React from 'react'
import { Coins, LogOut, Menu, MessageSquare, PanelLeftIcon, PanelRight, PenSquare, Plus, User, X, Brain, Sparkles, ChevronRight } from "lucide-react"
import { useState, useEffect } from 'react'
import { getConversations } from '../features/getConversations'
import { useDispatch, useSelector } from 'react-redux'
import { addConversation, setConversations, setSelectedConversation } from '../redux/conversationSlice'
import { createConversation } from '../features/createConversation'
import logOut from '../features/logOut'
import { setUserdata } from '../redux/userSlice'
import BillingDrawer from './BillingDrawer'
import { motion, AnimatePresence } from 'motion/react'

function SideBar() {
    const [collapsed, setCollapsed] = useState(false)
    const dispatch = useDispatch()
    const [imageError, setImageError] = useState(false)
    const { conversations, selectedConversation } = useSelector(state => state.conversation)
    const { userData } = useSelector(state => state.user)
    const [showBilling, setShowBilling] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        const getConv = async () => {
            const data = await getConversations()
            dispatch(setConversations(data))
        }
        getConv()
    }, [userData?._id])

    const handleCreateConversation = async () => {
        const data = await createConversation()
        dispatch(addConversation(data))
    }

    const creditPct = userData
        ? Math.round(((userData?.credits || 0) / (userData?.totalCredits || 1)) * 100)
        : 0

    // ─── Collapsed sidebar ───────────────────────────────────
    if (collapsed) {
        return (
            <div className='hidden lg:flex flex-col items-center w-[60px] h-screen shrink-0 py-4 gap-2'
                style={{
                    background: 'linear-gradient(180deg, #0d1117 0%, #080a0f 100%)',
                    borderRight: '1px solid rgba(255,255,255,0.05)',
                }}
            >
                {/* Expand button */}
                <button
                    onClick={() => setCollapsed(false)}
                    className='flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 transition-all duration-200 cursor-pointer mb-1'
                    style={{ background: 'transparent', border: 'none' }}
                    title='Expand sidebar'
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                    <PanelRight size={17} />
                </button>

                {/* New chat */}
                <button
                    className='flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 transition-all duration-200 cursor-pointer'
                    style={{ background: 'transparent', border: 'none' }}
                    onClick={() => dispatch(setSelectedConversation(null))}
                    title='New chat'
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                    <Plus size={17} />
                </button>

                {/* Conversation dots */}
                <div className='flex-1 overflow-y-auto px-2 pb-2 space-y-1 mt-2' style={{ scrollbarWidth: 'none' }}>
                    {Array.isArray(conversations) && conversations.map((conv) => {
                        const isActive = selectedConversation?._id === conv?._id
                        return (
                            <button
                                key={conv._id}
                                onClick={() => dispatch(setSelectedConversation(conv))}
                                className='flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-150 cursor-pointer border-none'
                                style={{
                                    background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
                                    border: isActive ? '1px solid rgba(99,102,241,0.25)' : '1px solid transparent',
                                }}
                                title={conv?.title || 'Chat'}
                                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                            >
                                <MessageSquare size={13} className={isActive ? 'text-indigo-400' : 'text-slate-500'} />
                            </button>
                        )
                    })}
                </div>

                {/* Avatar */}
                <div className='shrink-0 px-1.5'>
                    {(userData?.avatar && !imageError) ? (
                        <img
                            className='w-9 h-9 rounded-xl object-cover'
                            style={{ border: '2px solid rgba(99,102,241,0.3)' }}
                            src={userData?.avatar}
                            alt='avatar'
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className='w-9 h-9 rounded-xl flex items-center justify-center'
                            style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <User size={15} className='text-slate-400' />
                        </div>
                    )}
                </div>
            </div>
        )
    }

    // ─── Full sidebar ────────────────────────────────────────
    return (
        <>
            {/* Mobile hamburger */}
            <button
                className='lg:hidden fixed top-3.5 left-4 z-50 flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-200 transition-colors duration-150 cursor-pointer'
                style={{
                    background: 'rgba(13,17,23,0.95)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: 'none',
                }}
                onClick={() => setMobileOpen(true)}
            >
                <Menu size={14} />
            </button>

            {/* Mobile backdrop */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileOpen(false)}
                        className='lg:hidden fixed inset-0 z-40'
                        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar panel */}
            <div
                className={`fixed lg:static inset-y-0 left-0 z-50 w-[270px] h-screen shrink-0 flex flex-col transition-transform duration-300
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
                style={{
                    background: 'linear-gradient(180deg, #0d1117 0%, #0a0e18 100%)',
                    borderRight: '1px solid rgba(255,255,255,0.05)',
                    position: 'relative' /* for orbs */
                }}
            >
                {/* Ambient gradient orbs */}
                <div className='pointer-events-none absolute top-0 left-0 w-full h-full overflow-hidden'>
                    <div style={{
                        position: 'absolute', top: '-60px', left: '-60px',
                        width: '220px', height: '220px', borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }} />
                    <div style={{
                        position: 'absolute', bottom: '-40px', right: '-40px',
                        width: '160px', height: '160px', borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }} />
                </div>

                {/* ── Header ── */}
                <div className='flex items-center gap-2.5 px-4 py-[14px] shrink-0'
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>

                    {/* Desktop collapse / mobile close */}
                    <button
                        className='hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-600 hover:text-slate-300 transition-all duration-150 cursor-pointer'
                        style={{ background: 'transparent', border: 'none' }}
                        onClick={() => setCollapsed(true)}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                    >
                        <PanelLeftIcon size={16} />
                    </button>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className='lg:hidden flex items-center justify-center w-7 h-7 rounded-lg text-slate-600 hover:text-slate-300 transition-all duration-150 cursor-pointer'
                        style={{ background: 'transparent', border: 'none' }}
                    >
                        <X size={16} />
                    </button>

                    {/* Logo */}
                    <div className='flex items-center gap-2 flex-1'>
                        <div className='flex items-center justify-center w-7 h-7 rounded-lg shrink-0'
                            style={{
                                background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(124,58,237,0.25))',
                                border: '1px solid rgba(99,102,241,0.3)',
                                boxShadow: '0 0 12px rgba(99,102,241,0.15)',
                            }}>
                            <Brain size={14} className='text-indigo-400' />
                        </div>
                        <span className='text-[15px] font-bold tracking-tight'
                            style={{
                                background: 'linear-gradient(135deg, #f1f5f9, #94a3b8)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>
                            NovaAI
                        </span>
                    </div>

                    {/* Plan badge */}
                    <span className='text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-wide capitalize shrink-0'
                        style={{
                            background: 'rgba(99,102,241,0.12)',
                            border: '1px solid rgba(99,102,241,0.25)',
                            color: '#818cf8',
                        }}>
                        {userData?.plan || 'free'}
                    </span>

                    {/* New chat icon */}
                    <button
                        className='flex items-center justify-center w-7 h-7 rounded-lg text-slate-600 hover:text-slate-300 transition-all duration-150 cursor-pointer shrink-0'
                        style={{ background: 'transparent', border: 'none' }}
                        onClick={() => dispatch(setSelectedConversation(null))}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                        title='New chat'
                    >
                        <PenSquare size={14} />
                    </button>
                </div>

                {/* ── New Chat button ── */}
                <div className='px-3 pt-3 pb-2 shrink-0'>
                    <button
                        className='w-full flex items-center justify-center gap-2 text-[13px] font-semibold text-white rounded-xl py-[10px] transition-all duration-200 cursor-pointer'
                        style={{
                            background: 'linear-gradient(135deg, #4f46e5, #6d28d9)',
                            border: '1px solid rgba(99,102,241,0.3)',
                            boxShadow: '0 4px 16px rgba(79,70,229,0.25)',
                        }}
                        onClick={() => dispatch(setSelectedConversation(null))}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(79,70,229,0.40)' }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(79,70,229,0.25)' }}
                    >
                        <Plus size={15} />
                        New Chat
                    </button>
                </div>

                {/* ── Section label ── */}
                <div className='px-4 pt-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest shrink-0'
                    style={{ color: 'rgba(255,255,255,0.2)' }}>
                    {(!Array.isArray(conversations) || conversations.length === 0) ? 'No conversations yet' : 'Recents'}
                </div>

                {/* ── Conversation list ── */}
                <div className='flex-1 overflow-y-auto px-2.5 pb-2 space-y-0.5'>
                    {Array.isArray(conversations) && conversations.map((conv, i) => {
                        const isActive = selectedConversation?._id === conv?._id
                        return (
                            <motion.div
                                key={conv._id}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.25, delay: i * 0.04 }}
                                onClick={() => dispatch(setSelectedConversation(conv))}
                                className='flex items-center gap-2.5 cursor-pointer px-3 py-2.5 rounded-xl transition-all duration-150 group'
                                style={{
                                    background: isActive
                                        ? 'linear-gradient(135deg, rgba(99,102,241,0.14), rgba(124,58,237,0.08))'
                                        : 'transparent',
                                    border: isActive
                                        ? '1px solid rgba(99,102,241,0.22)'
                                        : '1px solid transparent',
                                    boxShadow: isActive ? '0 2px 12px rgba(99,102,241,0.08)' : 'none',
                                }}
                                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                            >
                                <div className='flex items-center justify-center shrink-0 w-[28px] h-[28px] rounded-lg transition-all duration-150'
                                    style={{
                                        background: isActive ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.05)',
                                        border: isActive ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
                                    }}>
                                    <MessageSquare size={12} className={isActive ? 'text-indigo-400' : 'text-slate-500'} />
                                </div>
                                <span className={`text-[13px] font-medium truncate flex-1 ${isActive ? 'text-slate-100' : 'text-slate-400'}`}>
                                    {conv?.title || 'New Chat'}
                                </span>
                                {isActive && (
                                    <ChevronRight size={12} className='text-indigo-400 shrink-0 opacity-60' />
                                )}
                            </motion.div>
                        )
                    })}
                </div>

                {/* ── Divider ── */}
                <div className='mx-3 shrink-0' style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

                {/* ── User profile section ── */}
                <div className='px-3 py-3 shrink-0'>
                    {userData ? (
                        <div className='flex items-center gap-2.5 rounded-2xl px-3 py-2.5 transition-all duration-150 cursor-pointer group'
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                        >
                            {/* Avatar */}
                            <div className='shrink-0 relative'>
                                {(userData?.avatar && !imageError) ? (
                                    <img
                                        className='w-9 h-9 rounded-xl object-cover'
                                        style={{ border: '2px solid rgba(99,102,241,0.35)' }}
                                        src={userData?.avatar}
                                        alt='avatar'
                                        onError={() => setImageError(true)}
                                    />
                                ) : (
                                    <div className='w-9 h-9 rounded-xl flex items-center justify-center'
                                        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(124,58,237,0.2))', border: '2px solid rgba(99,102,241,0.2)' }}>
                                        <User size={15} className='text-indigo-400' />
                                    </div>
                                )}
                                {/* Online dot */}
                                <span className='absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full'
                                    style={{ background: '#10b981', border: '2px solid #0d1117' }} />
                            </div>

                            {/* Name + plan */}
                            <div className='flex-1 min-w-0'>
                                <p className='text-[13px] font-semibold text-slate-100 truncate'>
                                    {userData?.name || 'User'}
                                </p>
                                {/* Credits bar */}
                                <div className='flex items-center gap-1.5 mt-1'>
                                    <div className='flex-1 h-1 rounded-full overflow-hidden'
                                        style={{ background: 'rgba(255,255,255,0.08)' }}>
                                        <div className='h-full rounded-full transition-all duration-500'
                                            style={{
                                                width: `${creditPct}%`,
                                                background: creditPct > 50
                                                    ? 'linear-gradient(90deg, #6366f1, #7c3aed)'
                                                    : creditPct > 20
                                                        ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                                                        : 'linear-gradient(90deg, #ef4444, #dc2626)',
                                            }} />
                                    </div>
                                    <span className='text-[10px] text-slate-600 shrink-0'>
                                        {userData?.credits || 0} cr
                                    </span>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className='flex items-center gap-1 shrink-0'>
                                <button
                                    onClick={() => setShowBilling(true)}
                                    className='flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-150 cursor-pointer'
                                    style={{ background: 'transparent', border: 'none', color: '#d97706' }}
                                    title='Billing'
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#f59e0b' }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d97706' }}
                                >
                                    <Coins size={15} />
                                </button>
                                <button
                                    className='flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-150 cursor-pointer'
                                    style={{ background: 'transparent', border: 'none', color: '#64748b' }}
                                    title='Sign out'
                                    onClick={() => {
                                        logOut()
                                        dispatch(setUserdata(null))
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171' }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b' }}
                                >
                                    <LogOut size={15} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button className='w-full flex items-center justify-center gap-2 text-[13px] font-medium text-slate-300 rounded-xl py-[11px] cursor-pointer transition-all duration-150'
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.08)',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>

            <BillingDrawer open={showBilling} onClose={() => setShowBilling(false)} />
        </>
    )
}

export default SideBar
