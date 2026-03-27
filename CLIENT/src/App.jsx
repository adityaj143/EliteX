import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Input from './pages/Input';
import Dashboard from './pages/Dashboard';
import api from './utils/api';

function App() {
  useEffect(() => {
    const initSession = async () => {
      const sessionId = localStorage.getItem('slasher_session_id');
      if (!sessionId) {
        try {
          const res = await api.post('/api/session/create', { inputMethod: 'checklist' });
          if (res.data?.sessionId) {
            localStorage.setItem('slasher_session_id', res.data.sessionId);
          }
        } catch (error) {
          console.error('Failed to create session on app load', error);
        }
      }
    };
    initSession();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/input" element={<Input />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;