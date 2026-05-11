import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { document.title = 'Kayıt — StrokePredict AI'; }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm) {
      setError('Şifreler eşleşmiyor.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register({ full_name: formData.full_name, email: formData.email, password: formData.password });
      navigate('/analysis');
    } catch (err) {
      setError(err.message || 'Kayıt başarısız. Bu e-posta zaten kullanılıyor olabilir.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans text-white min-h-screen flex flex-col bg-[#041329] relative overflow-hidden">

      {/* Üst Bar */}
      <header className="bg-[#041329]/80 backdrop-blur-xl border-b border-white/5 z-50">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#adc6ff] rounded-lg flex items-center justify-center text-[#002e69]">
              <Shield size={20} fill="currentColor" />
            </div>
            <h1 className="text-2xl font-bold tracking-tighter text-[#adc6ff]">StrokePredict</h1>
          </div>
          <Link to="/" className="text-xs uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Giriş Yap</Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 py-12 relative">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-[#adc6ff]/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-[480px] z-10">
          <div className="bg-[#1c2a41]/60 backdrop-blur-2xl rounded-2xl p-8 md:p-12 border border-white/5 shadow-2xl">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Hesap Oluştur</h2>
              <p className="text-slate-400 text-sm leading-relaxed">Klinik analiz sistemine kayıt olmak için bilgilerinizi girin.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 px-1">Ad Soyad</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#adc6ff] transition-colors" size={20} />
                  <input
                    required
                    value={formData.full_name}
                    className="w-full bg-[#041329] border-none focus:ring-1 focus:ring-[#adc6ff] rounded-lg py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 transition-all"
                    placeholder="Adınız Soyadınız"
                    type="text"
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 px-1">E-Posta Adresi</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#adc6ff] transition-colors" size={20} />
                  <input
                    required
                    value={formData.email}
                    className="w-full bg-[#041329] border-none focus:ring-1 focus:ring-[#adc6ff] rounded-lg py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 transition-all"
                    placeholder="mail@ornek.com"
                    type="email"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 px-1">Şifre</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#adc6ff] transition-colors" size={20} />
                  <input
                    required
                    value={formData.password}
                    className="w-full bg-[#041329] border-none focus:ring-1 focus:ring-[#adc6ff] rounded-lg py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 transition-all"
                    placeholder="••••••••"
                    type="password"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 px-1">Şifre Tekrar</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#adc6ff] transition-colors" size={20} />
                  <input
                    required
                    value={formData.confirm}
                    className="w-full bg-[#041329] border-none focus:ring-1 focus:ring-[#adc6ff] rounded-lg py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 transition-all"
                    placeholder="••••••••"
                    type="password"
                    onChange={(e) => setFormData({ ...formData, confirm: e.target.value })}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-br from-[#adc6ff] to-[#005bc1] text-[#002e69] font-bold py-4 rounded-md shadow-lg hover:shadow-[#adc6ff]/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 mt-4 flex items-center justify-center gap-2 uppercase tracking-widest text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
              >
                {loading ? 'Kayıt oluşturuluyor...' : 'Kaydı Tamamla'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-white/5 text-center">
              <p className="text-slate-400 text-sm">
                Zaten bir hesabınız var mı?
                <Link to="/" className="text-[#adc6ff] font-semibold hover:underline underline-offset-4 ml-1">Giriş Yap</Link>
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-8 opacity-40 grayscale hover:opacity-70 transition-opacity">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest">
              <Shield size={14} /> HIPAA Uyumlu
            </div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest">
              <Shield size={14} /> 256-bit Şifreleme
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#041329] py-8 px-8 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto text-[10px] text-slate-500 uppercase tracking-widest">
          <div>© 2026 StrokePredict AI System.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a>
            <a href="#" className="hover:text-white transition-colors">Kullanım Şartları</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Register;
