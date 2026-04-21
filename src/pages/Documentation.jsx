import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Brain, Code, FileText, 
  ExternalLink, ChevronRight, Zap,
  Target, Activity, Search, ShieldCheck,
  Plane, Terminal, Lightbulb, Database, Microscope
} from 'lucide-react';

const Documentation = () => {
  return (
    <div className="bg-[#f6f6f8] dark:bg-[#111521] font-display text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">
      {/* Üst Navigasyon */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#111521]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 no-underline">
            <div className="bg-[#143db8] p-1.5 rounded-lg text-white">
              <Brain size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              StrokePredict<span className="text-[#143db8] text-sm align-top">AI</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/panel" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-[#143db8] no-underline">Analiz Paneli</Link>
            <Link to="/history" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-[#143db8] no-underline">Hasta Geçmişi</Link>
            <Link to="/docs" className="text-sm font-bold text-[#143db8] border-b-2 border-[#143db8] py-5 no-underline">Dokümantasyon</Link>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-[#143db8] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all">
              Portal Girişi
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sol Yan Menü */}
          <aside className="lg:col-span-3 hidden lg:block space-y-8">
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Temel Kavramlar</h3>
              <ul className="space-y-3 list-none p-0">
                <li><a className="text-sm text-[#143db8] font-bold flex items-center gap-2 no-underline" href="#introduction"><div className="w-1.5 h-1.5 rounded-full bg-[#143db8]"></div>Giriş</a></li>
                <li><a className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#143db8] flex items-center gap-2 no-underline transition-colors" href="#algorithm-flow">Algoritma Akışı</a></li>
                <li><a className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#143db8] flex items-center gap-2 no-underline transition-colors" href="#v-formation">V-Formasyonu Mantığı</a></li>
              </ul>
            </div>
            <div className="p-5 bg-[#143db8]/5 rounded-2xl border border-[#143db8]/20">
              <p className="text-[11px] text-[#143db8] font-black uppercase mb-2">Yardım Gerekli mi?</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">Algoritma detayları için teknik ekibimizle iletişime geçin.</p>
              <button className="w-full py-2 bg-[#143db8] text-white rounded-lg text-[10px] font-black uppercase tracking-widest">Destek Al</button>
            </div>
          </aside>

          {/* Ana İçerik */}
          <div className="lg:col-span-9">
            <header className="mb-12">
              <nav className="flex mb-4 text-[10px] font-black text-slate-400 space-x-2 uppercase tracking-[0.2em]">
                <span>DOKÜMANLAR</span>
                <span>/</span>
                <span className="text-[#143db8]">MBO OPTİMİZASYONU</span>
              </nav>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Göç Eden Kuşlar Optimizasyonu (MBO)</h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
                StrokePredict AI, risk faktörü ağırlıklarını optimize etmek için Duman &amp; Uysal'ın (2012) meta-sezgisel yaklaşımını kullanır. MBO algoritması, inme teşhisindeki karmaşık doğrusal olmayan sınıflandırma problemlerini çözmek için göç eden kuşların enerji tasarruflu uçuş modellerini taklit eder.
              </p>
            </header>

            {/* Bölüm: V-Formasyonu */}
            <section className="mb-16" id="v-formation">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Lightbulb className="text-[#143db8]" size={24} /> V-Formasyonu Kavramı
              </h2>
              <div className="grid md:grid-cols-2 gap-8 items-center bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  <p>
                    MBO'nun temel ilham kaynağı V-formasyonu uçuşudur. Doğada kuşlar, hava direncini azaltmak için 'V' şeklinde uçarlar. En uçtaki kuş (lider) en çok enerjiyi harcarken, takipçiler öndekilerin oluşturduğu yukarı yönlü hava akımından faydalanır.
                  </p>
                  <p>
                    Teşhis modelimizde, <strong>Lider Kuş</strong> mevcut en iyi performans gösteren parametre setini (çözüm) temsil eder. <strong>Takipçi Kuşlar</strong>, liderin izini temel alarak konumlarını iyileştiren rakip aday çözümlerdir.
                  </p>
                </div>
                {/* Algoritma Şeması */}
                <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-[#041329]/50 rounded-2xl relative">
                  <div className="w-12 h-12 bg-[#143db8] rounded-full flex items-center justify-center text-white shadow-xl mb-6 relative z-10 animate-bounce">
                    <Plane size={24} className="rotate-[-45deg]" />
                  </div>
                  <p className="text-[10px] font-black text-[#143db8] mb-8 uppercase tracking-widest">Lider Kuş (Küresel En İyi)</p>
                  <div className="grid grid-cols-2 gap-10">
                    <div className="flex flex-col gap-4">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-[#143db8]"><Plane size={14}/></div>
                      <div className="w-8 h-8 bg-blue-100/50 rounded-full flex items-center justify-center text-blue-300"><Plane size={14}/></div>
                    </div>
                    <div className="flex flex-col gap-4 text-right">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-[#143db8] ml-auto"><Plane size={14}/></div>
                      <div className="w-8 h-8 bg-blue-100/50 rounded-full flex items-center justify-center text-blue-300 ml-auto"><Plane size={14}/></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Bölüm: Kod Bloğu */}
            <section className="mb-16" id="mbo-loop">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Terminal className="text-[#143db8]" size={24} /> Optimizasyon Döngüsü
              </h2>
              <div className="bg-[#0f172a] rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
                <div className="bg-slate-800/50 px-4 py-2 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">mbo_optimizer.py</span>
                </div>
                <div className="p-6 overflow-x-auto">
                  <pre className="text-xs md:text-sm font-mono leading-relaxed text-blue-100">
                    <code>{`def mbo_optimization_loop(initial_population, iterations):
  # 1. Kuşları V-Formasyonunda Başlat
  leading_bird = initial_population[0]
  followers = initial_population[1:]

  for k in range(iterations):
    # Lider kuş komşu çözümleri keşfeder
    leading_bird.improve(n_neighbors=neighbors)
    
    for i, bird in enumerate(followers):
      # Öndeki kuşun çözümlerinden faydalan
      shared_solutions = followers[i-1].get_unused()
      bird.update_position(shared_solutions)
      
    # Periyodik lider rotasyonu ile duraganlığı önle
    if k % rotation_period == 0:
      leading_bird = rotate_formation(leading_bird)`}</code>
                  </pre>
                </div>
              </div>
            </section>

            {/* Özellik Kartları */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <DocCard icon={<Zap size={20}/>} title="Yüksek Verimlilik" text="Bireyler arası çözüm paylaşımı ile hesaplama maliyetini düşürür." />
              <DocCard icon={<Target size={20}/>} title="Durağanlıktan Kaçınma" text="Lider rotasyonu sayesinde yerel optimumlara takılma riskini azaltır." />
              <DocCard icon={<Microscope size={20}/>} title="Tıbbi Hassasiyet" text="Klinik veri setleri için özel ağırlıklandırma mekanizması sunar." />
            </div>

            {/* Kaynaklar */}
            <footer className="border-t border-slate-200 dark:border-slate-800 pt-8">
              <h3 className="text-lg font-bold mb-6">Akademik Kaynaklar</h3>
              <div className="space-y-3">
                <AcademicItem title="Orijinal MBO Yayını: Duman & Uysal (2012)" sub="Information Sciences Journal, Elsevier" />
                <AcademicItem title="MBO'nun İnme Teşhisine Uyarlanması" sub="Internal Research Paper v2.4" />
              </div>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
};

// Küçük yardımcı bileşenler
const DocCard = ({ icon, title, text }) => (
  <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
    <div className="w-10 h-10 bg-[#143db8]/10 rounded-lg flex items-center justify-center text-[#143db8] mb-4">{icon}</div>
    <h4 className="font-bold mb-2 text-sm">{title}</h4>
    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{text}</p>
  </div>
);

const AcademicItem = ({ title, sub }) => (
  <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl group cursor-pointer hover:border-[#143db8] transition-all">
    <div className="flex items-center gap-4">
      <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg"><FileText size={20}/></div>
      <div>
        <p className="text-sm font-bold group-hover:text-[#143db8] transition-colors">{title}</p>
        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{sub}</p>
      </div>
    </div>
    <ExternalLink size={16} className="text-slate-300 group-hover:text-[#143db8]" />
  </div>
);

export default Documentation;