import React from 'react';

export default function StatsBar({ totalMonthly, totalAnnual, subscriptionCount, potentialAnnualSavings }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1 */}
      <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-5 shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 group">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">💸</div>
          <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Monthly Spend</span>
        </div>
        <div className="text-3xl font-bold text-white">₹{totalMonthly?.toLocaleString()}</div>
      </div>

      {/* Card 2 */}
      <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-5 shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 group">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">🔄</div>
          <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Active Subs</span>
        </div>
        <div className="text-3xl font-bold text-white">{subscriptionCount}</div>
      </div>

      {/* Card 3 */}
      <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-5 shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 group">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">📅</div>
          <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Annual Spend</span>
        </div>
        <div className="text-3xl font-bold text-white">₹{totalAnnual?.toLocaleString()}</div>
      </div>

      {/* Card 4 */}
      <div className="bg-[#12121a] border border-green-500/30 rounded-2xl p-5 shadow-lg hover:shadow-green-500/20 transition-all duration-300 group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-green-500/20 transition-colors"></div>
        <div className="flex items-center gap-2 mb-2 relative z-10">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center">🟢</div>
          <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Potential Savings</span>
        </div>
        <div className="text-3xl font-bold text-green-400 relative z-10">₹{potentialAnnualSavings?.toLocaleString()} <span className="text-lg text-gray-500 font-normal">/yr</span></div>
      </div>
    </div>
  );
}
