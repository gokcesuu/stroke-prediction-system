import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  useEffect(() => {
    document.title = '404 — Sayfa Bulunamadı';
  }, []);

  return (
    <div className="min-h-screen bg-[#041329] flex flex-col items-center justify-center text-white px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#adc6ff]/10 rounded-2xl flex items-center justify-center">
            <Shield className="text-[#adc6ff]" size={36} />
          </div>
        </div>
        <p className="text-[#adc6ff] text-sm font-black uppercase tracking-[0.3em] mb-2">Hata 404</p>
        <h1 className="text-5xl font-black tracking-tight mb-4">Sayfa Bulunamadı</h1>
        <p className="text-slate-400 leading-relaxed mb-10">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#adc6ff] text-[#002e69] rounded-xl font-bold hover:bg-white transition-colors"
        >
          <ArrowLeft size={18} /> Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
