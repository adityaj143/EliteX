import React from 'react';

export default function HealthScore({ score, label }) {
  // Determine color and description based on score
  let color = '#ef4444'; // default red
  let description = "Immediate action recommended — too many unused subscriptions.";
  
  if (score >= 80) {
    color = '#10b981'; // green
    description = "Great job! Your subscriptions are well managed.";
  } else if (score >= 60) {
    color = '#eab308'; // yellow
    description = "A few subscriptions could be reviewed.";
  } else if (score >= 40) {
    color = '#f97316'; // orange
    description = "Several rarely-used subscriptions are draining your wallet.";
  }

  // Calculate SVG stroke offset for the circle
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-8 shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col items-center justify-center text-center">
      <h3 className="text-xl font-bold text-white mb-6">Financial Health Score</h3>
      
      <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
        {/* Background Circle */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
          <circle 
            cx="70" cy="70" r={radius} 
            fill="transparent" 
            stroke="#1e1e2e" 
            strokeWidth="12" 
          />
          {/* Progress Circle */}
          <circle 
            cx="70" cy="70" r={radius} 
            fill="transparent" 
            stroke={color} 
            strokeWidth="12" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Inner Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold text-white">{score}</span>
          <span className="text-gray-500 text-sm font-medium">/100</span>
        </div>
      </div>

      <div 
        className="px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide mb-3"
        style={{ color, backgroundColor: `${color}1A` }} /* 1A is 10% opacity hex */
      >
        {label}
      </div>
      
      <p className="text-gray-400 max-w-sm">
        {description}
      </p>
    </div>
  );
}
