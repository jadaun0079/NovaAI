import { Check, Copy, ExternalLink, X, Brain } from 'lucide-react'
import React, { useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { motion, AnimatePresence } from 'motion/react'

function MessageBubble({ role, content, images }) {
    const isUser = role === 'user'
    const [lightBox, setLightBox] = useState(null)
    const [copiedCode, setCopiedCode] = useState('')

    const copyCode = async (code) => {
        await navigator.clipboard.writeText(code)
        setCopiedCode(code)
        setTimeout(() => setCopiedCode(''), 2000)
    }

    return (
        <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>

            {/* AI avatar */}
            {!isUser && (
                <div className='flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-0.5'
                    style={{
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(124,58,237,0.2))',
                        border: '1px solid rgba(99,102,241,0.25)',
                        boxShadow: '0 0 12px rgba(99,102,241,0.1)',
                    }}>
                    <Brain size={14} className='text-indigo-400' />
                </div>
            )}

            {/* Message bubble */}
            <div
                className={`w-fit max-w-[90vw] md:max-w-[75%] break-words overflow-hidden leading-relaxed
                    ${isUser ? 'rounded-2xl rounded-tr-sm' : 'rounded-2xl rounded-tl-sm'}`}
                style={isUser ? {
                    background: 'linear-gradient(135deg, #4f46e5 0%, #6d28d9 100%)',
                    color: '#fff',
                    padding: '12px 16px',
                    boxShadow: '0 4px 20px rgba(79,70,229,0.3)',
                    border: '1px solid rgba(99,102,241,0.3)',
                } : {
                    background: 'transparent',
                    color: '#cbd5e1',
                    padding: '4px 0',
                    borderLeft: 'none',
                }}
            >
                {/* Images */}
                {images.length > 0 && (
                    <div className='flex flex-wrap gap-2 mb-3'>
                        {images.map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                onClick={() => setLightBox(img)}
                                loading='lazy'
                                onError={e => e.currentTarget.remove()}
                                className='w-36 h-24 rounded-xl object-cover cursor-zoom-in transition-all duration-200'
                                style={{
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'scale(1.02)' }}
                                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)' }}
                            />
                        ))}
                    </div>
                )}

                {/* Markdown content */}
                <Markdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h1: ({ children }) => (
                            <h1 className='text-[22px] font-bold mt-5 mb-3 text-slate-100 tracking-tight'>{children}</h1>
                        ),
                        h2: ({ children }) => (
                            <h2 className='text-[18px] font-semibold mt-4 mb-2 text-slate-200 tracking-tight'>{children}</h2>
                        ),
                        h3: ({ children }) => (
                            <h3 className='text-[15px] font-semibold mt-3 mb-2 text-slate-300'>{children}</h3>
                        ),
                        p: ({ children }) => (
                            <p className='mb-3 whitespace-pre-wrap break-words text-[14px] leading-[1.75] text-slate-300'>{children}</p>
                        ),
                        ul: ({ children }) => (
                            <ul className='list-disc pl-5 space-y-1.5 my-3 text-[14px] text-slate-300'>{children}</ul>
                        ),
                        ol: ({ children }) => (
                            <ol className='list-decimal pl-5 space-y-1.5 my-3 text-[14px] text-slate-300'>{children}</ol>
                        ),
                        li: ({ children }) => (
                            <li className='text-slate-300 leading-relaxed'>{children}</li>
                        ),
                        strong: ({ children }) => (
                            <strong className='font-semibold text-slate-100'>{children}</strong>
                        ),
                        em: ({ children }) => (
                            <em className='italic text-slate-400'>{children}</em>
                        ),
                        blockquote: ({ children }) => (
                            <blockquote className='border-l-2 border-indigo-500/50 pl-4 my-3 italic text-slate-400'>{children}</blockquote>
                        ),
                        hr: () => (
                            <hr className='my-4' style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)' }} />
                        ),
                        table: ({ children }) => (
                            <div className='overflow-x-auto my-4 rounded-xl' style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                                <table className='min-w-full text-[13px]'>{children}</table>
                            </div>
                        ),
                        thead: ({ children }) => (
                            <thead style={{ background: 'rgba(99,102,241,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{children}</thead>
                        ),
                        th: ({ children }) => (
                            <th className='px-4 py-2.5 text-left font-semibold text-slate-200' style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                                {children}
                            </th>
                        ),
                        tr: ({ children }) => (
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                            >{children}</tr>
                        ),
                        td: ({ children }) => (
                            <td className='px-4 py-2.5 text-slate-400' style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                                {children}
                            </td>
                        ),
                        a: ({ href, children }) => (
                            <a
                                href={href}
                                target='_blank'
                                rel='noreferrer'
                                className='inline-flex items-center gap-1 underline underline-offset-2 transition-colors duration-150'
                                style={{ color: '#818cf8' }}
                                onMouseEnter={e => { e.currentTarget.style.color = '#a5b4fc' }}
                                onMouseLeave={e => { e.currentTarget.style.color = '#818cf8' }}
                            >
                                {children}
                                <ExternalLink size={12} />
                            </a>
                        ),
                        code: ({ className, children }) => {
                            const value = String(children).trim()

                            if (!className) {
                                return (
                                    <code className='px-1.5 py-0.5 rounded-md text-[13px] font-mono'
                                        style={{
                                            background: 'rgba(99,102,241,0.12)',
                                            border: '1px solid rgba(99,102,241,0.2)',
                                            color: '#a5b4fc',
                                        }}>
                                        {value}
                                    </code>
                                )
                            }

                            const language = className.replace('language-', '')

                            return (
                                <div className='my-4 overflow-hidden rounded-2xl'
                                    style={{
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                                    }}>
                                    {/* Code header */}
                                    <div className='flex items-center justify-between px-4 py-2.5'
                                        style={{
                                            background: 'rgba(22,27,40,0.95)',
                                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                                        }}>
                                        <div className='flex items-center gap-2'>
                                            {/* Traffic light dots */}
                                            <div className='flex gap-1.5'>
                                                <div className='w-2.5 h-2.5 rounded-full' style={{ background: '#ef4444', opacity: 0.7 }} />
                                                <div className='w-2.5 h-2.5 rounded-full' style={{ background: '#f59e0b', opacity: 0.7 }} />
                                                <div className='w-2.5 h-2.5 rounded-full' style={{ background: '#10b981', opacity: 0.7 }} />
                                            </div>
                                            <span className='text-[11px] font-semibold uppercase tracking-widest'
                                                style={{ color: '#475569', letterSpacing: '0.1em' }}>
                                                {language}
                                            </span>
                                        </div>
                                        <button
                                            className='flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg transition-all duration-150 cursor-pointer'
                                            style={{
                                                background: copiedCode === value ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.05)',
                                                border: copiedCode === value ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(255,255,255,0.06)',
                                                color: copiedCode === value ? '#34d399' : '#64748b',
                                            }}
                                            onClick={() => copyCode(value)}
                                        >
                                            {copiedCode === value ? (
                                                <><Check size={12} /> Copied</>
                                            ) : (
                                                <><Copy size={12} /> Copy</>
                                            )}
                                        </button>
                                    </div>

                                    {/* Code content */}
                                    <SyntaxHighlighter
                                        language={language}
                                        style={oneDark}
                                        wrapLongLines
                                        showLineNumbers
                                        customStyle={{
                                            margin: 0,
                                            padding: '16px',
                                            background: '#0d1117',
                                            fontSize: '13px',
                                            lineHeight: '1.65',
                                        }}
                                    >
                                        {value}
                                    </SyntaxHighlighter>
                                </div>
                            )
                        },
                        img: ({ src }) => {
                            if (!src) return null
                            return (
                                <img
                                    src={src}
                                    onClick={() => setLightBox(src)}
                                    loading='lazy'
                                    onError={e => e.currentTarget.remove()}
                                    className='w-40 h-28 rounded-xl object-cover cursor-zoom-in transition-all duration-200 my-2'
                                    style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                                />
                            )
                        },
                    }}
                >
                    {content}
                </Markdown>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightBox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='fixed inset-0 z-50 flex items-center justify-center p-6'
                        style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
                    >
                        <button
                            className='absolute top-5 right-5 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-150 cursor-pointer'
                            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0' }}
                            onClick={() => setLightBox(null)}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                        >
                            <X size={18} />
                        </button>
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            src={lightBox}
                            className='max-w-[90vw] max-h-[85vh] rounded-2xl object-contain'
                            style={{ border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default MessageBubble
