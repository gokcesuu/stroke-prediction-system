import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, User, Bell, Settings } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="bg-[#041329] border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo Bölümü */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#adc6ff] rounded-lg flex items-center justify-center text-[#002e69]">
            <Shield size={20} fill="currentColor" />
          </div>
          <h1 className="text-xl font-black tracking-tighter text-[#adc6ff] font-sans">
  StrokePredict<span className="text-white">AI</span>
</h1>
        </div>

        {/* Akıllı Menü - Alt çizgi karmaşasını bu çözer */}
        <nav className="flex gap-8">
          {[
            { name: 'Anasayfa', path: '/landing' },
            { name: 'Hasta Geçmişi', path: '/history' },
            { name: 'Analiz Paneli', path: '/analysis' },
            { name: 'Dokümantasyon', path: '/docs' },
          ].map((item) => (
            // NavLink'lerin olduğu döngüyü şu sınıflarla güncelle:
<NavLink
  key={item.path}
  to={item.path}
  className={({ isActive }) =>
    `text-[13px] font-black uppercase tracking-[0.15em] transition-all duration-300 pb-1 ${
      isActive 
        ? "text-[#adc6ff] border-b-2 border-[#adc6ff]" 
        : "text-slate-400 hover:text-white"
    }`
  }
>
  {item.name}
</NavLink>
          ))}
        </nav>

        {/* Sağ İkonlar */}
        <div className="flex items-center gap-5">
          <Bell size={18} className="text-slate-400 hover:text-white cursor-pointer" />
          <Settings size={18} className="text-slate-400 hover:text-white cursor-pointer" />
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
             <User size={16} className="text-slate-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;