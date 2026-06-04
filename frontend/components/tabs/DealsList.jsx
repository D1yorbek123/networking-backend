'use client'

import { useState, useEffect } from 'react'
import { getDeals, deleteDeal } from '@/lib/api'
import { AlertCircle, Trash2, X, Handshake, TrendingUp } from 'lucide-react'

export default function DealsList() {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDeals()
  }, [])

  const loadDeals = async () => {
    try {
      setLoading(true)
      const data = await getDeals()
      setDeals(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this deal?')) {
      try {
        await deleteDeal(id)
        await loadDeals()
      } catch (err) {
        setError(err.message)
      }
    }
  }

  const getStageStyle = (stage) => {
    const styles = {
      prospect: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      qualification: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      proposal: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      negotiation: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      closed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    }
    return styles[stage] || 'bg-white/[0.04] text-white/50 border-white/[0.06]'
  }

  const totalValue = deals.reduce((sum, d) => sum + (d.value || 0), 0)
  const avgProbability = deals.length > 0
    ? Math.round(deals.reduce((sum, d) => sum + (d.probability || 0), 0) / deals.length)
    : 0

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header Stats */}
      <div className="flex items-center gap-4">
        <p className="text-xs text-white/30">{deals.length} total deals</p>
        {deals.length > 0 && (
          <>
            <span className="text-white/10">·</span>
            <p className="text-xs text-white/30">
              Pipeline: <span className="text-white/60 font-medium">${totalValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
            </p>
            <span className="text-white/10">·</span>
            <p className="text-xs text-white/30">
              Avg. Probability: <span className="text-white/60 font-medium">{avgProbability}%</span>
            </p>
          </>
        )}
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

      {/* Deals */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#0a0a0a] rounded-xl border border-white/[0.06] p-5">
              <div className="skeleton w-32 h-4 mb-3" />
              <div className="skeleton w-20 h-3 mb-4" />
              <div className="skeleton w-full h-2 rounded-full" />
            </div>
          ))}
        </div>
      ) : deals.length === 0 ? (
        <div className="bg-[#0a0a0a] rounded-xl border border-white/[0.06] p-12 text-center">
          <Handshake size={40} className="mx-auto mb-4 text-white/10" />
          <p className="text-white/30 text-sm">No deals found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {deals.map((deal, i) => (
            <div
              key={deal._id}
              className="group bg-[#0a0a0a] rounded-xl border border-white/[0.06] p-5 hover:border-white/[0.12] transition-all duration-200 animate-slide-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white truncate">{deal.name}</h3>
                  <p className="text-[11px] text-white/30 mt-0.5">{deal.customer?.company || 'N/A'}</p>
                </div>
                <button
                  onClick={() => handleDelete(deal._id)}
                  className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all p-1 rounded shrink-0 ml-2"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <TrendingUp size={12} className="text-white/20" />
                  <span className="text-lg font-bold text-white tabular-nums">${deal.value?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border ${getStageStyle(deal.stage)}`}>
                  {deal.stage}
                </span>
              </div>

              {/* Probability bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-white/30">Probability</span>
                  <span className="text-[11px] text-white/50 font-medium tabular-nums">{deal.probability}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${deal.probability}%`,
                      background: deal.probability >= 70
                        ? 'rgb(52, 211, 153)'
                        : deal.probability >= 40
                        ? 'rgb(251, 191, 36)'
                        : 'rgb(248, 113, 113)'
                    }}
                  />
                </div>
              </div>

              {deal.expectedCloseDate && (
                <p className="text-[11px] text-white/20 mt-3 pt-3 border-t border-white/[0.04]">
                  Expected close: {new Date(deal.expectedCloseDate).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
