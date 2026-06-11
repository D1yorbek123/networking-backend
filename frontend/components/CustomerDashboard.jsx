'use client'

import { useState, useEffect } from 'react'
import { getMyOrders, createMyOrder, cancelMyOrder, getProducts, getCustomerDashboard } from '@/lib/api'
import { getUser, logout } from '@/lib/auth'
import {
  LogOut, Menu, X, ShoppingCart, User as UserIcon,
  Package, Sparkles, Search, Bell, Mail, Shield, ArrowUpRight, AlertCircle,
  Clock, CheckCircle, Truck, Plus, Minus, Trash2, MapPin, CreditCard,
  ChevronRight, CircleCheck, Building2, Phone, XCircle
} from 'lucide-react'

const NAV_ITEMS = [
  { key: 'profile', label: 'Mening Profilim', icon: UserIcon },
  { key: 'orders', label: 'Mening Buyurtmalarim', icon: Package },
  { key: 'newOrder', label: 'Buyurtma berish', icon: ShoppingCart },
]

const STATUS_TRANSLATIONS = {
  pending: 'Kutilmoqda',
  processing: 'Qayta ishlanmoqda',
  shipped: "Jo'natilgan",
  delivered: 'Yetkazilgan',
  cancelled: 'Bekor qilingan',
}

function translateStatus(status) {
  return STATUS_TRANSLATIONS[status] || status
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now - d
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'Bugun'
  if (days === 1) return 'Kecha'
  if (days < 7) return `${days} kun oldin`
  return d.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function CustomerDashboard() {
  const [user] = useState(() => getUser())
  const [activeTab, setActiveTab] = useState('profile')
  const [menuOpen, setMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [dashData, setDashData] = useState(null)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [ordersData, dashDataResult] = await Promise.all([
        getMyOrders(),
        getCustomerDashboard().catch(() => null)
      ])
      setOrders(ordersData)
      setDashData(dashDataResult)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadMyOrders = async () => {
    try {
      const ordersData = await getMyOrders()
      setOrders(ordersData)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleLogout = () => {
    logout()
    window.location.reload()
  }

  const getStatusStyle = (status) => {
    const styles = {
      pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      delivered: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
    }
    return styles[status] || 'bg-slate-500/20 text-slate-400 border-slate-500/30'
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={14} />;
      case 'processing': return <Package size={14} />;
      case 'shipped': return <Truck size={14} />;
      case 'delivered': return <CheckCircle size={14} />;
      default: return null;
    }
  }

  const getStatusStep = (status) => {
    const steps = ['pending', 'processing', 'shipped', 'delivered']
    const idx = steps.indexOf(status)
    return idx >= 0 ? idx : -1
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
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-6 py-8 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 neo-glow">
                <Sparkles size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tight">Fashion Hub</h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Mijoz Portali</p>
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
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 neo-glow shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon size={20} className={activeTab === key ? 'text-indigo-400' : 'text-slate-500'} />
                {label}
                {activeTab === key && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-indigo-400 neo-glow" />
                )}
              </button>
            ))}
          </nav>

          {/* User section */}
          <div className="p-4 mt-auto">
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20">
                  {user?.name?.charAt(0)?.toUpperCase() || 'C'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-200 truncate">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
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
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Abstract Background glows */}
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-indigo-600/10 blur-[100px] mix-blend-screen pointer-events-none" />
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
                {NAV_ITEMS.find(n => n.key === activeTab)?.label || 'Profil'}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-widest">Mijoz</span>
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
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto px-6 md:px-10 pb-10 z-10 custom-scrollbar">
          {/* Error */}
          {error && (
            <div className="mb-6 p-4 glass border border-red-500/30 rounded-2xl text-red-400 flex items-center gap-3 text-sm animate-fade-in shadow-[0_0_15px_rgba(239,68,68,0.15)]">
              <AlertCircle size={18} className="shrink-0" />
              {error}
              <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-300 p-1.5 rounded-xl hover:bg-red-500/10 transition">
                <X size={16} />
              </button>
            </div>
          )}

          {/* Success */}
          {successMessage && (
            <div className="mb-6 p-4 glass border border-emerald-500/30 rounded-2xl text-emerald-400 flex items-center gap-3 text-sm animate-fade-in shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <CircleCheck size={18} className="shrink-0" />
              {successMessage}
              <button onClick={() => setSuccessMessage('')} className="ml-auto text-emerald-400 hover:text-emerald-300 p-1.5 rounded-xl hover:bg-emerald-500/10 transition">
                <X size={16} />
              </button>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <ProfileView user={user} orders={orders} dashData={dashData} />
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <OrdersView
              orders={orders}
              loading={loading}
              getStatusStyle={getStatusStyle}
              getStatusIcon={getStatusIcon}
              getStatusStep={getStatusStep}
              formatDate={formatDate}
              translateStatus={translateStatus}
              onOrdersChanged={loadMyOrders}
              onError={setError}
            />
          )}

          {/* New Order Tab */}
          {activeTab === 'newOrder' && (
            <NewOrderView
              onOrderCreated={(msg) => {
                setSuccessMessage(msg)
                setActiveTab('orders')
                loadMyOrders()
              }}
              onError={setError}
            />
          )}
        </main>
      </div>
    </div>
  )
}

/* Profile View Component - API dan kelgan ma'lumotlar bilan */
function ProfileView({ user, orders, dashData }) {
  const totalSpent = dashData?.totalSpent || orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
  const totalOrders = dashData?.totalOrders || orders.length
  const customerRecord = dashData?.customerRecord

  return (
    <div className="max-w-3xl animate-fade-in space-y-6">
      <div className="glass-panel rounded-3xl overflow-hidden relative">
        <div className="h-32 bg-gradient-to-br from-indigo-600/40 via-purple-600/40 to-cyan-500/40 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 rounded-2xl glass border-2 border-white/20 shadow-2xl flex items-center justify-center text-4xl font-extrabold text-slate-100 bg-slate-900/50 backdrop-blur-xl">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
        </div>

        <div className="pt-16 px-8 pb-8">
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">{user?.name}</h1>
          <p className="text-sm text-slate-400 mt-1">{user?.email}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-slate-800 rounded-lg">
                  <Mail size={16} className="text-slate-400" />
                </div>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Email</p>
              </div>
              <p className="text-sm font-bold text-slate-200">{user?.email}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-slate-800 rounded-lg">
                  <Shield size={16} className="text-slate-400" />
                </div>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Rol</p>
              </div>
              <p className="text-sm font-bold text-slate-200 capitalize">{user?.role}</p>
            </div>
            {customerRecord?.company && (
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-slate-800 rounded-lg">
                    <Building2 size={16} className="text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Kompaniya</p>
                </div>
                <p className="text-sm font-bold text-slate-200">{customerRecord.company}</p>
              </div>
            )}
            {customerRecord?.phone && (
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-slate-800 rounded-lg">
                    <Phone size={16} className="text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Telefon</p>
                </div>
                <p className="text-sm font-bold text-slate-200">{customerRecord.phone}</p>
              </div>
            )}
          </div>

          <div className="mt-8 p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 neo-glow">
            <p className="text-sm text-indigo-200 leading-relaxed font-medium text-center">
              Mijoz portaliga xush kelibsiz! Bu yerda buyurtmalaringizni ko'rishingiz, yangi buyurtma berishingiz va hisobingizni boshqarishingiz mumkin.
            </p>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-6">
        <div className="glass-panel rounded-3xl p-6 hover:-translate-y-1 transition duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition">
              <Package size={20} className="text-indigo-400" />
            </div>
            <ArrowUpRight size={16} className="text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-slate-100">{totalOrders}</p>
          <p className="text-xs text-slate-400 mt-1 font-bold tracking-wide uppercase">Jami Buyurtmalar</p>
        </div>
        <div className="glass-panel rounded-3xl p-6 hover:-translate-y-1 transition duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition">
              <ShoppingCart size={20} className="text-emerald-400" />
            </div>
            <ArrowUpRight size={16} className="text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-slate-100 tabular-nums">
            ${totalSpent.toFixed(2)}
          </p>
          <p className="text-xs text-slate-400 mt-1 font-bold tracking-wide uppercase">Jami Sarflangan</p>
        </div>
      </div>
    </div>
  )
}

/* Orders View Component */
function OrdersView({ orders, loading, getStatusStyle, getStatusIcon, getStatusStep, formatDate, translateStatus, onOrdersChanged, onError }) {
  const [cancellingId, setCancellingId] = useState(null)

  const handleCancelOrder = async (orderId) => {
    if (!confirm("Bu buyurtmani bekor qilishni xohlaysizmi?")) return

    try {
      setCancellingId(orderId)
      await cancelMyOrder(orderId)
      onOrdersChanged()
    } catch (err) {
      onError(err.message)
    } finally {
      setCancellingId(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-fade-in">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton w-full h-32 rounded-3xl" />
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-16 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6">
          <Package size={40} className="text-indigo-400" />
        </div>
        <p className="text-slate-300 text-lg font-bold mb-2">Hali buyurtmalar yo'q</p>
        <p className="text-sm text-slate-500">Yangi buyurtma berish uchun "Buyurtma berish" bo'limiga o'ting</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Jami {orders.length} ta buyurtma</p>
      </div>

      {orders.map((order, i) => (
        <div
          key={order._id}
          className="glass-panel rounded-3xl overflow-hidden hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-300"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          {/* Order Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-900/30">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                <ShoppingCart size={18} className="text-indigo-400" />
              </div>
              <div>
                <p className="text-base font-extrabold text-slate-100">{order.orderNumber}</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{formatDate(order.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {(order.status === 'pending' || order.status === 'processing') && (
                <button
                  onClick={() => handleCancelOrder(order._id)}
                  disabled={cancellingId === order._id}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20 transition disabled:opacity-50"
                >
                  {cancellingId === order._id ? '...' : 'Bekor qilish'}
                </button>
              )}
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${getStatusStyle(order.status)}`}>
                {getStatusIcon(order.status)}
                {translateStatus(order.status)}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="px-6 py-5">
            <div className="space-y-3">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition border border-transparent hover:border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 border border-slate-700">
                      {item.quantity}x
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-200">{item.product?.name || "Mahsulot"}</p>
                      <p className="text-xs text-slate-500 mt-0.5">${item.price?.toFixed(2)} / dona</p>
                    </div>
                  </div>
                  <p className="text-base font-extrabold text-slate-100 tabular-nums">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Footer */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-900/30 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              {order.shippingAddress && (
                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-500" />{order.shippingAddress}</span>
              )}
            </div>
            <div className="text-right flex items-center gap-4">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Jami summa</p>
              <p className="text-xl font-extrabold text-slate-100 tabular-nums">${order.totalAmount?.toFixed(2)}</p>
            </div>
          </div>

          {/* Status Progress */}
          {order.status !== 'cancelled' && order.status !== 'delivered' && (
            <div className="px-6 py-5 bg-indigo-900/20 border-t border-indigo-500/20">
              <div className="flex items-center justify-between">
                {['pending', 'processing', 'shipped', 'delivered'].map((step, idx) => {
                  const currentStep = getStatusStep(order.status)
                  const isActive = idx <= currentStep
                  const isCurrent = idx === currentStep
                  return (
                    <div key={step} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isActive
                          ? isCurrent
                            ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-indigo-400'
                            : 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)] border border-emerald-400'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}>
                        {isActive && idx < currentStep ? <CheckCircle size={14} /> : idx + 1}
                      </div>
                      <span className={`text-xs font-bold tracking-wide ${
                        isActive ? 'text-indigo-300' : 'text-slate-600'
                      }`}>
                        {translateStatus(step)}
                      </span>
                      {idx < 3 && <div className={`w-12 h-0.5 mx-2 rounded-full ${idx < currentStep ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-slate-800'}`} />}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {order.status === 'delivered' && (
            <div className="px-6 py-4 bg-emerald-900/20 border-t border-emerald-500/20 text-center">
              <p className="text-sm text-emerald-400 font-bold flex items-center justify-center gap-2">
                <CircleCheck size={16} />
                Buyurtma muvaffaqiyatli yetkazib berildi
              </p>
            </div>
          )}

          {order.status === 'cancelled' && (
            <div className="px-6 py-4 bg-red-900/20 border-t border-red-500/20 text-center">
              <p className="text-sm text-red-400 font-bold flex items-center justify-center gap-2">
                <XCircle size={16} />
                Buyurtma bekor qilindi
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/* New Order View Component */
function NewOrderView({ onOrderCreated, onError }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState([])
  const [shippingAddress, setShippingAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('Barchasi')

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await getProducts()
      setProducts(data)
    } catch (err) {
      onError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product === product._id)
      if (existing) {
        return prev.map(item =>
          item.product === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product: product._id, name: product.name, price: product.price, quantity: 1, maxQty: product.quantity }]
    })
  }

  const updateQuantity = (productId, delta) => {
    setCart(prev => {
      const item = prev.find(i => i.product === productId)
      if (!item) return prev
      const newQty = item.quantity + delta
      if (newQty <= 0) {
        return prev.filter(i => i.product !== productId)
      }
      if (newQty > item.maxQty) {
        onError(`${item.name} mahsulotidan zaxirada atigi ${item.maxQty} dona qolgan`)
        return prev
      }
      return prev.map(i =>
        i.product === productId ? { ...i, quantity: newQty } : i
      )
    })
  }

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(i => i.product !== productId))
  }

  const clearCart = () => {
    setCart([])
  }

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const categories = ['Barchasi', ...new Set(products.map(p => p.category))]
  const filteredProducts = selectedCategory === 'Barchasi'
    ? products
    : products.filter(p => p.category === selectedCategory)

  const handleSubmit = async () => {
    if (cart.length === 0) {
      onError('Kamida bitta mahsulot tanlang!')
      return
    }

    try {
      setSubmitting(true)
      const items = cart.map(({ product, quantity, price }) => ({ product, quantity, price }))
      await createMyOrder({ items, shippingAddress, notes })
      setCart([])
      setShippingAddress('')
      setNotes('')
      onOrderCreated(`Buyurtma muvaffaqiyatli yaratildi!`)
    } catch (err) {
      onError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in items-start">
      {/* Products Selection */}
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-panel rounded-3xl p-6">
          <h3 className="text-lg font-bold text-slate-100 mb-5 tracking-tight">Katalok</h3>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6 border-b border-white/5 custom-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)] border border-indigo-500'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton h-40 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <button
                  key={product._id}
                  onClick={() => addToCart(product)}
                  disabled={product.quantity <= 0}
                  className="group text-left p-4 rounded-2xl bg-slate-900/40 border border-white/10 hover:border-indigo-500/50 hover:bg-slate-800/60 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3 group-hover:bg-indigo-500/20 group-hover:scale-110 transition duration-300">
                    <Package size={18} className="text-indigo-400" />
                  </div>
                  <p className="text-sm font-bold text-slate-200 mb-1 line-clamp-2">{product.name}</p>
                  <p className="text-xs text-slate-500 mb-3 font-medium uppercase tracking-wide">{product.category}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <p className="text-base font-extrabold text-indigo-400 tabular-nums">${product.price?.toFixed(2)}</p>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${
                      product.quantity <= (product.reorderLevel || 10)
                        ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                        : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    }`}>
                      {product.quantity} dona
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart / Order Summary */}
      <div className="space-y-6 lg:sticky lg:top-6">
        <div className="glass-panel rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <ShoppingCart size={20} className="text-blue-400" />
              Savatcha
            </h3>
            <div className="flex items-center gap-3">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-red-400 hover:text-red-300 transition font-bold bg-red-500/10 px-2.5 py-1.5 rounded-lg hover:bg-red-500/20 border border-red-500/20"
                >
                  Tozalash
                </button>
              )}
              <span className="text-xs text-slate-400 font-bold bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10">{cart.length} ta</span>
            </div>
          </div>

          {cart.length === 0 ? (
            <div className="py-12 text-center bg-slate-900/30 rounded-2xl border border-white/5 border-dashed">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 border border-white/10">
                <ShoppingCart size={24} className="text-slate-500" />
              </div>
              <p className="text-sm font-bold text-slate-400 mb-1">Savatcha bo'sh</p>
              <p className="text-xs text-slate-500">Katalokdan mahsulot tanlang</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-6 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
                {cart.map((item) => (
                  <div key={item.product} className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-200 truncate">{item.name}</p>
                      <p className="text-xs font-bold text-indigo-400 mt-0.5">${item.price?.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900 rounded-xl p-1 border border-white/5">
                      <button
                        onClick={() => updateQuantity(item.product, -1)}
                        className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 transition"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-sm font-extrabold text-slate-200 tabular-nums">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product, 1)}
                        className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 transition"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product)}
                      className="p-2.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-6 bg-slate-900/30 p-4 rounded-2xl border border-white/5">
                {/* Shipping Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Manzil</label>
                  <input
                    type="text"
                    value={shippingAddress}
                    onChange={e => setShippingAddress(e.target.value)}
                    placeholder="Yetkazib berish manzili"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-800 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-600 transition"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Izoh</label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Qo'shimcha izohlar..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-800 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none placeholder:text-slate-600 transition"
                  />
                </div>
              </div>

              {/* Total & Submit */}
              <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 neo-glow mb-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-indigo-300 uppercase tracking-widest">Jami Summa</p>
                  <p className="text-2xl font-extrabold text-white tabular-nums drop-shadow-md">${totalAmount.toFixed(2)}</p>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting || cart.length === 0}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-extrabold hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CreditCard size={18} />
                    Buyurtmani Tasdiqlash
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
