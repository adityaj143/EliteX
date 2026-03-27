import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleStartOver = () => {
    localStorage.removeItem('slasher_session_id');
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0a0a0f] border-b border-[#1e1e2e] px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
        <span className="text-2xl">💰</span>
        <span className="text-white font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
          Subscription Slasher
        </span>
      </div>
      <button 
        onClick={handleStartOver}
        className="px-4 py-2 bg-[#12121a] hover:bg-[#1e1e2e] border border-[#1e1e2e] text-gray-400 hover:text-white rounded-xl text-sm font-medium transition-colors"
      >
        Start Over
      </button>
    </nav>
  );
}
