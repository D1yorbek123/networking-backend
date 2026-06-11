'use client'

import { useEffect, useState } from 'react'
import { getUser, isAuthenticated, logout } from '@/lib/auth'
import { verify } from '@/lib/api'
import LoginPage from '@/components/LoginPage'
import AdminDashboard from '@/components/AdminDashboard'
import CustomerDashboard from '@/components/CustomerDashboard'

export default function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      if (!isAuthenticated()) {
        setLoading(false)
        return
      }

      // Token validity check
      try {
        await verify()
        const currentUser = getUser()
        setUser(currentUser)
      } catch {
        // Token expired or invalid - clear auth state
        logout()
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-slate-800 rounded-full" />
            <div className="absolute inset-0 w-16 h-16 border-2 border-transparent border-t-blue-500 rounded-full animate-spin neo-glow" />
            <div className="absolute inset-2 w-12 h-12 border-2 border-transparent border-b-purple-500 rounded-full animate-spin reverse neo-glow" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
          <p className="text-sm text-blue-400 font-medium tracking-[0.2em] uppercase animate-pulse">Tizimga ulanmoqda</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  return user.role === 'admin' ? <AdminDashboard /> : <CustomerDashboard />
}
