import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Giriş mantığı buraya gelecek, şimdilik analize yönlendirsin
    console.log("Giriş denemesi:", formData);
    navigate('/analysis');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      {/* Arka plan süsü */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full bg-[#1e293b]/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-700/50 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-4 shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Tekrar Hoş Geldin</h2>
          <p className="text-slate-400 mt-2">İnme riski analiz sistemine giriş yap</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">E-posta</label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
              <input 
                type="email" 
                required
                className="w-full bg-[#0f172a]/50 border border-slate-700 rounded-2xl py-3.5 px-11 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                placeholder="isim@mail.com"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Şifre</label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
              <input 
                type="password" 
                required
                className="w-full bg-[#0f172a]/50 border border-slate-700 rounded-2xl py-3.5 px-11 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                placeholder="••••••••"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Şifremi Unuttum</a>
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 group active:scale-[0.98]"
          >
            Sisteme Giriş Yap
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
          <p className="text-slate-400 text-sm">
            Henüz bir hesabın yok mu?{' '}
            <Link to="/register" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
              Hemen Kayıt Ol
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;