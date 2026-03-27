import React from 'react';

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0f] text-white">
      <div className="w-16 h-16 border-4 border-[#1e1e2e] border-t-indigo-500 rounded-full animate-spin mb-4"></div>
      <p className="text-gray-400 text-lg">Analysing your subscriptions...</p>
    </div>
  );
}
