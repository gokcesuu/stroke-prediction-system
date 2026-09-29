# 🧠 StrokePredict AI — İnme Risk Tahmin Sistemi

Hasta verilerinden **inme (stroke) riskini** tahmin eden, makine öğrenmesi destekli full-stack bir web uygulaması.
Model, **MBO (Migrating Birds Optimization)** ile hiperparametreleri optimize edilmiş bir **XGBoost** sınıflandırıcısıdır.
Uygulama; kullanıcı yönetimi, tahmin geçmişi, PDF rapor ve yapay zekâ destekli bir sağlık asistanı içerir.

> ⚠️ **Uyarı:** Bu sistem akademik amaçlıdır ve **tıbbi teşhis koymaz**. Sonuçlar bir sağlık profesyonelinin değerlendirmesinin yerine geçmez.

---

## ✨ Özellikler

- 🔐 **Kimlik doğrulama** — JWT tabanlı kayıt / giriş, bcrypt ile hashlenmiş şifreler
- 📊 **Risk analizi** — 10 klinik parametre ile anlık inme risk olasılığı
- 🗂️ **Hasta geçmişi** — Kullanıcıya ait tüm analizlerin listelenmesi ve klinik yorum
- 📄 **PDF rapor** — Analiz sonuçlarının indirilebilir PDF çıktısı
- 🤖 **AI sağlık asistanı** — GPT-4.1-mini tabanlı chatbot; acil belirti tespiti (112 yönlendirmesi) ve konu kapsamı kontrolü
- 🌗 **Açık / koyu tema**, bildirim (toast) sistemi, duyarlı (responsive) arayüz

---

## 🛠️ Teknolojiler

| Katman | Teknoloji |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS 4, React Router, Recharts, jsPDF, lucide-react |
| **Backend** | Python, FastAPI, Uvicorn, SQLAlchemy, Pydantic |
| **Veritabanı** | PostgreSQL |
| **Kimlik doğrulama** | JWT (python-jose), passlib + bcrypt |
| **Makine öğrenmesi** | XGBoost, scikit-learn, imbalanced-learn (SMOTE), pandas, joblib |
| **Yapay zekâ** | OpenAI API (GPT-4.1-mini) |

---

## 🏗️ Mimari

```
┌──────────────────┐    HTTP / JSON    ┌──────────────────────┐        ┌──────────────┐
│  React (Vite)    │ ────────────────▶ │  FastAPI             │ ─────▶ │  PostgreSQL  │
│  localhost:5173  │ ◀──── JWT ─────── │  127.0.0.1:8000      │        │  stroke_db   │
└──────────────────┘                   │                      │        └──────────────┘
                                       │  ├─ XGBoost_MBO.pkl  │
                                       │  └─ OpenAI API ──────┼──▶ Chatbot
                                       └──────────────────────┘
```

---

## 📁 Proje Yapısı

```
stroke-prediction-system/
├── backend/
│   ├── app.py              # FastAPI uygulaması, CORS, router kayıtları
│   ├── auth.py             # Şifre hash, JWT oluşturma/doğrulama
│   ├── database.py         # DB bağlantısı (yoksa stroke_db'yi otomatik oluşturur)
│   ├── models.py           # SQLAlchemy tabloları (User, Prediction)
│   ├── schemas.py          # Pydantic şemaları
│   ├── predict.py          # Model yükleme + tahmin fonksiyonu
│   ├── XGBoost_MBO.pkl     # Eğitilmiş model
│   ├── schema.sql          # Manuel tablo kurulumu (opsiyonel)
│   ├── requirements.txt
│   ├── routers/            # auth, users, predictions, chatbot
│   └── docs/               # Backend dokümantasyonu + Postman koleksiyonu
│
└── frontend/
    ├── src/
    │   ├── pages/          # Login, Register, AnalysisPanel, PatientHistory, ChatPage, ...
    │   ├── components/     # Navbar
    │   ├── context/        # Auth, Theme, Toast context'leri
    │   ├── services/api.js # Backend istemcisi
    │   └── utils/pdfReport.js
    └── package.json
```

---

## 🚀 Kurulum

### Gereksinimler

- Python **3.10+**
- Node.js **18+**
- PostgreSQL (çalışır durumda)
- OpenAI API anahtarı (chatbot için)

### 1. Depoyu klonla

```bash
git clone https://github.com/gokcesuu/stroke-prediction-system.git
cd stroke-prediction-system
```

### 2. Backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
```

`.env.example` dosyasını `.env` olarak kopyalayıp doldur:

```env
DATABASE_URL=postgresql://postgres:SIFRENIZ@localhost:5432/stroke_db
SECRET_KEY=uzun-ve-rastgele-bir-anahtar
OPENAI_API_KEY=sk-...
```

> `SECRET_KEY` üretmek için: `python -c "import secrets; print(secrets.token_hex(32))"`

Sunucuyu başlat:

```bash
python -m uvicorn app:app --reload
```

- API: `http://127.0.0.1:8000`
- Swagger: `http://127.0.0.1:8000/docs`

> Veritabanı ve tablolar ilk çalıştırmada otomatik oluşturulur.

### 3. Frontend

Yeni bir terminalde:

```bash
cd frontend
npm install
npm run dev
```

Uygulama: `http://localhost:5173`

---

## 🔌 API Özeti

| Metot | Endpoint | Auth | Açıklama |
|---|---|:---:|---|
| `GET` | `/` | – | Sağlık kontrolü |
| `POST` | `/auth/register` | – | Yeni kullanıcı kaydı |
| `POST` | `/auth/login` | – | Giriş, JWT token döner |
| `GET` | `/users/me` | ✅ | Giriş yapmış kullanıcı bilgisi |
| `POST` | `/predictions` | ✅ | Risk tahmini yapar ve kaydeder |
| `GET` | `/predictions/me` | ✅ | Kullanıcının tahmin geçmişi |
| `POST` | `/chatbot` | – | AI sağlık asistanı |

Korumalı endpoint'ler `Authorization: Bearer <token>` header'ı bekler.

### Örnek tahmin isteği

```json
{
  "gender": "Male",
  "age": 67,
  "hypertension": 1,
  "heart_disease": 1,
  "ever_married": "Yes",
  "work_type": "Private",
  "Residence_type": "Urban",
  "avg_glucose_level": 228.69,
  "bmi": 36.6,
  "smoking_status": "formerly smoked"
}
```

### Örnek yanıt (`result_data`)

```json
{
  "probability": 0.709,
  "percentage": 70.91,
  "threshold_used": 0.65,
  "prediction": 1,
  "risk_level": "Yüksek Risk"
}
```

Detaylı API ve veritabanı dokümantasyonu: [`backend/docs/BACKEND.md`](backend/docs/BACKEND.md)
Postman koleksiyonu: [`backend/docs/StrokePrediction.postman_collection.json`](backend/docs/StrokePrediction.postman_collection.json)

---

## 🤖 Makine Öğrenmesi Modeli

| Aşama | Açıklama |
|---|---|
| **Veri seti** | Kaggle — *Stroke Prediction Dataset* (`healthcare-dataset-stroke-data.csv`) |
| **Baseline** | 15 farklı algoritma eğitildi; accuracy yüksek fakat sınıf dengesizliği nedeniyle recall düşük |
| **Dengesizlik** | SMOTE + class-weight ile azınlık sınıfı güçlendirildi |
| **Optimizasyon** | 5 aday model üzerinde **MBO** ile hiperparametre araması |
| **Sonuç** | En dengeli precision–recall değerini veren **XGBoost** seçildi |
| **Karar eşiği** | `0.65` |

**Girdi değişkenleri:** cinsiyet, yaş, hipertansiyon, kalp hastalığı, evlilik durumu, çalışma tipi, yerleşim tipi, ortalama glikoz seviyesi, BMI, sigara kullanımı.

**Risk seviyeleri (arayüz):**

| Olasılık | Seviye |
|---|---|
| %0 – %34 | 🟢 Düşük Risk |
| %35 – %69 | 🟡 Orta Risk |
| %70 – %100 | 🔴 Yüksek Risk |

---

## 📜 Lisans

Bu proje akademik bir çalışma kapsamında geliştirilmiştir.
