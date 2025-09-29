import React from 'react';
import Icon from './Icon';

interface AnalysisFailureProps {
  message: string;
}

const AnalysisFailure: React.FC<AnalysisFailureProps> = ({ message }) => {
  return (
    <div className="w-full bg-red-50 dark:bg-slate-800 border border-red-200 dark:border-red-900/50 p-6 rounded-2xl shadow-lg dark:shadow-2xl dark:shadow-slate-950/20 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <Icon icon="exclamationTriangle" className="w-7 h-7 text-red-500 dark:text-red-400" />
          </div>
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Oops! Analisis Gagal</h3>
          <p className="text-slate-600 dark:text-slate-400 mt-1">{message}</p>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-red-200 dark:border-red-900/50">
        <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Saran untuk hasil lebih baik:</h4>
        <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 text-sm">
          <li>Pastikan gambar jelas dan tidak buram.</li>
          <li>Coba gunakan foto dengan pencahayaan yang baik.</li>
          <li>Pastikan objek utama dalam foto adalah makanan.</li>
          <li>Hindari gambar dengan terlalu banyak objek yang mengganggu.</li>
        </ul>
      </div>
    </div>
  );
};

export default AnalysisFailure;
