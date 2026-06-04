'use client'

import { useState, useEffect } from 'react'
import { getProducts, createProduct, deleteProduct } from '@/lib/api'
import { AlertCircle, Plus, Trash2, X, Package } from 'lucide-react'

export default function ProductsList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '', sku: '', category: '', price: '', cost: '', quantity: '', reorderLevel: ''
  })

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await getProducts()
      setProducts(data)
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
      await createProduct(formData)
      await loadProducts()
      setFormData({ name: '', sku: '', category: '', price: '', cost: '', quantity: '', reorderLevel: '' })
      setShowForm(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id)
        await loadProducts()
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
          <p className="text-xs text-white/30">{products.length} total products</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 transition-all"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'Add Product'}
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
          <p className="text-sm font-semibold text-white mb-1">New Product</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <input type="text" placeholder="Product Name *" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="px-3.5 py-2.5 rounded-lg text-sm bg-white/[0.03] border-white/[0.06]" />
            <input type="text" placeholder="SKU *" value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} required className="px-3.5 py-2.5 rounded-lg text-sm bg-white/[0.03] border-white/[0.06]" />
            <input type="text" placeholder="Category *" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required className="px-3.5 py-2.5 rounded-lg text-sm bg-white/[0.03] border-white/[0.06]" />
            <input type="number" step="0.01" placeholder="Price *" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required className="px-3.5 py-2.5 rounded-lg text-sm bg-white/[0.03] border-white/[0.06]" />
            <input type="number" step="0.01" placeholder="Cost *" value={formData.cost} onChange={(e) => setFormData({...formData, cost: e.target.value})} required className="px-3.5 py-2.5 rounded-lg text-sm bg-white/[0.03] border-white/[0.06]" />
            <input type="number" placeholder="Quantity" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} className="px-3.5 py-2.5 rounded-lg text-sm bg-white/[0.03] border-white/[0.06]" />
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
              Save Product
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      {loading ? (
        <div className="bg-[#0a0a0a] rounded-xl border border-white/[0.06] p-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton w-full h-12 mb-2 last:mb-0 rounded-lg" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-[#0a0a0a] rounded-xl border border-white/[0.06] p-12 text-center">
          <Package size={40} className="mx-auto mb-4 text-white/10" />
          <p className="text-white/30 text-sm">No products found</p>
        </div>
      ) : (
        <div className="bg-[#0a0a0a] rounded-xl border border-white/[0.06] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left px-5 py-3.5 text-white/40">Product</th>
                  <th className="text-left px-5 py-3.5 text-white/40">SKU</th>
                  <th className="text-left px-5 py-3.5 text-white/40">Category</th>
                  <th className="text-right px-5 py-3.5 text-white/40">Price</th>
                  <th className="text-right px-5 py-3.5 text-white/40">Qty</th>
                  <th className="text-center px-5 py-3.5 text-white/40"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="group border-b border-white/[0.04] hover:bg-white/[0.02] transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                          <Package size={14} className="text-white/30" />
                        </div>
                        <span className="text-white font-medium text-sm">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-white/40 text-sm font-mono text-xs">{product.sku}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/[0.04] text-white/50 border border-white/[0.06]">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right text-white font-medium tabular-nums text-sm">${product.price?.toFixed(2)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`tabular-nums text-sm font-medium ${
                        product.quantity <= (product.reorderLevel || 10) ? 'text-amber-400' : 'text-white/60'
                      }`}>
                        {product.quantity}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() => handleDelete(product._id)}
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
