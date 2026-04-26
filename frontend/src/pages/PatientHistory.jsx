import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, Bell, Search, Filter, Calendar, 
  CheckCircle2, MoreVertical, Plus, ChevronLeft, 
  ChevronRight, TrendingUp, Users, Brain, ShieldCheck
} from 'lucide-react';

const PatientHistory = () => {
  const patients = [
    { id: '#SP-8821', name: 'Jonathan Doe', initial: 'JD', date: '24 Eki 2023', time: '09:45', risk: 82, accuracy: 94.2, status: 'Tamamlandı', color: 'blue' },
    { id: '#SP-9012', name: 'Sarah Miller', initial: 'SM', date: '22 Eki 2023', time: '14:15', risk: 45, accuracy: 91.8, status: 'İnceleme Bekliyor', color: 'purple' },
    { id: '#SP-7734', name: 'Robert White', initial: 'RW', date: '20 Eki 2023', time: '11:30', risk: 12, accuracy: 97.5, status: 'Tamamlandı', color: 'emerald' },
    { id: '#SP-8110', name: 'Emily Knight', initial: 'EK', date: '19 Eki 2023', time: '16:50', risk: 68, accuracy: 95.0, status: 'Tamamlandı', color: 'rose' },
  ];

  return (
    <div className="bg-[#f6f6f8] dark:bg-[#111521] font-sans text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">
      <div className="flex h-full flex-col">
      

        <main className="flex-1 px-6 py-8 md:px-20 lg:px-40 max-w-[1440px] mx-auto w-full">
          {/* Header Bölümü */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <nav className="flex text-sm text-slate-500 mb-2 gap-2">
                <span>Analiz</span> <span>/</span> <span className="text-[#143db8] font-medium">Geçmiş</span>
              </nav>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Hasta Geçmişi</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Geçmiş inme riski değerlendirmelerini ve MBO doğruluğunu inceleyin.</p>
            </div>
            <button className="bg-[#143db8] text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-[#143db8]/90 transition-all shadow-lg shadow-[#143db8]/20">
              <Plus size={18} /> Yeni Değerlendirme
            </button>
          </div>

          {/* Filtre ve Arama - Cam Efektli */}
          <div className="bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-xl p-4 mb-6 flex flex-col lg:flex-row gap-4 items-center border border-white/30 shadow-sm">
            <div className="relative w-full lg:flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                className="w-full pl-12 pr-4 py-3 rounded-lg border-[#143db8]/10 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-[#143db8]/50 transition-all outline-none" 
                placeholder="Hasta adı, ID veya klinisyene göre ara..." 
                type="text"
              />
            </div>
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-[#143db8]/10 rounded-lg text-sm font-medium hover:border-[#143db8] transition-all">
                <Filter size={18} /> Risk Seviyesi
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-[#143db8]/10 rounded-lg text-sm font-medium hover:border-[#143db8] transition-all">
                <Calendar size={18} /> Tarih Aralığı
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Veri Tablosu */}
            <div className="lg:col-span-3">
              <div className="bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-xl overflow-hidden border border-white/30 shadow-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#143db8]/5 text-slate-500 uppercase text-[10px] font-black tracking-widest border-b border-[#143db8]/10">
                      <th className="px-6 py-4">Değerlendirme Tarihi</th>
                      <th className="px-6 py-4">Hasta Adı</th>
                      <th className="px-6 py-4">Risk %</th>
                      <th className="px-6 py-4">MBO Doğruluğu</th>
                      <th className="px-6 py-4">Durum</th>
                      <th className="px-6 py-4 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#143db8]/5">
                    {patients.map((p, i) => (
                      <tr key={i} className="hover:bg-[#143db8]/5 transition-colors group cursor-pointer">
                        <td className="px-6 py-4 text-sm">
                          <div className="font-bold text-slate-900 dark:text-white">{p.date}</div>
                          <div className="text-xs text-slate-500">{p.time}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full bg-${p.color}-100 flex items-center justify-center text-${p.color}-600 font-bold text-xs uppercase`}>{p.initial}</div>
                            <div>
                              <div className="text-sm font-bold text-slate-900 dark:text-white">{p.name}</div>
                              <div className="text-[10px] text-slate-500">ID: {p.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-12 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                              <div className={`h-full ${p.risk > 70 ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${p.risk}%` }}></div>
                            </div>
                            <span className={`text-sm font-bold ${p.risk > 70 ? 'text-red-600' : 'text-amber-600'}`}>%{p.risk}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-emerald-600">%{p.accuracy}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${p.status === 'Tamamlandı' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right"><MoreVertical size={16} className="inline text-slate-400" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="p-4 border-t border-[#143db8]/10 flex items-center justify-between text-xs text-slate-500">
                  <span>1.280 hasta arasından 4 tanesi gösteriliyor</span>
                  <div className="flex gap-1">
                    <button className="w-8 h-8 flex items-center justify-center rounded border border-[#143db8]/10 hover:bg-[#143db8]/5"><ChevronLeft size={14}/></button>
                    <button className="w-8 h-8 flex items-center justify-center rounded bg-[#143db8] text-white font-bold">1</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded border border-[#143db8]/10 hover:bg-[#143db8]/5">2</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded border border-[#143db8]/10 hover:bg-[#143db8]/5"><ChevronRight size={14}/></button>
                  </div>
                </div>
              </div>
            </div>

            {/* Yan Panel */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-xl p-5 border-l-4 border-[#143db8] shadow-sm">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex justify-between items-center">
                  Aktif Trend <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded tracking-tighter">YÜKSEK RİSK</span>
                </h3>
                <div className="mb-4">
                  <p className="text-[10px] text-slate-500 font-bold mb-1">HİSTOGRAM: JONATHAN DOE</p>
                  <div className="h-24 bg-blue-600/5 rounded-lg flex items-end p-2 gap-1 overflow-hidden">
                    {[40, 70, 45, 90, 65, 82].map((h, i) => (
                      <div key={i} className="flex-1 bg-[#143db8]/30 rounded-t-sm transition-all hover:bg-[#143db8]" style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Kan Basıncı</span>
                    <span className="font-bold text-red-600 font-serif">145/95 mmHg</span>
                  </div>
                  <button className="w-full mt-2 bg-slate-900 text-white py-2 rounded-lg font-bold text-[10px] hover:bg-slate-800 transition-colors uppercase">Profil Detayları</button>
                </div>
              </div>

              <div className="bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/30 shadow-sm">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Performans Özeti</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600"><CheckCircle2 size={24}/></div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-black">ORTALAMA DOĞRULUK</p>
                      <p className="text-lg font-black text-slate-900 dark:text-white">%95.4</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-[#143db8]"><Users size={24}/></div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-black">TOPLAM ANALİZ</p>
                      <p className="text-lg font-black text-slate-900 dark:text-white">1,280</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientHistory;