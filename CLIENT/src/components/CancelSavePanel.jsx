import React, { useState, useEffect } from 'react';

export default function CancelSavePanel({ cancelRecommendations = [], onSelectionChange }) {
  const [selectedIds, setSelectedIds] = useState(
    cancelRecommendations.map(r => r.id || r.merchantName) // pre-select all recommendations by default
  );

  useEffect(() => {
    // Calculate total selected monthly savings
    const selectedSubs = cancelRecommendations.filter(r => selectedIds.includes(r.id || r.merchantName));
    const totalMonthly = selectedSubs.reduce((acc, sub) => acc + Number(sub.amount), 0);
    if (onSelectionChange) {
      onSelectionChange(totalMonthly);
    }
  }, [selectedIds, cancelRecommendations, onSelectionChange]);

  const toggleSelection = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const scrollToSimulator = () => {
    const el = document.getElementById('savings-simulator');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const totalCurrentMonthly = cancelRecommendations
    .filter(r => selectedIds.includes(r.id || r.merchantName))
    .reduce((acc, sub) => acc + Number(sub.amount), 0);
  const totalCurrentYearly = totalCurrentMonthly * 12;

  if (cancelRecommendations.length === 0) return null;

  return (
    <div className="bg-[#12121a] border border-indigo-500/30 rounded-2xl p-6 md:p-8 shadow-lg shadow-indigo-500/10 mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
          <span>💡</span> Cancel & Save Recommendations
        </h2>
        <p className="text-gray-400 mt-2">Sorted by highest savings potential. Select to simulate your savings.</p>
      </div>

      <div className="flex flex-col gap-4 mb-24">
        {cancelRecommendations.map((sub, idx) => {
          const id = sub.id || sub.merchantName;
          const isSelected = selectedIds.includes(id);

          return (
            <div 
              key={idx}
              onClick={() => toggleSelection(id)}
              className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-xl gap-4 cursor-pointer transition-colors ${
                isSelected ? 'bg-indigo-500/10 border-indigo-500' : 'bg-[#1e1e2e]/50 border-[#1e1e2e] hover:border-indigo-500/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-indigo-500 border-indigo-500' : 'bg-transparent border-gray-500'
                }`}>
                  {isSelected && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <div className="text-2xl">{sub.emoji || '💳'}</div>
                <div>
                  <h4 className="font-bold text-lg text-white">{sub.merchantName}</h4>
                  <div className="text-gray-400">₹{sub.amount}/mo</div>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-6 sm:pl-0 pl-14">
                <div className="text-left sm:text-right">
                  <div className="text-sm text-gray-400">Save</div>
                  <div className="text-green-400 font-bold">₹{(sub.amount * 12).toLocaleString()}/year</div>
                </div>
                <div className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs font-medium uppercase tracking-wider">
                  {sub.usageFrequency === 'rarely' ? '🔴 Rarely Used' : '🟡 Sometimes'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky inside card summary */}
      <div className="absolute w-full bottom-0 left-0 bg-[#0a0a0f]/90 backdrop-blur-md border-t border-indigo-500/20 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <span className="text-white font-bold">{selectedIds.length}</span> <span className="text-gray-400">subscriptions selected</span>
          <div className="text-2xl font-black text-green-400 transition-all duration-300 transform">
            <span className="text-sm font-normal text-gray-400 mr-2">Total Savings:</span>
            ₹{totalCurrentYearly.toLocaleString()}/year
          </div>
        </div>
        <button 
          onClick={scrollToSimulator}
          disabled={selectedIds.length === 0}
          className={`px-6 py-3 rounded-xl font-bold transition-colors ${
            selectedIds.length > 0 
              ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-[#003824] shadow-lg shadow-green-500/20'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          View Savings Projection &rarr;
        </button>
      </div>

    </div>
  );
}
