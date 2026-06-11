'use client';
import { useState, useEffect } from 'react';
import { getAdminDashboard, getOrders } from '../../lib/api';

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [statsData, ordersData] = await Promise.all([
        getAdminDashboard(),
        getOrders(),
      ]);
      setStats(statsData);
      setOrders(ordersData.orders || ordersData || []);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="glass-panel rounded-3xl p-6">
              <div className="skeleton h-4 w-1/2 mb-4" />
              <div className="skeleton h-8 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const ordersByStatus = (Array.isArray(orders) ? orders : []).reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const monthlyRevenue = (Array.isArray(orders) ? orders : []).reduce((acc, order) => {
    const month = new Date(order.createdAt).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + (order.totalAmount || 0);
    return acc;
  }, {});

  const statusColors = {
    pending: { bg: 'bg-amber-500/20', text: 'text-amber-400', bar: 'bg-amber-400', border: 'border-amber-500/30' },
    processing: { bg: 'bg-blue-500/20', text: 'text-blue-400', bar: 'bg-blue-400', border: 'border-blue-500/30' },
    shipped: { bg: 'bg-purple-500/20', text: 'text-purple-400', bar: 'bg-purple-400', border: 'border-purple-500/30' },
    delivered: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', bar: 'bg-emerald-400', border: 'border-emerald-500/30' },
    cancelled: { bg: 'bg-red-500/20', text: 'text-red-400', bar: 'bg-red-400', border: 'border-red-500/30' },
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Tahlil</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Biznes ko'rsatkichlari va statistika</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel rounded-3xl p-6 border-b-2 border-b-emerald-500 relative overflow-hidden group hover:-translate-y-1 transition duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition duration-500"></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 relative z-10">Jami Daromad</p>
          <p className="text-3xl font-extrabold text-slate-100 relative z-10">${(stats?.totalRevenue || 0).toLocaleString()}</p>
          <div className="mt-4 flex items-center gap-2 relative z-10">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-lg border border-emerald-500/30">+12.5%</span>
            <span className="text-[10px] text-slate-500 font-medium">O'tgan oyga nisbatan</span>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 border-b-2 border-b-blue-500 relative overflow-hidden group hover:-translate-y-1 transition duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-500/20 transition duration-500"></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 relative z-10">Mijozlar</p>
          <p className="text-3xl font-extrabold text-slate-100 relative z-10">{stats?.totalCustomers || 0}</p>
          <div className="mt-4 flex items-center gap-2 relative z-10">
            <span className="text-xs font-bold text-blue-400 bg-blue-500/20 px-2 py-1 rounded-lg border border-blue-500/30">+5.2%</span>
            <span className="text-[10px] text-slate-500 font-medium">O'tgan oyga nisbatan</span>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 border-b-2 border-b-purple-500 relative overflow-hidden group hover:-translate-y-1 transition duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-purple-500/20 transition duration-500"></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 relative z-10">Buyurtmalar</p>
          <p className="text-3xl font-extrabold text-slate-100 relative z-10">{stats?.totalOrders || 0}</p>
          <div className="mt-4 flex items-center gap-2 relative z-10">
            <span className="text-xs font-bold text-purple-400 bg-purple-500/20 px-2 py-1 rounded-lg border border-purple-500/30">+8.1%</span>
            <span className="text-[10px] text-slate-500 font-medium">O'tgan oyga nisbatan</span>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 border-b-2 border-b-amber-500 relative overflow-hidden group hover:-translate-y-1 transition duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-amber-500/20 transition duration-500"></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 relative z-10">Faol Shartnomalar</p>
          <p className="text-3xl font-extrabold text-slate-100 relative z-10">{stats?.activeDeals || 0}</p>
          <div className="mt-4 flex items-center gap-2 relative z-10">
            <span className="text-xs font-bold text-amber-400 bg-amber-500/20 px-2 py-1 rounded-lg border border-amber-500/30">+3.7%</span>
            <span className="text-[10px] text-slate-500 font-medium">O'tgan oyga nisbatan</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Distribution */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col">
          <h3 className="text-base font-bold text-slate-200 mb-6 uppercase tracking-widest text-center">Buyurtmalar Holati</h3>
          <div className="space-y-5 flex-1 flex flex-col justify-center">
            {Object.entries(ordersByStatus).length > 0 ? Object.entries(ordersByStatus).map(([status, count]) => {
              const total = Object.values(ordersByStatus).reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
              const colors = statusColors[status] || { bg: 'bg-slate-800', text: 'text-slate-300', bar: 'bg-slate-500', border: 'border-slate-700' };

              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${colors.bg} ${colors.text} ${colors.border} uppercase tracking-wider`}>
                      {status}
                    </span>
                    <span className="text-xs font-bold text-slate-400">{count} ({percentage}%)</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                    <div
                      className={`h-full rounded-full ${colors.bar} transition-all duration-1000 shadow-[0_0_10px_currentColor]`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            }) : (
              <p className="text-center text-slate-500 text-sm">Ma'lumotlar yo'q</p>
            )}
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col">
          <h3 className="text-base font-bold text-slate-200 mb-6 uppercase tracking-widest text-center">Oylik Daromad</h3>
          <div className="space-y-4 flex-1 flex flex-col justify-center">
            {Object.entries(monthlyRevenue).length > 0 ? Object.entries(monthlyRevenue).map(([month, revenue]) => {
              const maxRevenue = Math.max(...Object.values(monthlyRevenue));
              const percentage = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;

              return (
                <div key={month} className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-400 w-10 uppercase tracking-widest">{month}</span>
                  <div className="flex-1 h-8 bg-slate-800 rounded-xl overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-1000 flex items-center justify-end pr-3 relative"
                      style={{ width: `${percentage}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 blur-sm mix-blend-overlay"></div>
                      <span className="text-[10px] font-extrabold text-white relative z-10 drop-shadow-md">${revenue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <p className="text-center text-slate-500 text-sm">Ma'lumotlar yo'q</p>
            )}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="glass-panel rounded-3xl p-6">
        <h3 className="text-base font-bold text-slate-200 mb-6 uppercase tracking-widest text-center">Samaradorlik</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition duration-300">
            <p className="text-4xl font-extrabold text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.4)]">
              ${Array.isArray(orders) && orders.length > 0
                ? (orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) / orders.length).toFixed(0)
                : '0'
              }
            </p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-3">O'rtacha xarid summasi</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition duration-300">
            <p className="text-4xl font-extrabold text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]">
              {Array.isArray(orders) ? orders.filter(o => o.status === 'delivered').length : 0}
            </p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-3">Yakunlangan Buyurtmalar</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition duration-300">
            <p className="text-4xl font-extrabold text-purple-400 drop-shadow-[0_0_15px_rgba(192,132,252,0.4)]">
              {Array.isArray(orders) && orders.length > 0
                ? ((orders.filter(o => o.status === 'delivered').length / orders.length) * 100).toFixed(1)
                : '0'
              }%
            </p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-3">Yetkazib berish darajasi</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
