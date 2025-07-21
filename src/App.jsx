import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import React from 'react';

function Home() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 via-purple-300 to-pink-200 animate-fade-in">
      <div className="text-center p-10 bg-white/80 rounded-3xl shadow-2xl border border-blue-100 animate-slide-up">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 mb-4 drop-shadow animate-fade-in-delay">Welcome to Verlo Dashboard</h1>
        <p className="text-lg text-gray-700 mb-8 animate-fade-in-delay">Your modern, beautiful dashboard starter with React, Vite, and TailwindCSS.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-pink-500 text-white font-bold rounded-lg shadow-lg transition-all duration-200 transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 animate-bounce"
        >
          Go to Dashboard
        </button>
      </div>
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-4">
        <span className="w-4 h-4 bg-blue-400 rounded-full animate-pulse"></span>
        <span className="w-4 h-4 bg-purple-400 rounded-full animate-pulse delay-200"></span>
        <span className="w-4 h-4 bg-pink-400 rounded-full animate-pulse delay-400"></span>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 1s ease; }
        .animate-fade-in-delay { animation: fadeIn 1.5s ease; }
        .animate-slide-up { animation: slideUp 0.8s cubic-bezier(.39,.575,.565,1) both; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
