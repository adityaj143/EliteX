import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Checklist from '../components/Checklist';
import CSVUpload from '../components/CSVUpload';
import api from '../utils/api';

export default function Input() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [method, setMethod] = useState(searchParams.get('method') || 'checklist');

  useEffect(() => {
    const queryMethod = searchParams.get('method');
    if (queryMethod && queryMethod !== method) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMethod(queryMethod);
    }
  }, [searchParams]);

  const handleTabChange = async (newMethod) => {
    setMethod(newMethod);
    setSearchParams({ method: newMethod });
    const sessionId = localStorage.getItem('slasher_session_id');
    try {
      if (sessionId) {
        await api.post('/api/session/create', { inputMethod: newMethod, sessionId });
      } else {
        const res = await api.post('/api/session/create', { inputMethod: newMethod });
        localStorage.setItem('slasher_session_id', res.data.sessionId);
      }
    } catch (error) {
      console.error('Failed to update session method', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-20 pb-24">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4">
        {/* Tab Switcher */}
        <div className="flex p-1 bg-[#12121a] border border-[#1e1e2e] rounded-xl mb-8 w-fit mx-auto shadow-lg">
          <button
            onClick={() => handleTabChange('checklist')}
            className={`px-6 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
              method === 'checklist' ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            📋 Manual Checklist
          </button>
          <button
            onClick={() => handleTabChange('csv')}
            className={`px-6 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
              method === 'csv' ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            📁 Upload CSV
          </button>
        </div>

        {/* Content Area */}
        <div className="animate-fade-in animate-slide-up">
          {method === 'checklist' ? <Checklist /> : <CSVUpload />}
        </div>
      </div>
    </div>
  );
}
