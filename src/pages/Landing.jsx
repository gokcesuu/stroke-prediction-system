import { Link } from 'react-router-dom';
import React from 'react';
import { 
  Bell, Settings, Zap, ArrowRight, Activity, 
  ShieldCheck, Gauge, MousePointerClick, Share2, Mail 
} from 'lucide-react';

const Landing = () => {
  return (
    <div className="bg-[#041329] text-[#d6e3ff] font-sans selection:bg-[#adc6ff]/30 min-h-screen flex flex-col overflow-x-hidden">
      {/* Üst Navigasyon Bar */}
      <nav className="fixed top-0 w-full z-50 bg-[#041329]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex justify-between items-center h-16 px-8 w-full max-w-[1440px] mx-auto">
          <div className="text-2xl font-black text-[#adc6ff] tracking-tighter">StrokePredict AI</div>
          <div className="hidden lg:flex gap-8 items-center">
            <Link className="text-[#adc6ff] border-b-2 border-[#1a7dff] pb-1 font-bold transition-all duration-300" to="/">Anasayfa</Link>
            <Link className="text-[#93a1b8] hover:text-[#adc6ff] transition-colors font-medium" to="/history">Hasta Geçmişi</Link>
            <Link className="text-[#adc6ff] border-b-2 border-[#1a7dff] pb-1 font-bold transition-all duration-300" to="/analysis">Analiz Paneli</Link>
            <Link className="text-[#93a1b8] hover:text-[#adc6ff] transition-colors font-medium" to="/lab">Araştırma Laboratuvarı</Link>
            <Link className="text-[#93a1b8] hover:text-[#adc6ff] transition-colors font-medium" to="/docs">Dokümantasyon</Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button className="text-[#adc6ff] hover:bg-[#1c2a41]/50 p-2 rounded-lg transition-all duration-300">
                <Bell size={20} />
              </button>
              <button className="text-[#adc6ff] hover:bg-[#1c2a41]/50 p-2 rounded-lg transition-all duration-300">
                <Settings size={20} />
              </button>
            </div>
            <div className="w-8 h-8 rounded-full border border-[#1a7dff]/30 overflow-hidden">
              <img alt="User" className="w-full h-full object-cover" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Irem" />
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-16 flex flex-col">
        {/* Hero Section */}
        <section className="relative min-h-[calc(100vh-64px)] flex items-center shrink-0">
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1559757175-0eb30cd8c063?q=80&w=2000')] bg-cover bg-center"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#041329] via-[#041329]/85 to-[#041329]/20"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#041329]"></div>
          </div>

          <div className="container mx-auto px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00183c]/30 text-[#adc6ff] text-xs font-bold tracking-widest border border-[#adc6ff]/20 backdrop-blur-md">
                <Zap size={14} className="fill-current" />
                AKILLI KLİNİK ANALİZ
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#d6e3ff] leading-[1.05] tracking-tighter">
                MBO Algoritması ile <br/><span className="text-[#adc6ff]">Felç Riski Tahmini</span>
              </h1>
              <p className="text-lg text-[#c5c6cd] leading-relaxed max-w-xl">
                Mitat Uysal'ın Göçmen Kuşlar Algoritması ile <span className="text-[#d6e3ff] font-semibold underline decoration-[#adc6ff]/40 underline-offset-4">%95 doğruluk oranına</span> sahip klinik analiz platformu.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="group relative px-8 py-4 bg-[#adc6ff] text-[#002e69] rounded-xl font-extrabold text-base transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 hover:shadow-[0_0_40px_rgba(173,198,255,0.3)]">
                  Hemen Analiz Et
                  <ArrowRight className="transition-transform group-hover:translate-x-1" size={20} />
                </button>
                <button className="px-8 py-4 bg-white/5 border border-[#44474d]/30 hover:bg-white/10 backdrop-blur-sm rounded-xl font-bold text-[#d6e3ff] transition-all duration-300">
                  Nasıl Çalışır?
                </button>
              </div>
            </div>

            {/* Sağdaki İstatistik Kartı */}
            <div className="lg:col-span-5">
              <div className="bg-[#112036]/70 backdrop-blur-2xl p-6 rounded-2xl border border-white/10 shadow-2xl space-y-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-[#adc6ff] text-[10px] font-black tracking-widest uppercase">Canlı Veri Analizi</p>
                    <h3 className="text-xl font-bold">Klinik Doğruluk</h3>
                  </div>
                  <div className="bg-[#00183c]/50 p-2 rounded-lg text-[#adc6ff]">
                    <Activity size={24} />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-[#c5c6cd]">Model Güven Skoru</span>
                    <span className="text-[#adc6ff]">%95.4</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#010e24] rounded-full overflow-hidden">
                    <div className="h-full bg-[#adc6ff] w-[95%] shadow-[0_0_15px_rgba(173,198,255,0.6)]"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-[10px] text-[#c5c6cd] uppercase font-black">Analiz Süresi</p>
                    <p className="text-xl font-extrabold mt-0.5">2.4sn</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-[10px] text-[#c5c6cd] uppercase font-black">Veri Seti</p>
                    <p className="text-xl font-extrabold mt-0.5">10M+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Alt Özellikler */}
        <section className="py-16 container mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<ShieldCheck size={24}/>} 
              title="Klinik Güven & Şeffaflık" 
              desc="Dünya çapındaki klinik yönergelerle tam uyumlu yapı."
              tags={["HIPAA", "CE CERTIFIED"]}
            />
            <FeatureCard 
              icon={<Gauge size={24}/>} 
              title="Hızlı Analiz" 
              desc="Saniyeler içinde sonuç veren gelişmiş sinir ağları."
              link="Detayları Gör"
            />
            <FeatureCard 
              icon={<Zap size={24}/>} 
              title="Yüksek Doğruluk" 
              desc="MBO Algoritması ile hata payı minimize edilmiş modeller."
              sub="Migrating Birds Optimization"
            />
          </div>
        </section>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, tags, link, sub }) => (
  <div className="bg-[#112036]/70 backdrop-blur-md rounded-2xl p-8 border border-white/5 hover:border-[#adc6ff]/20 transition-all duration-300">
    <div className="space-y-4">
      <div className="w-12 h-12 bg-[#adc6ff]/10 rounded-xl flex items-center justify-center text-[#adc6ff]">{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-sm text-[#c5c6cd] leading-relaxed">{desc}</p>
    </div>
    {tags && <div className="mt-6 flex gap-3">{tags.map(t => <span key={t} className="px-2.5 py-1 bg-white/5 rounded-md text-[10px] font-bold">{t}</span>)}</div>}
    {link && <div className="mt-6 text-xs text-[#adc6ff] font-bold cursor-pointer hover:underline">{link} →</div>}
    {sub && <div className="mt-6 text-[10px] font-black uppercase text-[#c5c6cd] tracking-widest">{sub}</div>}
  </div>
);

export default Landing;