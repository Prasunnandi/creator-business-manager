import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Building2, Mail, DollarSign, Award, Star } from 'lucide-react';

export default function BrandDirectory() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await api.getBrands();
      setBrands(data || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Building2 className="h-5 w-5 text-rose-400" /> Brand CRM & Sponsor Relationships
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Historical sponsor database with contract frequency, key contacts, and average deal values.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {brands.map(brand => (
          <div key={brand.id} className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                  {brand.tier}
                </span>
                <span className="text-xs font-mono text-slate-400">{brand.id}</span>
              </div>
              <h3 className="text-base font-bold text-white mt-2">{brand.name}</h3>
              <p className="text-xs text-slate-400">{brand.industry}</p>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="h-3.5 w-3.5 text-slate-500" />
                <span className="truncate">{brand.email}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Past Partnerships:</span>
                <strong className="text-white">{brand.pastDealsCount} Campaigns</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Avg Contract Size:</span>
                <strong className="text-emerald-400">${brand.avgDealValue?.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
