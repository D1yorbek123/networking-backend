'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { login, register } from '@/lib/api'
import { setToken, setUser } from '@/lib/auth'
import { Mail, Lock, User, AlertCircle, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
      setError(err.message || 'Xatolik yuz berdi')
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
      setError(err.message || 'Xatolik yuz berdi')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background neon glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] mix-blend-screen pointer-events-none" />

      <div className="w-full max-w-[420px] relative z-10 animate-fade-in">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass mb-6 shadow-2xl neo-glow">
            <Sparkles size={28} className="text-blue-400" />
          </div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight mb-2">
            Fashion Hub
          </h1>
          <p className="text-sm text-slate-400 font-medium tracking-wide uppercase">
            {isLogin ? 'Tizimga kirish' : 'Hisob yaratish'}
          </p>
        </div>

        {/* Card */}
        <div className="glass-panel rounded-2xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-start gap-3 text-sm animate-fade-in">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="animate-fade-in">
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wide">To'liq Ism</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Aliyev Alisher"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900/50 border-white/10 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wide">Email Manzil</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="siz@example.com"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900/50 border-white/10 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wide">Parol</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-slate-900/50 border-white/10 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600 tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-400 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm transition-all neo-glow mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Kirish' : 'Hisob yaratish'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Yoki tezkor kirish</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Demo Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => demoLogin('admin')}
              disabled={loading}
              className="px-4 py-3 rounded-xl border border-white/10 bg-slate-800/30 text-slate-300 text-sm font-semibold hover:bg-slate-800/60 hover:border-blue-500/50 disabled:opacity-50 transition-all hover:text-blue-400"
            >
              Admin Demo
            </button>
            <button
              onClick={() => demoLogin('customer')}
              disabled={loading}
              className="px-4 py-3 rounded-xl border border-white/10 bg-slate-800/30 text-slate-300 text-sm font-semibold hover:bg-slate-800/60 hover:border-purple-500/50 disabled:opacity-50 transition-all hover:text-purple-400"
            >
              Mijoz Demo
            </button>
          </div>

          {/* Toggle Auth Mode */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError('') }}
              className="text-slate-400 hover:text-slate-200 text-sm transition-colors"
            >
              {isLogin ? "Hisobingiz yo'qmi? " : 'Hisobingiz bormi? '}
              <span className="text-blue-400 font-bold hover:text-blue-300">{isLogin ? "Ro'yxatdan o'tish" : 'Kirish'}</span>
            </button>
          </div>
        </div>

        {/* Demo Credentials Info */}
        <div className="mt-6 p-5 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3 text-center">Demo Ma'lumotlari</p>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-4 py-2 bg-slate-800/30 rounded-lg">
              <span className="text-xs text-blue-400 font-bold">Admin:</span>
              <span className="text-xs text-slate-400 font-mono">admin@example.com / admin123</span>
            </div>
            <div className="flex justify-between items-center px-4 py-2 bg-slate-800/30 rounded-lg">
              <span className="text-xs text-purple-400 font-bold">Mijoz:</span>
              <span className="text-xs text-slate-400 font-mono">john@company1.com / password123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
