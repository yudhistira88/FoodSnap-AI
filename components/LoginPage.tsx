

import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showRegisterOptions, setShowRegisterOptions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() === '' || password.trim() === '') {
      setError('Email dan password tidak boleh kosong.');
      return;
    }
    // Check for specific credentials
    if (email === 'yudhistira.andri.n@gmail.com' && password === 'yamakasi88') {
      setError('');
      onLogin();
    } else {
      setError('Email atau password salah.');
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4 transition-colors duration-300">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg animate-fade-in dark:shadow-2xl dark:shadow-slate-950/20">
          <div className="text-center mb-8">
              <div className="w-16 h-16 bg-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
              </div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              Welcome to FoodSnap <span className="text-emerald-500">AI</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Silakan masuk untuk melanjutkan.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anda@email.com"
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                />
              </div>
            </div>
            
            {error && <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>}

            <div className="space-y-4 pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
              >
                Masuk
              </button>
              <button
                type="button"
                onClick={() => setShowRegisterOptions(true)}
                className="w-full flex justify-center py-3 px-4 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
              >
                Daftar
              </button>
            </div>
          </form>
        </div>
      </div>

      {showRegisterOptions && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4"
          onClick={() => setShowRegisterOptions(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="register-modal-title"
        >
          <div 
            className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg max-w-sm w-full mx-4 text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowRegisterOptions(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              aria-label="Tutup modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 id="register-modal-title" className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Daftar Melalui</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Pilih platform untuk melanjutkan pendaftaran.</p>
            <div className="space-y-4">
              <a
                href="https://shopee.co.id/product/33980549/26242311433/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors transform hover:scale-105"
              >
                Daftar dengan Shopee
              </a>
              <a
                href="https://lynk.id/yudhistira.andri.n"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-cyan-500 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors transform hover:scale-105"
              >
                Daftar dengan Lynk.id
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;