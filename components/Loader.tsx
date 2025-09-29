

import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-emerald-500"></div>
      <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">Menganalisis Makanan...</p>
    </div>
  );
};

export default Loader;