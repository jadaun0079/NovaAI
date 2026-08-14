import { MessageSquare, Hash } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'motion/react'

function Nav() {
    const { selectedConversation } = useSelector(state => state.conversation)
    const { messages } = useSelector(state => state.message)

    return (
        <AnimatePresence>
            {selectedConversation && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className='flex items-center gap-3 px-5 shrink-0'
                    style={{
                        height: '56px',
                        background: 'rgba(8,10,15,0.85)',
                        backdropFilter: 'blur(12px)',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        WebkitBackdropFilter: 'blur(12px)',
                    }}
                >
                    {/* Icon */}
                    <div className='flex items-center justify-center w-8 h-8 rounded-xl shrink-0'
                        style={{
                            background: 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(124,58,237,0.12))',
                            border: '1px solid rgba(99,102,241,0.25)',
                            boxShadow: '0 0 12px rgba(99,102,241,0.12)',
                        }}>
                        <MessageSquare size={13} className='text-indigo-400' />
                    </div>

                    {/* Title */}
                    <div className='flex-1 min-w-0'>
                        <p className='text-[14px] font-semibold text-slate-100 tracking-tight truncate'>
                            {selectedConversation?.title || 'New Chat'}
                        </p>
                    </div>

                    {/* Message count badge */}
                    <div className='flex items-center gap-1.5 px-2.5 py-1 rounded-full shrink-0'
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.08)',
                        }}>
                        <Hash size={9} className='text-slate-600' />
                        <span className='text-[11px] font-medium text-slate-500'>
                            {messages?.length || 0} messages
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default Nav
