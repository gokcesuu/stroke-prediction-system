import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Sayfalarımızı içe aktarıyoruz
import Landing from './pages/Landing';
import AnalysisPanel from './pages/AnalysisPanel';
import PatientHistory from './pages/PatientHistory';
import Documentation from './pages/Documentation';
import ResearchLab from './pages/ResearchLab';
import Login from './pages/Login'; // Yeni ekledik
import Register from './pages/Register'; // Yeni ekledik

// CSS dosyamız
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 1. Ana Vitrin Sayfası */}
          <Route path="/" element={<Landing />} />

          {/* Yeni Eklediğimiz Giriş ve Kayıt Sayfaları */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 2. MBO Analiz Paneli */}
          <Route path="/analysis" element={<AnalysisPanel />} />

          {/* 3. Hasta Geçmişi */}
          <Route path="/history" element={<PatientHistory />} />

          {/* 4. Akademik Dokümantasyon */}
          <Route path="/docs" element={<Documentation />} />

          {/* 5. Araştırma Laboratuvarı */}
          <Route path="/lab" element={<ResearchLab />} />

          {/* Joker: Eğer yanlış bir adrese gidilirse Ana Sayfa'ya dönsün */}
          <Route path="*" element={<Landing />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;