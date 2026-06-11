'use client';
import { useState, useEffect } from 'react';
import { getOrders, updateOrder } from '../../lib/api';
import { ShoppingCart } from 'lucide-react';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data.orders || data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrder(orderId, { status: newStatus });
      fetchOrders();
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  const statusColors = {
    pending: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    processing: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    shipped: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    delivered: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    cancelled: 'text-red-400 border-red-500/30 bg-red-500/10',
  };

  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  const ordersArray = Array.isArray(orders) ? orders : [];
  const filteredOrders = filterStatus === 'all' ? ordersArray : ordersArray.filter(o => o.status === filterStatus);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Buyurtmalar</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Barcha mijoz buyurtmalarini boshqarish</p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${filterStatus === 'all' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'bg-slate-900/50 border border-white/5 text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
        >
          Barchasi ({ordersArray.length})
        </button>
        {statuses.map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${filterStatus === status ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'bg-slate-900/50 border border-white/5 text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
          >
            {status} ({ordersArray.filter(o => o.status === status).length})
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-8 space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="mb-4 animate-pulse">
                <div className="h-4 bg-slate-800 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-800 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th>Buyurtma ID</th>
                  <th>Mijoz</th>
                  <th>Mahsulotlar</th>
                  <th>Summa</th>
                  <th>Holati</th>
                  <th>Sana</th>
                  <th className="text-right">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-white/5 transition-colors group">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-all">
                          <ShoppingCart size={14} className="text-indigo-400" />
                        </div>
                        <p className="font-mono text-sm font-bold text-slate-200">#{order._id?.slice(-6)}</p>
                      </div>
                    </td>
                    <td>
                      <p className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors">{order.customer?.name || 'Mavjud emas'}</p>
                      <p className="text-xs text-slate-500">{order.customer?.email || ''}</p>
                    </td>
                    <td className="text-sm font-bold text-slate-400">{order.items?.length || 0} xil</td>
                    <td className="font-extrabold text-blue-400">${(order.totalAmount || 0).toFixed(2)}</td>
                    <td>
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${statusColors[order.status] || 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="text-right">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className="text-xs font-bold px-3 py-1.5 rounded-xl border border-white/10 bg-slate-900 text-slate-300 focus:border-blue-500/50 uppercase tracking-wider inline-block text-right w-[140px]"
                      >
                        {statuses.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center">
            <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <ShoppingCart size={32} className="text-slate-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-1">Buyurtmalar topilmadi</h3>
            <p className="text-sm text-slate-500">Filtr bo'yicha hech qanday buyurtma mavjud emas.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersList;
