'use client'

import { useState, useEffect } from 'react'
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/lib/api'
import { AlertCircle, Plus, Trash2, X, Package, Tag, DollarSign, Layers, Pencil } from 'lucide-react'

export default function ProductsList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
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

  const openCreateForm = () => {
    setEditingProduct(null)
    setFormData({ name: '', sku: '', category: '', price: '', cost: '', quantity: '', reorderLevel: '' })
    setShowForm(true)
  }

  const openEditForm = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name || '',
      sku: product.sku || '',
      category: product.category || '',
      price: String(product.price || ''),
      cost: String(product.cost || ''),
      quantity: String(product.quantity || ''),
      reorderLevel: String(product.reorderLevel || ''),
    })
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      const payload = {
        ...formData,
        price: Number(formData.price),
        cost: Number(formData.cost),
        quantity: Number(formData.quantity),
        reorderLevel: Number(formData.reorderLevel),
      }
      if (editingProduct) {
        await updateProduct(editingProduct._id, payload)
      } else {
        await createProduct(payload)
      }
      await loadProducts()
      setShowForm(false)
      setEditingProduct(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (confirm("Bu mahsulotni o'chirishni xohlaysizmi?")) {
      try {
        await deleteProduct(id)
        await loadProducts()
      } catch (err) {
        setError(err.message)
      }
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Mahsulotlar Katalogi</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Jami {products.length} ta mahsulot</p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600/20 text-blue-400 font-bold rounded-xl border border-blue-500/30 hover:bg-blue-600/30 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300 uppercase tracking-widest text-xs"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Bekor qilish' : "Mahsulot qo'shish"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 glass border border-red-500/30 rounded-2xl text-red-400 flex items-center gap-3 text-sm animate-fade-in shadow-[0_0_15px_rgba(239,68,68,0.15)]">
          <AlertCircle size={18} className="shrink-0" />
          {error}
          <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-300 p-1.5 rounded-xl hover:bg-red-500/10 transition">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 space-y-4 animate-fade-in shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          
          <h3 className="text-lg font-bold text-slate-100 mb-4 relative z-10">
            {editingProduct ? 'Mahsulotni Tahrirlash' : 'Yangi Mahsulot'}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Mahsulot Nomi</label>
              <input type="text" placeholder="Kiriting" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-slate-200 placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">SKU</label>
              <input type="text" placeholder="Kiriting" value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-slate-200 placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Kategoriya</label>
              <input type="text" placeholder="Kiriting" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-slate-200 placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Narx ($)</label>
              <input type="number" step="0.01" placeholder="0.00" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-slate-200 placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Tannarx ($)</label>
              <input type="number" step="0.01" placeholder="0.00" value={formData.cost} onChange={(e) => setFormData({...formData, cost: e.target.value})} required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-slate-200 placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Miqdor</label>
                <input type="number" placeholder="0" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-slate-200 placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Min. Zaxira</label>
                <input type="number" placeholder="10" value={formData.reorderLevel} onChange={(e) => setFormData({...formData, reorderLevel: e.target.value})} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-slate-200 placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm" />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10 relative z-10 mt-6">
            <button type="button" onClick={() => { setShowForm(false); setEditingProduct(null) }} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              {editingProduct ? 'Saqlash' : "Qo'shish"}
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      {loading ? (
        <div className="glass-panel rounded-3xl p-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton w-full h-14 mb-3 last:mb-0 rounded-2xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="glass-panel rounded-3xl p-16 text-center">
          <div className="w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6">
            <Package size={40} className="text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-200 mb-2">Katalog bo'sh</h3>
          <p className="text-slate-500 text-sm font-medium">Mahsulotlar qo'shish tugmasi orqali yangi mahsulot yarating.</p>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th>Mahsulot</th>
                  <th>SKU</th>
                  <th>Kategoriya</th>
                  <th className="text-right">Narx</th>
                  <th className="text-right">Zaxira</th>
                  <th className="text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-white/5 transition-colors group">
                    <td>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 group-hover:scale-105 transition-all">
                          <Package size={18} className="text-blue-400" />
                        </div>
                        <span className="text-slate-200 font-bold group-hover:text-blue-400 transition-colors">{product.name}</span>
                      </div>
                    </td>
                    <td className="text-slate-400 text-xs font-mono font-bold tracking-wider">{product.sku}</td>
                    <td>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-white/5 text-slate-300 border border-white/10 uppercase tracking-wider">
                        <Tag size={12} className="text-slate-500" />
                        {product.category}
                      </span>
                    </td>
                    <td className="text-right">
                      <span className="font-extrabold text-slate-200 text-base">
                        <span className="text-slate-500 mr-0.5">$</span>
                        {product.price?.toFixed(2)}
                      </span>
                    </td>
                    <td className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-xs font-bold ${
                        product.quantity <= (product.reorderLevel || 10) 
                          ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' 
                          : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                      }`}>
                        {product.quantity} ta
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => openEditForm(product)}
                          className="p-2 rounded-xl text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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
