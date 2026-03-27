import React from 'react';

const EMOJI_MAP = {
  'netflix': '🎬',
  'spotify': '🎵',
  'prime': '📦',
  'amazon': '📦',
  'hotstar': '⭐',
  'jio': '🎥',
  'youtube': '▶️',
  'apple': '🍎',
  'gym': '💪',
  'swiggy': '🛒',
  'zepto': '⚡',
  'microsoft': '💼',
  'canva': '🎨',
  'airtel': '📡',
  'uber': '🚗',
  'adobe': '✏️',
  'starbucks': '☕'
};

const getEmoji = (name, providedEmoji) => {
  if (providedEmoji) return providedEmoji;
  const lowerName = name.toLowerCase();
  for (const [key, val] of Object.entries(EMOJI_MAP)) {
    if (lowerName.includes(key)) return val;
  }
  return '💳'; // Fallback
};

const CAT_COLORS = {
  Entertainment: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  Utilities: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Health: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Software: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Food: 'bg-red-500/20 text-red-400 border-red-500/30',
  Other: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
};

export default function SubscriptionCard({ merchantName, amount, category, usageFrequency, isRecurring, emoji }) {
  const isRare = usageFrequency?.toLowerCase() === 'rarely';
  const freqBadgeMap = {
    rarely: { icon: '🔴', text: 'Rarely Used', style: 'text-red-400 bg-red-400/10 border border-red-400/20' },
    sometimes: { icon: '🟡', text: 'Sometimes', style: 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/20' },
    daily: { icon: '🟢', text: 'Daily', style: 'text-green-400 bg-green-400/10 border border-green-400/20' }
  };
  const freq = freqBadgeMap[usageFrequency?.toLowerCase()] || freqBadgeMap.sometimes;
  const catColor = CAT_COLORS[category] || CAT_COLORS.Other;
  
  return (
    <div className={`bg-[#12121a] rounded-2xl p-5 shadow-lg group transition-all duration-300 ${
      isRare ? 'border border-[#ef444455] hover:border-[#ef4444] hover:shadow-[#ef444422]' : 'border border-[#1e1e2e] hover:border-indigo-500 hover:shadow-indigo-500/10'
    }`}>
      
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-[#1e1e2e] rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
          {getEmoji(merchantName, emoji)}
        </div>
        <div className={`px-2 py-1 rounded-md text-xs font-semibold border ${catColor}`}>
          {category || 'Other'}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-bold text-lg text-white mb-1 truncate" title={merchantName}>{merchantName}</h4>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-white">₹{Number(amount).toLocaleString()}</span>
          <span className="text-gray-500 text-sm">/mo</span>
        </div>
        <div className="text-sm text-gray-500 mt-1">₹{(Number(amount) * 12).toLocaleString()}/year</div>
      </div>

      <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#1e1e2e]">
        <div className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${freq.style}`}>
          <span>{freq.icon}</span> <span>{freq.text}</span>
        </div>
        
        {isRecurring === false && (
          <span className="text-xs text-gray-500 italic">One-time</span>
        )}
      </div>

    </div>
  );
}
