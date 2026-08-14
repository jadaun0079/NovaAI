import React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Crown, X, Zap, Check, Star } from 'lucide-react'
import { useSelector } from 'react-redux'
import { createOrder } from '../features/createOrder'
import { verifyPayment } from '../features/verifyPayment'

const PLANS = [
    {
        id: 'starter',
        name: 'Starter',
        price: '₹199',
        credits: 500,
        features: ['500 AI credits', 'All agent types', 'Code generation', 'File uploads'],
        gradient: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(124,58,237,0.10))',
        borderColor: 'rgba(99,102,241,0.25)',
        accentColor: '#818cf8',
        recommended: false,
    },
    {
        id: 'pro',
        name: 'Pro',
        price: '₹499',
        credits: 1000,
        features: ['1000 AI credits', 'Priority processing', 'Advanced agents', 'PDF & Vision AI', 'PPT generation'],
        gradient: 'linear-gradient(135deg, rgba(124,58,237,0.20), rgba(99,102,241,0.15))',
        borderColor: 'rgba(124,58,237,0.40)',
        accentColor: '#a78bfa',
        recommended: true,
    },
]

function BillingDrawer({ open, onClose }) {
    const { userData } = useSelector(state => state.user)

    const handleUpgrade = async (plan) => {
        try {
            const data = await createOrder(plan)
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data?.order?.amount,
                currency: data?.order?.currency,
                name: 'CortexAI',
                description: `${data?.plan?.name} Plan`,
                order_id: data?.order?.id,
                handler: async (response) => {
                    try {
                        const data = await verifyPayment(response)
                        console.log(data)
                    } catch (error) {
                        console.log(error)
                    }
                },
                theme: { color: '#4F46E5' },
            }
            const razorpay = new window.Razorpay(options)
            razorpay.open()
        } catch (error) {
            console.log(error)
        }
    }

    const creditPct = userData
        ? Math.min(100, Math.round(((userData?.credits || 0) / (userData?.totalCredits || 1)) * 100))
        : 0

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className='fixed inset-0 z-40'
                        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className='fixed right-0 top-0 z-50 h-screen w-[400px] flex flex-col overflow-hidden'
                        style={{
                            background: 'linear-gradient(180deg, #0d1117 0%, #080a0f 100%)',
                            borderLeft: '1px solid rgba(255,255,255,0.07)',
                            boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
                        }}
                    >
                        {/* Inner glow */}
                        <div className='absolute top-0 left-0 right-0 h-px'
                            style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)' }} />

                        {/* Header */}
                        <div className='flex items-center justify-between px-6 py-5 shrink-0'
                            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <div>
                                <h2 className='text-[17px] font-bold text-slate-100 tracking-tight'>
                                    Billing & Plans
                                </h2>
                                <p className='text-[12px] text-slate-500 mt-0.5'>
                                    Manage your subscription and credits
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className='flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-150 cursor-pointer'
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#94a3b8' }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#64748b' }}
                            >
                                <X size={17} />
                            </button>
                        </div>

                        {/* Current plan card */}
                        <div className='px-5 pt-5 shrink-0'>
                            <div className='rounded-2xl p-4 relative overflow-hidden'
                                style={{
                                    background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(124,58,237,0.08))',
                                    border: '1px solid rgba(99,102,241,0.2)',
                                    boxShadow: '0 4px 20px rgba(99,102,241,0.08)',
                                }}>
                                {/* Glow orb */}
                                <div className='absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none'
                                    style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />

                                <div className='flex items-start justify-between mb-4'>
                                    <div>
                                        <p className='text-[11px] text-slate-500 uppercase tracking-widest font-semibold mb-1'>
                                            Current Plan
                                        </p>
                                        <h3 className='text-[22px] font-bold capitalize'
                                            style={{
                                                background: 'linear-gradient(135deg, #f1f5f9, #818cf8)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text',
                                            }}>
                                            {userData?.plan || 'Free'}
                                        </h3>
                                    </div>
                                    <div className='flex items-center justify-center w-10 h-10 rounded-xl'
                                        style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.2)' }}>
                                        <Crown size={18} className='text-yellow-400' />
                                    </div>
                                </div>

                                {/* Credits bar */}
                                <div>
                                    <div className='flex justify-between text-[11px] mb-2'>
                                        <span className='text-slate-500 font-medium'>Credits used</span>
                                        <span className='font-semibold' style={{ color: creditPct > 80 ? '#f87171' : '#818cf8' }}>
                                            {userData?.credits || 0} / {userData?.totalCredits || 100}
                                        </span>
                                    </div>
                                    <div className='h-2 rounded-full overflow-hidden'
                                        style={{ background: 'rgba(255,255,255,0.07)' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${creditPct}%` }}
                                            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                                            className='h-full rounded-full'
                                            style={{
                                                background: creditPct > 80
                                                    ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                                                    : 'linear-gradient(90deg, #6366f1, #7c3aed)',
                                                boxShadow: creditPct > 80
                                                    ? '0 0 10px rgba(239,68,68,0.4)'
                                                    : '0 0 10px rgba(99,102,241,0.4)',
                                            }}
                                        />
                                    </div>
                                    <p className='text-[10px] text-slate-600 mt-1.5'>
                                        {creditPct}% of credits remaining
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Plans section */}
                        <div className='px-5 pt-4 pb-1 shrink-0'>
                            <p className='text-[11px] text-slate-600 font-semibold uppercase tracking-widest'>
                                Upgrade Plan
                            </p>
                        </div>

                        <div className='flex-1 overflow-y-auto px-5 pb-5 space-y-3'>
                            {PLANS.map((plan, i) => (
                                <motion.div
                                    key={plan.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: i * 0.1 }}
                                    className='rounded-2xl p-4 relative overflow-hidden'
                                    style={{
                                        background: plan.gradient,
                                        border: `1px solid ${plan.borderColor}`,
                                        boxShadow: plan.recommended ? '0 8px 32px rgba(124,58,237,0.15)' : 'none',
                                    }}
                                >
                                    {/* Recommended badge */}
                                    {plan.recommended && (
                                        <div className='absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold'
                                            style={{
                                                background: 'linear-gradient(135deg, #4f46e5, #6d28d9)',
                                                color: '#fff',
                                                boxShadow: '0 2px 8px rgba(79,70,229,0.3)',
                                            }}>
                                            <Star size={9} /> Popular
                                        </div>
                                    )}

                                    <div className='flex items-start justify-between mb-3'>
                                        <div>
                                            <h3 className='text-[15px] font-bold text-slate-100'>
                                                {plan.name}
                                            </h3>
                                            <div className='flex items-baseline gap-1 mt-0.5'>
                                                <span className='text-[24px] font-bold' style={{ color: plan.accentColor }}>
                                                    {plan.price}
                                                </span>
                                                <span className='text-[11px] text-slate-500'>/ one-time</span>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0'
                                            style={{
                                                background: 'rgba(255,255,255,0.08)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                color: '#94a3b8',
                                            }}>
                                            <Zap size={11} className='text-amber-400' />
                                            {plan.credits} credits
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className='space-y-1.5 mb-4'>
                                        {plan.features.map((feat, fi) => (
                                            <div key={fi} className='flex items-center gap-2'>
                                                <div className='w-4 h-4 rounded-full flex items-center justify-center shrink-0'
                                                    style={{ background: 'rgba(16,185,129,0.15)' }}>
                                                    <Check size={9} className='text-emerald-400' />
                                                </div>
                                                <span className='text-[12px] text-slate-400'>{feat}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Upgrade button */}
                                    <button
                                        className='w-full py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 cursor-pointer'
                                        style={{
                                            background: plan.recommended
                                                ? 'linear-gradient(135deg, #4f46e5, #6d28d9)'
                                                : 'rgba(255,255,255,0.08)',
                                            border: plan.recommended
                                                ? '1px solid rgba(99,102,241,0.3)'
                                                : '1px solid rgba(255,255,255,0.08)',
                                            color: plan.recommended ? '#fff' : '#94a3b8',
                                            boxShadow: plan.recommended ? '0 4px 16px rgba(79,70,229,0.3)' : 'none',
                                        }}
                                        onClick={() => handleUpgrade(plan.id)}
                                        onMouseEnter={e => {
                                            if (plan.recommended) {
                                                e.currentTarget.style.boxShadow = '0 6px 24px rgba(79,70,229,0.5)'
                                                e.currentTarget.style.transform = 'translateY(-1px)'
                                            } else {
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            if (plan.recommended) {
                                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(79,70,229,0.3)'
                                                e.currentTarget.style.transform = 'translateY(0)'
                                            } else {
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                                            }
                                        }}
                                    >
                                        Upgrade to {plan.name}
                                    </button>
                                </motion.div>
                            ))}

                            <p className='text-center text-[11px] text-slate-700 pb-2'>
                                Payments powered by Razorpay · Secure & encrypted
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default BillingDrawer
