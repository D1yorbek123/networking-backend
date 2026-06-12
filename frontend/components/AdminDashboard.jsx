'use client'

import { useState, useEffect } from 'react'
import { getAdminDashboard } from '@/lib/api'
import { getUser, logout } from '@/lib/auth'
import {
  LogOut, Menu, X, BarChart3, Users, ShoppingCart,
  TrendingUp, AlertCircle, Layers, Handshake,
  ChevronRight, ArrowUpRight, Search, Bell, Sparkles, PieChart as PieChartIcon
} from 'lucide-react'
import CustomersList from './tabs/CustomersList'
import ProductsList from './tabs/ProductsList'
import OrdersList from './tabs/OrdersList'
import DealsList from './tabs/DealsList'
import AdminAnalytics from './tabs/AdminAnalytics'

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Umumiy', icon: BarChart3 },
  { key: 'analytics', label: 'Tahlil', icon: PieChartIcon },
  { key: 'customers', label: 'Mijozlar', icon: Users },
  { key: 'products', label: 'Remudule', icon: Layers },
  { key: 'orders', label: 'Buyurtmalar', icon: ShoppingCart },
  { key: 'deals', label: 'Shartnomalar', icon: Handshake },
]

export default function AdminDashboard() {
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
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 z-30 md:hidden backdrop-blur-md"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Floating Glass Sidebar */}
      <aside className={`
        fixed md:relative z-40 h-[calc(100vh-32px)] my-4 ml-4 w-[280px] glass rounded-3xl
        transform transition-all duration-300 ease-out flex flex-col shadow-2xl
        ${menuOpen ? 'translate-x-0' : '-translate-x-[120%] md:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="px-6 py-8 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 neo-glow">
              <Sparkles size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight">Fashion Hub</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setMenuOpen(false) }}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                activeTab === key
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 neo-glow shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon size={20} className={activeTab === key ? 'text-blue-400' : 'text-slate-500'} />
              {label}
              {activeTab === key && (
                <div className="ml-auto w-2 h-2 rounded-full bg-blue-400 neo-glow" />
              )}
            </button>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 mt-auto">
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-200 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 text-sm font-bold transition-all duration-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
          >
            <LogOut size={16} />
            Tizimdan chiqish
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Abstract Background glows */}
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-blue-600/10 blur-[100px] mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] mix-blend-screen pointer-events-none" />

        {/* Top Header */}
        <header className="h-24 px-6 md:px-10 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden glass p-2.5 rounded-xl hover:bg-white/10 transition"
            >
              {menuOpen ? <X size={20} className="text-slate-300"/> : <Menu size={20} className="text-slate-300"/>}
            </button>
            <div>
              <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight drop-shadow-md">
                {NAV_ITEMS.find(n => n.key === activeTab)?.label || 'Umumiy'}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-widest">Admin</span>
                <span className="text-xs text-slate-500 font-medium">{new Date().toLocaleDateString('uz-UZ', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="glass p-3 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/10 transition duration-300">
              <Search size={18} />
            </button>
            <button className="glass p-3 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/10 transition duration-300 relative">
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-purple-500 rounded-full animate-pulse-dot" />
            </button>
          </div>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-y-auto px-6 md:px-10 pb-10 z-10 custom-scrollbar">
          {error && (
            <div className="mb-6 p-4 glass border border-red-500/30 rounded-2xl text-red-400 flex items-center gap-3 text-sm animate-fade-in shadow-[0_0_15px_rgba(239,68,68,0.15)]">
              <AlertCircle size={18} className="shrink-0" />
              {error}
            </div>
          )}

          {activeTab === 'dashboard' && (
            loading ? <DashboardSkeleton /> : dashboardData && <DashboardContent data={dashboardData} />
          )}

          {activeTab === 'analytics' && (
            loading ? <DashboardSkeleton /> : <AdminAnalytics data={dashboardData} />
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
    { title: 'Jami Mijozlar', value: data.totalCustomers, icon: Users, change: '+12%', color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.2)]' },
    { title: 'Jami Buyurtmalar', value: data.totalOrders, icon: ShoppingCart, change: '+8%', color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/30', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.2)]' },
    { title: 'Jami Daromad', value: `$${data.totalRevenue?.toFixed(2) || '0.00'}`, icon: TrendingUp, change: '+23%', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]' },
    { title: 'Jami Mahsulotlar', value: data.totalProducts, icon: Layers, change: '+5%', color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]' },
  ]
  return (
    <div className="space-y-8 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map(({ title, value, icon: Icon, change, color, bg, border, glow }, i) => (
          <div
            key={title}
            className={`group glass-panel rounded-3xl p-6 transition-all duration-300 animate-slide-up hover:-translate-y-1 hover:${glow}`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${bg} ${border} border`}>
                <Icon size={20} className={color} />
              </div>
              <span className={`text-xs font-bold ${color} ${bg} px-2.5 py-1 rounded-lg flex items-center gap-1 border ${border}`}>
                <ArrowUpRight size={14} />
                {change}
              </span>
            </div>
            <p className="text-3xl font-extrabold text-slate-100 tracking-tight drop-shadow-md mb-1">{value}</p>
            <p className="text-sm text-slate-400 font-medium tracking-wide">{title}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="glass-panel rounded-3xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
            <h3 className="text-base font-bold text-slate-200">Oxirgi Buyurtmalar</h3>
            <button className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 transition uppercase tracking-widest">
              Barchasi <ChevronRight size={14} />
            </button>
          </div>
          <div className="divide-y divide-white/5 flex-1 p-2">
            {data.recentOrders?.length > 0 ? (
              data.recentOrders.slice(0, 5).map((order) => (
                <div key={order._id} className="flex items-center justify-between px-4 py-4 hover:bg-white/5 rounded-2xl transition cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                      <ShoppingCart size={16} className="text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-200">{order.orderNumber}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="text-sm font-extrabold text-slate-200 tabular-nums">${order.totalAmount?.toFixed(2)}</p>
                </div>
              ))
            ) : (
              <div className="px-6 py-10 text-center">
                <p className="text-sm text-slate-500">Oxirgi buyurtmalar yo'q</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Customers */}
        <div className="glass-panel rounded-3xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
            <h3 className="text-base font-bold text-slate-200">Eng Faol Mijozlar</h3>
            <button className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 transition uppercase tracking-widest">
              Barchasi <ChevronRight size={14} />
            </button>
          </div>
          <div className="divide-y divide-white/5 flex-1 p-2">
            {data.topCustomers?.length > 0 ? (
              data.topCustomers.slice(0, 5).map((customer, i) => (
                <div key={customer._id} className="flex items-center justify-between px-4 py-4 hover:bg-white/5 rounded-2xl transition cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
                      {customer.name?.charAt(0)?.toUpperCase() || '#'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-200">{customer.name}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">{customer.company || "Mavjud emas"}</p>
                    </div>
                  </div>
                  <p className="text-sm font-extrabold text-emerald-400 tabular-nums drop-shadow-sm">${customer.totalSpent?.toFixed(2)}</p>
                </div>
              ))
            ) : (
              <div className="px-6 py-10 text-center">
                <p className="text-sm text-slate-500">Mijoz ma'lumotlari yo'q</p>
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
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-panel rounded-3xl p-6">
            <div className="skeleton w-12 h-12 rounded-2xl mb-4" />
            <div className="skeleton w-24 h-8 mb-2" />
            <div className="skeleton w-32 h-4" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="glass-panel rounded-3xl p-6 min-h-[300px] flex flex-col">
            <div className="skeleton w-40 h-6 mb-6" />
            <div className="space-y-4 flex-1">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="skeleton w-full h-14 rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
