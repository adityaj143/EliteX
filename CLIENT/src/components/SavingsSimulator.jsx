import React from 'react';

export default function SavingsSimulator({ monthlySavings = 0 }) {
  const isZero = monthlySavings <= 0;
  
  // Calculate equivalent free netflix months
  const netflixCost = 649;
  const netflixMonths = Math.floor((monthlySavings * 12) / netflixCost);

  return (
    <div id="savings-simulator" className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-green-500/10 transition-all duration-300 mb-8">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <span>📈</span> Savings Simulator
      </h2>

      {isZero ? (
        <div className="p-8 border border-dashed border-[#1e1e2e] rounded-xl text-center text-gray-400">
          Select subscriptions above to see your projected savings
        </div>
      ) : (
        <div className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-[#12121a] to-[#12241b] border border-green-500/30 rounded-xl p-6 relative overflow-hidden group">
              <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
              </div>
              <h3 className="text-gray-400 font-semibold mb-1 uppercase tracking-wider text-sm">1 Year</h3>
              <div className="text-3xl font-black text-white">₹{(monthlySavings * 12).toLocaleString()}</div>
            </div>

            <div className="bg-gradient-to-br from-[#12121a] to-[#153424] border border-green-500/30 rounded-xl p-6 relative overflow-hidden group shadow-lg shadow-green-500/5 cursor-pointer transform hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
              </div>
              <h3 className="text-green-400/80 font-semibold mb-1 uppercase tracking-wider text-sm">3 Years</h3>
              <div className="text-4xl font-black text-green-400">₹{(monthlySavings * 36).toLocaleString()}</div>
            </div>

            <div className="bg-gradient-to-br from-[#12121a] to-[#16422b] border border-green-500/40 rounded-xl p-6 relative overflow-hidden group">
              <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
              </div>
              <h3 className="text-green-300 font-semibold mb-1 uppercase tracking-wider text-sm">5 Years</h3>
              <div className="text-3xl font-black text-white">₹{(monthlySavings * 60).toLocaleString()}</div>
            </div>
          </div>

          {netflixMonths > 0 && (
            <div className="text-center p-4 bg-[#1e1e2e]/50 text-indigo-300 rounded-xl animate-slide-up border border-[#1e1e2e]">
              <span className="text-xl inline-block mr-2">🎯</span>
              <strong>Motivation:</strong> That's roughly <strong>{netflixMonths} months</strong> of a standard Netflix subscription for free!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
