'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { login, register } from '@/lib/api'
import { setToken, setUser } from '@/lib/auth'
import { Mail, Lock, User, AlertCircle, ArrowRight, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const handleSubmit = useCallback(async (e, overrideData = null) => {
    e?.preventDefault?.()
    setLoading(true)
    setError('')

    const data = overrideData || formData

    try {
      let response
      if (isLogin) {
        response = await login({ email: data.email, password: data.password })
      } else {
        response = await register(data)
      }

      setToken(response.token)
      setUser(response.user)
      window.location.reload()
    } catch (err) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [formData, isLogin])

  const demoLogin = async (role) => {
    setLoading(true)
    setError('')

    const demoData = role === 'admin'
      ? { email: 'admin@example.com', password: 'admin123' }
      : { email: 'john@company1.com', password: 'password123' }

    try {
      const response = await login(demoData)
      setToken(response.token)
      setUser(response.user)
      window.location.reload()
    } catch (err) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '64px 64px'
      }} />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[100px]" />

      <div className="w-full max-w-[420px] relative z-10 animate-fade-in">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white text-black mb-5">
            <Sparkles size={22} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1.5">
            Fashion Hub
          </h1>
          <p className="text-sm text-white/40">
            {isLogin ? 'Welcome back. Sign in to continue.' : 'Create your account to get started.'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0a0a0a] rounded-xl border border-white/[0.06] p-6 shadow-2xl shadow-black/50">
          {error && (
            <div className="mb-5 p-3.5 bg-red-500/[0.06] border border-red-500/10 rounded-lg text-red-400 flex items-start gap-2.5 text-sm animate-fade-in">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="animate-fade-in">
                <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/[0.03] border-white/[0.06]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/[0.03] border-white/[0.06]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/[0.03] border-white/[0.06]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-semibold py-2.5 rounded-lg hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm transition-all"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-[11px] text-white/25 uppercase tracking-widest font-medium">Demo Access</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Demo Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => demoLogin('admin')}
              disabled={loading}
              className="px-4 py-2.5 rounded-lg border border-white/[0.06] text-white/70 text-sm font-medium hover:bg-white/[0.04] hover:text-white hover:border-white/[0.12] disabled:opacity-50 transition-all"
            >
              Admin Demo
            </button>
            <button
              onClick={() => demoLogin('customer')}
              disabled={loading}
              className="px-4 py-2.5 rounded-lg border border-white/[0.06] text-white/70 text-sm font-medium hover:bg-white/[0.04] hover:text-white hover:border-white/[0.12] disabled:opacity-50 transition-all"
            >
              Customer Demo
            </button>
          </div>

          {/* Toggle Auth Mode */}
          <div className="mt-5 pt-5 border-t border-white/[0.06] text-center">
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError('') }}
              className="text-white/40 hover:text-white text-sm transition-colors"
            >
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <span className="text-white font-medium">{isLogin ? 'Sign up' : 'Sign in'}</span>
            </button>
          </div>
        </div>

        {/* Demo Credentials Info */}
        <div className="mt-4 p-4 rounded-xl border border-white/[0.04] bg-white/[0.01]">
          <p className="text-[11px] text-white/30 font-medium uppercase tracking-wider mb-2.5">Demo Credentials</p>
          <div className="space-y-1.5">
            <p className="text-xs text-white/40">
              <span className="text-white/60 font-medium">Admin:</span> admin@example.com / admin123
            </p>
            <p className="text-xs text-white/40">
              <span className="text-white/60 font-medium">Customer:</span> john@company1.com / password123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
