import { Check, Code2, Copy, Eye, PanelRightClose, PanelRightOpen, X, FileCode } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { AnimatePresence, motion } from 'motion/react'
import Editor from '@monaco-editor/react'

function Artifact() {
    const [collapsed, setCollapsed] = useState(false)
    const { artifacts } = useSelector(state => state.message)
    const [tab, setTab] = useState('code')
    const [activeFile, setActiveFile] = useState(0)
    const [copied, setCopied] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    if (artifacts.length === 0) return null

    const file = artifacts[0]?.files[activeFile]
    const htmlFile = artifacts[0]?.files?.find(f => f.name === 'index.html')
    const cssFile = artifacts[0]?.files?.find(f => f.name === 'style.css')
    const jsFile = artifacts[0]?.files?.find(f => f.name === 'script.js')
    const canPreview = Boolean(htmlFile)

    const previewDoc = `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
     ${cssFile?.content || ''}
    </style>
</head>
<body>
 ${htmlFile?.content || ''} 
<script>
    ${jsFile?.content || ''}
</script>    
</body>
</html>`

    const handleCopy = async () => {
        await navigator.clipboard.writeText(file?.content || '')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const detectLanguage = (fileName = '') => {
        const name = fileName.toLowerCase()
        if (name.endsWith('.html')) return 'html'
        if (name.endsWith('.css')) return 'css'
        if (name.endsWith('.js')) return 'javascript'
        if (name.endsWith('.jsx')) return 'javascript'
        if (name.endsWith('.ts')) return 'typescript'
        if (name.endsWith('.tsx')) return 'typescript'
        if (name.endsWith('.json')) return 'json'
        if (name.endsWith('.py')) return 'python'
        if (name.endsWith('.java')) return 'java'
        if (name.endsWith('.cpp')) return 'cpp'
        if (name.endsWith('.c')) return 'c'
        return 'plaintext'
    }

    const PanelContent = ({ onClose }) => (
        <>
            {!collapsed ? (
                <div className='flex flex-col h-full'
                    style={{ background: '#0d1117' }}>

                    {/* Header */}
                    <div className='flex items-center gap-3 px-4 shrink-0'
                        style={{
                            height: '56px',
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                            background: 'rgba(13,17,23,0.95)',
                        }}>
                        {/* Close / collapse */}
                        <button
                            className='flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-150 cursor-pointer shrink-0'
                            style={{ background: 'transparent', border: 'none', color: '#475569' }}
                            onClick={onClose ?? (() => setCollapsed(true))}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#94a3b8' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#475569' }}
                        >
                            {onClose ? <X size={15} /> : <PanelRightClose size={15} />}
                        </button>

                        {/* Title */}
                        <div className='flex items-center gap-2 flex-1 min-w-0'>
                            <div className='flex items-center justify-center w-6 h-6 rounded-lg shrink-0'
                                style={{
                                    background: 'rgba(99,102,241,0.12)',
                                    border: '1px solid rgba(99,102,241,0.2)',
                                }}>
                                <FileCode className='text-indigo-400' size={12} />
                            </div>
                            <div className='text-[13px] font-semibold text-slate-200 truncate'>
                                {artifacts[0]?.title}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className='flex items-center gap-1.5 shrink-0'>
                            {/* Copy button */}
                            <button
                                onClick={handleCopy}
                                className='flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium rounded-lg transition-all duration-150 cursor-pointer'
                                style={{
                                    background: copied ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.05)',
                                    border: copied ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(255,255,255,0.06)',
                                    color: copied ? '#34d399' : '#64748b',
                                }}
                                onMouseEnter={e => { if (!copied) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#94a3b8' } }}
                                onMouseLeave={e => { if (!copied) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#64748b' } }}
                            >
                                {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                            </button>

                            {/* Code / Preview toggle */}
                            {canPreview && (
                                <div className='flex items-center p-1 rounded-lg'
                                    style={{
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.06)',
                                    }}>
                                    <button
                                        onClick={() => setTab('code')}
                                        className='flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md transition-all duration-150 cursor-pointer'
                                        style={{
                                            background: tab === 'code' ? 'linear-gradient(135deg, #4f46e5, #6d28d9)' : 'transparent',
                                            color: tab === 'code' ? '#fff' : '#64748b',
                                            border: 'none',
                                            boxShadow: tab === 'code' ? '0 2px 8px rgba(79,70,229,0.3)' : 'none',
                                        }}
                                    >
                                        <Code2 size={11} /> Code
                                    </button>
                                    <button
                                        onClick={() => setTab('preview')}
                                        className='flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md transition-all duration-150 cursor-pointer'
                                        style={{
                                            background: tab === 'preview' ? 'linear-gradient(135deg, #4f46e5, #6d28d9)' : 'transparent',
                                            color: tab === 'preview' ? '#fff' : '#64748b',
                                            border: 'none',
                                            boxShadow: tab === 'preview' ? '0 2px 8px rgba(79,70,229,0.3)' : 'none',
                                        }}
                                    >
                                        <Eye size={11} /> Preview
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* File tabs */}
                    {tab === 'code' && (
                        <div className='flex overflow-x-auto shrink-0'
                            style={{
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                background: 'rgba(10,14,20,0.8)',
                                scrollbarWidth: 'none',
                            }}>
                            {artifacts[0]?.files?.map((f, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveFile(index)}
                                    className='relative px-4 py-2.5 text-[11.5px] font-medium whitespace-nowrap transition-all duration-150 cursor-pointer'
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        borderRight: '1px solid rgba(255,255,255,0.04)',
                                        color: activeFile === index ? '#818cf8' : '#475569',
                                    }}
                                    onMouseEnter={e => { if (activeFile !== index) e.currentTarget.style.color = '#64748b' }}
                                    onMouseLeave={e => { if (activeFile !== index) e.currentTarget.style.color = '#475569' }}
                                >
                                    {f?.name}
                                    {activeFile === index && (
                                        <div className='absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full'
                                            style={{ background: 'linear-gradient(90deg, #6366f1, #7c3aed)' }} />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Content area */}
                    <div className='flex-1 overflow-hidden'>
                        <AnimatePresence mode='wait'>
                            {tab === 'preview' && canPreview ? (
                                <motion.div
                                    key='preview'
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className='w-full h-full'
                                >
                                    <iframe
                                        title='preview'
                                        srcDoc={previewDoc}
                                        sandbox='allow-scripts'
                                        className='w-full h-full bg-white'
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key='code'
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className='w-full h-full'
                                >
                                    <Editor
                                        theme='vs-dark'
                                        language={detectLanguage(file?.name)}
                                        value={file?.content}
                                        options={{
                                            readOnly: true,
                                            minimap: { enabled: false },
                                            fontSize: 13,
                                            wordWrap: 'on',
                                            automaticLayout: true,
                                            scrollBeyondLastLine: false,
                                            padding: { top: 16 },
                                            lineNumbers: 'on',
                                            renderLineHighlight: 'none',
                                            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                            fontLigatures: true,
                                        }}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            ) : (
                /* Collapsed strip */
                <div className='hidden lg:flex h-full flex-col items-center py-4 gap-3 shrink-0'
                    style={{
                        borderLeft: '1px solid rgba(255,255,255,0.05)',
                        background: '#0d1117',
                    }}>
                    <button
                        className='flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-150 cursor-pointer'
                        style={{ background: 'transparent', border: 'none', color: '#475569' }}
                        onClick={() => setCollapsed(false)}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#94a3b8' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#475569' }}
                    >
                        <PanelRightOpen size={15} />
                    </button>
                    <div className='flex-1 flex items-center'>
                        <div
                            className='text-[10px] font-semibold tracking-widest uppercase whitespace-nowrap'
                            style={{
                                writingMode: 'vertical-lr',
                                transform: 'rotate(180deg)',
                                background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            {artifacts[0]?.title}
                        </div>
                    </div>
                </div>
            )}
        </>
    )

    return (
        <>
            {/* Mobile open button */}
            <button
                onClick={() => setMobileOpen(true)}
                className='lg:hidden fixed bottom-24 right-4 z-40 flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-[12px] font-semibold transition-all duration-200 cursor-pointer'
                style={{
                    background: 'linear-gradient(135deg, #4f46e5, #6d28d9)',
                    border: '1px solid rgba(99,102,241,0.3)',
                    boxShadow: '0 8px 24px rgba(79,70,229,0.35)',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 32px rgba(79,70,229,0.5)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(79,70,229,0.35)' }}
            >
                <Code2 size={13} />
                View Code
            </button>

            {/* Mobile sheet */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setMobileOpen(false)}
                            className='lg:hidden fixed inset-0 z-50'
                            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className='lg:hidden fixed inset-y-0 right-0 z-50 w-[90vw] max-w-[440px] overflow-hidden'
                            style={{ borderLeft: '1px solid rgba(255,255,255,0.07)' }}
                        >
                            <PanelContent onClose={() => setMobileOpen(false)} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop panel */}
            <motion.div
                initial={{ width: 420 }}
                animate={{ width: collapsed ? 52 : 420 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className='hidden lg:flex h-full flex-col overflow-hidden shrink-0'
                style={{ borderLeft: '1px solid rgba(255,255,255,0.05)' }}
            >
                <PanelContent />
            </motion.div>
        </>
    )
}

export default Artifact
