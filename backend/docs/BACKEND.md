# StrokePredict AI — Backend Teknik Dokümantasyonu

Python + FastAPI ile yazılmış REST API. ML modeli çalıştırır, kullanıcı yönetimi yapar, tahminleri veritabanına kaydeder.

> **Base URL (lokal):** `http://127.0.0.1:8000`  
> **Swagger (tarayıcıdan test):** `http://127.0.0.1:8000/docs`  
> **ReDoc:** `http://127.0.0.1:8000/redoc`

---

## İçindekiler

1. [Teknolojiler](#1-teknolojiler)
2. [Klasör Yapısı](#2-klasör-yapısı)
3. [Sıfırdan Kurulum](#3-sıfırdan-kurulum)
4. [Ortam Değişkenleri (.env)](#4-ortam-değişkenleri-env)
5. [Veritabanı](#5-veritabanı)
6. [Kimlik Doğrulama (JWT)](#6-kimlik-doğrulama-jwt)
7. [API Referansı](#7-api-referansı)
8. [Request ve Response Modelleri](#8-request-ve-response-modelleri)
9. [ML Tahmin Motoru](#9-ml-tahmin-motoru)
10. [Hata Kodları](#10-hata-kodları)
11. [CORS](#11-cors)
12. [Postman ile Test](#12-postman-ile-test)

---

## 1. Teknolojiler

| Paket | Ne İşe Yarıyor |
|---|---|
| **FastAPI** | API framework — endpoint'leri tanımlarız |
| **Uvicorn** | FastAPI'yi çalıştıran sunucu |
| **SQLAlchemy** | Python ile veritabanı tabloları oluşturma ve sorgulama (ORM) |
| **psycopg2** | Python → PostgreSQL köprüsü |
| **Pydantic** | Gelen veriyi doğrular (tip kontrolü, zorunlu alan kontrolü) |
| **python-jose** | JWT token oluşturma ve doğrulama |
| **passlib + bcrypt** | Şifreleri hashleyerek saklar (düz metin saklanmaz) |
| **python-dotenv** | `.env` dosyasını okur |
| **XGBoost + joblib** | ML modeli yükleme ve tahmin |
| **pandas** | Veriyi modele vermeden önce DataFrame'e çevirir |

---

## 2. Klasör Yapısı

```
backend/
│
├── app.py              # Uygulamanın kalbi. CORS, router kayıtları, create_all
├── auth.py             # Şifre hash, JWT oluştur/doğrula, get_current_user
├── database.py         # DB yoksa oluştur, engine, SessionLocal, Base
├── models.py           # SQLAlchemy ORM tabloları (User, Prediction)
├── schemas.py          # Pydantic request/response şemaları
├── predict.py          # XGBoost_MBO.pkl yükle + tahmin fonksiyonu
│
├── routers/
│   ├── __init__.py
│   ├── auth_router.py  # POST /auth/register, POST /auth/login
│   ├── users.py        # GET /users/me
│   └── predictions.py  # POST /predictions, GET /predictions/me
│
├── XGBoost_MBO.pkl     # Eğitilmiş model — binary dosya
├── schema.sql          # Tabloları elle kurmak istersen bu SQL'i çalıştır
├── requirements.txt    # pip install -r requirements.txt
├── .env                # Şifreler burada (git'e girmez)
├── .env.example        # Şablon — ne yazacağını gösterir (git'e girer)
└── docs/
    ├── BACKEND.md      # Bu dosya
    └── StrokePrediction.postman_collection.json
```

---

## 3. Sıfırdan Kurulum

> **Gereksinim:** Python 3.10 veya üstü kurulu olmalı.
> Kontrol: `python --version`
> Kurulu değilse: https://python.org

> **Gereksinim:** PostgreSQL kurulu ve çalışıyor olmalı.
> Kontrol: `psql --version`
> Kurulu değilse: https://postgresql.org/download

---

### Adım 1 — Klasöre gir

```bash
cd backend
```

---

### Adım 2 — Sanal ortam oluştur

Sanal ortam (virtual environment), bu projenin paketlerini sistemin geri kalanından ayırır. Her Python projesinde yapılması önerilir.

```bash
python -m venv .venv
```

Bu komut `backend/.venv/` klasörünü oluşturur.

---

### Adım 3 — Sanal ortamı aktif et

Her yeni terminalde projeye döndüğünde bunu yapman gerekir.

**Windows:**
```bash
.venv\Scripts\activate
```

**macOS / Linux:**
```bash
source .venv/bin/activate
```

Başarılı olursa terminal satırının başına `(.venv)` gelir:
```
(.venv) C:\...\backend>
```

---

### Adım 4 — Paketleri yükle

```bash
pip install -r requirements.txt
```

Bu komut `requirements.txt` içindeki tüm kütüphaneleri yükler. İnternet bağlantısı gerekir, birkaç dakika sürebilir.

---

### Adım 5 — .env dosyasını oluştur

`.env.example` şablonunu kopyala:

```bash
# Windows
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

Sonra `.env` dosyasını bir metin editörüyle aç ve kendi değerlerini yaz:

```env
DATABASE_URL=postgresql://postgres:SENIN_SIFREN@localhost:5432/stroke_db
SECRET_KEY=buraya-uzun-rastgele-bir-sifre-yaz
```

**`DATABASE_URL` nasıl doldurulur?**
- `postgres` → PostgreSQL kullanıcı adın (kurulumda değiştirmediysen bu kalır)
- `SENIN_SIFREN` → PostgreSQL kurulumunda girdiğin şifre
- `localhost:5432` → Lokal kurulumda değişmez
- `stroke_db` → Veritabanı adı (uygulama yoksa kendisi oluşturuyor)

**`SECRET_KEY` nasıl üretilir?**
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```
Çıktıyı kopyala, SECRET_KEY'e yapıştır.

---

### Adım 6 — Sunucuyu başlat

```bash
python -m uvicorn app:app --reload
```

`--reload` parametresi kod değişikliklerinde sunucuyu otomatik yeniden başlatır. Geliştirme ortamı için kullan.

**Başarılı çıktı:**
```
INFO:     [DB] 'stroke_db' veritabanı oluşturuldu.   ← ilk çalıştırmada görürsün
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

**Swagger'ı aç:** `http://127.0.0.1:8000/docs`
Tüm endpoint'leri burada görsel olarak test edebilirsin.

---

### Sık Sorulan: Sanal ortam her açılışta aktif edilmeli mi?

**Evet.** Terminal kapanınca sanal ortam da kapanır. Yeni terminalde:

```bash
cd backend
.venv\Scripts\activate     # Windows
# veya
source .venv/bin/activate  # macOS/Linux
python -m uvicorn app:app --reload
```

---

## 4. Ortam Değişkenleri (.env)

```env
DATABASE_URL=postgresql://postgres:1234@localhost:5432/stroke_db
SECRET_KEY=9f8c2d1a7b6e4f0c3a9e8d7b2c1f6e5a4d3c2b1a9f0e8d7c6b5a4e3d2c1b0a9f
```

| Değişken | Açıklama |
|---|---|
| `DATABASE_URL` | PostgreSQL bağlantı stringi. `kullanıcı:şifre@host:port/dbname` formatında |
| `SECRET_KEY` | JWT imzalamak için kullanılır. Sızdırılırsa token'lar taklit edilebilir — güçlü tut |

> ⚠️ `.env` dosyası `.gitignore`'dadır. Commit'e **girmez**. `.env.example` commit'e girer.

---

## 5. Veritabanı

### Otomatik kurulum

`database.py` çalışınca şunlar olur:

1. PostgreSQL'deki `postgres` (default) veritabanına bağlanır.
2. `stroke_db` var mı bakar.
3. Yoksa `CREATE DATABASE stroke_db` çalıştırır.
4. SQLAlchemy engine bağlanır.
5. `app.py` içindeki `create_all()` tabloları oluşturur.

Yani hiçbir şey yapman gerekmez — sunucuyu başlattığında her şey hazır olur.

---

### Tablo: `users`

| Kolon | Tip | Açıklama |
|---|---|---|
| `id` | SERIAL (otomatik) | Birincil anahtar |
| `email` | VARCHAR(255) | Unique, boş olamaz |
| `full_name` | VARCHAR(255) | Ad soyad |
| `hashed_password` | VARCHAR(255) | bcrypt ile hashlenmiş şifre |
| `created_at` | TIMESTAMP | Kayıt tarihi, otomatik doldurulur |

---

### Tablo: `predictions`

| Kolon | Tip | Açıklama |
|---|---|---|
| `id` | SERIAL (otomatik) | Birincil anahtar |
| `user_id` | INTEGER | `users.id`'ye foreign key |
| `input_data` | JSONB | Forma girilen 10 alan |
| `result_data` | JSONB | Modelin verdiği sonuç |
| `created_at` | TIMESTAMP | Analiz tarihi, otomatik doldurulur |

**Not:** `user_id` foreign key'dir. Bir kullanıcı silinirse o kullanıcıya ait tüm tahminler de silinir (`ON DELETE CASCADE`).

---

### İlişki

```
users (1) ──── predictions (N)
Bir kullanıcının birden fazla tahmini olabilir.
```

---

### Elle kurulum (opsiyonel)

Tabloları manuel oluşturmak istersen:

```bash
psql -U postgres -c "CREATE DATABASE stroke_db;"
psql -U postgres -d stroke_db -f schema.sql
```

---

## 6. Kimlik Doğrulama (JWT)

### Genel akış

```
1. Kullanıcı kayıt olur    → şifre bcrypt ile hashlenip DB'ye yazılır
2. Kullanıcı giriş yapar   → hash doğrulanır → JWT token oluşturulur → döndürülür
3. Korumalı endpoint       → Authorization: Bearer <token> header'ı beklenir
4. get_current_user()      → token decode edilir → user_id çıkarılır → DB'den kullanıcı çekilir
```

### Token yapısı

```json
{
  "sub": "1",
  "exp": 1714086400
}
```

- `sub`: Kullanıcı ID'si (string olarak)
- `exp`: Geçerlilik süresi — **24 saat**

### Korumalı endpoint'lere istek atmak

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token'ı login yanıtından alırsın. Frontend bunu `localStorage`'de saklar ve her istekte otomatik ekler.

---

## 7. API Referansı

---

### GET `/`
Sağlık kontrolü. Auth gerektirmez.

**Response 200:**
```json
{ "message": "Stroke Prediction API is running" }
```

---

### POST `/auth/register`
Yeni kullanıcı kaydı. Auth gerektirmez.

**Request Body:**
```json
{
  "email": "kullanici@ornek.com",
  "password": "sifre123",
  "full_name": "Ahmet Yılmaz"
}
```

| Alan | Tip | Kural |
|---|---|---|
| `email` | string | Geçerli e-posta formatı, daha önce kayıtlı olmamalı |
| `password` | string | Düz metin — DB'ye hashli yazılır |
| `full_name` | string | Ad soyad |

**Response 201:**
```json
{
  "id": 1,
  "email": "kullanici@ornek.com",
  "full_name": "Ahmet Yılmaz",
  "created_at": "2024-04-22T20:00:00.000000"
}
```

**Hata Durumları:**

| HTTP | Mesaj |
|---|---|
| 400 | `"Bu e-posta zaten kayıtlı"` |
| 422 | Geçersiz e-posta, eksik alan vs. |

---

### POST `/auth/login`
Giriş yapar, JWT token döner. Auth gerektirmez.

**Request Body:**
```json
{
  "email": "kullanici@ornek.com",
  "password": "sifre123"
}
```

**Response 200:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

`access_token`'ı sakla — korumalı endpoint'lere atarken header'a koyacaksın.

**Hata Durumları:**

| HTTP | Mesaj |
|---|---|
| 401 | `"E-posta veya şifre hatalı"` |

---

### GET `/users/me`
Giriş yapmış kullanıcının bilgisini döner. **Auth gerektirir.**

**Header:**
```
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "id": 1,
  "email": "kullanici@ornek.com",
  "full_name": "Ahmet Yılmaz",
  "created_at": "2024-04-22T20:00:00.000000"
}
```

**Hata:** Token eksik/geçersiz → 401

---

### POST `/predictions`
Stroke risk tahmini yapar ve sonucu kullanıcıyla eşleyerek DB'ye kaydeder. **Auth gerektirir.**

**Header:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
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

**Alan Değerleri:**

| Alan | Kabul Edilen Değerler |
|---|---|
| `gender` | `Male`, `Female`, `Other` |
| `age` | Pozitif sayı — ör. `45`, `67.5` |
| `hypertension` | `0` (yok), `1` (var) |
| `heart_disease` | `0` (yok), `1` (var) |
| `ever_married` | `Yes`, `No` |
| `work_type` | `Private`, `Self-employed`, `Govt_job`, `children`, `Never_worked` |
| `Residence_type` | `Urban`, `Rural` — **R büyük harf** |
| `avg_glucose_level` | Pozitif ondalık — ör. `106.0` |
| `bmi` | Pozitif ondalık — ör. `28.5` |
| `smoking_status` | `never smoked`, `formerly smoked`, `smokes`, `Unknown` |

> ⚠️ `Residence_type` büyük **R** ile yazılır. Modelin eğitim verisi bu isimde.

**Response 201:**
```json
{
  "id": 15,
  "user_id": 1,
  "input_data": {
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
  },
  "result_data": {
    "probability": 0.7090753316879272,
    "percentage": 70.91,
    "threshold_used": 0.65,
    "prediction": 1,
    "risk_level": "Yüksek Risk"
  },
  "created_at": "2024-04-22T21:30:00.000000"
}
```

**`result_data` alanları:**

| Alan | Açıklama |
|---|---|
| `probability` | Modelin ham çıktısı — 0 ile 1 arası |
| `percentage` | `probability × 100`, 2 ondalık |
| `threshold_used` | Karar eşiği (sabit: `0.65`) |
| `prediction` | `0` = Düşük Risk, `1` = Yüksek Risk |
| `risk_level` | Türkçe etiket — `"Yüksek Risk"` veya `"Düşük Risk"` |

**Risk etiket eşikleri (frontend/chatbot için):**

| Yüzde | Gösterilen Etiket |
|---|---|
| 0 – 34 | Düşük Risk |
| 35 – 69 | Orta Risk |
| 70 – 100 | Yüksek Risk |

**Hata Durumları:**

| HTTP | Açıklama |
|---|---|
| 401 | Token eksik veya geçersiz |
| 422 | Eksik veya hatalı alan |

---

### GET `/predictions/me`
Giriş yapmış kullanıcının tüm tahminlerini en yeniden eskiye sıralar. **Auth gerektirir.**

**Header:**
```
Authorization: Bearer <token>
```

**Response 200:**
```json
[
  {
    "id": 15,
    "user_id": 1,
    "input_data": { "...": "..." },
    "result_data": {
      "probability": 0.709,
      "percentage": 70.91,
      "threshold_used": 0.65,
      "prediction": 1,
      "risk_level": "Yüksek Risk"
    },
    "created_at": "2024-04-22T21:30:00.000000"
  }
]
```

Kayıt yoksa boş liste döner: `[]`

---

## 8. Request ve Response Modelleri

Tüm modeller `schemas.py` içinde tanımlı.

### UserCreate (Register isteği)
```python
email: EmailStr    # geçerli e-posta
password: str      # düz metin, DB'de hashli
full_name: str
```

### UserLogin (Login isteği)
```python
email: EmailStr
password: str
```

### Token (Login yanıtı)
```python
access_token: str  # JWT string
token_type: str    # her zaman "bearer"
```

### UserResponse (Kullanıcı yanıtı)
```python
id: int
email: str
full_name: str
created_at: datetime
```

### StrokeInput (Analiz isteği)
```python
gender: str
age: float
hypertension: int          # 0 veya 1
heart_disease: int         # 0 veya 1
ever_married: str
work_type: str
Residence_type: str        # Büyük R
avg_glucose_level: float
bmi: float
smoking_status: str
```

### PredictionResponse (Analiz yanıtı)
```python
id: int
user_id: int
input_data: dict           # StrokeInput'un dict hali
result_data: dict          # predict_stroke_risk() çıktısı
created_at: datetime
```

---

## 9. ML Tahmin Motoru

### Model

- **Dosya:** `XGBoost_MBO.pkl`
- **Algoritma:** XGBoost
- **Optimizasyon:** MBO (Migrating Birds Optimization) ile hiperparametre ayarı
- **Karar eşiği:** `0.65` (tuning sonucu belirlendi)

### `predict_stroke_risk(input_data)` — `predict.py`

```python
def predict_stroke_risk(input_data: dict) -> dict:
    df = pd.DataFrame([input_data])          # tek satırlık DataFrame yap
    prob = model.predict_proba(df)[0][1]     # stroke sınıfı olasılığı (0-1)
    prediction = 1 if prob >= 0.65 else 0   # eşiğe göre karar
    risk_level = "Yüksek Risk" if prediction == 1 else "Düşük Risk"
    return {
        "probability": float(prob),
        "percentage": float(round(prob * 100, 2)),
        "threshold_used": 0.65,
        "prediction": int(prediction),
        "risk_level": risk_level,
    }
```

### Model Seçim Süreci

| Aşama | Yapılan |
|---|---|
| Baseline | 15 algoritma eğitildi — accuracy yüksek ama recall düşük (sınıf dengesizliği) |
| Dengesizlik | SMOTE + class-weight ile minority sınıf güçlendirildi |
| MBO Optimizasyonu | 5 model üzerinde MBO ile hiperparametre araması yapıldı |
| Sonuç | XGBoost en dengeli precision-recall dengesiyle seçildi |

---

## 10. Hata Kodları

| HTTP | Anlamı | Örnek Sebep |
|---|---|---|
| 200 | OK | Başarılı GET |
| 201 | Created | Başarılı POST (kayıt oluştu) |
| 400 | Bad Request | E-posta zaten kayıtlı |
| 401 | Unauthorized | Token yok, süresi dolmuş veya hatalı |
| 422 | Validation Error | Eksik alan, yanlış tip |
| 500 | Server Error | Model yüklenemedi, DB bağlantı sorunu |

### 422 Örnek Yanıt

```json
{
  "detail": [
    {
      "type": "missing",
      "loc": ["body", "avg_glucose_level"],
      "msg": "Field required"
    }
  ]
}
```

---

## 11. CORS

Frontend ile aynı makinede çalışırken izin verilen adresler (`app.py`):

```python
allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"]
```

Farklı bir adreste yayınlarsan bu listeye ekle.

---

## 12. Postman ile Test

### Koleksiyonu import et

1. Postman'i aç
2. `File → Import`
3. `docs/StrokePrediction.postman_collection.json` dosyasını seç

### Koleksiyon değişkenleri

| Değişken | Varsayılan | Ne Zaman Değişir |
|---|---|---|
| `base_url` | `http://127.0.0.1:8000` | Backend farklı adreste çalışıyorsa değiştir |
| `token` | (boş) | Login isteği atıldığında **otomatik doldurulur** |

### Test sırası

1. **Register** → kullanıcı oluştur
2. **Login** → token `{{token}}` değişkenine otomatik yazılır
3. **Me** → kullanıcı bilgisi geldi mi kontrol et
4. **Create Prediction** → analiz yap, DB'ye yazıldı mı gör
5. **My Predictions** → geçmiş listeleniyor mu kontrol et
