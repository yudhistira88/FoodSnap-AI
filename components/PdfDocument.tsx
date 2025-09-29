import React from 'react';
import type { FoodData } from '../types';
import Icon from './Icon';

interface PdfDocumentProps {
  data: FoodData;
  imageUrl: string;
}

const PdfDocument: React.FC<PdfDocumentProps> = ({ data, imageUrl }) => {
  return (
    <div className="w-[800px] bg-white p-10 text-slate-800 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between pb-6 border-b-2 border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            FoodSnap <span className="text-emerald-500">AI</span>
          </h1>
        </div>
        <p className="text-sm text-slate-500">Analisis Makanan Lengkap</p>
      </header>

      {/* Main Content */}
      <main className="pt-8">
        <img
          src={imageUrl}
          alt={data.foodName}
          className="block mx-auto h-auto max-h-64 rounded-2xl mb-6 shadow-lg"
        />
        <h2 className="text-4xl font-extrabold text-center mb-10 tracking-tight">{data.foodName}</h2>

        <div className="grid grid-cols-2 gap-10">
          {/* Recipe Column */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Icon icon="recipe" className="w-8 h-8 text-emerald-500" />
              <h3 className="text-2xl font-bold">Resep</h3>
            </div>
             <div className="grid grid-cols-2 gap-4">
              <InfoBox icon="time" label="Waktu Memasak" value={data.recipe.cookingTime} />
              <InfoBox icon="price" label="Estimasi Biaya" value={data.recipe.estimatedCost} />
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2 text-slate-700">Bahan-bahan:</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-600 text-sm">
                {data.recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2 text-slate-700">Langkah-langkah:</h4>
              <ol className="list-decimal list-outside pl-5 space-y-2 text-slate-600 text-sm">
                {data.recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
              </ol>
            </div>
          </div>

          {/* Nutrition Column */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Icon icon="nutrition" className="w-8 h-8 text-rose-500" />
              <h3 className="text-2xl font-bold">Informasi Gizi</h3>
            </div>
            <p className="text-sm text-slate-500 -mt-4">Estimasi per porsi</p>
            <div className="space-y-3 pt-2">
              <NutritionItem icon="calories" color="orange" label="Energi (Kalori)" value={data.nutrition.calories} />
              <NutritionItem icon="fat" color="yellow" label="Lemak Total" value={data.nutrition.totalFat} />
              <NutritionItem icon="cholesterol" color="purple" label="Kolesterol" value={data.nutrition.cholesterol} />
              <NutritionItem icon="sodium" color="blue" label="Natrium" value={data.nutrition.sodium} />
              <NutritionItem icon="carbs" color="sky" label="Karbohidrat Total" value={data.nutrition.totalCarbohydrates} />
              <NutritionItem icon="sugar" color="pink" label="Kadar Gula" value={data.nutrition.sugar} />
              <NutritionItem icon="protein" color="red" label="Protein" value={data.nutrition.protein} />
              <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                  <div className={`p-2 rounded-full bg-green-100 text-green-600 flex-shrink-0`}><Icon icon="vitaminsAndMinerals" className="w-5 h-5"/></div>
                  <div className="flex-1">
                      <span className="font-semibold text-slate-700 text-base">Vitamin & Mineral Utama</span>
                      <p className="text-slate-600 text-sm">{data.nutrition.vitaminsAndMinerals}</p>
                  </div>
              </div>
            </div>
          </div>
        </div>

        {/* Health Analysis Section */}
        <div className="mt-8 pt-6 border-t-2 border-slate-100">
            <div className="flex items-center space-x-3 mb-3">
                <Icon icon="health" className="w-8 h-8 text-sky-500" />
                <h3 className="text-2xl font-bold">Analisis Kesehatan</h3>
            </div>
            <p className="text-slate-600 text-sm mb-4">{data.healthAnalysis.summary}</p>
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <h4 className="font-bold text-lg mb-2 text-green-600">Efek Positif</h4>
                    <ul className="list-disc list-outside pl-5 space-y-1 text-slate-600 text-sm">
                        {data.healthAnalysis.positiveEffects.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
                 <div>
                    <h4 className="font-bold text-lg mb-2 text-amber-600">Potensi Risiko</h4>
                    <ul className="list-disc list-outside pl-5 space-y-1 text-slate-600 text-sm">
                        {data.healthAnalysis.potentialRisks.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
            </div>
        </div>

        {/* Flavor Profile & Pairing Section */}
        <div className="mt-8 pt-6 border-t-2 border-slate-100">
             <div className="flex items-center space-x-3 mb-4">
                <Icon icon="wine" className="w-8 h-8 text-purple-500" />
                <h3 className="text-2xl font-bold">Profil Rasa & Paduan</h3>
            </div>
             <div>
                <h4 className="text-lg font-bold mb-2 text-slate-700">Profil Rasa</h4>
                <p className="text-slate-600 text-sm mb-4">{data.flavorProfile}</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
                 <div>
                    <h4 className="text-lg font-bold mb-2 text-slate-700">Paduan Minuman</h4>
                    <ul className="list-disc list-outside pl-5 space-y-1 text-slate-600 text-sm">
                        {data.foodPairing.drinkPairings.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
                 <div>
                    <h4 className="text-lg font-bold mb-2 text-slate-700">Paduan Makanan Pendamping</h4>
                     <ul className="list-disc list-outside pl-5 space-y-1 text-slate-600 text-sm">
                         {data.foodPairing.foodPairings.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
            </div>
        </div>

        {/* Smart Tips Section */}
        <div className="mt-8 pt-6 border-t-2 border-slate-100">
             <div className="flex items-center space-x-3 mb-4">
                <Icon icon="sparkles" className="w-8 h-8 text-blue-500" />
                <h3 className="text-2xl font-bold">Tips Cerdas</h3>
            </div>
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="text-lg font-bold mb-2 text-slate-700">Tahukah Anda? (Edukasi)</h4>
                    <p className="text-slate-600 text-sm">{data.smartTips.educationalTip}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="text-lg font-bold mb-2 text-slate-700">Tips Hemat</h4>
                    <p className="text-slate-600 text-sm">{data.smartTips.savingTip}</p>
                </div>
            </div>
        </div>

        {/* Additional Suggestions Section */}
        <div className="mt-8 pt-6 border-t-2 border-slate-100">
            <div className="flex items-center space-x-3 mb-4">
                <Icon icon="suggestion" className="w-8 h-8 text-indigo-500" />
                <h3 className="text-2xl font-bold">Saran Tambahan</h3>
            </div>
            <div className="grid grid-cols-3 gap-6">
                <PdfSuggestionItem icon="serving" label="Saran Penyajian" text={data.servingSuggestion} />
                <PdfSuggestionItem icon="time_of_day" label="Waktu Konsumsi" text={data.consumptionTime} />
                <PdfSuggestionItem icon="suggestion" label="Saran Konsumsi" text={data.consumptionSuggestion} />
            </div>
        </div>
      </main>

       {/* Footer */}
      <footer className="w-full pt-8 mt-10 border-t-2 border-slate-100 text-center">
        <p className="text-xs text-slate-500 mb-2">
            <strong>Peringatan:</strong> Hasil analisis ini 100% dibuat oleh AI dan mungkin tidak sepenuhnya akurat.
        </p>
        <p className="text-xs text-slate-500">
          © 2025 FoodSnap AI. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

const InfoBox: React.FC<{icon: 'time' | 'price'; label: string; value: string}> = ({icon, label, value}) => (
    <div className="flex items-center space-x-3 bg-slate-100 p-3 rounded-lg">
        <Icon icon={icon} className="w-6 h-6 text-emerald-600 flex-shrink-0" />
        <div>
            <p className="text-xs text-slate-500">{label}</p>
            <strong className="text-slate-800 text-sm">{value}</strong>
        </div>
    </div>
);

const PdfSuggestionItem: React.FC<{icon: 'serving' | 'time_of_day' | 'suggestion'; label: string; text: string}> = ({icon, label, text}) => (
    <div>
        <div className="flex items-center space-x-2 mb-2">
            <Icon icon={icon} className="w-6 h-6 text-slate-500 flex-shrink-0" />
            <h4 className="text-lg font-bold text-slate-700">{label}</h4>
        </div>
        <p className="text-slate-600 text-sm">{text}</p>
    </div>
);

const NutritionItem: React.FC<{icon: 'calories' | 'carbs' | 'protein' | 'fat' | 'cholesterol' | 'sodium' | 'sugar'; color: string; label: string; value: string}> = ({ icon, color, label, value }) => {
    const colorClasses = {
        orange: 'bg-orange-100 text-orange-600', sky: 'bg-sky-100 text-sky-600', red: 'bg-red-100 text-red-600',
        yellow: 'bg-yellow-100 text-yellow-600', purple: 'bg-purple-100 text-purple-600', blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600', pink: 'bg-pink-100 text-pink-600',
    };
    return (
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}><Icon icon={icon} className="w-5 h-5"/></div>
                <span className="font-semibold text-slate-700">{label}</span>
            </div>
            <span className="font-bold text-slate-800">{value}</span>
        </div>
    );
};

export default PdfDocument;