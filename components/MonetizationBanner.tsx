import React from 'react';
import Icon from './Icon';

const MonetizationBanner: React.FC = () => {
    return (
        <div className="mt-12 w-full bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 p-8 rounded-2xl shadow-lg dark:shadow-2xl dark:shadow-slate-950/20 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Icon icon="star" className="w-9 h-9 text-white" />
                </div>
            </div>
            <div className="flex-grow text-center md:text-left">
                <h3 className="text-2xl font-bold">Buka Fitur Premium!</h3>
                <p className="mt-1 opacity-90">Daftar sekarang untuk menyimpan resep, melacak nutrisi, dan mendapatkan analisis eksklusif!</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0 w-full sm:w-auto">
                 <a
                    href="https://shopee.co.id/product/33980549/26242311433/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-block text-center px-6 py-3 bg-white text-emerald-600 font-bold rounded-lg shadow-md hover:bg-slate-100 transition-all transform hover:scale-105"
                >
                    Daftar di Shopee
                </a>
                <a
                    href="https://lynk.id/yudhistira.andri.n"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-block text-center px-6 py-3 bg-white/20 text-white font-bold rounded-lg hover:bg-white/30 transition-all transform hover:scale-105"
                >
                    Info Lainnya
                </a>
            </div>
        </div>
    );
};

export default MonetizationBanner;
