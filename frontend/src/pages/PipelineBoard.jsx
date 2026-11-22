import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Layers, Plus, DollarSign, Calendar, ChevronRight } from 'lucide-react';

const STAGES = [
  { key: 'INQUIRY', label: '1. Inquiries', color: 'border-slate-700' },
  { key: 'NEGOTIATION', label: '2. Negotiation', color: 'border-amber-500/50' },
  { key: 'CONTRACT_SIGNED', label: '3. Contract MSA', color: 'border-blue-500/50' },
  { key: 'DELIVERABLES_IN_PROGRESS', label: '4. Production', color: 'border-purple-500/50' },
  { key: 'INVOICED', label: '5. Invoiced', color: 'border-cyan-500/50' },
  { key: 'PAID', label: '6. Paid Out', color: 'border-emerald-500/50' },
];

export default function PipelineBoard({ onSelectDeal }) {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await api.getDeals();
      setDeals(data || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Layers className="h-5 w-5 text-rose-400" /> Sponsorship Sales & Collaboration Pipeline
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Real-time deal flow across all 6 stages of creator partnership execution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto pb-4">
        {STAGES.map(stage => {
          const stageDeals = deals.filter(d => d.stage === stage.key);
          const totalVal = stageDeals.reduce((sum, d) => sum + d.value, 0);

          return (
            <div key={stage.key} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col min-w-[210px] space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-200">{stage.label}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  {stageDeals.length}
                </span>
              </div>
              <div className="text-[11px] font-mono text-emerald-400 font-bold">
                ${totalVal.toLocaleString()}
              </div>

              <div className="space-y-2 flex-1">
                {stageDeals.map(deal => (
                  <div
                    key={deal.id}
                    onClick={() => onSelectDeal && onSelectDeal(deal.id)}
                    className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-slate-700 cursor-pointer space-y-2 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{deal.brandName}</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">${deal.value.toLocaleString()}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                      {deal.campaignTitle}
                    </div>
                    <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/60 flex justify-between">
                      <span>Air: {deal.targetPublishDate}</span>
                      <span className="text-rose-400 flex items-center">Inspect <ChevronRight className="h-2.5 w-2.5" /></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
