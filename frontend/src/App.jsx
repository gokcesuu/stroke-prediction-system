import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import AnalysisPanel from './pages/AnalysisPanel';
import PatientHistory from './pages/PatientHistory';
import Documentation from './pages/Documentation';
import Login from './pages/Login';
import Register from './pages/Register';
import ResearchLab from './pages/ResearchLab';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import './index.css';

// Giriş gerektiren sayfaları korur
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#041329]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#adc6ff]"></div>
    </div>
  );
  if (!user) return <Navigate to="/" replace />;
  return children;
}

const AppContent = () => {
  const location = useLocation();
  const hideNavbar = ['/', '/register'].includes(location.pathname);

  return (
    <div className="App min-h-screen bg-[#041329]">
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* Auth sayfaları — Navbar yok */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Herkese açık sayfalar */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/docs" element={<Documentation />} />
        <Route path="/lab" element={<ResearchLab />} />

        {/* Korumalı sayfalar */}
        <Route path="/analysis" element={<ProtectedRoute><AnalysisPanel /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><PatientHistory /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
