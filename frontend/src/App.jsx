import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Sayfalarımızı içe aktarıyoruz
import Landing from './pages/Landing';
import AnalysisPanel from './pages/AnalysisPanel';
import PatientHistory from './pages/PatientHistory';
import Documentation from './pages/Documentation';
import Login from './pages/Login';
import Register from './pages/Register';

// Navbar bileşenini içe aktarıyoruz
import Navbar from './components/Navbar';

// CSS dosyamız
import './index.css';

// Navbar'ın hangi sayfalarda görüneceğini kontrol eden yardımcı bileşen
const AppContent = () => {
  const location = useLocation();
  
  // Login ve Register sayfalarında Navbar'ı gizle
  const showNavbar = !['/', '/register'].includes(location.pathname);

  return (
    <div className="App min-h-screen bg-[#041329]">
      {showNavbar && <Navbar />}
      <Routes>
        {/* Giriş ve Kayıt (Navbar yok) */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Uygulama içi sayfalar (Navbar var) */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/analysis" element={<AnalysisPanel />} />
        <Route path="/history" element={<PatientHistory />} />
        <Route path="/docs" element={<Documentation />} />

        {/* Yanlış adrese gidilirse Login'e at */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;