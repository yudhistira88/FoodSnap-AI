import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { FoodData } from '../types';
import Icon from './Icon';
import PdfDocument from './PdfDocument';

interface ResultDisplayProps {
  data: FoodData;
  imageBase64: string | null;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ data, imageBase64, onReset }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    if (!imageBase64) return;

    setIsDownloading(true);

    const pdfContainer = document.createElement('div');
    pdfContainer.style.position = 'absolute';
    pdfContainer.style.left = '-9999px';
    pdfContainer.style.top = '0';
    document.body.appendChild(pdfContainer);

    const root = ReactDOM.createRoot(pdfContainer);
    root.render(<PdfDocument data={data} imageUrl={`data:image/jpeg;base64,${imageBase64}`} />);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const pdfContentElement = pdfContainer.firstChild as HTMLElement;
      if (!pdfContentElement) throw new Error("PDF content element not found.");

      const canvas = await html2canvas(pdfContentElement, { 
        scale: 1.5, // Lowered scale for smaller file size
        useCORS: true, 
        windowWidth: pdfContentElement.scrollWidth, 
        windowHeight: pdfContentElement.scrollHeight 
      });
      
      // Use JPEG format with quality compression
      const imgData = canvas.toDataURL('image/jpeg', 0.85);
      const pdf = new jsPDF({ 
        orientation: 'p', 
        unit: 'px', 
        format: [canvas.width, canvas.height] 
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height, undefined, 'MEDIUM');
      pdf.save(`${data.foodName.replace(/\s+/g, '-')}-analysis.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
      root.unmount();
      document.body.removeChild(pdfContainer);
    }
  };

  return (
    <div className="w-full space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-center sm:text-left">
          <p className="text-slate-600 dark:text-slate-400">Hasil Deteksi:</p>
          <h2 className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">{data.foodName}</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="order-1 sm:order-2 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-white font-bold rounded-lg shadow-md hover:bg-emerald-600 transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
            >
              <Icon icon="download" className="w-5 h-5" />
              {isDownloading ? 'Menyiapkan PDF...' : 'Unduh Hasil'}
            </button>
            <button
                onClick={onReset}
                className="order-2 sm:order-1 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-lg shadow-sm hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 focus:ring-opacity-50"
            >
                <Icon icon="reload" className="w-5 h-5" />
                Muat Baru
            </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Recipe Card */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg dark:shadow-2xl dark:shadow-slate-950/20">
            <div className="flex items-center space-x-3 mb-4">
                <Icon icon="recipe" className="w-8 h-8 text-emerald-500" />
                <h3 className="text-2xl font-bold dark:text-slate-100">Resep</h3>
            </div>
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoBox icon="time" label="Waktu Memasak" value={data.recipe.cookingTime} />
                    <InfoBox icon="price" label="Estimasi Biaya" value={data.recipe.estimatedCost} />
                </div>
                <div>
                    <h4 className="font-bold text-lg mt-4 mb-2 text-slate-700 dark:text-slate-300">Bahan-bahan:</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                        {data.recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-2 text-slate-700 dark:text-slate-300">Langkah-langkah:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-300">
                        {data.recipe.instructions.map((step, i) => <li key={i} className="pl-2">{step}</li>)}
                    </ol>
                </div>
            </div>
        </div>

        {/* Nutrition Card */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg dark:shadow-2xl dark:shadow-slate-950/20">
          <div className="flex items-center space-x-3 mb-4">
            <Icon icon="nutrition" className="w-8 h-8 text-rose-500" />
            <h3 className="text-2xl font-bold dark:text-slate-100">Informasi Gizi</h3>
          </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Estimasi per porsi</p>
          <div className="space-y-3">
              <NutritionItem icon="calories" color="orange" label="Energi (Kalori)" value={data.nutrition.calories} />
              <NutritionItem icon="fat" color="yellow" label="Lemak Total" value={data.nutrition.totalFat} />
              <NutritionItem icon="cholesterol" color="purple" label="Kolesterol" value={data.nutrition.cholesterol} />
              <NutritionItem icon="sodium" color="blue" label="Natrium" value={data.nutrition.sodium} />
              <NutritionItem icon="carbs" color="sky" label="Karbohidrat Total" value={data.nutrition.totalCarbohydrates} />
              <NutritionItem icon="sugar" color="pink" label="Kadar Gula" value={data.nutrition.sugar} />
              <NutritionItem icon="protein" color="red" label="Protein" value={data.nutrition.protein} />
              <div className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className={`p-2 rounded-full bg-green-100 text-green-600 flex-shrink-0`}><Icon icon="vitaminsAndMinerals" className="w-5 h-5"/></div>
                  <div className="flex-1">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">Vitamin & Mineral Utama</span>
                      <p className="text-slate-600 dark:text-slate-300 text-sm">{data.nutrition.vitaminsAndMinerals}</p>
                  </div>
              </div>
          </div>
        </div>
        
        {/* Health Analysis Card */}
        <div className="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg dark:shadow-2xl dark:shadow-slate-950/20">
            <div className="flex items-center space-x-3 mb-4">
                <Icon icon="health" className="w-8 h-8 text-sky-500" />
                <h3 className="text-2xl font-bold dark:text-slate-100">Analisis Kesehatan</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-6">{data.healthAnalysis.summary}</p>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-bold text-lg mb-3 text-green-600 dark:text-green-400">Efek Positif</h4>
                    <ul className="space-y-2">
                        {data.healthAnalysis.positiveEffects.map((item, i) => (
                            <li key={i} className="flex items-start space-x-3">
                                <Icon icon="checkCircle" className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-slate-600 dark:text-slate-300">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                 <div>
                    <h4 className="font-bold text-lg mb-3 text-amber-600 dark:text-amber-400">Potensi Risiko</h4>
                    <ul className="space-y-2">
                        {data.healthAnalysis.potentialRisks.map((item, i) => (
                             <li key={i} className="flex items-start space-x-3">
                                <Icon icon="exclamationTriangle" className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                <span className="text-slate-600 dark:text-slate-300">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>

        {/* Flavor Profile & Pairing Card */}
        <div className="md:col-span-2 bg-purple-50 dark:bg-slate-800 p-6 rounded-2xl shadow-lg dark:shadow-2xl dark:shadow-slate-950/20 border border-purple-200 dark:border-purple-700">
            <div className="flex items-center space-x-3 mb-4">
                <Icon icon="wine" className="w-8 h-8 text-purple-500" />
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Profil Rasa & Paduan</h3>
            </div>
            <div>
                <h4 className="text-lg font-bold mb-2 text-slate-700 dark:text-slate-200">Profil Rasa</h4>
                <p className="text-slate-600 dark:text-slate-300 mb-6">{data.flavorProfile}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                 <div>
                    <h4 className="text-lg font-bold mb-3 text-slate-700 dark:text-slate-200">Paduan Minuman</h4>
                    <ul className="space-y-2">
                        {data.foodPairing.drinkPairings.map((item, i) => (
                            <li key={i} className="flex items-start space-x-3">
                                <span className="text-purple-500 mt-1">&#8226;</span>
                                <span className="text-slate-600 dark:text-slate-300">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                 <div>
                    <h4 className="text-lg font-bold mb-3 text-slate-700 dark:text-slate-200">Paduan Makanan Pendamping</h4>
                    <ul className="space-y-2">
                         {data.foodPairing.foodPairings.map((item, i) => (
                            <li key={i} className="flex items-start space-x-3">
                                <span className="text-purple-500 mt-1">&#8226;</span>
                                <span className="text-slate-600 dark:text-slate-300">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>


        {/* Smart Tips Card */}
        <div className="md:col-span-2 bg-blue-50 dark:bg-slate-800 p-6 rounded-2xl shadow-lg dark:shadow-2xl dark:shadow-slate-950/20 border border-blue-200 dark:border-blue-700">
            <div className="flex items-center space-x-3 mb-4">
                <Icon icon="sparkles" className="w-8 h-8 text-blue-500" />
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Tips Cerdas</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-700/50 p-4 rounded-lg">
                    <h4 className="text-lg font-bold mb-2 text-slate-700 dark:text-slate-200">Tahukah Anda? (Edukasi)</h4>
                    <p className="text-slate-600 dark:text-slate-300">{data.smartTips.educationalTip}</p>
                </div>
                <div className="bg-white dark:bg-slate-700/50 p-4 rounded-lg">
                    <h4 className="text-lg font-bold mb-2 text-slate-700 dark:text-slate-200">Tips Hemat</h4>
                    <p className="text-slate-600 dark:text-slate-300">{data.smartTips.savingTip}</p>
                </div>
            </div>
        </div>

        {/* Additional Suggestions Card */}
        <div className="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg dark:shadow-2xl dark:shadow-slate-950/20">
            <div className="flex items-center space-x-3 mb-4">
                <Icon icon="suggestion" className="w-8 h-8 text-indigo-500" />
                <h3 className="text-2xl font-bold dark:text-slate-100">Saran Tambahan</h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-x-6 gap-y-8">
                <SuggestionItem icon="serving" label="Saran Penyajian" text={data.servingSuggestion} />
                <SuggestionItem icon="time_of_day" label="Waktu Konsumsi" text={data.consumptionTime} />
                <SuggestionItem icon="suggestion" label="Saran Konsumsi" text={data.consumptionSuggestion} />
            </div>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
        <p><strong className="font-semibold text-slate-600 dark:text-slate-300">Peringatan:</strong> Hasil analisis ini 100% dibuat oleh AI. Informasi yang diberikan mungkin tidak sepenuhnya akurat. Selalu konsultasikan dengan ahli gizi atau dokter untuk saran kesehatan yang lebih terpercaya.</p>
      </div>
    </div>
  );
};

const InfoBox: React.FC<{icon: 'time' | 'price'; label: string; value: string}> = ({icon, label, value}) => (
    <div className="flex items-center space-x-3 bg-slate-100 dark:bg-slate-700 p-3 rounded-lg">
        <Icon icon={icon} className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
        <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            <strong className="text-slate-800 dark:text-slate-100">{value}</strong>
        </div>
    </div>
);

interface NutritionItemProps {
    icon: 'calories' | 'carbs' | 'protein' | 'fat' | 'cholesterol' | 'sodium' | 'sugar';
    color: string;
    label: string;
    value: string;
}

const NutritionItem: React.FC<NutritionItemProps> = ({ icon, color, label, value }) => {
    const colorClasses = {
        orange: 'bg-orange-100 text-orange-600', sky: 'bg-sky-100 text-sky-600', red: 'bg-red-100 text-red-600',
        yellow: 'bg-yellow-100 text-yellow-600', purple: 'bg-purple-100 text-purple-600', blue: 'bg-blue-100 text-blue-600',
        pink: 'bg-pink-100 text-pink-600',
    };
    return (
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}><Icon icon={icon} className="w-5 h-5"/></div>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{label}</span>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-100">{value}</span>
        </div>
    );
};

interface SuggestionItemProps {
  icon: 'serving' | 'time_of_day' | 'suggestion';
  label: string;
  text: string;
}

const SuggestionItem: React.FC<SuggestionItemProps> = ({ icon, label, text }) => (
  <div>
    <div className="flex items-center space-x-2 mb-2">
      <Icon icon={icon} className="w-6 h-6 text-slate-500 dark:text-slate-400" />
      <h4 className="text-lg font-bold text-slate-700 dark:text-slate-200">{label}</h4>
    </div>
    <p className="text-slate-600 dark:text-slate-300">{text}</p>
  </div>
);

export default ResultDisplay;