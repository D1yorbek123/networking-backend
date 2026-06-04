'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAdminDashboard } from '@/lib/api'
import { getUser, logout } from '@/lib/auth'
import {
  LogOut, Menu, X, BarChart3, Users, ShoppingCart,
  TrendingUp, AlertCircle, Layers, Handshake,
  ChevronRight, ArrowUpRight, Search, Bell, Sparkles
} from 'lucide-react'
import CustomersList from './tabs/CustomersList'
import ProductsList from './tabs/ProductsList'
import OrdersList from './tabs/OrdersList'
import DealsList from './tabs/DealsList'

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Overview', icon: BarChart3 },
  { key: 'customers', label: 'Customers', icon: Users },
  { key: 'products', label: 'Products', icon: Layers },
  { key: 'orders', label: 'Orders', icon: ShoppingCart },
  { key: 'deals', label: 'Deals', icon: Handshake },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [user] = useState(() => getUser())
  const [activeTab, setActiveTab] = useState('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await getAdminDashboard()
      setDashboardData(data)
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
                <p className="text-[11px] text-white/30">CRM Platform</p>
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
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
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
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white">
                {NAV_ITEMS.find(n => n.key === activeTab)?.label || 'Overview'}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition">
              <Search size={16} />
            </button>
            <button className="p-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition relative">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-white rounded-full animate-pulse-dot" />
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
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {activeTab === 'dashboard' && (
            loading ? <DashboardSkeleton /> : dashboardData && <DashboardContent data={dashboardData} />
          )}

          {activeTab === 'customers' && <CustomersList />}
          {activeTab === 'products' && <ProductsList />}
          {activeTab === 'orders' && <OrdersList />}
          {activeTab === 'deals' && <DealsList />}
        </main>
      </div>
    </div>
  )
}

function DashboardContent({ data }) {
  const kpis = [
    { title: 'Total Customers', value: data.totalCustomers, icon: Users, change: '+12%' },
    { title: 'Total Orders', value: data.totalOrders, icon: ShoppingCart, change: '+8%' },
    { title: 'Total Revenue', value: `$${data.totalRevenue?.toFixed(2) || '0.00'}`, icon: TrendingUp, change: '+23%' },
    { title: 'Total Products', value: data.totalProducts, icon: Layers, change: '+5%' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ title, value, icon: Icon, change }, i) => (
          <div
            key={title}
            className="group bg-[#0a0a0a] rounded-xl border border-white/[0.06] p-5 hover:border-white/[0.12] transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-white/[0.04]">
                <Icon size={16} className="text-white/40 group-hover:text-white/70 transition" />
              </div>
              <span className="text-[11px] font-medium text-emerald-400/80 flex items-center gap-0.5">
                <ArrowUpRight size={12} />
                {change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
            <p className="text-xs text-white/30 mt-1">{title}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Orders */}
        <div className="bg-[#0a0a0a] rounded-xl border border-white/[0.06] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white">Recent Orders</h3>
            <button className="text-xs text-white/30 hover:text-white/60 flex items-center gap-1 transition">
              View all <ChevronRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {data.recentOrders?.length > 0 ? (
              data.recentOrders.slice(0, 5).map((order) => (
                <div key={order._id} className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                      <ShoppingCart size={14} className="text-white/30" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{order.orderNumber}</p>
                      <p className="text-[11px] text-white/30">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-white tabular-nums">${order.totalAmount?.toFixed(2)}</p>
                </div>
              ))
            ) : (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-white/20">No recent orders</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-[#0a0a0a] rounded-xl border border-white/[0.06] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white">Top Customers</h3>
            <button className="text-xs text-white/30 hover:text-white/60 flex items-center gap-1 transition">
              View all <ChevronRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {data.topCustomers?.length > 0 ? (
              data.topCustomers.slice(0, 5).map((customer, i) => (
                <div key={customer._id} className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/[0.08] border border-white/[0.06] flex items-center justify-center text-white/50 text-xs font-semibold">
                      {customer.name?.charAt(0)?.toUpperCase() || '#'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{customer.name}</p>
                      <p className="text-[11px] text-white/30">{customer.company || 'N/A'}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-emerald-400/80 tabular-nums">${customer.totalSpent?.toFixed(2)}</p>
                </div>
              ))
            ) : (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-white/20">No customer data</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#0a0a0a] rounded-xl border border-white/[0.06] p-5">
            <div className="skeleton w-8 h-8 rounded-lg mb-3" />
            <div className="skeleton w-20 h-7 mb-1.5" />
            <div className="skeleton w-24 h-3" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-[#0a0a0a] rounded-xl border border-white/[0.06] p-5">
            <div className="skeleton w-32 h-5 mb-4" />
            {[...Array(4)].map((_, j) => (
              <div key={j} className="skeleton w-full h-12 mb-2.5 last:mb-0" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
