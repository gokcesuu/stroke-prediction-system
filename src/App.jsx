import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Sayfalarımızı içe aktarıyoruz
import Landing from './pages/Landing';
import AnalysisPanel from './pages/AnalysisPanel';
import PatientHistory from './pages/PatientHistory';
import Documentation from './pages/Documentation';
import ResearchLab from './pages/ResearchLab'; // Yeni sayfamızı buraya ekledik!

// CSS dosyamız
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 1. Ana Vitrin Sayfası */}
          <Route path="/" element={<Landing />} />

          {/* 2. MBO Analiz Paneli (Veri Girişi & PDF Raporu) */}
          <Route path="/analysis" element={<AnalysisPanel />} />

          {/* 3. Hasta Geçmişi (Tablolu Liste) */}
          <Route path="/history" element={<PatientHistory />} />

          {/* 4. Akademik Dokümantasyon (MBO Algoritması Detayı) */}
          <Route path="/docs" element={<Documentation />} />

          {/* 5. Araştırma Laboratuvarı (Simülasyon & HUD Ekranı) */}
          <Route path="/lab" element={<ResearchLab />} />
          
          {/* Joker: Eğer yanlış bir adrese gidilirse Ana Sayfa'ya dönsün */}
          <Route path="*" element={<Landing />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;