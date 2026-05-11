import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, Calendar,
  CheckCircle2, MoreVertical, Plus, ChevronLeft,
  ChevronRight, TrendingUp, Users, Brain, X, AlertTriangle, Download
} from 'lucide-react';
import { api } from '../services/api';
import { generateStrokeReport, getInterpretation, getRiskWarnings } from '../utils/pdfReport';

const PAGE_SIZE = 10;

const riskColor = (pct) => {
  if (pct >= 70) return 'text-red-600';
  if (pct >= 35) return 'text-amber-600';
  return 'text-emerald-600';
};

const riskBarColor = (pct) => {
  if (pct >= 70) return 'bg-red-500';
  if (pct >= 35) return 'bg-amber-500';
  return 'bg-emerald-500';
};

const riskBadge = (pct) => {
  if (pct >= 70) return 'bg-red-100 text-red-700';
  if (pct >= 35) return 'bg-amber-100 text-amber-700';
  return 'bg-emerald-100 text-emerald-700';
};

const riskLabel = (pct) => {
  if (pct >= 70) return 'Yüksek Risk';
  if (pct >= 35) return 'Orta Risk';
  return 'Düşük Risk';
};

const formatDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatTime = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
};

// Detay modalı
const DetailModal = ({ prediction, onClose }) => {
  if (!prediction) return null;
  const pct  = Math.round((prediction.result_data?.percentage ?? 0) * 10) / 10;
  const inp  = prediction.input_data ?? {};
  const warnings    = getRiskWarnings(inp);
  const interpretation = getInterpretation(pct, warnings);

  const smokingTr = { 'never smoked': 'Hiç İçmedi', 'formerly smoked': 'Eski İçici', 'smokes': 'İçiyor', 'Unknown': 'Bilinmiyor' };
  const workTr    = { 'Private': 'Özel Sektör', 'Self-employed': 'Serbest Meslek', 'Govt_job': 'Kamu', 'children': 'Çocuk', 'Never_worked': 'Hiç Çalışmadı' };
  const resTr     = { 'Urban': 'Şehir', 'Rural': 'Kırsal' };
  const genderTr  = { 'Male': 'Erkek', 'Female': 'Kadın', 'Other': 'Diğer' };

  const rows = [
    ['Yaş',           inp.age],
    ['Cinsiyet',      genderTr[inp.gender] ?? inp.gender],
    ['BMI',           inp.bmi],
    ['Ortalama Glikoz', inp.avg_glucose_level ? `${inp.avg_glucose_level} mg/dL` : '—'],
    ['Hipertansiyon', parseInt(inp.hypertension)  === 1 ? 'Var' : 'Yok'],
    ['Kalp Hastalığı',parseInt(inp.heart_disease) === 1 ? 'Var' : 'Yok'],
    ['Sigara',        smokingTr[inp.smoking_status] ?? inp.smoking_status],
    ['Çalışma Türü',  workTr[inp.work_type] ?? inp.work_type],
    ['Bölge',         resTr[inp.Residence_type] ?? inp.Residence_type],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">

        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#143db8]/5 border-b border-[#143db8]/10 shrink-0">
          <div>
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide">Analiz Detayı</h3>
            <p className="text-xs text-slate-500">{formatDate(prediction.created_at)} — {formatTime(prediction.created_at)}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {/* Risk sonucu */}
          <div className={`px-6 py-4 flex items-center gap-4 border-b ${pct >= 70 ? 'bg-red-50 border-red-100' : pct >= 35 ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'}`}>
            <div className={`text-4xl font-black ${riskColor(pct)}`}>%{pct}</div>
            <div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${riskBadge(pct)}`}>{riskLabel(pct)}</span>
              <p className="text-[11px] text-slate-500 mt-1">{prediction.result_data?.risk_level ?? ''}</p>
            </div>
          </div>

          {/* Klinik yorum */}
          <div className={`mx-5 mt-4 mb-2 p-4 rounded-xl text-[12px] leading-relaxed border ${
            pct >= 70 ? 'bg-red-50 border-red-200 text-red-900'
            : pct >= 35 ? 'bg-amber-50 border-amber-200 text-amber-900'
            : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}>
            <p className="font-black text-[10px] uppercase tracking-widest mb-1.5 opacity-60">Klinik Yorum</p>
            <p>{interpretation}</p>
          </div>

          {/* Uyarı faktörleri */}
          {warnings.length > 0 && (
            <div className="mx-5 mb-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-2 flex items-center gap-1">
                <AlertTriangle size={12} /> Dikkat Edilmesi Gerekenler
              </p>
              <ul className="space-y-1">
                {warnings.map((w, i) => (
                  <li key={i} className="text-[11px] text-amber-800 flex gap-2">
                    <span className="text-amber-400 shrink-0">•</span>{w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Girdi verileri */}
          <div className="px-5 pb-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Girilen Veriler</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 bg-slate-50 rounded-xl p-3">
              {rows.map(([key, val]) => (
                <div key={key} className="flex justify-between text-[11px]">
                  <span className="text-slate-500">{key}</span>
                  <span className="font-bold text-slate-900">{val ?? '—'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Butonlar */}
        <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex gap-3 shrink-0">
          <button
            onClick={() => generateStrokeReport(prediction.result_data, prediction.input_data)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-100 transition-all border border-emerald-200"
          >
            <Download size={15} /> PDF İndir
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-[#143db8] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

const PatientHistory = () => {
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    document.title = 'Geçmiş — StrokePredict AI';
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    setLoading(true);
    try {
      const data = await api.myPredictions();
      setPredictions(data);
    } catch (err) {
      setError(err.message || 'Veriler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  // Client-side arama (tarihe veya riske göre)
  const filtered = predictions.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const date = formatDate(p.created_at).toLowerCase();
    const risk = String(p.result_data?.percentage ?? '');
    const level = riskLabel(p.result_data?.percentage ?? 0).toLowerCase();
    return date.includes(q) || risk.includes(q) || level.includes(q);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Yan panel istatistikleri
  const totalCount = predictions.length;
  const avgRisk = totalCount > 0
    ? Math.round(predictions.reduce((acc, p) => acc + (p.result_data?.percentage ?? 0), 0) / totalCount)
    : 0;
  const highRiskCount = predictions.filter((p) => (p.result_data?.percentage ?? 0) >= 70).length;

  // Mini grafik için son 6 tahmin
  const last6 = predictions.slice(0, 6).reverse().map((p) => p.result_data?.percentage ?? 0);
  const maxVal = Math.max(...last6, 1);

  return (
    <div className="bg-[#f6f6f8] font-sans text-slate-900 min-h-screen">
      {selected && <DetailModal prediction={selected} onClose={() => setSelected(null)} />}

      <main className="flex-1 px-6 py-8 md:px-20 lg:px-40 max-w-[1440px] mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <nav className="flex text-sm text-slate-500 mb-2 gap-2">
              <span>Analiz</span> <span>/</span> <span className="text-[#143db8] font-medium">Geçmiş</span>
            </nav>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Hasta Geçmişi</h1>
            <p className="text-slate-500 mt-1">Geçmiş inme riski değerlendirmelerini ve MBO doğruluğunu inceleyin.</p>
          </div>
          <button
            onClick={() => navigate('/analysis')}
            className="bg-[#143db8] text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-[#143db8]/90 transition-all shadow-lg shadow-[#143db8]/20"
          >
            <Plus size={18} /> Yeni Değerlendirme
          </button>
        </div>

        {/* Arama + Filtre */}
        <div className="bg-white/70 backdrop-blur-md rounded-xl p-4 mb-6 flex flex-col lg:flex-row gap-4 items-center border border-white/30 shadow-sm">
          <div className="relative w-full lg:flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-[#143db8]/50 transition-all outline-none"
              placeholder="Tarih, risk yüzdesi veya risk seviyesine göre ara..."
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <button
              onClick={() => { setSearch('yüksek'); setPage(1); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#143db8]/10 rounded-lg text-sm font-medium hover:border-[#143db8] transition-all"
            >
              <Filter size={18} /> Yüksek Risk
            </button>
            <button
              onClick={() => { setSearch(''); setPage(1); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#143db8]/10 rounded-lg text-sm font-medium hover:border-[#143db8] transition-all"
            >
              <Calendar size={18} /> Tümü
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tablo */}
          <div className="lg:col-span-3">
            <div className="bg-white/70 backdrop-blur-md rounded-xl overflow-hidden border border-white/30 shadow-sm">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#143db8]"></div>
                  <span className="ml-3 text-sm text-slate-500">Veriler yükleniyor...</span>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-20 gap-2 text-red-600">
                  <AlertTriangle size={20} />
                  <span className="text-sm">{error}</span>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <Brain size={40} className="mb-3 opacity-30" />
                  <p className="text-sm font-medium">
                    {search ? 'Arama kriterine uygun kayıt bulunamadı.' : 'Henüz analiz yapılmamış.'}
                  </p>
                </div>
              ) : (
                <>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#143db8]/5 text-slate-500 uppercase text-[10px] font-black tracking-widest border-b border-[#143db8]/10">
                        <th className="px-6 py-4">Tarih</th>
                        <th className="px-6 py-4">Risk %</th>
                        <th className="px-6 py-4">Seviye</th>
                        <th className="px-6 py-4">Yaş / Cinsiyet</th>
                        <th className="px-6 py-4 text-right">Detay</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#143db8]/5">
                      {paginated.map((p, i) => {
                        const pct = p.result_data?.percentage ?? 0;
                        const inp = p.input_data ?? {};
                        return (
                          <tr
                            key={p.id ?? i}
                            className="hover:bg-[#143db8]/5 transition-colors cursor-pointer"
                            onClick={() => setSelected(p)}
                          >
                            <td className="px-6 py-4 text-sm">
                              <div className="font-bold text-slate-900">{formatDate(p.created_at)}</div>
                              <div className="text-xs text-slate-500">{formatTime(p.created_at)}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${riskBarColor(pct)}`}
                                    style={{ width: `${pct}%` }}
                                  ></div>
                                </div>
                                <span className={`text-sm font-bold ${riskColor(pct)}`}>%{pct}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${riskBadge(pct)}`}>
                                {riskLabel(pct)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              {inp.age ? `${inp.age} yaş` : '—'} / {inp.gender === 'Male' ? 'E' : inp.gender === 'Female' ? 'K' : '—'}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={(e) => { e.stopPropagation(); setSelected(p); }}
                                className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                              >
                                <MoreVertical size={16} className="text-slate-400" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Sayfalama */}
                  <div className="p-4 border-t border-[#143db8]/10 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      {filtered.length} kayıttan {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} gösteriliyor
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="w-8 h-8 flex items-center justify-center rounded border border-[#143db8]/10 hover:bg-[#143db8]/5 disabled:opacity-40"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                        .map((n, idx, arr) => (
                          <React.Fragment key={n}>
                            {idx > 0 && arr[idx - 1] !== n - 1 && (
                              <span className="w-8 h-8 flex items-center justify-center text-slate-400">…</span>
                            )}
                            <button
                              onClick={() => setPage(n)}
                              className={`w-8 h-8 flex items-center justify-center rounded font-bold ${
                                page === n
                                  ? 'bg-[#143db8] text-white'
                                  : 'border border-[#143db8]/10 hover:bg-[#143db8]/5'
                              }`}
                            >
                              {n}
                            </button>
                          </React.Fragment>
                        ))}
                      <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="w-8 h-8 flex items-center justify-center rounded border border-[#143db8]/10 hover:bg-[#143db8]/5 disabled:opacity-40"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Yan Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Risk Trend */}
            <div className="bg-white/70 backdrop-blur-md rounded-xl p-5 border-l-4 border-[#143db8] shadow-sm">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex justify-between items-center">
                Risk Trendi
                {highRiskCount > 0 && (
                  <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded tracking-tighter">
                    {highRiskCount} YÜKSEK
                  </span>
                )}
              </h3>
              <div className="mb-4">
                <p className="text-[10px] text-slate-500 font-bold mb-1">SON 6 ANALİZ</p>
                <div className="h-24 bg-blue-600/5 rounded-lg flex items-end p-2 gap-1 overflow-hidden">
                  {last6.length > 0 ? last6.map((h, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t-sm transition-all hover:opacity-80 ${h >= 70 ? 'bg-red-400' : h >= 35 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                      style={{ height: `${(h / maxVal) * 100}%` }}
                      title={`%${h}`}
                    ></div>
                  )) : (
                    <div className="flex-1 flex items-center justify-center text-[10px] text-slate-400">Veri yok</div>
                  )}
                </div>
              </div>
              <div className="text-[11px] text-slate-500">
                Son 6 analiz ortalaması:{' '}
                <span className={`font-bold ${riskColor(avgRisk)}`}>%{avgRisk}</span>
              </div>
            </div>

            {/* Performans Özeti */}
            <div className="bg-white/70 backdrop-blur-md rounded-xl p-5 border border-white/30 shadow-sm">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Performans Özeti</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-[#143db8]">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-black">TOPLAM ANALİZ</p>
                    <p className="text-lg font-black text-slate-900">
                      {loading ? '...' : totalCount.toLocaleString('tr-TR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-black">ORTALAMA RİSK</p>
                    <p className={`text-lg font-black ${riskColor(avgRisk)}`}>
                      {loading ? '...' : `%${avgRisk}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-black">YÜKSEK RİSK</p>
                    <p className="text-lg font-black text-red-600">
                      {loading ? '...' : highRiskCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientHistory;
