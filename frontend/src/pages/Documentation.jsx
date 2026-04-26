import React from 'react';
import { 
  FileText, ExternalLink, Zap, Target, 
  Plane, Terminal, Lightbulb, Microscope
} from 'lucide-react';

const Documentation = () => {
  return (
    <div className="bg-[#041329] text-slate-300 min-h-screen font-sans selection:bg-[#adc6ff]/30">
      
      
      {/* Hero Section - Boşluk azaltildi */}
<div className="relative border-b border-white/5 bg-[#041329] pt-12 pb-6"> 
  {/* pt-12 (üst boşluk), pb-6 (alt tabloya olan mesafe) */}
        <div className="max-w-6xl mx-auto px-6 text-center">
          <nav className="flex justify-center mb-6 text-[10px] font-black text-[#adc6ff] space-x-2 uppercase tracking-[0.3em]">
            <span>TEKNİK DOKÜMANTASYON</span>
            <span className="opacity-30">/</span>
            <span>MBO OPTİMİZASYONU</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
            Göç Eden Kuşlar <br /> 
            <span className="text-[#adc6ff]">Optimizasyonu (MBO)</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
            StrokePredict AI, risk faktörü ağırlıklarını optimize etmek için göç eden kuşların 
            enerji tasarruflu uçuş modellerini taklit eden meta-sezgisel bir yaklaşım kullanır.
          </p>
        </div>
      </div>

      {/* İçerik Alanı - Üst boşluğu (pt-4) azalttim */}
<main className="max-w-5xl mx-auto px-6 pt-4 pb-16">
        
        {/* V-Formasyonu - Geniş Kart Tasarımı */}
        <section className="mb-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center bg-white/5 border border-white/10 p-10 rounded-[40px] backdrop-blur-sm">
            <div className="space-y-6">
              <div className="w-12 h-12 bg-[#adc6ff]/10 rounded-2xl flex items-center justify-center text-[#adc6ff]">
                <Lightbulb size={28} />
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">V-Formasyonu Kavramı</h2>
              <div className="space-y-4 text-lg leading-relaxed font-light">
                <p>
                  MBO'nun temel ilham kaynağı <span className="text-white font-medium">V-formasyonu</span> uçuşudur. 
                  Doğada kuşlar, hava direncini azaltmak için 'V' şeklinde uçarlar.
                </p>
                <p>
                  Teşhis modelimizde, <strong className="text-[#adc6ff]">Lider Kuş</strong> mevcut en iyi parametre setini temsil ederken, 
                  <strong className="text-white"> Takipçi Kuşlar</strong> liderin izini temel alarak konumlarını iyileştirirler.
                </p>
              </div>
            </div>

            {/* Algoritma Şeması - Görselleştirme */}
            <div className="bg-[#0a192f] rounded-[32px] p-12 border border-white/5 relative overflow-hidden group">
               <div className="absolute inset-0 bg-[#adc6ff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
               <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#adc6ff] rounded-full flex items-center justify-center text-[#002e69] shadow-[0_0_50px_rgba(173,198,255,0.3)] mb-8 animate-bounce">
                    <Plane size={32} className="rotate-[-45deg]" />
                  </div>
                  <p className="text-[10px] font-black text-[#adc6ff] mb-10 uppercase tracking-[0.4em]">Lider Kuş (Global Best)</p>
                  <div className="grid grid-cols-2 gap-16">
                    <div className="flex flex-col gap-6">
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-[#adc6ff]"><Plane size={18}/></div>
                      <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-slate-600"><Plane size={18}/></div>
                    </div>
                    <div className="flex flex-col gap-6">
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-[#adc6ff] ml-auto"><Plane size={18}/></div>
                      <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-slate-600 ml-auto"><Plane size={18}/></div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Özellikler - 3'lü Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          <DocCard icon={<Zap size={24}/>} title="Yüksek Verimlilik" text="Bireyler arası çözüm paylaşımı ile hesaplama maliyetini minimize eder." />
          <DocCard icon={<Target size={24}/>} title="Durağanlıktan Kaçınma" text="Lider rotasyonu sayesinde yerel optimumlara takılma riskini yok eder." />
          <DocCard icon={<Microscope size={24}/>} title="Tıbbi Hassasiyet" text="Klinik veri setleri için özelleştirilmiş ağırlıklandırma sunar." />
        </div>

        {/* Kod Bloğu - Terminal Tasarımı */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-8">
            <Terminal className="text-[#adc6ff]" size={24} />
            <h2 className="text-2xl font-bold text-white tracking-tight">Optimizasyon Döngüsü</h2>
          </div>
          <div className="bg-[#010816] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="bg-white/5 px-6 py-4 flex items-center justify-between border-b border-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              </div>
              <span className="text-[11px] text-slate-500 font-mono tracking-widest">mbo_optimizer.py</span>
            </div>
            <div className="p-8 overflow-x-auto">
              <pre className="text-sm md:text-base font-mono leading-relaxed text-[#adc6ff]/80">
                <code>{`def mbo_optimization_loop(initial_population, iterations):
  # 1. Kuşları V-Formasyonunda Başlat
  leading_bird = initial_population[0]
  followers = initial_population[1:]

  for k in range(iterations):
    leading_bird.improve(n_neighbors=neighbors)
    
    for i, bird in enumerate(followers):
      shared_solutions = followers[i-1].get_unused()
      bird.update_position(shared_solutions)
      
    if k % rotation_period == 0:
      leading_bird = rotate_formation(leading_bird)`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Kaynaklar - Minimalist Liste */}
        <footer className="border-t border-white/5 pt-12">
          <h3 className="text-xl font-bold text-white mb-8 tracking-tight">Akademik Kaynaklar</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <AcademicItem title="Orijinal MBO Yayını: Duman & Uysal (2012)" sub="Information Sciences Journal, Elsevier" />
            <AcademicItem title="İnme Teşhisi Uyarlaması" sub="Internal Research Paper v2.4" />
          </div>
        </footer>
      </main>
    </div>
  );
};

const DocCard = ({ icon, title, text }) => (
  <div className="group p-8 bg-white/5 border border-white/5 rounded-[32px] hover:bg-white/10 hover:border-[#adc6ff]/30 transition-all duration-500">
    <div className="w-12 h-12 bg-[#adc6ff]/10 rounded-xl flex items-center justify-center text-[#adc6ff] mb-6 group-hover:scale-110 transition-transform font-bold">{icon}</div>
    <h4 className="font-bold text-white mb-3 text-lg">{title}</h4>
    <p className="text-sm text-slate-400 leading-relaxed font-light">{text}</p>
  </div>
);

const AcademicItem = ({ title, sub }) => (
  <div className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-2xl group cursor-pointer hover:bg-white/[0.08] transition-all">
    <div className="flex items-center gap-5">
      <div className="p-3 bg-[#adc6ff]/10 text-[#adc6ff] rounded-xl"><FileText size={22}/></div>
      <div>
        <p className="text-white font-medium group-hover:text-[#adc6ff] transition-colors">{title}</p>
        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">{sub}</p>
      </div>
    </div>
    <ExternalLink size={18} className="text-slate-600 group-hover:text-white transition-colors" />
  </div>
);

export default Documentation;