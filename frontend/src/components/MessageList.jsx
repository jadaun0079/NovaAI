import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import MessageBubble from './MessageBubble'
import LoadingAnimation from './LoadingAnimation'
import { motion, AnimatePresence } from 'motion/react'
import { Brain, Sparkles, ArrowRight } from 'lucide-react'

const PROMPT_SUGGESTIONS = [
    { label: 'Write a Netflix clone', emoji: '🎬' },
    { label: 'Explain Redis in depth', emoji: '🧠' },
    { label: 'Build a dashboard UI', emoji: '📊' },
    { label: 'Debug my code', emoji: '🐛' },
    { label: 'Create a REST API', emoji: '⚡' },
    { label: 'Write unit tests', emoji: '✅' },
]

function MessageList() {
    const { selectedConversation } = useSelector(state => state.conversation)
    const { messages, isLoading } = useSelector(state => state.message)
    const bottomRef = useRef(null)

    useEffect(() => {
        requestAnimationFrame(() => {
            bottomRef?.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            })
        })
    }, [messages?.length, isLoading])

    const showEmpty = messages.length === 0 || !selectedConversation

    return (
        <div className='flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6'
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.06) transparent' }}>

            {showEmpty ? (
                /* ── Empty / welcome state ── */
                <div className='h-full flex flex-col items-center justify-center gap-8 text-center px-4'>
                    {/* Animated orb */}
                    <div className='relative'>
                        {/* Outer rings */}
                        {[0, 1, 2].map((i) => (
                            <div key={i} className='absolute inset-0 rounded-full'
                                style={{
                                    border: '1px solid rgba(99,102,241,0.15)',
                                    transform: `scale(${1.8 + i * 0.6})`,
                                    opacity: 0.6 - i * 0.15,
                                    animation: `pulse-glow ${2 + i * 0.5}s ease-in-out infinite`,
                                    animationDelay: `${i * 0.4}s`,
                                }} />
                        ))}

                        {/* Core orb */}
                        <div className='relative w-16 h-16 rounded-full flex items-center justify-center'
                            style={{
                                background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(124,58,237,0.25))',
                                border: '1px solid rgba(99,102,241,0.35)',
                                boxShadow: '0 0 32px rgba(99,102,241,0.2), 0 0 64px rgba(99,102,241,0.1)',
                                animation: 'float-orb 4s ease-in-out infinite',
                            }}>
                            <Brain size={28} className='text-indigo-400' />
                        </div>

                        {/* Sparkle dot */}
                        <div className='absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center'
                            style={{ background: 'linear-gradient(135deg, #22d3ee, #6366f1)', boxShadow: '0 0 10px rgba(34,211,238,0.4)' }}>
                            <Sparkles size={10} className='text-white' />
                        </div>
                    </div>

                    {/* Headline */}
                    <div className='flex flex-col gap-2'>
                        <h1 className='text-[28px] md:text-[32px] font-bold tracking-tight leading-tight'
                            style={{
                                background: 'linear-gradient(135deg, #f1f5f9 0%, #94a3b8 60%, #818cf8 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>
                            NovaAI
                        </h1>
                        <p className='text-[15px] font-medium text-slate-400'>
                            How can I help you today?
                        </p>
                        <p className='text-[13px] text-slate-600 max-w-[300px] leading-relaxed mx-auto'>
                            Ask me anything — coding, analysis, research, writing, or just a quick question.
                        </p>
                    </div>

                    {/* Suggestion chips */}
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-2.5 max-w-[520px] w-full'>
                        {PROMPT_SUGGESTIONS.map((s, idx) => (
                            <motion.button
                                key={idx}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: idx * 0.07 }}
                                className='group flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer'
                                style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.07)',
                                    color: '#64748b',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'rgba(99,102,241,0.08)'
                                    e.currentTarget.style.border = '1px solid rgba(99,102,241,0.2)'
                                    e.currentTarget.style.color = '#94a3b8'
                                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.08)'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)'
                                    e.currentTarget.style.color = '#64748b'
                                    e.currentTarget.style.boxShadow = 'none'
                                }}
                            >
                                <span className='text-base shrink-0'>{s.emoji}</span>
                                <span className='text-[12px] font-medium text-slate-400 truncate flex-1'>
                                    {s.label}
                                </span>
                                <ArrowRight size={11} className='text-slate-600 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity' />
                            </motion.button>
                        ))}
                    </div>
                </div>
            ) : (
                /* ── Message list ── */
                <div className='space-y-6 max-w-4xl mx-auto'>
                    {messages?.map((msg, i) => (
                        <motion.div
                            key={msg?._id || i}
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <MessageBubble
                                role={msg?.role}
                                content={msg?.content}
                                images={msg.images || []}
                            />
                        </motion.div>
                    ))}

                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25 }}
                        >
                            <LoadingAnimation />
                        </motion.div>
                    )}
                </div>
            )}

            <div ref={bottomRef} />
        </div>
    )
}

export default MessageList
