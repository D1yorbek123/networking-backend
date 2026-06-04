'use client'

import { useEffect, useState } from 'react'
import { getUser, isAuthenticated } from '@/lib/auth'
import LoginPage from '@/components/LoginPage'
import AdminDashboard from '@/components/AdminDashboard'
import CustomerDashboard from '@/components/CustomerDashboard'

export default function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      setLoading(false)
      return
    }

    const currentUser = getUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-10 h-10 border-2 border-white/10 rounded-full" />
            <div className="absolute inset-0 w-10 h-10 border-2 border-transparent border-t-white rounded-full animate-spin" />
          </div>
          <p className="text-sm text-white/40 font-medium tracking-wide">Loading</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  return user.role === 'admin' ? <AdminDashboard /> : <CustomerDashboard />
}
