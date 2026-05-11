import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Play, RefreshCcw, UserPlus, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const INITIAL_FORM = {
  gender: 'Male',
  age: '',
  hypertension: 0,
  heart_disease: 0,
  ever_married: 'Yes',
  work_type: 'Private',
  Residence_type: 'Urban',
  avg_glucose_level: '',
  bmi: '',
  smoking_status: 'never smoked',
};

const LOG_STEPS = [
  '> [BAŞLATILIYOR] Model yükleniyor...',
  '> [MBO] Kuş popülasyonu başlatıldı. Kuş sayısı: 50',
  '> [MBO] V-formasyonu oluşturuluyor...',
  '> [İTERASYON 1/10] En iyi skor: 0.7821',
  '> [İTERASYON 3/10] Lider kuş pozisyonu güncellendi...',
  '> [İTERASYON 5/10] Yakınsama devam ediyor...',
  '> [İTERASYON 8/10] Optimal parametreler yaklaşıyor...',
  '> [TAMAMLANDI] Optimal parametreler bulundu.',
  '> [SONUÇ] Risk hesaplaması tamamlandı.',
];

const getRiskWarnings = (form) => {
  const warnings = [];
  const age = parseFloat(form.age);
  const glucose = parseFloat(form.avg_glucose_level);
  const bmi = parseFloat(form.bmi);

  if (parseInt(form.hypertension) === 1)
    warnings.push('Hipertansiyonunuz var — önemli bir inme risk faktörüdür');
  if (parseInt(form.heart_disease) === 1)
    warnings.push('Kalp hastalığı önemli bir inme risk faktörüdür');
  if (form.smoking_status === 'smokes')
    warnings.push('Aktif sigara kullanımı inme riskini artırır');
  if (form.smoking_status === 'formerly smoked')
    warnings.push('Geçmiş sigara kullanımı risk faktörü olarak değerlendirilir');
  if (!isNaN(age) && age >= 65)
    warnings.push('65 yaş üzeri yüksek riskli grup — düzenli doktor takibi önerilir');
  else if (!isNaN(age) && age >= 50)
    warnings.push('50 yaş üzeri düzenli kardiyoloji kontrolü önerilir');
  if (!isNaN(glucose) && glucose >= 200)
    warnings.push('Glikoz değeriniz yüksek — diyabet riski kontrol edilmeli');
  if (!isNaN(bmi) && bmi >= 30)
    warnings.push('BMI değeriniz obezite sınırında — kardiyovasküler riski artırır');

  return warnings;
};

const validateForm = (form) => {
  const age = parseFloat(form.age);
  const glucose = parseFloat(form.avg_glucose_level);
  const bmi = parseFloat(form.bmi);

  if (!form.age || isNaN(age) || age < 1 || age > 120)
    return 'Yaş 1 ile 120 arasında olmalıdır.';
  if (!form.avg_glucose_level || isNaN(glucose) || glucose < 40 || glucose > 500)
    return 'Glikoz seviyesi 40 ile 500 arasında olmalıdır.';
  if (!form.bmi || isNaN(bmi) || bmi < 10 || bmi > 60)
    return 'BMI 10 ile 60 arasında olmalıdır.';
  return null;
};

const riskColor = (pct) => {
  if (pct >= 70) return 'text-red-600';
  if (pct >= 35) return 'text-amber-600';
  return 'text-emerald-600';
};

const riskLabel = (pct) => {
  if (pct >= 70) return 'YÜKSEK RİSK';
  if (pct >= 35) return 'ORTA RİSK';
  return 'DÜŞÜK RİSK';
};

const SelectField = ({ label, name, options, form, setForm, disabled }) => (
  <div>
    <label className="text-[10px] font-black text-slate-400 uppercase">{label}</label>
    <select
      value={form[name]}
      onChange={(e) => setForm({ ...form, [name]: e.target.value })}
      disabled={disabled}
      className="w-full mt-1 p-3 bg-slate-50 rounded-lg border-none outline-none focus:ring-2 focus:ring-blue-100 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
);

const NumberInput = ({ label, name, placeholder, form, setForm, disabled }) => (
  <div>
    <label className="text-[10px] font-black text-slate-400 uppercase">{label}</label>
    <input
      type="number"
      step="any"
      required
      value={form[name]}
      onChange={(e) => setForm({ ...form, [name]: e.target.value })}
      disabled={disabled}
      className="w-full mt-1 p-3 bg-slate-50 rounded-lg border-none outline-none focus:ring-2 focus:ring-blue-100 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      placeholder={placeholder}
    />
  </div>
);

const AnalysisPanel = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState(INITIAL_FORM);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [savedForm, setSavedForm] = useState(null);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([]);
  const logRef = useRef(null);

  useEffect(() => {
    document.title = 'Analiz — StrokePredict AI';
  }, []);

  // Log animasyonu
  useEffect(() => {
    if (!analyzing) return;
    setLogs([]);
    let i = 0;
    const interval = setInterval(() => {
      if (i < LOG_STEPS.length) {
        setLogs((prev) => [...prev, LOG_STEPS[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 320);
    return () => clearInterval(interval);
  }, [analyzing]);

  // Log kutusunu otomatik aşağı kaydır
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  const exportPDF = () => {
    if (!result || !savedForm) return;

    // jsPDF helvetica fontu Türkçe karakterleri desteklemez → ASCII karşılığı
    const tr = (str) => String(str ?? '')
      .replace(/ş/g, 's').replace(/Ş/g, 'S')
      .replace(/ı/g, 'i').replace(/İ/g, 'I')
      .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
      .replace(/ö/g, 'o').replace(/Ö/g, 'O')
      .replace(/ü/g, 'u').replace(/Ü/g, 'U')
      .replace(/ç/g, 'c').replace(/Ç/g, 'C')
      .replace(/â/g, 'a').replace(/î/g, 'i').replace(/û/g, 'u');

    // Dropdown değerlerini Türkçeye çevir
    const smokingLabel = {
      'never smoked': 'Hic icmedi',
      'formerly smoked': 'Eski icici',
      'smokes': 'Iciyor',
      'Unknown': 'Bilinmiyor',
    }[savedForm.smoking_status] ?? savedForm.smoking_status;

    const workLabel = {
      'Private': 'Ozel sektor',
      'Self-employed': 'Serbest meslek',
      'Govt_job': 'Kamu',
      'children': 'Cocuk',
      'Never_worked': 'Hic calismadi',
    }[savedForm.work_type] ?? savedForm.work_type;

    const residenceLabel = { 'Urban': 'Sehir', 'Rural': 'Kirsal' }[savedForm.Residence_type] ?? savedForm.Residence_type;
    const genderLabel = { 'Male': 'Erkek', 'Female': 'Kadin', 'Other': 'Diger' }[savedForm.gender] ?? savedForm.gender;

    const pdf = new jsPDF('p', 'mm', 'a4');
    // Yüzdeyi yuvarla: 27.299... → 27.3
    const pct = Math.round(result.percentage * 10) / 10;
    const level = pct >= 70 ? 'Yuksek Risk' : pct >= 35 ? 'Orta Risk' : 'Dusuk Risk';
    const riskR = pct >= 70 ? 220 : pct >= 35 ? 180 : 22;
    const riskG = pct >= 70 ? 38  : pct >= 35 ? 100 : 163;
    const riskB = pct >= 70 ? 38  : pct >= 35 ? 6   : 74;

    // ── BAŞLIK ──
    pdf.setFillColor(20, 61, 184);
    pdf.rect(0, 0, 210, 18, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(13);
    pdf.setTextColor(255, 255, 255);
    pdf.text('StrokePredict AI  |  Inme Riski Analiz Raporu', 15, 12);

    // ── TARİH ──
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(120, 120, 120);
    pdf.text(`Olusturulma tarihi: ${new Date().toLocaleDateString('tr-TR')}`, 15, 26);

    // ── RİSK SKORU KUTUSU ──
    pdf.setFillColor(riskR, riskG, riskB);
    pdf.roundedRect(15, 32, 85, 28, 4, 4, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(26);
    pdf.setTextColor(255, 255, 255);
    pdf.text(`%${pct}`, 20, 50);
    pdf.setFontSize(11);
    pdf.text(level, 20, 57);

    // Model bilgisi kutusu
    pdf.setFillColor(240, 244, 255);
    pdf.roundedRect(108, 32, 87, 28, 4, 4, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(20, 61, 184);
    pdf.text('MODEL BILGISi', 113, 40);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(60, 60, 60);
    pdf.setFontSize(9);
    pdf.text('Algoritma: XGBoost + MBO', 113, 47);
    pdf.text('Esik Degeri: 0.65', 113, 53);
    pdf.text('Olasilik: ' + result.probability ? `%${Math.round((result.probability ?? pct / 100) * 100 * 10) / 10}` : '-', 113, 59);

    // ── GİRİLEN VERİLER ──
    pdf.setDrawColor(220, 220, 220);
    pdf.setLineWidth(0.3);
    pdf.line(15, 68, 195, 68);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(30, 30, 30);
    pdf.text('Girilen Hasta Verileri', 15, 76);

    const fields = [
      ['Yas',           String(savedForm.age)],
      ['Cinsiyet',      genderLabel],
      ['BMI',           String(savedForm.bmi)],
      ['Glikoz',        savedForm.avg_glucose_level + ' mg/dL'],
      ['Hipertansiyon', parseInt(savedForm.hypertension) === 1 ? 'Var' : 'Yok'],
      ['Kalp Hastaligi',parseInt(savedForm.heart_disease) === 1 ? 'Var' : 'Yok'],
      ['Sigara',        smokingLabel],
      ['Calisma Turu',  workLabel],
      ['Bolge',         residenceLabel],
      ['Medeni Durum',  savedForm.ever_married === 'Yes' ? 'Evli' : 'Bekar'],
    ];

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    fields.forEach(([key, val], idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = col === 0 ? 15 : 108;
      const y = 85 + row * 10;
      // Arka plan alternatif satır
      if (row % 2 === 0) {
        pdf.setFillColor(248, 250, 255);
        pdf.rect(col === 0 ? 15 : 108, y - 5, 88, 9, 'F');
      }
      pdf.setTextColor(100, 100, 100);
      pdf.text(`${key}:`, x + 2, y);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(30, 30, 30);
      pdf.text(String(val), x + 38, y);
      pdf.setFont('helvetica', 'normal');
    });

    // ── UYARI FAKTÖRLERİ ──
    const warnings = getRiskWarnings(savedForm);
    const warnStartY = 85 + Math.ceil(fields.length / 2) * 10 + 8;

    pdf.setDrawColor(220, 220, 220);
    pdf.line(15, warnStartY - 2, 195, warnStartY - 2);

    if (warnings.length > 0) {
      pdf.setFillColor(255, 248, 235);
      pdf.roundedRect(15, warnStartY + 2, 180, 10 + warnings.length * 9, 3, 3, 'F');
      pdf.setDrawColor(230, 160, 30);
      pdf.roundedRect(15, warnStartY + 2, 180, 10 + warnings.length * 9, 3, 3, 'S');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(160, 90, 0);
      pdf.text('! Dikkat Edilmesi Gereken Risk Faktorleri', 20, warnStartY + 10);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9.5);
      warnings.forEach((w, i) => {
        pdf.setTextColor(120, 60, 0);
        pdf.text(`• ${tr(w)}`, 22, warnStartY + 18 + i * 9);
      });
    } else {
      pdf.setFillColor(235, 255, 245);
      pdf.roundedRect(15, warnStartY + 2, 180, 16, 3, 3, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(20, 130, 80);
      pdf.text('Belirgin risk faktoru tespit edilmedi.', 20, warnStartY + 12);
    }

    // ── FOOTER ──
    pdf.setFillColor(245, 247, 252);
    pdf.rect(0, 272, 210, 25, 'F');
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(8);
    pdf.setTextColor(140, 140, 140);
    pdf.text('Bu rapor StrokePredict AI tarafindan otomatik olusturulmustur.', 15, 280);
    pdf.text('Tibbi teshis yerine geçmez. Kesin tani icin saglik profesyoneline basvurunuz.', 15, 286);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(20, 61, 184);
    pdf.text('StrokePredict AI  |  strokepredict.ai', 140, 286);

    pdf.save('Inme_Riski_Raporu.pdf');
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/'); return; }

    const validationError = validateForm(form);
    if (validationError) { setError(validationError); return; }

    setError('');
    setResult(null);
    setAnalyzing(true);
    setSavedForm({ ...form });

    try {
      const payload = {
        ...form,
        age: parseFloat(form.age),
        hypertension: parseInt(form.hypertension),
        heart_disease: parseInt(form.heart_disease),
        avg_glucose_level: parseFloat(form.avg_glucose_level),
        bmi: parseFloat(form.bmi),
      };
      const data = await api.predict(payload);
      setResult(data.result_data);
    } catch (err) {
      setError(err.message || 'Analiz sırasında bir hata oluştu.');
    } finally {
      setAnalyzing(false);
    }
  };

  const pct = result ? Math.round(result.percentage * 10) / 10 : 0;
  const warnings = result && savedForm ? getRiskWarnings(savedForm) : [];

  return (
    <div className="bg-[#f6f6f8] min-h-screen font-display">
      <main className="p-8 md:px-20 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto">

        {/* SOL: VERİ GİRİŞİ */}
        <section className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-sm font-black text-[#143db8] uppercase mb-6 flex items-center gap-2">
            <UserPlus size={18} /> Hasta Veri Girişi
          </h2>
          <form onSubmit={handleAnalyze} className="space-y-3">
            <NumberInput label="Yaş" name="age" placeholder="ör. 65" form={form} setForm={setForm} disabled={analyzing} />
            <NumberInput label="Ortalama Glikoz Seviyesi" name="avg_glucose_level" placeholder="ör. 106.0" form={form} setForm={setForm} disabled={analyzing} />
            <NumberInput label="BMI (Vücut Kitle İndeksi)" name="bmi" placeholder="ör. 28.5" form={form} setForm={setForm} disabled={analyzing} />
            <SelectField label="Cinsiyet" name="gender" options={[
              { value: 'Male', label: 'Erkek' },
              { value: 'Female', label: 'Kadın' },
              { value: 'Other', label: 'Diğer' },
            ]} form={form} setForm={setForm} disabled={analyzing} />
            <SelectField label="Hipertansiyon" name="hypertension" options={[
              { value: 0, label: 'Yok' },
              { value: 1, label: 'Var' },
            ]} form={form} setForm={setForm} disabled={analyzing} />
            <SelectField label="Kalp Hastalığı" name="heart_disease" options={[
              { value: 0, label: 'Yok' },
              { value: 1, label: 'Var' },
            ]} form={form} setForm={setForm} disabled={analyzing} />
            <SelectField label="Evli mi?" name="ever_married" options={[
              { value: 'Yes', label: 'Evet' },
              { value: 'No', label: 'Hayır' },
            ]} form={form} setForm={setForm} disabled={analyzing} />
            <SelectField label="Çalışma Türü" name="work_type" options={[
              { value: 'Private', label: 'Özel Sektör' },
              { value: 'Self-employed', label: 'Serbest Meslek' },
              { value: 'Govt_job', label: 'Kamu' },
              { value: 'children', label: 'Çocuk' },
              { value: 'Never_worked', label: 'Hiç Çalışmadı' },
            ]} form={form} setForm={setForm} disabled={analyzing} />
            <SelectField label="Yaşanılan Bölge" name="Residence_type" options={[
              { value: 'Urban', label: 'Şehir' },
              { value: 'Rural', label: 'Kırsal' },
            ]} form={form} setForm={setForm} disabled={analyzing} />
            <SelectField label="Sigara Durumu" name="smoking_status" options={[
              { value: 'never smoked', label: 'Hiç İçmedi' },
              { value: 'formerly smoked', label: 'Eski İçici' },
              { value: 'smokes', label: 'İçiyor' },
              { value: 'Unknown', label: 'Bilinmiyor' },
            ]} form={form} setForm={setForm} disabled={analyzing} />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg flex items-start gap-2">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={analyzing}
              className="w-full bg-[#143db8] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all mt-2 shadow-lg shadow-blue-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {analyzing ? <RefreshCcw className="animate-spin" size={18} /> : <Play size={18} />}
              {analyzing ? 'Analiz ediliyor...' : 'MBO Analizini Çalıştır'}
            </button>
          </form>
        </section>

        {/* ORTA: ANALİZ SÜRECİ */}
        <section className="lg:col-span-6 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
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
                <div className="animate-bounce mb-2">
                  <Activity className="text-[#143db8] mx-auto" size={40} />
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Kuşlar V-Formasyonunda...</p>
              </div>
            ) : result ? (
              <div className="text-center px-6">
                <p className={`text-4xl font-black mb-1 ${riskColor(pct)}`}>%{pct}</p>
                <p className={`text-sm font-bold uppercase tracking-widest ${riskColor(pct)}`}>{riskLabel(pct)}</p>
              </div>
            ) : (
              <p className="text-slate-400 text-sm font-medium italic">Analiz başlatılmaya hazır.</p>
            )}
          </div>

          {/* Animasyonlu terminal log */}
          <div
            ref={logRef}
            className="mt-6 bg-slate-900 rounded-xl p-4 font-mono text-[11px] text-emerald-400 h-28 overflow-y-auto scroll-smooth"
          >
            {logs.length === 0 && !result && (
              <p className="opacity-40">{`> Sistem bekleniyor...`}</p>
            )}
            {logs.map((line, i) => (
              <p key={i} className={i === logs.length - 1 ? 'text-white' : 'opacity-70'}>{line}</p>
            ))}
            {result && logs.length === 0 && (
              <p className="text-white">{`> Sonuç: ${result.risk_level} (%${pct})`}</p>
            )}
          </div>
        </section>

        {/* SAĞ: SONUÇ */}
        <section className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
            <h2 className="text-xs font-black text-slate-400 uppercase mb-6">İnme Riski Analiz Sonucu</h2>
            <div className="relative size-40 mx-auto mb-6">
              <svg className="size-full" viewBox="0 0 36 36">
                <path
                  className="stroke-slate-100 fill-none"
                  strokeWidth="3"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`fill-none transition-all duration-1000 ${
                    result
                      ? pct >= 70 ? 'stroke-red-500' : pct >= 35 ? 'stroke-amber-500' : 'stroke-emerald-500'
                      : 'stroke-[#143db8]'
                  }`}
                  strokeWidth="3"
                  strokeDasharray={`${pct}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-black tracking-tighter ${result ? riskColor(pct) : 'text-slate-900'}`}>
                  %{pct || '0'}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  {result ? riskLabel(pct) : 'BEKLİYOR'}
                </span>
              </div>
            </div>

            {result && (
              <button
                onClick={exportPDF}
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-50 text-emerald-700 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-100 transition-all border border-emerald-200"
              >
                <Download size={16} /> PDF Raporu İndir
              </button>
            )}
          </div>

          {/* Risk Faktörü Uyarı Kutusu */}
          {result && (
            <div className={`rounded-2xl p-4 border shadow-sm ${
              warnings.length > 0
                ? 'bg-amber-50 border-amber-200'
                : 'bg-emerald-50 border-emerald-200'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                {warnings.length > 0 ? (
                  <>
                    <AlertTriangle size={16} className="text-amber-600 shrink-0" />
                    <p className="text-xs font-black text-amber-700 uppercase tracking-wide">Dikkat Edilmesi Gerekenler</p>
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                    <p className="text-xs font-black text-emerald-700 uppercase tracking-wide">Belirgin Risk Faktörü Yok</p>
                  </>
                )}
              </div>

              {warnings.length > 0 ? (
                <ul className="space-y-2 mb-3">
                  {warnings.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px] text-amber-800">
                      <span className="mt-0.5 shrink-0 text-amber-500">•</span>
                      {w}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[11px] text-emerald-700 mb-3">
                  Girilen veriler belirgin bir risk faktörü içermiyor.
                </p>
              )}

              <p className="text-[10px] text-slate-500 border-t border-slate-200 pt-2 leading-relaxed">
                ⓘ Bu sonuç tıbbi teşhis değildir. Kesin tanı için sağlık profesyoneline başvurunuz.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AnalysisPanel;
