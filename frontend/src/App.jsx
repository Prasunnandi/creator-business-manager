import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DealLifecycleTracker from './pages/DealLifecycleTracker';
import PipelineBoard from './pages/PipelineBoard';
import BrandDirectory from './pages/BrandDirectory';
import InvoicesFinance from './pages/InvoicesFinance';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('tracker');
  const [analytics, setAnalytics] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    const data = await api.getAnalytics();
    setAnalytics(data);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAnalytics();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onRefresh={handleRefresh} isRefreshing={isRefreshing} analytics={analytics} />
        
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'tracker' && <DealLifecycleTracker onRefreshRequired={fetchAnalytics} />}
          {activeTab === 'pipeline' && <PipelineBoard onSelectDeal={() => setActiveTab('tracker')} />}
          {activeTab === 'brands' && <BrandDirectory />}
          {activeTab === 'invoices' && <InvoicesFinance />}
        </main>
      </div>
    </div>
  );
}
