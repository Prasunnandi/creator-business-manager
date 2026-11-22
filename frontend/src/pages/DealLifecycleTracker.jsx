import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Zap, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ArrowRight, 
  DollarSign, 
  Building2, 
  Calendar, 
  ShieldCheck, 
  Sparkles,
  Receipt,
  AlertCircle
} from 'lucide-react';

export default function DealLifecycleTracker({ onRefreshRequired }) {
  const [deals, setDeals] = useState([]);
  const [selectedDealId, setSelectedDealId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [advancing, setAdvancing] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await api.getDeals();
      setDeals(data || []);
      if (data?.length > 0) setSelectedDealId(data[0].id);
      setLoading(false);
    }
    load();
  }, []);

  const selectedDeal = deals.find(d => d.id === selectedDealId);

  const handleAdvanceStage = async () => {
    if (!selectedDealId) return;
    setAdvancing(true);
    try {
      const res = await api.advanceStage(selectedDealId);
      if (res.deal) {
        setDeals(deals.map(d => d.id === res.deal.id ? res.deal : d));
      }
      if (onRefreshRequired) onRefreshRequired();
    } catch (e) {
      console.error(e);
    } finally {
      setAdvancing(false);
    }
  };

  const getStageBadgeColor = (stage) => {
    switch (stage) {
      case 'INQUIRY': return 'bg-slate-800 text-slate-300 border-slate-700';
      case 'NEGOTIATION': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'CONTRACT_SIGNED': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'DELIVERABLES_IN_PROGRESS': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'INVOICED': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'PAID': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default: return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900 border border-rose-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-rose-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                <Zap className="h-3 w-3" /> Standout Flagship Feature
              </span>
              <span className="text-xs text-slate-400">CreatorDesk + DealRadar Engine</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              End-to-End Brand Sponsorship Lifecycle & Revenue Tracker
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl mt-1">
              Tracks high-value partnerships seamlessly across all six milestones: from cold brand enquiry through scoping, contract execution, deliverable approval, invoicing, and wire receipt.
            </p>
          </div>

          {selectedDeal && selectedDeal.stage !== 'PAID' && (
            <button
              onClick={handleAdvanceStage}
              disabled={advancing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-rose-600/20 flex items-center gap-2 transition-all disabled:opacity-50 shrink-0"
            >
              <Sparkles className="h-4 w-4" />
              {advancing ? 'Updating Milestone...' : 'Advance Deal to Next Stage'}
            </button>
          )}
        </div>
      </div>

      {/* Deal Selector Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {deals.map(deal => {
          const isSelected = selectedDealId === deal.id;
          return (
            <div
              key={deal.id}
              onClick={() => setSelectedDealId(deal.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-rose-950/30 border-rose-500/60 shadow-md'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{deal.brandName}</span>
                <span className="font-mono text-xs font-bold text-emerald-400">${deal.value.toLocaleString()}</span>
              </div>
              <div className="text-[11px] text-slate-400 truncate mt-1">{deal.campaignTitle}</div>
              <div className="mt-2.5 flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getStageBadgeColor(deal.stage)}`}>
                  {deal.stage.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] text-slate-500">{deal.probability}% Win Prob</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Deal Comprehensive Lifecycle Cockpit */}
      {selectedDeal && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Building2 className="h-4 w-4 text-rose-400" />
                <span className="font-semibold text-slate-200">{selectedDeal.brandName}</span>
                <span>•</span>
                <span className="font-mono">{selectedDeal.id}</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">{selectedDeal.campaignTitle}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Deliverable: <strong className="text-slate-300">{selectedDeal.deliverableType}</strong>
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Contract Sponsorship Fee</div>
              <div className="text-2xl font-black text-white font-mono mt-0.5">
                ${selectedDeal.value.toLocaleString()}
              </div>
              <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded border uppercase tracking-wider mt-1 ${getStageBadgeColor(selectedDeal.stage)}`}>
                Current Status: {selectedDeal.stage.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Graphical 6-Stage Timeline */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-rose-400" /> End-to-End Progression Lifecycle
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              {selectedDeal.timeline.map((step, idx) => {
                const isCompleted = step.status === 'COMPLETED';
                const isActive = step.status === 'ACTIVE';

                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border relative transition-all ${
                      isCompleted
                        ? 'bg-slate-950 border-emerald-500/40 text-slate-200'
                        : isActive
                        ? 'bg-rose-950/20 border-rose-500/60 shadow-lg shadow-rose-950/40'
                        : 'bg-slate-950/40 border-slate-800/60 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400">0{idx + 1}</span>
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : isActive ? (
                        <div className="h-2.5 w-2.5 rounded-full bg-rose-400 animate-ping" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-slate-700" />
                      )}
                    </div>
                    <div className="text-xs font-bold leading-tight">
                      {step.step}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-1.5">
                      {step.date}
                    </div>
                    {step.note && (
                      <div className="text-[10px] text-slate-300 mt-2 bg-slate-900 p-1.5 rounded border border-slate-800 leading-tight">
                        {step.note}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Scheduled Live Airing</div>
              <div className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-rose-400" />
                <span>{selectedDeal.targetPublishDate}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Invoice & Billing</div>
              <div className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
                <Receipt className="h-4 w-4 text-cyan-400" />
                <span>{selectedDeal.invoiceNumber || 'Pending Delivery Sign-off'}</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {selectedDeal.paymentDueDate ? `Due: ${selectedDeal.paymentDueDate}` : 'Net 30 terms upon air date'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Production Notes</div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {selectedDeal.notes}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
