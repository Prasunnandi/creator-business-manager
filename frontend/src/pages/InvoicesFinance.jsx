import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Receipt, CheckCircle2, Clock, AlertTriangle, ArrowUpRight } from 'lucide-react';

export default function InvoicesFinance() {
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

  const billedDeals = deals.filter(d => d.stage === 'INVOICED' || d.stage === 'PAID');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Receipt className="h-5 w-5 text-rose-400" /> Sponsorship Invoices & Payment Ledger
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Automated Net 30 invoices, payment statuses, and creator wire clearance.
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">Invoice #</th>
                <th className="py-2.5 px-3">Brand Sponsor</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Due Date</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {billedDeals.map((deal) => {
                const isPaid = deal.stage === 'PAID';
                return (
                  <tr key={deal.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-rose-300">
                      {deal.invoiceNumber || 'INV-DRAFT'}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{deal.brandName}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-xs">{deal.campaignTitle}</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                      ${deal.value.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {deal.paymentDueDate || 'Net 30 on delivery'}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        isPaid
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      }`}>
                        {isPaid ? 'Settled & Paid' : 'Awaiting Wire (Net 30)'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-rose-300 text-[11px] font-medium transition-colors">
                        Download PDF
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
