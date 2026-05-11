import jsPDF from 'jspdf';

// ── jsPDF helvetica Türkçe desteklemez → ASCII dönüşüm ──────────────────────
export const tr = (str) =>
  String(str ?? '')
    .replace(/ş/g, 's').replace(/Ş/g, 'S')
    .replace(/ı/g, 'i').replace(/İ/g, 'I')
    .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
    .replace(/ö/g, 'o').replace(/Ö/g, 'O')
    .replace(/ü/g, 'u').replace(/Ü/g, 'U')
    .replace(/ç/g, 'c').replace(/Ç/g, 'C')
    .replace(/â/g, 'a').replace(/î/g, 'i').replace(/û/g, 'u');

// ── Risk faktörü uyarıları ───────────────────────────────────────────────────
export const getRiskWarnings = (inp) => {
  const warnings = [];
  const age     = parseFloat(inp.age);
  const glucose = parseFloat(inp.avg_glucose_level);
  const bmi     = parseFloat(inp.bmi);

  if (parseInt(inp.hypertension)  === 1) warnings.push('Hipertansiyonunuz var — önemli bir inme risk faktörüdür');
  if (parseInt(inp.heart_disease) === 1) warnings.push('Kalp hastalığı önemli bir inme risk faktörüdür');
  if (inp.smoking_status === 'smokes')         warnings.push('Aktif sigara kullanımı inme riskini artırır');
  if (inp.smoking_status === 'formerly smoked') warnings.push('Geçmiş sigara kullanımı risk faktörü olarak değerlendirilir');
  if (!isNaN(age) && age >= 65) warnings.push('65 yaş üzeri yüksek riskli grup — düzenli doktor takibi önerilir');
  else if (!isNaN(age) && age >= 50) warnings.push('50 yaş üzeri düzenli kardiyoloji kontrolü önerilir');
  if (!isNaN(glucose) && glucose >= 200) warnings.push('Glikoz değeriniz yüksek — diyabet riski kontrol edilmeli');
  if (!isNaN(bmi)     && bmi     >= 30)  warnings.push('BMI değeriniz obezite sınırında — kardiyovasküler riski artırır');

  return warnings;
};

// ── Klinik yorum metni ───────────────────────────────────────────────────────
export const getInterpretation = (pct, warnings) => {
  const wCount = warnings.length;

  if (pct >= 70) {
    return tr(
      `Bu analiz sonucu YUKSEK RISK grubuna isaret etmektedir (%${pct}). ` +
      (wCount > 0 ? `${wCount} onemli risk faktoru tespit edilmistir. ` : '') +
      `En kisa surede bir saglik kurulusuna basvurarak kardiyoloji ve noroloji ` +
      `degerlendirmesi yapilmasi onemle onerilmektedir. ` +
      `Sigara kullaniminin birakilmasi, kilo kontrolu ve duzenli egzersiz riski ` +
      `onemli olcude azaltabilir.`
    );
  }
  if (pct >= 35) {
    return tr(
      `Bu analiz sonucu ORTA RISK grubuna isaret etmektedir (%${pct}). ` +
      (wCount > 0 ? `${wCount} risk faktoru dikkat gerektirmektedir. ` : '') +
      `Mevcut risk faktörlerinin kontrol altına alinmasi onerilmektedir. ` +
      `Duzenli kan basinci ve glikoz takibi, saglikli beslenme ve fiziksel ` +
      `aktivite riski azaltmada etkili olacaktir. Yilda en az bir kez doktor kontrolu onerilir.`
    );
  }
  return tr(
    `Bu analiz sonucu DUSUK RISK grubuna isaret etmektedir (%${pct}). ` +
    (wCount > 0
      ? `Ancak ${wCount} risk faktoru tespit edilmistir; bu faktorlerin takibi onemlidir. `
      : 'Belirgin risk faktoru tespit edilmemistir. ') +
    `Yillik saglik kontrollerine devam edilmesi ve saglikli yasam aliskanliklari ` +
    `surdurmesi onerilmektedir.`
  );
};

// ── Alan etiketleri ──────────────────────────────────────────────────────────
const smokingLabel = (v) => ({ 'never smoked': 'Hic icmedi', 'formerly smoked': 'Eski icici', 'smokes': 'Iciyor', 'Unknown': 'Bilinmiyor' }[v] ?? v);
const workLabel    = (v) => ({ 'Private': 'Ozel sektor', 'Self-employed': 'Serbest meslek', 'Govt_job': 'Kamu', 'children': 'Cocuk', 'Never_worked': 'Hic calismadi' }[v] ?? v);
const resLabel     = (v) => ({ 'Urban': 'Sehir', 'Rural': 'Kirsal' }[v] ?? v);
const genderLabel  = (v) => ({ 'Male': 'Erkek', 'Female': 'Kadin', 'Other': 'Diger' }[v] ?? v);

// ── Ana PDF üretici ──────────────────────────────────────────────────────────
export const generateStrokeReport = (resultData, inputData) => {
  if (!resultData || !inputData) return;

  const pct      = Math.round((resultData.percentage ?? 0) * 10) / 10;
  const warnings = getRiskWarnings(inputData);
  const interp   = getInterpretation(pct, warnings);
  const level    = pct >= 70 ? 'Yuksek Risk' : pct >= 35 ? 'Orta Risk' : 'Dusuk Risk';

  const riskR = pct >= 70 ? 220 : pct >= 35 ? 180 : 22;
  const riskG = pct >= 70 ? 38  : pct >= 35 ? 100 : 163;
  const riskB = pct >= 70 ? 38  : pct >= 35 ? 6   : 74;

  const pdf = new jsPDF('p', 'mm', 'a4');
  let y = 0; // imlec takibi

  // ── BAŞLIK BANDI ──────────────────────────────────────────────────────────
  pdf.setFillColor(20, 61, 184);
  pdf.rect(0, 0, 210, 18, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13);
  pdf.setTextColor(255, 255, 255);
  pdf.text('StrokePredict AI  |  Inme Riski Analiz Raporu', 15, 12);
  y = 26;

  // ── TARİH ────────────────────────────────────────────────────────────────
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(120, 120, 120);
  pdf.text(`Olusturulma tarihi: ${new Date().toLocaleDateString('tr-TR')}`, 15, y);
  y += 8;

  // ── RİSK SKORU + MODEL BİLGİSİ ───────────────────────────────────────────
  pdf.setFillColor(riskR, riskG, riskB);
  pdf.roundedRect(15, y, 85, 26, 4, 4, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(24);
  pdf.setTextColor(255, 255, 255);
  pdf.text(`%${pct}`, 20, y + 14);
  pdf.setFontSize(11);
  pdf.text(level, 20, y + 22);

  pdf.setFillColor(240, 244, 255);
  pdf.roundedRect(108, y, 87, 26, 4, 4, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(20, 61, 184);
  pdf.text('MODEL BILGISI', 113, y + 7);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(60, 60, 60);
  pdf.text('Algoritma: XGBoost + MBO (Migrating Birds)', 113, y + 14);
  pdf.text('Esik degeri: 0.65  |  Versiyon: 1.0', 113, y + 20);
  y += 32;

  // ── KLİNİK YORUM ─────────────────────────────────────────────────────────
  pdf.setDrawColor(220, 220, 220);
  pdf.setLineWidth(0.3);
  pdf.line(15, y, 195, y);
  y += 6;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(30, 30, 30);
  pdf.text('Klinik Yorum', 15, y);
  y += 6;

  // Yorum kutucuğu — arka plan renkli
  const bgR = pct >= 70 ? 255 : pct >= 35 ? 255 : 240;
  const bgG = pct >= 70 ? 245 : pct >= 35 ? 251 : 255;
  const bgB = pct >= 70 ? 245 : pct >= 35 ? 235 : 245;
  const interpLines = pdf.splitTextToSize(interp, 170);
  const boxH = 8 + interpLines.length * 5.5;
  pdf.setFillColor(bgR, bgG, bgB);
  pdf.roundedRect(15, y, 180, boxH, 3, 3, 'F');
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9.5);
  pdf.setTextColor(50, 50, 50);
  pdf.text(interpLines, 20, y + 7);
  y += boxH + 8;

  // ── GİRİLEN VERİLER ──────────────────────────────────────────────────────
  pdf.setDrawColor(220, 220, 220);
  pdf.line(15, y, 195, y);
  y += 6;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(30, 30, 30);
  pdf.text('Girilen Hasta Verileri', 15, y);
  y += 6;

  const fields = [
    ['Yas',            String(inputData.age ?? '—')],
    ['Cinsiyet',       genderLabel(inputData.gender)],
    ['BMI',            String(inputData.bmi ?? '—')],
    ['Glikoz',         inputData.avg_glucose_level ? `${inputData.avg_glucose_level} mg/dL` : '—'],
    ['Hipertansiyon',  parseInt(inputData.hypertension)  === 1 ? 'Var' : 'Yok'],
    ['Kalp Hastaligi', parseInt(inputData.heart_disease) === 1 ? 'Var' : 'Yok'],
    ['Sigara',         smokingLabel(inputData.smoking_status)],
    ['Calisma Turu',   workLabel(inputData.work_type)],
    ['Bolge',          resLabel(inputData.Residence_type)],
    ['Medeni Durum',   inputData.ever_married === 'Yes' ? 'Evli' : 'Bekar'],
  ];

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  fields.forEach(([key, val], idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x   = col === 0 ? 15 : 108;
    const fy  = y + row * 10;
    if (row % 2 === 0) {
      pdf.setFillColor(248, 250, 255);
      pdf.rect(col === 0 ? 15 : 108, fy - 5, 88, 9, 'F');
    }
    pdf.setTextColor(100, 100, 100);
    pdf.text(`${key}:`, x + 2, fy);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(30, 30, 30);
    pdf.text(String(val), x + 38, fy);
    pdf.setFont('helvetica', 'normal');
  });
  y += Math.ceil(fields.length / 2) * 10 + 6;

  // ── UYARI FAKTÖRLERİ ─────────────────────────────────────────────────────
  pdf.setDrawColor(220, 220, 220);
  pdf.line(15, y, 195, y);
  y += 6;

  if (warnings.length > 0) {
    const boxHeight = 10 + warnings.length * 9;
    pdf.setFillColor(255, 248, 235);
    pdf.roundedRect(15, y, 180, boxHeight, 3, 3, 'F');
    pdf.setDrawColor(230, 160, 30);
    pdf.setLineWidth(0.4);
    pdf.roundedRect(15, y, 180, boxHeight, 3, 3, 'S');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(160, 90, 0);
    pdf.text('! Dikkat Edilmesi Gereken Risk Faktorleri', 20, y + 8);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    warnings.forEach((w, i) => {
      pdf.setTextColor(120, 60, 0);
      pdf.text(`• ${tr(w)}`, 22, y + 16 + i * 9);
    });
    y += boxHeight + 6;
  } else {
    pdf.setFillColor(235, 255, 245);
    pdf.roundedRect(15, y, 180, 14, 3, 3, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(20, 130, 80);
    pdf.text('Belirgin risk faktoru tespit edilmedi.', 20, y + 9);
    y += 20;
  }

  // ── FOOTER ───────────────────────────────────────────────────────────────
  pdf.setFillColor(245, 247, 252);
  pdf.rect(0, 272, 210, 25, 'F');
  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(8);
  pdf.setTextColor(140, 140, 140);
  pdf.text('Bu rapor StrokePredict AI tarafindan otomatik olusturulmustur.', 15, 280);
  pdf.text('Tibbi teshis yerine gecmez. Kesin tani icin saglik profesyoneline basvurunuz.', 15, 286);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(20, 61, 184);
  pdf.text('StrokePredict AI', 162, 286);

  pdf.save('Inme_Riski_Raporu.pdf');
};
