import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const THINKING_LABELS = ['Thinking', 'Analyzing', 'Reasoning', 'Generating']

function LoadingAnimation() {
    const [labelIndex, setLabelIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setLabelIndex(prev => (prev + 1) % THINKING_LABELS.length)
        }, 1800)
        return () => clearInterval(interval)
    }, [])

    const label = THINKING_LABELS[labelIndex]

    return (
        <div className='flex items-center gap-3.5 py-1'>
            {/* Animated orb */}
            <div className='relative w-10 h-10 flex items-center justify-center shrink-0'>
                {/* Pulsing rings */}
                {[0, 0.5, 1.0].map((delay, i) => (
                    <motion.div
                        key={i}
                        className='absolute inset-0 rounded-full'
                        style={{ border: '1px solid rgba(99,102,241,0.25)' }}
                        initial={{ scale: 0.4, opacity: 0.6 }}
                        animate={{ scale: 2.2, opacity: 0 }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay,
                            ease: 'easeOut',
                        }}
                    />
                ))}

                {/* Inner glow ring */}
                <motion.div
                    className='absolute inset-0 rounded-full'
                    style={{
                        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
                    }}
                    animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Core dot */}
                <motion.div
                    className='w-3 h-3 rounded-full relative z-10'
                    style={{
                        background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
                        boxShadow: '0 0 14px rgba(129,140,248,0.7), 0 0 28px rgba(129,140,248,0.3)',
                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                        boxShadow: [
                            '0 0 14px rgba(129,140,248,0.7)',
                            '0 0 22px rgba(129,140,248,0.9)',
                            '0 0 14px rgba(129,140,248,0.7)',
                        ],
                    }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>

            {/* Animated label */}
            <div className='flex flex-col gap-0.5'>
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className='flex items-center gap-0.5'
                    >
                        {label.split('').map((ch, i) => (
                            <motion.span
                                key={`${label}-${i}`}
                                className='text-[13px] font-medium tracking-wide'
                                style={{ color: '#64748b' }}
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{
                                    duration: 1.6,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                    delay: i * 0.06,
                                }}
                            >
                                {ch}
                            </motion.span>
                        ))}
                        <span className='text-[13px] text-slate-600'>...</span>
                    </motion.div>
                </AnimatePresence>

                {/* Typing dots */}
                <div className='flex items-center gap-1 pl-0.5'>
                    {[0, 1, 2].map(i => (
                        <motion.div
                            key={i}
                            className='w-1 h-1 rounded-full'
                            style={{ background: 'rgba(99,102,241,0.5)' }}
                            animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                            transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: i * 0.15,
                                ease: 'easeInOut',
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default LoadingAnimation
