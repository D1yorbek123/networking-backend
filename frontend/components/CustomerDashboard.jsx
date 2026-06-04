'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getOrders } from '@/lib/api'
import { getUser, logout } from '@/lib/auth'
import {
  LogOut, Menu, X, ShoppingCart, User as UserIcon,
  Package, Sparkles, Search, Bell, Mail, Shield, ArrowUpRight
} from 'lucide-react'

const NAV_ITEMS = [
  { key: 'profile', label: 'My Profile', icon: UserIcon },
  { key: 'orders', label: 'My Orders', icon: Package },
]

export default function CustomerDashboard() {
  const router = useRouter()
  const [user] = useState(() => getUser())
  const [activeTab, setActiveTab] = useState('profile')
  const [menuOpen, setMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const ordersData = await getOrders()
      setOrders(ordersData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    window.location.reload()
  }

  const getStatusStyle = (status) => {
    const styles = {
      pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
    }
    return styles[status] || 'bg-white/[0.04] text-white/50 border-white/[0.06]'
  }

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative z-40 h-full w-[260px] bg-[#0a0a0a] border-r border-white/[0.06]
        transform transition-transform duration-300 ease-in-out
        ${menuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-5 py-6 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                <Sparkles size={16} className="text-black" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-white tracking-tight">Fashion Hub</h1>
                <p className="text-[11px] text-white/30">Customer Portal</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
            {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => { setActiveTab(key); setMenuOpen(false) }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === key
                    ? 'bg-white/[0.08] text-white'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
                }`}
              >
                <Icon size={16} className={activeTab === key ? 'text-white' : 'text-white/30'} />
                {label}
                {activeTab === key && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </button>
            ))}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-white/[0.08] border border-white/[0.06] flex items-center justify-center text-white/60 text-sm font-semibold">
                {user?.name?.charAt(0)?.toUpperCase() || 'C'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-[11px] text-white/30 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-white/[0.06] text-white/40 hover:text-white hover:bg-white/[0.04] hover:border-white/[0.12] text-xs font-medium transition-all"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 border-b border-white/[0.06] flex items-center justify-between px-4 md:px-6 bg-black/80 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-white/60 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.04] transition"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h2 className="text-sm font-semibold text-white">
              {NAV_ITEMS.find(n => n.key === activeTab)?.label || 'Profile'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition">
              <Search size={16} />
            </button>
            <button className="p-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition">
              <Bell size={16} />
            </button>
            <div className="hidden sm:block pl-2 ml-2 border-l border-white/[0.06]">
              <span className="text-xs text-white/30">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-5 md:p-8">
          {error && (
            <div className="mb-5 p-3.5 bg-red-500/[0.06] border border-red-500/10 rounded-lg text-red-400 flex items-center gap-2.5 text-sm animate-fade-in">
              {error}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-2xl animate-fade-in">
              {/* Profile Card */}
              <div className="bg-[#0a0a0a] rounded-xl border border-white/[0.06] overflow-hidden">
                {/* Profile header with gradient */}
                <div className="h-24 bg-gradient-to-br from-white/[0.04] to-transparent relative">
                  <div className="absolute -bottom-8 left-6">
                    <div className="w-16 h-16 rounded-xl bg-[#0a0a0a] border-2 border-white/[0.06] flex items-center justify-center text-2xl font-bold text-white">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  </div>
                </div>

                <div className="pt-12 px-6 pb-6">
                  <h1 className="text-xl font-bold text-white tracking-tight">{user?.name}</h1>
                  <p className="text-sm text-white/40 mt-0.5">{user?.email}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                    <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                      <div className="flex items-center gap-2.5 mb-2">
                        <Mail size={14} className="text-white/30" />
                        <p className="text-[11px] text-white/40 uppercase tracking-wider font-medium">Email</p>
                      </div>
                      <p className="text-sm font-medium text-white">{user?.email}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                      <div className="flex items-center gap-2.5 mb-2">
                        <Shield size={14} className="text-white/30" />
                        <p className="text-[11px] text-white/40 uppercase tracking-wider font-medium">Role</p>
                      </div>
                      <p className="text-sm font-medium text-white capitalize">{user?.role}</p>
                    </div>
                  </div>

                  <div className="mt-5 p-4 rounded-lg border border-white/[0.04] bg-white/[0.01]">
                    <p className="text-sm text-white/40 leading-relaxed">
                      Welcome to your customer portal. You can view your orders and manage your account here.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-[#0a0a0a] rounded-xl border border-white/[0.06] p-5">
                  <div className="flex items-center justify-between mb-2">
                    <Package size={16} className="text-white/30" />
                    <ArrowUpRight size={14} className="text-emerald-400/60" />
                  </div>
                  <p className="text-xl font-bold text-white">{orders.length}</p>
                  <p className="text-xs text-white/30 mt-0.5">Total Orders</p>
                </div>
                <div className="bg-[#0a0a0a] rounded-xl border border-white/[0.06] p-5">
                  <div className="flex items-center justify-between mb-2">
                    <ShoppingCart size={16} className="text-white/30" />
                    <ArrowUpRight size={14} className="text-emerald-400/60" />
                  </div>
                  <p className="text-xl font-bold text-white">
                    ${orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toFixed(2)}
                  </p>
                  <p className="text-xs text-white/30 mt-0.5">Total Spent</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="animate-fade-in">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="skeleton w-full h-14 rounded-lg" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-[#0a0a0a] rounded-xl border border-white/[0.06] p-12 text-center">
                  <ShoppingCart size={40} className="mx-auto mb-4 text-white/10" />
                  <p className="text-white/30 text-sm">No orders yet</p>
                </div>
              ) : (
                <div className="bg-[#0a0a0a] rounded-xl border border-white/[0.06] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/[0.06]">
                          <th className="text-left px-5 py-3.5 text-white/40">Order #</th>
                          <th className="text-left px-5 py-3.5 text-white/40">Customer</th>
                          <th className="text-right px-5 py-3.5 text-white/40">Total</th>
                          <th className="text-left px-5 py-3.5 text-white/40">Status</th>
                          <th className="text-left px-5 py-3.5 text-white/40">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition">
                            <td className="px-5 py-3.5 text-white font-medium text-sm">{order.orderNumber}</td>
                            <td className="px-5 py-3.5 text-white/50 text-sm">{order.customer?.name || 'N/A'}</td>
                            <td className="px-5 py-3.5 text-right text-white font-medium tabular-nums text-sm">${order.totalAmount?.toFixed(2)}</td>
                            <td className="px-5 py-3.5">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${getStatusStyle(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-white/30 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
