import { Code2, FileText, Globe, ImageIcon, MessageSquare, Mic, MicOff, Paperclip, Presentation, Send, X, Zap } from 'lucide-react'
import React, { useEffect, useState, useRef } from 'react'
import sendMessage from '../features/sendMessage'
import { useDispatch, useSelector } from 'react-redux'
import { addMessage, setArtifacts, setIsLoading, setMessages } from '../redux/messageSlice'
import { createConversation } from '../features/createConversation'
import { addConversation, setConvTitle, setSelectedConversation } from '../redux/conversationSlice'
import { updateConversation } from '../features/updateConversation'
import { motion, AnimatePresence } from 'motion/react'

function ChatInput() {
    const [value, setValue] = useState('')
    const [selectedAgent, setSelectedAgent] = useState('Auto')
    const { selectedConversation } = useSelector(state => state.conversation)
    const { messages, isLoading } = useSelector(state => state.message)
    const [selectedFile, setSelectedFile] = useState(null)
    const [listening, setListening] = useState(false)
    const [focused, setFocused] = useState(false)
    const recognitionRef = useRef(null)
    const fileRef = useRef(null)
    const dispatch = useDispatch()

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (!SpeechRecognition) return

        const recognition = new SpeechRecognition()
        recognition.lang = 'en-US'
        recognition.interimResults = true
        recognition.continuous = true

        recognition.onresult = (event) => {
            let transcript = ''
            for (let index = event.resultIndex; index < event.results.length; index++) {
                transcript += event.results[index][0].transcript
            }
            setValue(transcript)
        }

        recognition.onend = () => setListening(false)
        recognitionRef.current = recognition
    }, [])

    const toggleMic = () => {
        if (!recognitionRef.current) {
            alert('Speech recognition not supported')
            return
        }
        if (listening) {
            recognitionRef.current.stop()
            setListening(false)
        } else {
            recognitionRef.current.start()
            setListening(true)
        }
    }

    const handleSendMessage = async () => {
        if (!value.trim() || isLoading) return
        dispatch(setIsLoading(true))
        let conversation = selectedConversation
        if (!conversation) {
            dispatch(setMessages([]))
            const conv = await createConversation()
            dispatch(setSelectedConversation(conv))
            dispatch(addConversation(conv))
            conversation = conv
        }

        if (conversation.title === 'New Chat') {
            await updateConversation({ id: conversation?._id, title: value.trim() })
            dispatch(setConvTitle({ conversationId: conversation?._id, title: value.slice(0, 40) }))
        }

        console.log(selectedFile)
        const formData = new FormData()
        formData.append('prompt', value.trim())
        formData.append('conversationId', conversation?._id)
        formData.append('agent', selectedAgent.toLowerCase())
        if (selectedFile) {
            formData.append('file', selectedFile)
        }

        dispatch(addMessage({ role: 'user', content: value.trim() }))
        setValue('')
        const data = await sendMessage(formData)
        dispatch(setIsLoading(false))
        setSelectedFile(null)
        dispatch(setArtifacts(data.artifacts || []))
        dispatch(addMessage({ role: 'assistant', content: data?.answer, images: data?.images }))
        console.log(data)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const agents = [
        { id: 'auto', icon: Zap, label: 'Auto' },
        { id: 'chat', icon: MessageSquare, label: 'Chat' },
        { id: 'coding', icon: Code2, label: 'Coding' },
        { id: 'pdf', icon: FileText, label: 'PDF' },
        { id: 'ppt', icon: Presentation, label: 'PPT' },
        { id: 'vision', icon: ImageIcon, label: 'Vision' },
        { id: 'search', icon: Globe, label: 'Search' },
    ]

    const canSend = value.trim().length > 0 && !isLoading

    return (
        <div className='w-full px-3 md:px-6 py-4 shrink-0'
            style={{
                background: 'linear-gradient(to top, rgba(8,10,15,1) 60%, rgba(8,10,15,0) 100%)',
            }}
        >
            {/* Main input container */}
            <div
                className='flex flex-col gap-0 rounded-2xl transition-all duration-300 overflow-hidden'
                style={{
                    background: 'rgba(17,24,39,0.7)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: focused
                        ? '1px solid rgba(99,102,241,0.45)'
                        : '1px solid rgba(255,255,255,0.07)',
                    boxShadow: focused
                        ? '0 0 0 3px rgba(99,102,241,0.08), 0 8px 32px rgba(0,0,0,0.3)'
                        : '0 4px 24px rgba(0,0,0,0.2)',
                }}
            >
                {/* Agent selector strip */}
                <div className='flex items-center gap-1.5 px-4 pt-3 pb-2 overflow-x-auto'
                    style={{ scrollbarWidth: 'none' }}>
                    {agents.map((agent) => {
                        const isActive = selectedAgent === agent.label
                        const Icon = agent.icon
                        return (
                            <button
                                key={agent.id}
                                onClick={() => setSelectedAgent(agent.label)}
                                className='flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11.5px] font-medium transition-all duration-200 cursor-pointer'
                                style={{
                                    background: isActive
                                        ? 'linear-gradient(135deg, #4f46e5, #6d28d9)'
                                        : 'rgba(255,255,255,0.04)',
                                    border: isActive
                                        ? '1px solid rgba(99,102,241,0.4)'
                                        : '1px solid rgba(255,255,255,0.06)',
                                    color: isActive ? '#fff' : '#64748b',
                                    boxShadow: isActive ? '0 2px 12px rgba(79,70,229,0.3)' : 'none',
                                }}
                                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#94a3b8' } }}
                                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#64748b' } }}
                            >
                                <Icon size={12} className={isActive ? 'text-white' : ''} />
                                {agent.label}
                            </button>
                        )
                    })}
                </div>

                {/* File preview */}
                <AnimatePresence>
                    {selectedFile && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className='px-4 pb-2'
                        >
                            <div className='inline-flex items-center gap-2.5 rounded-xl px-3 py-2'
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                }}>
                                {selectedFile?.type === 'application/pdf' ? (
                                    <div className='flex items-center justify-center w-8 h-8 rounded-lg'
                                        style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.2)' }}>
                                        <FileText size={14} className='text-red-400' />
                                    </div>
                                ) : selectedFile.type.startsWith('image/') && (
                                    <img
                                        src={URL.createObjectURL(selectedFile)}
                                        className='h-8 w-8 rounded-lg object-cover'
                                    />
                                )}
                                <div>
                                    <p className='text-[12px] font-medium text-slate-200'>{selectedFile?.name}</p>
                                    <p className='text-[10px] text-slate-500'>{Math.ceil(selectedFile.size / 1024)} KB</p>
                                </div>
                                <button
                                    className='ml-1 flex items-center justify-center w-5 h-5 rounded-full transition-all duration-150 cursor-pointer'
                                    style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#64748b' }}
                                    onClick={() => { setSelectedFile(null); fileRef.current.value = '' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#f87171' }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#64748b' }}
                                >
                                    <X size={11} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Textarea */}
                <textarea
                    placeholder='Ask anything… (Shift+Enter for new line)'
                    onChange={e => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    value={value}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className='w-full bg-transparent outline-none resize-none text-[14px] leading-relaxed px-4 py-1'
                    style={{
                        color: '#e2e8f0',
                        caretColor: '#818cf8',
                        scrollbarWidth: 'none',
                        minHeight: '72px',
                        maxHeight: '180px',
                    }}
                    rows={3}
                />

                {/* Bottom toolbar */}
                <div className='flex items-center justify-between px-3 pb-3'>
                    <div className='flex items-center gap-1'>
                        {/* Hidden file input */}
                        <input
                            type='file'
                            accept='.pdf,image/*'
                            hidden
                            ref={fileRef}
                            onChange={e => {
                                const file = e.target.files[0]
                                if (file) setSelectedFile(file)
                            }}
                        />

                        {/* Attach button */}
                        <button
                            className='flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-150 cursor-pointer'
                            style={{ background: 'transparent', border: 'none', color: '#475569' }}
                            onClick={() => fileRef.current.click()}
                            title='Attach file'
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#94a3b8' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#475569' }}
                        >
                            <Paperclip size={16} />
                        </button>

                        {/* Mic button */}
                        <button
                            onClick={toggleMic}
                            className='flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200 cursor-pointer relative'
                            style={{
                                background: listening ? 'rgba(239,68,68,0.15)' : 'transparent',
                                border: listening ? '1px solid rgba(239,68,68,0.3)' : 'none',
                                color: listening ? '#f87171' : '#475569',
                            }}
                            title={listening ? 'Stop recording' : 'Start recording'}
                        >
                            {listening ? <Mic size={16} /> : <MicOff size={16} />}
                            {listening && (
                                <span className='absolute inset-0 rounded-xl animate-ping'
                                    style={{ background: 'rgba(239,68,68,0.15)', animationDuration: '1.5s' }} />
                            )}
                        </button>
                    </div>

                    {/* Send button */}
                    <button
                        disabled={!canSend}
                        onClick={handleSendMessage}
                        className='flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 cursor-pointer'
                        style={{
                            background: canSend
                                ? 'linear-gradient(135deg, #4f46e5, #6d28d9)'
                                : 'rgba(255,255,255,0.05)',
                            border: canSend ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.06)',
                            color: canSend ? '#fff' : '#334155',
                            boxShadow: canSend ? '0 4px 16px rgba(79,70,229,0.3)' : 'none',
                            transform: 'scale(1)',
                            cursor: canSend ? 'pointer' : 'not-allowed',
                        }}
                        onMouseEnter={e => { if (canSend) { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(79,70,229,0.45)' } }}
                        onMouseLeave={e => { if (canSend) { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(79,70,229,0.3)' } }}
                    >
                        <Send size={15} />
                    </button>
                </div>
            </div>

            {/* Footer hint */}
            <p className='text-center text-[11px] mt-2' style={{ color: '#1e293b' }}>
                CortexAI can make mistakes. Verify important information.
            </p>
        </div>
    )
}

export default ChatInput
