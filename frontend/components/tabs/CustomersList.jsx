'use client'

import { useState, useEffect } from 'react'
import { getCustomers, createCustomer, deleteCustomer } from '@/lib/api'
import { AlertCircle, Plus, Trash2, X, Users, Building2, Mail, Phone } from 'lucide-react'

export default function CustomersList() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', industry: '', city: '', country: ''
  })

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      const data = await getCustomers()
      setCustomers(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      await createCustomer(formData)
      await loadCustomers()
      setFormData({ name: '', email: '', phone: '', company: '', industry: '', city: '', country: '' })
      setShowForm(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(id)
        await loadCustomers()
      } catch (err) {
        setError(err.message)
      }
    }
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-white/30">{customers.length} total customers</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 transition-all"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'Add Customer'}
        </button>
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

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#0a0a0a] rounded-xl border border-white/[0.06] p-5 space-y-4 animate-slide-up">
          <p className="text-sm font-semibold text-white mb-1">New Customer</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" placeholder="Full Name *" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="px-3.5 py-2.5 rounded-lg text-sm bg-white/[0.03] border-white/[0.06]" />
            <input type="email" placeholder="Email *" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="px-3.5 py-2.5 rounded-lg text-sm bg-white/[0.03] border-white/[0.06]" />
            <input type="tel" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="px-3.5 py-2.5 rounded-lg text-sm bg-white/[0.03] border-white/[0.06]" />
            <input type="text" placeholder="Company" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="px-3.5 py-2.5 rounded-lg text-sm bg-white/[0.03] border-white/[0.06]" />
            <input type="text" placeholder="Industry" value={formData.industry} onChange={(e) => setFormData({...formData, industry: e.target.value})} className="px-3.5 py-2.5 rounded-lg text-sm bg-white/[0.03] border-white/[0.06]" />
            <input type="text" placeholder="City" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="px-3.5 py-2.5 rounded-lg text-sm bg-white/[0.03] border-white/[0.06]" />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm text-white/40 hover:text-white transition">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {submitting ? (
                <div className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : null}
              Save Customer
            </button>
          </div>
        </form>
      )}

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#0a0a0a] rounded-xl border border-white/[0.06] p-5">
              <div className="skeleton w-8 h-8 rounded-full mb-3" />
              <div className="skeleton w-28 h-4 mb-2" />
              <div className="skeleton w-36 h-3 mb-1" />
              <div className="skeleton w-24 h-3" />
            </div>
          ))}
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-[#0a0a0a] rounded-xl border border-white/[0.06] p-12 text-center">
          <Users size={40} className="mx-auto mb-4 text-white/10" />
          <p className="text-white/30 text-sm">No customers found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {customers.map((customer, i) => (
            <div
              key={customer._id}
              className="group bg-[#0a0a0a] rounded-xl border border-white/[0.06] p-5 hover:border-white/[0.12] transition-all duration-200 animate-slide-up"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.06] flex items-center justify-center text-white/50 text-sm font-semibold">
                  {customer.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <button
                  onClick={() => handleDelete(customer._id)}
                  className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all p-1 rounded"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{customer.name}</h3>
              <div className="space-y-1">
                {customer.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={12} className="text-white/20" />
                    <p className="text-xs text-white/40 truncate">{customer.email}</p>
                  </div>
                )}
                {customer.company && (
                  <div className="flex items-center gap-2">
                    <Building2 size={12} className="text-white/20" />
                    <p className="text-xs text-white/40 truncate">{customer.company}</p>
                  </div>
                )}
                {customer.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={12} className="text-white/20" />
                    <p className="text-xs text-white/40">{customer.phone}</p>
                  </div>
                )}
              </div>
              {customer.status && (
                <div className="mt-3 pt-3 border-t border-white/[0.04]">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border ${
                    customer.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    customer.status === 'inactive' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {customer.status}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
