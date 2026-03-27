import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import StatsBar from '../components/StatsBar';
import HealthScore from '../components/HealthScore';
import CategoryPieChart from '../components/CategoryPieChart';
import SubscriptionBarChart from '../components/SubscriptionBarChart';
import SubscriptionCard from '../components/SubscriptionCard';
import CancelSavePanel from '../components/CancelSavePanel';
import SavingsSimulator from '../components/SavingsSimulator';
import AIRecommendations from '../components/AIRecommendations';
import api from '../utils/api';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [simulatedSavings, setSimulatedSavings] = useState(0);

  useEffect(() => {
    const fetchDashboard = async () => {
      const sessionId = localStorage.getItem('slasher_session_id');
      if (!sessionId) {
        setError("No session found. Please start over.");
        setLoading(false);
        return;
      }
      
      try {
        const res = await api.get(`/api/dashboard/${sessionId}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch dashboard data. Make sure backend is running on :5000");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <Loader />;
  
  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white pt-20 flex flex-col items-center justify-center p-4">
        <Navbar />
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-8 rounded-2xl max-w-lg text-center font-medium shadow-lg shadow-red-500/5">
          <div className="text-4xl mb-4">⚠️</div>
          {error}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-24 pb-32">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-12">
        <div className="animate-fade-in animate-slide-up">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 mb-8">
            Your Financial Vault
          </h1>
          <StatsBar 
            totalMonthly={data.totalMonthly} 
            totalAnnual={data.totalAnnual} 
            subscriptionCount={data.subscriptionCount} 
            potentialAnnualSavings={data.potentialAnnualSavings} 
          />
        </div>
        
        <div className="animate-fade-in animate-slide-up delay-100">
          <HealthScore score={data.healthScore} label={data.healthLabel} />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 animate-fade-in animate-slide-up delay-200">
          <div className="w-full lg:w-1/2">
            <CategoryPieChart byCategory={data.byCategory} />
          </div>
          <div className="w-full lg:w-1/2">
            <SubscriptionBarChart subscriptions={data.subscriptions} />
          </div>
        </div>

        <div className="animate-fade-in animate-slide-up delay-300">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span>💳</span> Your Subscriptions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.subscriptions?.map((sub, i) => (
              <SubscriptionCard key={i} {...sub} />
            ))}
            {(!data.subscriptions || data.subscriptions.length === 0) && (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 p-12 border border-dashed border-[#1e1e2e] bg-[#12121a] rounded-2xl text-center text-gray-500 font-medium">
                No active subscriptions found. You are completely optimized!
              </div>
            )}
          </div>
        </div>

        {data.cancelRecommendations && data.cancelRecommendations.length > 0 && (
          <div className="animate-fade-in animate-slide-up delay-400">
            <CancelSavePanel 
              cancelRecommendations={data.cancelRecommendations} 
              onSelectionChange={setSimulatedSavings} 
            />
          </div>
        )}

        <div className="animate-fade-in animate-slide-up delay-500">
          <SavingsSimulator monthlySavings={simulatedSavings} />
        </div>

        <div className="animate-fade-in animate-slide-up delay-500">
          <AIRecommendations 
            subscriptions={data.subscriptions} 
            sessionId={localStorage.getItem('slasher_session_id')} 
          />
        </div>
      </div>
    </div>
  );
}
