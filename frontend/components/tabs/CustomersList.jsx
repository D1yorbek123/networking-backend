'use client';
import { useState, useEffect } from 'react';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../../lib/api';
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react';

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', password: '',
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data.customers || data || []);
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer._id, formData);
      } else {
        await createCustomer({ ...formData, role: 'customer' });
      }
      fetchCustomers();
      resetForm();
    } catch (err) {
      console.error('Error saving customer:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu mijozni o'chirib tashlashni xohlaysizmi?")) {
      try {
        await deleteCustomer(id);
        fetchCustomers();
      } catch (err) {
        console.error('Error deleting customer:', err);
      }
    }
  };

  const startEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      company: customer.company || '',
      password: '',
    });
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', company: '', password: '' });
    setEditingCustomer(null);
    setShowAddModal(false);
  };

  const filteredCustomers = (Array.isArray(customers) ? customers : []).filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Mijozlar Boshqaruvi</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Barcha mijozlar bazasi</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600/20 text-blue-400 font-bold rounded-xl border border-blue-500/30 hover:bg-blue-600/30 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300 uppercase tracking-widest text-xs"
        >
          <Plus size={16} />
          Mijoz Qo'shish
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input
          type="text"
          placeholder="Ism, email yoki kompaniya bo'yicha qidiruv..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-slate-200 placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm"
        />
      </div>

      {/* Customers Table */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-8 space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex gap-4 items-center animate-pulse">
                <div className="w-10 h-10 bg-slate-800 rounded-xl"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-800 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-slate-800 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCustomers.length > 0 ? (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th>Mijoz</th>
                  <th>Telefon</th>
                  <th>Kompaniya</th>
                  <th>Qo'shilgan sana</th>
                  <th className="text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCustomers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-white/5 transition-colors group">
                    <td>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
                          {customer.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">{customer.name}</p>
                          <p className="text-xs text-slate-500">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm font-medium text-slate-400">{customer.phone || '-'}</td>
                    <td className="text-sm font-medium text-slate-400">{customer.company || '-'}</td>
                    <td className="text-xs font-bold text-slate-500 uppercase tracking-wider">{new Date(customer.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => startEdit(customer)}
                          className="p-2 rounded-xl text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(customer._id)}
                          className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
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
        ) : (
          <div className="p-16 text-center">
            <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">👥</span>
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-1">Mijozlar topilmadi</h3>
            <p className="text-sm text-slate-500">Qidiruvni o'zgartiring yoki yangi mijoz qo'shing.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={resetForm}></div>
          <div className="relative glass-panel rounded-3xl w-full max-w-md shadow-2xl animate-fade-in flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-100">{editingCustomer ? 'Mijozni Tahrirlash' : 'Yangi Mijoz'}</h2>
              <button onClick={resetForm} className="p-2 text-slate-400 hover:text-slate-200 hover:bg-white/10 rounded-xl transition">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="customerForm" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Ism</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full" placeholder="Mijoz ismi" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full" placeholder="email@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Telefon</label>
                  <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full" placeholder="+998 90 123 45 67" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Kompaniya</label>
                  <input type="text" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full" placeholder="Kompaniya nomi" />
                </div>
                {!editingCustomer && (
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Parol</label>
                    <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full" placeholder="••••••••" />
                  </div>
                )}
              </form>
            </div>
            
            <div className="p-6 border-t border-white/10 flex gap-3">
              <button type="button" onClick={resetForm} className="flex-1 py-3 text-sm font-bold text-slate-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">Bekor qilish</button>
              <button type="submit" form="customerForm" className="flex-1 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all">
                {editingCustomer ? 'Saqlash' : 'Qo\'shish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersList;
