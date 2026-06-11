'use client';
import { useState, useEffect } from 'react';
import { getDeals, getCustomers, updateDeal, createDeal, deleteDeal } from '../../lib/api';
import { Plus, Edit2, Trash2, X, LayoutGrid, List } from 'lucide-react';

const DealsList = () => {
  const [deals, setDeals] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [viewMode, setViewMode] = useState('kanban');
  const [formData, setFormData] = useState({
    title: '', description: '', value: '', stage: 'lead', customer: '', priority: 'medium',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dealsData, customersData] = await Promise.all([
        getDeals(),
        getCustomers(),
      ]);
      setDeals(dealsData.deals || dealsData || []);
      setCustomers(customersData.customers || customersData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = { ...formData, value: parseFloat(formData.value) };
      if (editingDeal) {
        await updateDeal(editingDeal._id, submitData);
      } else {
        await createDeal(submitData);
      }
      fetchData();
      resetForm();
    } catch (err) {
      console.error('Error saving deal:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Ushbu shartnomani o'chirmoqchimisiz?")) {
      try {
        await deleteDeal(id);
        fetchData();
      } catch (err) {
        console.error('Error deleting deal:', err);
      }
    }
  };

  const handleStageChange = async (dealId, newStage) => {
    try {
      await updateDeal(dealId, { stage: newStage });
      fetchData();
    } catch (err) {
      console.error('Error updating deal stage:', err);
    }
  };

  const startEdit = (deal) => {
    setEditingDeal(deal);
    setFormData({
      title: deal.title,
      description: deal.description || '',
      value: deal.value?.toString() || '',
      stage: deal.stage,
      customer: deal.customer?._id || deal.customer || '',
      priority: deal.priority || 'medium',
    });
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', value: '', stage: 'lead', customer: '', priority: 'medium' });
    setEditingDeal(null);
    setShowAddModal(false);
  };

  const stages = [
    { id: 'lead', label: 'Yangi (Lead)', color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' },
    { id: 'qualified', label: 'Saralangan', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { id: 'proposal', label: 'Taklif', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { id: 'negotiation', label: 'Muzokara', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    { id: 'closed_won', label: 'Yutilgan', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { id: 'closed_lost', label: 'Yo\'qotilgan', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  ];

  const priorityColors = {
    low: 'text-slate-400 bg-slate-500/20 border-slate-500/30',
    medium: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
    high: 'text-red-400 bg-red-500/20 border-red-500/30',
  };

  const dealsArray = Array.isArray(deals) ? deals : [];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Shartnomalar (Deals)</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Sotuv jarayonlarini kuzatib boring</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-slate-900/50 rounded-xl p-1 border border-white/5">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'kanban' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <LayoutGrid size={14} /> Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'list' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <List size={14} /> Ro'yxat
            </button>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600/20 text-blue-400 font-bold rounded-xl border border-blue-500/30 hover:bg-blue-600/30 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300 uppercase tracking-widest text-xs"
          >
            <Plus size={16} />
            Yangi Shartnoma
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="glass-panel rounded-3xl p-4">
              <div className="skeleton h-4 w-1/2 mb-4" />
              <div className="skeleton h-24 rounded-2xl" />
            </div>
          ))}
        </div>
      ) : viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto custom-scrollbar pb-4 min-h-[60vh]">
          {stages.map((stage) => {
            const stageDeals = dealsArray.filter(d => d.stage === stage.id);
            const stageTotal = stageDeals.reduce((sum, d) => sum + (d.value || 0), 0);

            return (
              <div key={stage.id} className="flex flex-col">
                <div className={`p-4 rounded-t-3xl border-t-4 border border-b-0 ${stage.color} backdrop-blur-md`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold uppercase tracking-widest">{stage.label}</h3>
                    <span className="text-[10px] font-extrabold bg-slate-900/50 px-2 py-1 rounded-lg">
                      {stageDeals.length}
                    </span>
                  </div>
                  <p className="text-sm font-extrabold drop-shadow-md">${stageTotal.toLocaleString()}</p>
                </div>
                
                <div className="flex-1 bg-white/5 border border-white/10 rounded-b-3xl p-3 space-y-3">
                  {stageDeals.map((deal) => (
                    <div key={deal._id} className="bg-slate-900/60 rounded-2xl p-4 border border-white/5 hover:border-blue-500/30 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all cursor-pointer group">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-sm font-bold text-slate-200 line-clamp-2 leading-snug">{deal.title}</h4>
                      </div>
                      <p className="text-lg font-extrabold text-blue-400 mb-2">${(deal.value || 0).toLocaleString()}</p>
                      
                      <div className="flex items-center justify-between mt-4">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${priorityColors[deal.priority] || priorityColors.medium} uppercase tracking-wider`}>
                          {deal.priority}
                        </span>
                        
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => startEdit(deal)} className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">
                            <Edit2 size={12} />
                          </button>
                          <button onClick={() => handleDelete(deal._id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th>Shartnoma</th>
                  <th>Qiymati</th>
                  <th>Bosqich</th>
                  <th>Ustuvorlik</th>
                  <th>Mijoz</th>
                  <th className="text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {dealsArray.map((deal) => (
                  <tr key={deal._id} className="hover:bg-white/5 transition-colors group">
                    <td>
                      <p className="font-bold text-slate-200">{deal.title}</p>
                      <p className="text-xs text-slate-500 line-clamp-1">{deal.description}</p>
                    </td>
                    <td className="text-sm font-extrabold text-blue-400">${(deal.value || 0).toLocaleString()}</td>
                    <td>
                      <select
                        value={deal.stage}
                        onChange={(e) => handleStageChange(deal._id, e.target.value)}
                        className="text-xs font-bold px-3 py-1.5 rounded-xl border border-white/10 bg-slate-900 text-slate-300 focus:border-blue-500/50"
                      >
                        {stages.map(s => (
                          <option key={s.id} value={s.id}>{s.label}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${priorityColors[deal.priority] || priorityColors.medium} uppercase tracking-wider`}>
                        {deal.priority}
                      </span>
                    </td>
                    <td className="text-sm font-medium text-slate-400">{deal.customer?.name || '-'}</td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <button onClick={() => startEdit(deal)} className="p-2 rounded-xl text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(deal._id)} className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
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

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={resetForm}></div>
          <div className="relative glass-panel rounded-3xl w-full max-w-md shadow-2xl animate-fade-in flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-100">{editingDeal ? 'Shartnomani Tahrirlash' : 'Yangi Shartnoma'}</h2>
              <button onClick={resetForm} className="p-2 text-slate-400 hover:text-slate-200 hover:bg-white/10 rounded-xl transition">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="dealForm" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nomi</label>
                  <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full" placeholder="Shartnoma nomi" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Tavsif</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} className="w-full" placeholder="Qisqacha ma'lumot..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Qiymati ($)</label>
                    <input type="number" required value={formData.value} onChange={(e) => setFormData({...formData, value: e.target.value})} className="w-full" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Ustuvorlik</label>
                    <select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} className="w-full">
                      <option value="low">Past</option>
                      <option value="medium">O'rta</option>
                      <option value="high">Yuqori</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Bosqich</label>
                  <select value={formData.stage} onChange={(e) => setFormData({...formData, stage: e.target.value})} className="w-full">
                    {stages.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Mijoz</label>
                  <select value={formData.customer} onChange={(e) => setFormData({...formData, customer: e.target.value})} className="w-full">
                    <option value="">Mijozni tanlang</option>
                    {(Array.isArray(customers) ? customers : []).map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-white/10 flex gap-3">
              <button type="button" onClick={resetForm} className="flex-1 py-3 text-sm font-bold text-slate-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">Bekor qilish</button>
              <button type="submit" form="dealForm" className="flex-1 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all">
                {editingDeal ? 'Saqlash' : 'Qo\'shish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealsList;
