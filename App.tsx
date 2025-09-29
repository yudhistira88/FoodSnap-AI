

import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import Loader from './components/Loader';
import ResultDisplay from './components/ResultDisplay';
import LoginPage from './components/LoginPage';
import { analyzeFoodImage } from './services/geminiService';
import type { FoodData } from './types';
import AnalysisFailure from './components/AnalysisFailure';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<FoodData | null>(null);

  const handleImageSelect = useCallback((file: File, base64: string) => {
    setImageBase64(base64);
    setAnalysisResult(null);
    setError(null);
  }, []);
  
  const handleAnalyzeClick = async () => {
    if (!imageBase64) {
      setError("Silakan unggah gambar terlebih dahulu.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    
    try {
      const result = await analyzeFoodImage(imageBase64);
      setAnalysisResult(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui.";
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setImageBase64(null);
    setIsLoading(false);
    setError(null);
    setAnalysisResult(null);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col transition-colors duration-300">
      <Header onSignOut={handleSignOut} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto flex flex-col items-center space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-800 sm:text-4xl dark:text-slate-100">Kenali Makanan dari Foto</h2>
            <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Unggah foto makanan untuk mendapatkan resep dan informasi gizinya secara instan.</p>
          </div>
          
          <div className="w-full max-w-2xl bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg dark:shadow-2xl dark:shadow-slate-950/20">
            <div className="space-y-6 flex flex-col items-center">
              <ImageUpload onImageSelect={handleImageSelect} imagePreviewUrl={imageBase64} />
              {imageBase64 && (
                <button
                  onClick={handleAnalyzeClick}
                  disabled={isLoading}
                  className="w-full sm:w-auto px-8 py-3 bg-emerald-500 text-white font-bold rounded-lg shadow-md hover:bg-emerald-600 transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
                >
                  {isLoading ? 'Menganalisis...' : 'Analisis Foto Makanan'}
                </button>
              )}
            </div>
          </div>
          
          <div className="w-full mt-10">
            {isLoading && <Loader />}
            {error && <AnalysisFailure message={error} />}
            {analysisResult && <ResultDisplay data={analysisResult} imageBase64={imageBase64} />}
          </div>

        </div>
      </main>
      <footer className="w-full py-4 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          © 2025 FoodSnap AI. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default App;