'use client'

import { useState, useEffect } from 'react'
import { getOrders, deleteOrder } from '@/lib/api'
import { AlertCircle, Trash2, X, ShoppingCart } from 'lucide-react'

export default function OrdersList() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const data = await getOrders()
      setOrders(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder(id)
        await loadOrders()
      } catch (err) {
        setError(err.message)
      }
    }
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
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-white/30">{orders.length} total orders</p>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3.5 bg-red-500/[0.06] border border-red-500/10 rounded-lg text-red-400 flex items-center gap-2.5 text-sm animate-fade-in">
          <AlertCircle size={16} />
          {error}
          <button onClick={() => setError('')} className="ml-auto text-red-400/60 hover:text-red-400">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="bg-[#0a0a0a] rounded-xl border border-white/[0.06] p-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton w-full h-12 mb-2 last:mb-0 rounded-lg" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-[#0a0a0a] rounded-xl border border-white/[0.06] p-12 text-center">
          <ShoppingCart size={40} className="mx-auto mb-4 text-white/10" />
          <p className="text-white/30 text-sm">No orders found</p>
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
                  <th className="text-center px-5 py-3.5 text-white/40"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="group border-b border-white/[0.04] hover:bg-white/[0.02] transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                          <ShoppingCart size={14} className="text-white/30" />
                        </div>
                        <span className="text-white font-medium text-sm">{order.orderNumber}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="text-sm text-white/70">{order.customer?.name || 'N/A'}</p>
                        {order.customer?.company && (
                          <p className="text-[11px] text-white/30">{order.customer.company}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right text-white font-medium tabular-nums text-sm">
                      ${order.totalAmount?.toFixed(2)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-white/30 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all p-1.5 rounded-lg hover:bg-red-500/[0.06]"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
