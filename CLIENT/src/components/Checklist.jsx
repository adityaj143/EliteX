import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TiltCard from './TiltCard';
import api from '../utils/api';

const PRELOADED = [
  { id: 1, name: "Netflix", emoji: "🎬", category: "Entertainment", suggestedAmount: 649 },
  { id: 2, name: "Prime Video", emoji: "📦", category: "Entertainment", suggestedAmount: 299 },
  { id: 3, name: "JioHotstar", emoji: "⭐", category: "Entertainment", suggestedAmount: 299 },
  { id: 4, name: "SonyLIV", emoji: "🎭", category: "Entertainment", suggestedAmount: 299 },
  { id: 6, name: "Zee5", emoji: "🍿", category: "Entertainment", suggestedAmount: 149 },
  { id: 7, name: "YouTube Premium", emoji: "▶️", category: "Entertainment", suggestedAmount: 189 },
  { id: 8, name: "Spotify Premium", emoji: "🎵", category: "Entertainment", suggestedAmount: 119 },
  { id: 9, name: "Swiggy One", emoji: "🍕", category: "Food", suggestedAmount: 149 },
  { id: 10, name: "Zomato Gold", emoji: "🍔", category: "Food", suggestedAmount: 149 },
  { id: 11, name: "JioFiber", emoji: "🌐", category: "Utilities", suggestedAmount: 999 },
  { id: 12, name: "Airtel Xstream", emoji: "📡", category: "Utilities", suggestedAmount: 899 },
  { id: 13, name: "Tata Power", emoji: "⚡", category: "Utilities", suggestedAmount: 1500 },
  { id: 14, name: "PlayStation Plus", emoji: "🎮", category: "Entertainment", suggestedAmount: 499 },
  { id: 15, name: "ChatGPT Plus", emoji: "🤖", category: "Software", suggestedAmount: 1950 }
];

const CATEGORIES = ["Entertainment", "Health", "Food", "Software", "Utilities", "Other"];
const FREQUENCIES = ["Rarely", "Sometimes", "Daily"];
const RANDOM_EMOJIS = ['💳', '💎', '🚀', '🔥', '✨', '⚡', '🌟', '📱', '💻', '🎮', '🎧', '🎬', '🏆', '🎯', '🧩'];

export default function Checklist() {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState(PRELOADED.map(sub => ({ ...sub, selected: false, amount: sub.suggestedAmount, usageFrequency: '' })));
  const [searchQuery, setSearchQuery] = useState('');
  const [customFormOpen, setCustomFormOpen] = useState(false);
  const [customData, setCustomData] = useState({ name: '', emoji: '💳', amount: '', category: 'Other', usageFrequency: '' });
  const [errorToast, setErrorToast] = useState('');

  const handleToggle = (id) => {
    setSubscriptions(subs => subs.map(sub => sub.id === id ? { ...sub, selected: !sub.selected } : sub));
  };

  const handleUpdate = (id, field, value) => {
    setSubscriptions(subs => subs.map(sub => sub.id === id ? { ...sub, [field]: value } : sub));
  };

  const addCustomSubscription = () => {
    if (!customData.name || !customData.amount || !customData.usageFrequency) {
      showError('Please fill name, amount, and frequency.');
      return;
    }
    const newSub = { 
      // eslint-disable-next-line react-hooks/purity
      id: Date.now(), 
      ...customData, 
      emoji: RANDOM_EMOJIS[Math.floor(Math.random() * RANDOM_EMOJIS.length)],
      amount: Number(customData.amount), 
      selected: true 
    };
    setSubscriptions([newSub, ...subscriptions]);
    setCustomData({ name: '', emoji: '💳', amount: '', category: 'Other', usageFrequency: '' });
    setCustomFormOpen(false);
  };

  const showError = (msg) => {
    setErrorToast(msg);
    setTimeout(() => setErrorToast(''), 4000);
  };

  const handleSubmit = async () => {
    const selected = subscriptions.filter(s => s.selected);
    if (selected.length === 0) {
      showError('Empty vault. Select at least one active subscription.');
      return;
    }
    const invalid = selected.find(s => !s.amount || !s.usageFrequency);
    if (invalid) {
      showError(`Complete setup (amount & usage) for ${invalid.name}`);
      return;
    }
    const payload = selected.map(s => ({
      merchantName: s.name,
      amount: Number(s.amount),
      category: s.category,
      usageFrequency: s.usageFrequency.toLowerCase(),
      emoji: s.emoji
    }));

    const sessionId = localStorage.getItem('slasher_session_id');
    try {
      await api.post('/api/subscriptions/manual', { sessionId, subscriptions: payload });
      navigate('/dashboard');
    } catch (err) {
      showError('Network error. Failed to process vault data.');
    }
  };

  const filteredSubs = subscriptions.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const selectedCount = subscriptions.filter(s => s.selected).length;
  const totalMonthly = subscriptions.filter(s => s.selected).reduce((acc, s) => acc + (Number(s.amount) || 0), 0);

  // Sovereign Vault Styling Tokens (from Stitch MCP)
  const bgBase = "bg-[#0b1326]";
  const surfaceLow = "bg-[#131b2e] border-[#3c4a42]";
  const textSurface = "text-[#dae2fd]";
  const accentPrimary = "#4edea3";
  const neonGlow = "shadow-[0_0_15px_rgba(78,222,163,0.4)]";

  return (
    <div className={`relative pb-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans ${bgBase}`}>
      
      {/* Stitch Ambient Background Glows */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#10B981]/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      <div className="text-center mb-16 animate-fade-in relative z-10 pt-10">
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 text-[#4edea3] text-sm font-bold mb-6 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span> Sovereign Vault Status
        </div>
        <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black ${textSurface} mb-6 drop-shadow-xl tracking-tight`}>
          Vault Checklist Dashboard.
        </h2>
        <p className="text-[#bbcabf] text-xl font-medium max-w-2xl mx-auto leading-relaxed">
          Select digital assets draining your resources. Curation and encryption initialized.
        </p>

        {/* Stitch Screen Suggestion: Search Bar */}
        <div className="max-w-xl mx-auto mt-10 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-[#86948a]">🔍</span>
          <input 
            type="text"
            placeholder="Search subscriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full py-4 pl-12 pr-6 rounded-2xl ${surfaceLow} border focus:border-[#4edea3] focus:${neonGlow} ${textSurface} outline-none transition-all placeholder-[#86948a] font-bold shadow-lg`}
          />
        </div>
      </div>

      {errorToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#060e20]/90 border border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)] text-[#ffb4ab] px-8 py-4 rounded-2xl font-bold backdrop-blur-xl animate-slide-up flex items-center gap-3">
          <span className="text-xl">⚠️</span> {errorToast}
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16 relative z-10">
        
        {/* Custom Input Block */}
        <TiltCard maxTilt={8} className="col-span-1 md:col-span-2 lg:col-span-1 h-full">
          {!customFormOpen ? (
            <div 
              onClick={() => setCustomFormOpen(true)}
              className="bg-gradient-to-b from-[#131b2e] to-[#0b1326] border-2 border-dashed border-[#10B981]/40 hover:border-[#4edea3] cursor-pointer rounded-[2rem] flex flex-col items-center justify-center p-8 transition-all h-full shadow-lg group min-h-[160px]"
            >
              <div className={`w-16 h-16 bg-[#10B981]/10 rounded-2xl flex items-center justify-center text-[#4edea3] mb-4 text-3xl group-hover:scale-110 shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all`}>
                +
              </div>
              <p className={`font-bold text-lg ${textSurface} transition-colors`}>Add Unlisted</p>
            </div>
          ) : (
            <div className={`bg-[#060e20] border border-[#4edea3] rounded-[2rem] p-6 ${neonGlow} flex flex-col gap-5 h-full relative`}>
              <button 
                onClick={() => setCustomFormOpen(false)} 
                className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                &times;
              </button>
              
              <h3 className={`font-black text-xl ${textSurface} mb-2 flex items-center gap-2`}>
                <span className="text-[#4edea3]">⚡</span> Map Entity
              </h3>
              
              <div className="flex flex-col gap-3">
                <div className="w-full">
                  <div className="text-xs text-[#86948a] uppercase font-bold mb-1">Entity Name</div>
                  <input type="text" placeholder="Custom..." className={`w-full bg-[#131b2e] border border-[#3c4a42] focus:border-[#4edea3] rounded-xl p-3 ${textSurface} outline-none font-bold transition-colors shadow-inner`} value={customData.name} onChange={e => setCustomData({...customData, name: e.target.value})} />
                </div>
                
                <div className="w-full">
                  <div className="text-xs text-[#86948a] uppercase font-bold mb-1">₹ / month</div>
                  <input type="number" placeholder="0" className={`w-full bg-[#131b2e] border border-[#3c4a42] focus:border-[#4edea3] rounded-xl p-3 ${textSurface} outline-none font-mono font-bold transition-colors shadow-inner`} value={customData.amount} onChange={e => setCustomData({...customData, amount: e.target.value})} />
                </div>
                
                <div className="w-full">
                  <div className="text-xs text-[#86948a] uppercase font-bold mb-1">Sector</div>
                  <select className={`w-full bg-[#131b2e] border border-[#3c4a42] focus:border-[#4edea3] rounded-xl p-3 ${textSurface} outline-none font-semibold transition-colors shadow-inner cursor-pointer appearance-none`} value={customData.category} onChange={e => setCustomData({...customData, category: e.target.value})}>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              <div className="mt-1">
                <div className="text-xs text-[#86948a] uppercase font-bold mb-1.5">Usage Telemetry</div>
                <div className="flex flex-col gap-2">
                  {FREQUENCIES.map(freq => (
                    <button
                      key={freq}
                      onClick={() => setCustomData({...customData, usageFrequency: freq})}
                      className={`w-full py-2.5 px-2 rounded-xl font-bold border text-xs transition-colors ${
                        customData.usageFrequency === freq ? `bg-[#10b981] border-[#4edea3] text-[#002113] ${neonGlow}` : 'bg-[#131b2e] border-[#3c4a42] text-[#dae2fd]'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={addCustomSubscription} className={`mt-2 w-full bg-gradient-to-br from-[#4edea3] to-[#10b981] hover:brightness-110 text-[#002113] font-black py-4 rounded-xl transition-all ${neonGlow}`}>
                Inject Asset
              </button>
            </div>
          )}
        </TiltCard>

        {/* Existing Subscriptions Grid with Search Filter applied */}
        {filteredSubs.map((sub, i) => (
          <TiltCard key={sub.id} maxTilt={8} className="h-full">
            <div 
              className={`h-full bg-gradient-to-b from-[#131b2e] to-[#0b1326] border rounded-[2rem] overflow-hidden transition-all duration-300 shadow-2xl flex flex-col ${
                sub.selected ? `border-[#4edea3] ${neonGlow}` : `border-[#3c4a42]`
              }`}
            >
              {/* Header Card / Toggle Area */}
              <div 
                className="p-6 cursor-pointer flex flex-col items-start hover:bg-white/5 transition-colors relative"
                onClick={() => handleToggle(sub.id)}
              >
                {/* Absolute Check Toggle */}
                <div className={`absolute top-6 right-6 w-8 h-8 shrink-0 rounded-full border-[2px] flex items-center justify-center transition-all duration-300 ${
                  sub.selected ? `bg-[#4edea3] border-[#4edea3] scale-110 shadow-[0_0_15px_rgba(78,222,163,0.4)]` : 'border-[#86948a] bg-[#0b1326]'
                }`}>
                  {sub.selected && <svg className="w-5 h-5 text-[#002113]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>}
                </div>

                {/* Icon */}
                <div className={`text-4xl bg-[#060e20] border ${sub.selected ? 'border-[#4edea3]' : 'border-[#3c4a42]'} w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner mb-4`}>
                  {sub.emoji}
                </div>

                {/* Text Block */}
                <div className="w-full pr-10">
                  <div className="text-[10px] uppercase font-black tracking-widest text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded inline-block mb-1.5 border border-[#10b981]/20">
                    {sub.category}
                  </div>
                  <h3 className={`font-black text-xl ${textSurface} tracking-tight leading-snug break-words`}>{sub.name}</h3>
                  <p className="text-sm font-bold text-[#86948a] mt-1 uppercase tracking-wide">
                    Avg: ₹{sub.suggestedAmount || sub.amount}/MO
                  </p>
                </div>
              </div>

              {/* Expandable Configuration Form */}
              <div 
                className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  sub.selected ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 pt-4 border-t border-[#3c4a42]/50 bg-[#060e20]/50 flex flex-col gap-5 h-full">
                  
                  <div>
                    <label className="block text-xs text-[#86948a] mb-2 uppercase tracking-widest font-bold">Monthly Burn (₹)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86948a] font-black">₹</span>
                      <input 
                        type="number" 
                        value={sub.amount} 
                        onChange={e => handleUpdate(sub.id, 'amount', e.target.value)}
                        className={`w-full bg-[#131b2e] border border-[#3c4a42] focus:border-[#4edea3] rounded-xl py-3 pl-10 pr-4 ${textSurface} font-mono font-bold outline-none transition-colors shadow-inner`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#86948a] mb-2 uppercase tracking-widest font-bold">Usage</label>
                    <div className="flex flex-col gap-2">
                      {FREQUENCIES.map(freq => (
                        <button
                          key={freq}
                          onClick={() => handleUpdate(sub.id, 'usageFrequency', freq)}
                          className={`w-full py-2.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                            sub.usageFrequency === freq 
                              ? 'bg-[#10b981] border-[#4edea3] text-[#002113] shadow-[0_0_15px_rgba(78,222,163,0.4)]' 
                              : 'bg-[#131b2e] border-[#3c4a42] text-[#dae2fd] hover:border-[#4edea3]'
                          }`}
                        >
                          {freq}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#86948a] mb-2 uppercase tracking-widest font-bold">Sector Category</label>
                    <div className="relative">
                      <select
                        value={sub.category}
                        onChange={e => handleUpdate(sub.id, 'category', e.target.value)}
                        className={`w-full bg-[#131b2e] border border-[#3c4a42] focus:border-[#4edea3] rounded-xl py-3 pl-4 pr-10 ${textSurface} font-bold outline-none transition-colors appearance-none shadow-inner cursor-pointer`}
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat} className="font-semibold">{cat}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#86948a]">▼</div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </TiltCard>
        ))}
        {filteredSubs.length === 0 && (
          <div className="col-span-full py-20 text-center text-[#86948a] font-bold text-xl">
             No assets matched your query in the Sovereign Vault.
          </div>
        )}
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-6 pointer-events-none">
        <div className={`max-w-4xl mx-auto bg-[#0b1326]/90 backdrop-blur-2xl border border-[#3c4a42] p-4 lg:p-5 rounded-[2rem] shadow-[0_-15px_60px_rgba(11,19,38,0.9)] flex flex-col sm:flex-row justify-between items-center gap-6 pointer-events-auto transform transition-transform animate-slide-up`}>
          
          <div className="flex items-center gap-6 ml-2">
            <div className="relative">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="28" fill="transparent" stroke="#3c4a42" strokeWidth="6" />
                <circle cx="32" cy="32" r="28" fill="transparent" stroke="#4edea3" strokeWidth="6" strokeDasharray={175} strokeDashoffset={175 - (selectedCount/15)*175} className="transition-all duration-1000 delay-150" />
              </svg>
              <div className={`absolute inset-0 flex items-center justify-center font-black text-xl ${textSurface}`}>
                {selectedCount}
              </div>
            </div>
            <div>
              <div className="text-[#86948a] font-bold text-xs uppercase tracking-widest mb-1">Total Vault Allocation</div>
              <div className="text-2xl sm:text-3xl font-black text-[#4edea3] flex items-baseline gap-1 drop-shadow-md">
                ₹{totalMonthly.toLocaleString()} <span className="text-sm text-[#86948a] font-bold uppercase tracking-wider">/mo</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleSubmit}
            className={`w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-[#4edea3] to-[#10B981] text-[#002113] hover:brightness-110 font-black rounded-2xl ${neonGlow} transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 shrink-0`}
          >
             Optimize Vault <span className="text-xl">🛡️</span>
          </button>
        </div>
      </div>
    </div>
  );
}
