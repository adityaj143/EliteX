import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const TiltCard = ({ children, className = '' }) => {
  const ref = useRef(null);
  
  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -15; // 15 degrees max tilt
    const rotateY = ((x - cx) / cx) * 15;
    
    ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    ref.current.style.boxShadow = `${-rotateY}px ${rotateX}px 40px rgba(99, 102, 241, 0.2)`;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    ref.current.style.boxShadow = `0px 10px 30px rgba(0, 0, 0, 0.5)`;
  };

  return (
    <div 
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-all duration-200 ease-out will-change-transform ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
};

export default function Landing() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectMethod = async (method) => {
    const sessionId = localStorage.getItem('slasher_session_id');
    try {
      if (!sessionId) {
        const res = await api.post('/api/session/create', { inputMethod: method });
        localStorage.setItem('slasher_session_id', res.data.sessionId);
      } else {
        await api.post('/api/session/create', { inputMethod: method, sessionId });
      }
    } catch (error) {
      console.error('Session update failed', error);
    }
    navigate(`/input?method=${method}`);
  };

  return (
    <div className="bg-[#050508] min-h-screen text-white overflow-hidden selection:bg-indigo-500/30 font-sans">
      
      {/* Dynamic Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrollY > 50 ? 'bg-[#050508]/80 backdrop-blur-xl border-b border-[#1e1e2e] py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <span className="text-3xl filter drop-shadow-[0_0_15px_rgba(99,102,241,0.6)] group-hover:scale-110 transition-transform">💰</span>
            <span className="text-2xl font-black tracking-tight text-white drop-shadow-md">
              Sub<span className="text-indigo-500">Slasher</span>
            </span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-bold text-gray-400">
             <a href="#features" className="hover:text-white transition-colors">Features</a>
             <a href="#demo" className="hover:text-white transition-colors">Live Demo</a>
             <a href="#testimonials" className="hover:text-white transition-colors">Reviews</a>
             <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>
          <div className="flex gap-4">
            <button onClick={() => handleSelectMethod('checklist')} className="text-sm font-black bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2.5 rounded-full hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all hover:scale-105">
              Get Started Free
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Parallax */}
      <section className="relative pt-32 pb-40 lg:pt-56 lg:pb-64 flex items-center justify-center min-h-screen perspective-1000">
        
        {/* Dynamic Background Grid */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        ></div>

        {/* Ambient Meshes */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>

        {/* 3D Floating Elements responding to scroll */}
        <div 
          className="hidden lg:block absolute z-0 transition-transform duration-100 ease-out opacity-60"
          style={{ transform: `translate3d(-35vw, ${scrollY * -0.4 + 100}px, -200px) rotate(-15deg)` }}
        >
          <TiltCard className="w-64 bg-gradient-to-br from-[#12121a] to-[#0a0a0f] rounded-3xl border border-indigo-500/20 p-6 shadow-2xl backdrop-blur-md">
            <div className="h-2 w-16 bg-gray-700 rounded-full mb-6"></div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 text-2xl">🎬</div>
              <div>
                <div className="text-white font-bold">Netflix</div>
                <div className="text-xs text-gray-500">Last charged 2d ago</div>
              </div>
            </div>
            <div className="text-right mt-4 text-red-400 font-black text-2xl">- ₹649</div>
          </TiltCard>
        </div>

        <div 
          className="hidden lg:block absolute z-0 transition-transform duration-100 ease-out opacity-80"
          style={{ transform: `translate3d(35vw, ${scrollY * -0.6 + 200}px, -100px) rotate(12deg)` }}
        >
          <TiltCard className="w-60 bg-gradient-to-b from-[#12121a] to-[#050508] rounded-3xl border border-green-500/30 p-6 shadow-[0_0_40px_rgba(16,185,129,0.15)] backdrop-blur-md">
            <div className="flex justify-between items-start mb-6">
              <div className="text-4xl text-green-400">⚡</div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-green-400 bg-green-500/10 px-2 py-1 rounded">Saved</div>
            </div>
            <div className="text-gray-400 text-sm mb-1">Zepto Pass Cancelled</div>
            <div className="text-2xl font-black text-white">+ ₹1,188 /yr</div>
          </TiltCard>
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-bold mb-8 backdrop-blur-md cursor-default pointer-events-none hover:bg-indigo-500/20 transition-colors">
             <span className="relative flex h-3 w-3">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
             </span>
            Stop the wealth drain
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter mb-8 leading-[1.1]">
            Cancel <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500">Ghost Subs.</span><br/>
            Keep Your Cash.
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-14 font-medium leading-relaxed">
            Upload your transactions or select what you pay for. We render a deeply optimized financial 3D dashboard showing exactly where you're bleeding money.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <TiltCard>
              <button 
                onClick={() => handleSelectMethod('csv')}
                className="group px-8 py-5 rounded-2xl bg-white text-black font-black text-lg w-full sm:w-auto transition-transform flex items-center justify-center gap-3 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative z-10">📁 Import Bank CSV</span>
              </button>
            </TiltCard>
            <TiltCard>
              <button 
                onClick={() => handleSelectMethod('checklist')}
                className="group px-8 py-5 rounded-2xl bg-[#12121a] border border-[#1e1e2e] hover:border-indigo-500 text-white font-black text-lg w-full sm:w-auto transition-all flex items-center justify-center gap-3 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative z-10 text-indigo-400">📋 Use Manual Checklist</span>
              </button>
            </TiltCard>
          </div>
          
          <p className="mt-8 text-sm font-semibold text-gray-500 tracking-wide">NO LOGIN REQUIRED &middot; 100% PRIVATE &middot; INSTANT ANALYSIS</p>
        </div>
      </section>

      {/* 3D Immersive Features Section */}
      <section id="features" className="py-32 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-5xl font-black mb-6">Built for Financial Dominance</h2>
            <p className="text-xl text-gray-400">Experience a high-end dashboard engine that automatically slices through your raw transaction logs to build interactive spending models.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Deep Pattern Algorithms", desc: "Recognizes fragmented billing names like 'NF_PAY_INTL' and categorizes them automatically to exact services.", icon: "🧠" },
              { title: "AI Compounding Intel", desc: "Instantly simulates 1YR, 3YR, and 5YR burn rates of your dormant subscriptions so you see the real cost.", icon: "📈" },
              { title: "Immediate Output", desc: "No signups, no bank OAuth risk. Just drop an exported CSV or pick from our library and view your tailored 3D dashboard.", icon: "⚡" }
            ].map((ft, i) => (
              <TiltCard key={i} className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-[2rem] p-10 hover:border-indigo-500/50 group h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors duration-500"></div>
                <div className="text-5xl mb-8 transform group-hover:-translate-y-2 transition-transform duration-300 relative z-10">{ft.icon}</div>
                <h3 className="text-2xl font-black text-white mb-4 relative z-10">{ft.title}</h3>
                <p className="text-gray-400 leading-relaxed font-medium relative z-10">{ft.desc}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive 3D Chart Demo */}
      <section id="demo" className="py-32 relative bg-[#12121a] border-y border-[#1e1e2e] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-8">
            <h2 className="text-5xl font-black leading-tight">Interact with your data like never before.</h2>
            <p className="text-xl text-gray-400 leading-relaxed">Hover over the simulation to the right. See how small recurring payments balloon into massive wealth leakage over 5 years. Stop funding what you don't use.</p>
            
            <TiltCard className="inline-block">
              <button onClick={() => window.scrollTo(0,0)} className="px-8 py-4 bg-[#1e1e2e] border border-gray-700 hover:border-white text-white rounded-xl font-bold transition-colors">
                Run Simulation &rarr;
              </button>
            </TiltCard>
          </div>

          <TiltCard className="relative h-[450px] bg-[#050508] border border-indigo-500/30 rounded-[3rem] p-10 shadow-[0_0_50px_rgba(99,102,241,0.15)] flex flex-col justify-end">
             {/* Mock 3D chart */}
             <div className="absolute top-10 left-10">
               <div className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-1">5 Year Compound Loss</div>
               <div className="text-5xl font-black text-red-500">₹{(Math.min(950000, 150000 + scrollY * 200)).toLocaleString()}</div>
             </div>
             <div className="flex items-end gap-4 h-56 w-full mt-auto relative z-10">
                {[15, 25, 40, 60, 100].map((h, i) => (
                  <div key={i} className="flex-1 bg-[#1e1e2e] rounded-xl relative group">
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-red-600 to-red-400 rounded-xl transition-all duration-700 ease-out" style={{ height: `${h}%` }}></div>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-black font-black py-2 px-4 rounded-lg text-sm transition-opacity shadow-xl">
                      Year {i+1}
                    </div>
                  </div>
                ))}
             </div>
          </TiltCard>

        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-4xl md:text-5xl font-black mb-20">Saved <span className="text-green-400">millions</span> in ghost fees.</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {name: 'Aditi M.', handle: '@adititech', quote: 'Found out I was paying ₹649 for Netflix and ₹299 for Hotstar, and hadn\'t watched either in 4 months. Instant cancel.'},
              {name: 'Rahul K.', handle: '@rahulcodes', quote: 'The SVG charts and compounding simulation legitimately motivated me to cancel my unused Adobe sub.'},
              {name: 'Pooja S.', handle: '@poojadesigns', quote: 'No signup wall. Dropped my bank CSV, saw the 3D breakdown instantly, and realized how much food delivery was costing me.'}
            ].map((t, i) => (
              <TiltCard key={i} className="bg-[#12121a] border border-[#1e1e2e] p-8 rounded-3xl">
                <div className="text-indigo-400 text-4xl mb-6">"</div>
                <p className="text-lg text-gray-300 mb-8 font-medium">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center font-bold">{t.name[0]}</div>
                  <div>
                    <div className="font-bold text-white">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.handle}</div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-32 bg-[#12121a] border-t border-[#1e1e2e]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-black mb-16 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {q: "Is it really free? Do I need to login?", a: "100% free and no login required whatsoever. Your data is analyzed entirely within your session context and disappears when you leave."},
              {q: "How does the CSV scanner work?", a: "Our parsing engine natively runs through your rows checking against a massive library of 500+ common merchant names to locate billing traps."},
              {q: "Is my bank data safe?", a: "Yes. You don't connect your bank via OAuth. You just upload an offline file, and the analysis is done transiently on the server without storing your history long-term."}
            ].map((faq, i) => (
              <div key={i} className="bg-[#050508] border border-[#1e1e2e] p-8 rounded-2xl hover:border-indigo-500/30 transition-colors">
                <h4 className="text-xl font-bold text-white mb-3">{faq.q}</h4>
                <p className="text-gray-400 font-medium leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ultra Footer */}
      <footer className="bg-black pt-24 pb-12 border-t border-[#1e1e2e] relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-indigo-500/10 rounded-[100%] blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 text-center md:text-left">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                <span className="text-4xl">💰</span>
                <span className="text-3xl font-black text-white tracking-tight">
                  Sub<span className="text-indigo-500">Slasher</span>
                </span>
              </div>
              <p className="text-gray-400 max-w-md mx-auto md:mx-0 mb-8 font-medium leading-relaxed">
                The most advanced, privacy-first subscription tracking dashboard built to intercept and eliminate your ghost recurring charges.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Features</h4>
              <ul className="space-y-4 text-gray-500 font-semibold">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">CSV Machine Learning</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">3D Data Dashboard</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Compounding Engine</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Legal</h4>
              <ul className="space-y-4 text-gray-500 font-semibold">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-[#1e1e2e] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-bold text-gray-600">
            <p>&copy; {new Date().getFullYear()} SubSlasher Tech. All rights reserved.</p>
            <p className="flex items-center gap-2">Designed with maximum performance <span className="text-indigo-500">⚡</span></p>
          </div>
        </div>
      </footer>

    </div>
  );
}
