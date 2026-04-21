import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, Bell, Settings, Play, 
  RotateCcw, Activity, Cpu, Zap, 
  Maximize, ZoomIn, Box, 
  Target, Database, Terminal,
  ChevronRight
} from 'lucide-react';

const ResearchLab = () => {
  return (
    <div className="bg-[#f6f6f8] dark:bg-[#111521] font-sans text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      {/* Üst Navigasyon */}
      <header className="flex items-center justify-between border-b border-[#143db8]/10 bg-white/80 dark:bg-[#111521]/80 backdrop-blur-md px-6 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-[#143db8] rounded-lg text-white">
            <Brain size={24} />
          </div>
          <h2 className="text-lg font-bold tracking-tight">StrokePredict AI</h2>
        </div>
        <nav className="hidden md:flex items-center gap-9">
          <Link to="/panel" className="text-slate-500 hover:text-[#143db8] text-sm font-medium no-underline">Panel</Link>
          <Link to="/lab" className="text-[#143db8] text-sm font-bold border-b-2 border-[#143db8] pb-1 no-underline">Araştırma</Link>
          <Link to="/history" className="text-slate-500 hover:text-[#143db8] text-sm font-medium no-underline transition-colors">Arşiv</Link>
        </nav>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg bg-[#143db8]/10 text-[#143db8] hover:bg-[#143db8]/20 transition-colors">
            <Bell size={20} />
          </button>
          <div className="flex items-center gap-3 border-l pl-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold leading-none">Dr. İrem Aydoğdu</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Baş Araştırmacı</p>
            </div>
            <div className="size-10 rounded-full border-2 border-[#143db8]/20 overflow-hidden bg-[#143db8]/10">
              <img alt="Profil" className="w-full h-full object-cover" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Irem" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-[1600px] mx-auto w-full grid grid-cols-12 gap-6">
        {/* Sol Panel: Parametreler */}
        <aside className="col-span-12 lg:col-span-3 space-y-6">
          <div className="p-6 rounded-xl bg-white dark:bg-[#1e293b] shadow-sm border border-[#143db8]/5">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="text-[#143db8]" size={20} />
              <h3 className="font-bold text-lg">MBO Parametreleri</h3>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kuş Sayısı</label>
                <input className="w-full bg-slate-50 dark:bg-[#0f172a] border border-[#143db8]/10 rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#143db8]" type="number" defaultValue="50" />
                <p className="text-[10px] text-slate-400 leading-relaxed italic">Karmaşık tıbbi veri setleri için optimal sürü boyutu</p>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">İterasyon Sayısı</label>
                <input className="w-full bg-slate-50 dark:bg-[#0f172a] border border-[#143db8]/10 rounded-lg p-3 text-sm outline-none" type="number" defaultValue="1500" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Yakınsama Eşiği</label>
                <input className="w-full bg-slate-50 dark:bg-[#0f172a] border border-[#143db8]/10 rounded-lg p-3 text-sm outline-none" type="text" defaultValue="0.000125" />
              </div>
              <div className="pt-4 space-y-3">
                <button className="w-full py-3 bg-[#143db8] text-white font-bold rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20">
                  <Play size={18} /> Optimizasyonu Başlat
                </button>
                <button className="w-full py-3 bg-[#143db8]/10 text-[#143db8] font-bold rounded-lg hover:bg-[#143db8]/20 transition-all flex items-center justify-center gap-2">
                  <RotateCcw size={18} /> Simülasyonu Sıfırla
                </button>
              </div>
            </div>
          </div>

          {/* Performans Kartı */}
          <div className="p-6 rounded-xl bg-white dark:bg-[#1e293b] shadow-sm border border-[#143db8]/5">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="text-[#143db8]" size={20} />
              <h3 className="font-bold text-lg">Performans</h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black">
                  <span className="text-slate-400 uppercase">CPU Kullanımı</span>
                  <span className="text-[#143db8]">78%</span>
                </div>
                <div className="h-1.5 w-full bg-[#143db8]/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#143db8] w-[78%]"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0f172a] border border-[#143db8]/5">
                  <p className="text-[9px] text-slate-400 font-black uppercase">Hız</p>
                  <p className="text-sm font-bold mt-1 tracking-tight">2.4 GHz</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0f172a] border border-[#143db8]/5">
                  <p className="text-[9px] text-slate-400 font-black uppercase">Verimlilik</p>
                  <p className="text-sm font-bold mt-1 tracking-tight">94.2%</p>
                </div>
              </div>
              {/* Nöral Senkronizasyon Grafiği */}
              <div className="p-4 rounded-xl bg-[#143db8]/5 border border-[#143db8]/10">
                <div className="flex items-center gap-2 mb-3 text-[#143db8]">
                  <Zap size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Nöral Senkronizasyon</span>
                </div>
                <div className="flex gap-1 h-8 items-end">
                  {[40, 70, 100, 30, 60, 80, 20, 90, 50, 100].map((h, i) => (
                    <div key={i} className="flex-1 bg-[#143db8] rounded-full opacity-60" style={{ height: `${h}%` }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Orta Panel: Simülasyon Alanı */}
        <section className="col-span-12 lg:col-span-9 space-y-6">
          <div className="relative w-full aspect-video lg:aspect-auto lg:h-[600px] rounded-2xl overflow-hidden bg-[#041329] border border-[#143db8]/20 group">
            {/* HUD Overlay */}
            <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between z-20">
              <div className="flex justify-between items-start">
                <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center gap-3">
                  <div className="size-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <div>
                    <p className="text-[9px] text-slate-300 font-black uppercase tracking-[0.2em]">Canlı Algoritma Akışı</p>
                    <p className="text-white font-bold tracking-tight">Göç Eden Kuşlar Yol Bulma</p>
                  </div>
                </div>
                <div className="flex gap-3 pointer-events-auto">
                  <button className="bg-white/5 backdrop-blur-md size-10 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-all border border-white/10"><ZoomIn size={18}/></button>
                  <button className="bg-white/5 backdrop-blur-md size-10 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-all border border-white/10"><Box size={18}/></button>
                  <button className="bg-white/5 backdrop-blur-md size-10 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-all border border-white/10"><Maximize size={18}/></button>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
                  <p className="text-[9px] text-slate-300 font-black uppercase tracking-widest mb-2">Lider Kuş Pozisyonu</p>
                  <div className="grid grid-cols-3 gap-6">
                    <div><p className="text-[8px] text-slate-500 font-bold uppercase">X-Ekseni</p><p className="text-white text-xs font-mono font-bold">1.284.22</p></div>
                    <div><p className="text-[8px] text-slate-500 font-bold uppercase">Y-Ekseni</p><p className="text-white text-xs font-mono font-bold">-0.492.11</p></div>
                    <div><p className="text-[8px] text-slate-500 font-bold uppercase">Z-Ekseni</p><p className="text-white text-xs font-mono font-bold">4.102.85</p></div>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-md p-2 px-4 rounded-lg flex items-center gap-4 text-white text-[10px] font-mono border border-white/10">
                  <span className="flex items-center gap-1 opacity-70">FPS: 60.0</span>
                  <span className="flex items-center gap-1 opacity-70">GECİKME: 14MS</span>
                  <span className="text-emerald-400 font-bold">VERİ PKT: 1.2K/S</span>
                </div>
              </div>
            </div>

            {/* Simülasyon Arka Planı (SVG) */}
            <div className="absolute inset-0 opacity-40 flex items-center justify-center overflow-hidden">
               <svg className="w-full h-full p-20 scale-150 rotate-12" viewBox="0 0 800 500">
                 <path d="M100,250 Q400,50 700,250" fill="none" stroke="#143db8" strokeWidth="1" strokeDasharray="10 5" />
                 <path d="M100,250 Q400,450 700,250" fill="none" stroke="#143db8" strokeWidth="1" strokeDasharray="10 5" />
                 <circle cx="400" cy="250" r="100" fill="none" stroke="#143db8" strokeWidth="0.5" opacity="0.3" />
                 <circle cx="400" cy="250" r="12" fill="#143db8" className="animate-pulse" />
               </svg>
            </div>
          </div>

          {/* Alt Bilgi Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard icon={<Activity size={20}/>} label="Mevcut Nesil" value="842" trend="Yakınsanıyor (88%)" trendColor="text-emerald-500" />
            <InfoCard icon={<Target size={20}/>} label="En İyi Çözüm" value="0.00412" trend="4sn önce güncellendi" trendColor="text-slate-400" />
            <InfoCard icon={<Activity size={20}/>} label="Arama Hızı" value="14.2k" unit="işlem/s" trend="Optimal Verim" trendColor="text-[#143db8]" />
          </div>
        </section>
      </main>

      <footer className="mt-auto border-t border-[#143db8]/10 py-6 px-10 flex flex-col md:flex-row justify-between items-center bg-white dark:bg-[#111521] text-slate-500 text-[10px] font-bold uppercase tracking-widest">
        <p>© 2026 StrokePredict AI Araştırma Laboratuvarı</p>
        <div className="flex items-center gap-3">
          <div className="size-2 rounded-full bg-emerald-500"></div>
          <span className="text-slate-700 dark:text-slate-300">Sistem Durumu: Tüm Servisler Çalışıyor</span>
        </div>
      </footer>
    </div>
  );
};

const InfoCard = ({ icon, label, value, unit, trend, trendColor }) => (
  <div className="p-6 rounded-xl bg-white dark:bg-[#1e293b] shadow-sm border border-[#143db8]/5 flex items-start gap-4">
    <div className="p-3 bg-[#143db8]/10 rounded-lg text-[#143db8]">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
        {value} {unit && <span className="text-sm font-normal text-slate-400">{unit}</span>}
      </p>
      <p className={`text-[9px] font-bold mt-1 ${trendColor}`}>{trend}</p>
    </div>
  </div>
);

export default ResearchLab;