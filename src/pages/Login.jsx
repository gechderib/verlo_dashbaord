import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { login } from '../services/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError('');
    const result = await login(data);
    setLoading(false);
    if (result.success && result.data.status === 'SUCCESS') {
      localStorage.setItem('access', result.data.data.access);
      localStorage.setItem('refresh', result.data.data.refresh);
      localStorage.setItem('user', JSON.stringify(result.data.data.user));
      navigate('/');
    } else {
      setApiError(result.data.error?.[0] || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-100 to-blue-300 animate-fade-in">
      <div className="bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-md border border-blue-100 animate-slide-up">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-blue-700 tracking-tight drop-shadow animate-fade-in-delay">Welcome Back</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="transition-all duration-300">
            <label className="block text-gray-700 mb-1 font-semibold">Username or Email or Phone</label>
            <input
              type="text"
              {...register('username', { required: 'Username is required' })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 ${errors.username ? 'border-red-400' : 'border-gray-300'}`}
              placeholder="Enter your username, email, or phone"
              autoComplete="username"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1 animate-shake">{errors.username.message}</p>}
          </div>
          <div className="transition-all duration-300">
            <label className="block text-gray-700 mb-1 font-semibold">Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 ${errors.password ? 'border-red-400' : 'border-gray-300'}`}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1 animate-shake">{errors.password.message}</p>}
          </div>
          {apiError && <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-center font-semibold shadow animate-shake">{apiError}</div>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-2 rounded-lg shadow-lg transition-all duration-200 transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading && <span className="loader ease-linear rounded-full border-2 border-t-2 border-blue-200 h-5 w-5 mr-2 animate-spin"></span>}
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 1s ease; }
        .animate-fade-in-delay { animation: fadeIn 1.5s ease; }
        .animate-slide-up { animation: slideUp 0.8s cubic-bezier(.39,.575,.565,1) both; }
        .animate-shake { animation: shake 0.3s; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes shake { 10%, 90% { transform: translateX(-1px); } 20%, 80% { transform: translateX(2px); } 30%, 50%, 70% { transform: translateX(-4px); } 40%, 60% { transform: translateX(4px); } }
        .loader { border-top-color: #3498db; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
} 