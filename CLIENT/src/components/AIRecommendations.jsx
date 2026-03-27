import React, { useState } from 'react';
import api from '../utils/api';

export default function AIRecommendations({ subscriptions = [], sessionId }) {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState(null);

  const getInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/api/recommendations', { subscriptions, sessionId });
      setInsights(res.data.recommendations || []);
    } catch (err) {
      console.error(err);
      setError("AI service unavailable. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span>🤖</span> AI-Powered Insights
        </h2>
        
        {!insights && !loading && (
          <button 
            onClick={getInsights}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg ring-1 ring-white/20 transition-all hover:scale-105"
          >
            Get AI Insights
          </button>
        )}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="w-12 h-12 border-4 border-[#1e1e2e] border-t-purple-500 rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
          <p className="text-indigo-400 font-medium animate-pulse">Analysing your subscriptions with AI...</p>
        </div>
      )}

      {error && !loading && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-center rounded-xl">
          {error}
        </div>
      )}

      {insights && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {insights.map((insight, i) => (
            <div key={i} className="bg-[#1e1e2e]/50 border border-[#1e1e2e] rounded-xl p-5 shadow-inner">
              <div className="flex justify-between items-center mb-3">
                <div className="font-bold text-lg text-white">{insight.merchantName || 'Subscription'}</div>
                {insight.shouldCancel ? (
                  <span className="px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/30 rounded-full text-xs font-bold uppercase">🔴 Cancel</span>
                ) : (
                  <span className="px-2.5 py-1 bg-green-500/10 text-green-400 border border-green-500/30 rounded-full text-xs font-bold uppercase">🟢 Keep</span>
                )}
              </div>
              
              <p className="text-gray-400 mb-4">{insight.reason}</p>
              
              {insight.shouldCancel && (
                <div className="mt-auto">
                  {insight.alternativeSuggestion && (
                    <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 rounded-lg text-sm mb-3">
                      <span className="font-semibold text-indigo-400">Alternative: </span> {insight.alternativeSuggestion}
                    </div>
                  )}
                  {insight.annualSavingsIfCancelled && (
                    <div className="text-green-400 font-bold">
                      Annual savings: ₹{insight.annualSavingsIfCancelled.toLocaleString()}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {insights.length === 0 && (
             <div className="col-span-1 md:col-span-2 p-8 text-center text-gray-500 border border-dashed border-[#1e1e2e] rounded-xl">
               AI could not find strong recommendations. You are optimal.
             </div>
          )}
        </div>
      )}
    </div>
  );
}
