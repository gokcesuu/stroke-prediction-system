import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Download, Play, RefreshCcw, UserPlus, ClipboardList, Activity } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const AnalysisPanel = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  // PDF İndirme Fonksiyonu
  const exportPDF = () => {
    const input = document.getElementById('report-area');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save("Inme_Riski_Raporu.pdf");
    });
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setResult(34.8); // Örnek sonuç
      setAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="bg-[#f6f6f8] min-h-screen font-display">
      {/* Navigasyon */}
      <header className="bg-white border-b border-[#143db8]/10 px-6 py-3 md:px-20 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 no-underline text-[#143db8]">
          <Brain size={24} /> <span className="font-bold text-lg">StrokePredict AI</span>
        </Link>
        <nav className="flex gap-6 text-sm font-bold text-slate-500">
          <Link to="/history" className="hover:text-[#143db8] no-underline">Geçmiş</Link>
          <Link to="/docs" className="hover:text-[#143db8] no-underline">Dokümantasyon</Link>
        </nav>
      </header>

      <main className="p-8 md:px-20 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto">
        
        {/* SOL: VERİ GİRİŞİ */}
        <section className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-sm font-black text-[#143db8] uppercase mb-6 flex items-center gap-2">
            <UserPlus size={18}/> Hasta Veri Girişi
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase">Yaş</label>
              <input type="number" className="w-full mt-1 p-3 bg-slate-50 rounded-lg border-none outline-none focus:ring-2 focus:ring-blue-100" placeholder="ör. 65" />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase">Tansiyon (Sistolik)</label>
              <input type="number" className="w-full mt-1 p-3 bg-slate-50 rounded-lg border-none outline-none focus:ring-2 focus:ring-blue-100" placeholder="120" />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase">Glukoz Seviyesi</label>
              <input type="number" className="w-full mt-1 p-3 bg-slate-50 rounded-lg border-none outline-none focus:ring-2 focus:ring-blue-100" placeholder="95" />
            </div>
            <button 
              onClick={handleAnalyze}
              className="w-full bg-[#143db8] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all mt-6 shadow-lg shadow-blue-600/20">
              {analyzing ? <RefreshCcw className="animate-spin" /> : <Play size={18} />}
              MBO Analizini Çalıştır
            </button>
          </div>
        </section>

        {/* ORTA: ANALİZ SÜRECİ (REPORT AREA) */}
        <section id="report-area" className="lg:col-span-6 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-black text-slate-400 uppercase">MBO Optimizasyon Akışı</h2>
            <div className="flex gap-2">
              <div className="size-2 rounded-full bg-red-400"></div>
              <div className="size-2 rounded-full bg-amber-400"></div>
              <div className="size-2 rounded-full bg-emerald-400"></div>
            </div>
          </div>
          
          <div className="h-64 bg-slate-50 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-200">
            {analyzing ? (
              <div className="text-center">
                <div className="animate-bounce mb-2"><Activity className="text-[#143db8] mx-auto" size={40}/></div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Kuşlar V-Formasyonunda...</p>
              </div>
            ) : (
              <p className="text-slate-400 text-sm font-medium italic">Analiz başlatılmaya hazır.</p>
            )}
          </div>

          <div className="mt-6 bg-slate-900 rounded-xl p-4 font-mono text-[11px] text-emerald-400">
             <p className="opacity-50 tracking-tighter">{`> [BİLGİ] Yakınsama eşiğine 0.0024 seviyesinde ulaşıldı`}</p>
             <p>{`> V-şekilli formasyon aracılığıyla takipçi kuş pozisyonları güncelleniyor...`}</p>
          </div>
        </section>

        {/* SAĞ: SONUÇ PANELİ */}
        <section className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
            <h2 className="text-xs font-black text-slate-400 uppercase mb-8">İnme Riski Analiz Sonucu</h2>
            <div className="relative size-40 mx-auto mb-6">
              <svg className="size-full" viewBox="0 0 36 36">
                <path className="stroke-slate-100 fill-none" strokeWidth="3" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="stroke-[#143db8] fill-none transition-all duration-1000" strokeWidth="3" strokeDasharray={`${result || 0}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-900 tracking-tighter">%{result || "0"}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">ORTA RİSK</span>
              </div>
            </div>
            {result && (
              <button 
                onClick={exportPDF}
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-50 text-emerald-700 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-100 transition-all border border-emerald-200">
                <Download size={16}/> PDF Raporu İndir
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AnalysisPanel;