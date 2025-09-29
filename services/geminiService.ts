import { GoogleGenAI, Type } from "@google/genai";
import type { FoodData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Schema for the initial food check
const foodCheckSchema = {
    type: Type.OBJECT,
    properties: {
        isFood: { type: Type.BOOLEAN, description: "True if the image contains edible food or a drink." },
        reason: { type: Type.STRING, description: "Reason for rejection if not food." }
    },
    required: ['isFood', 'reason']
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        foodName: { 
            type: Type.STRING,
            description: "Nama makanan yang teridentifikasi dalam bahasa Indonesia." 
        },
        recipe: {
            type: Type.OBJECT,
            properties: {
                ingredients: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: "Daftar bahan-bahan yang dibutuhkan beserta takarannya."
                },
                instructions: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: "Langkah-langkah memasak secara terstruktur dan jelas."
                },
                cookingTime: { 
                    type: Type.STRING, 
                    description: "Estimasi waktu memasak, contoh: '45 menit'."
                },
                estimatedCost: {
                    type: Type.STRING,
                    description: "Estimasi biaya pembuatan dalam Rupiah (IDR), contoh: 'Rp 50.000 - Rp 75.000'."
                }
            },
            required: ["ingredients", "instructions", "cookingTime", "estimatedCost"]
        },
        nutrition: {
            type: Type.OBJECT,
            properties: {
                calories: { type: Type.STRING, description: "Energi total per porsi dalam kkal, contoh: '350 kkal'." },
                totalFat: { type: Type.STRING, description: "Lemak total per porsi dalam gram, contoh: '15g'." },
                cholesterol: { type: Type.STRING, description: "Kolesterol per porsi dalam miligram, contoh: '75mg'." },
                sodium: { type: Type.STRING, description: "Natrium per porsi dalam miligram, contoh: '500mg'." },
                totalCarbohydrates: { type: Type.STRING, description: "Karbohidrat total per porsi dalam gram, contoh: '40g'." },
                protein: { type: Type.STRING, description: "Jumlah protein per porsi dalam gram, contoh: '20g'." },
                sugar: { type: Type.STRING, description: "Kadar gula per porsi dalam gram, contoh: '10g'." },
                vitaminsAndMinerals: { type: Type.STRING, description: "Daftar vitamin dan mineral utama yang signifikan, contoh: 'Vitamin A, Kalsium, Zat Besi'." }
            },
            required: [
                "calories", "totalFat", "cholesterol",
                "sodium", "totalCarbohydrates",
                "protein", "sugar", "vitaminsAndMinerals"
            ]
        },
        healthAnalysis: {
            type: Type.OBJECT,
            description: "Analisis kesehatan yang mendalam.",
            properties: {
                summary: {
                    type: Type.STRING,
                    description: "Ringkasan saran kesehatan umum terkait makanan ini."
                },
                positiveEffects: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Daftar efek positif dari mengonsumsi makanan ini bagi kesehatan."
                },
                potentialRisks: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Daftar potensi risiko atau hal yang perlu diperhatikan, terutama untuk kondisi kesehatan tertentu."
                }
            },
            required: ["summary", "positiveEffects", "potentialRisks"]
        },
        smartTips: {
            type: Type.OBJECT,
            description: "Tips cerdas terkait makanan.",
            properties: {
                educationalTip: {
                    type: Type.STRING,
                    description: "Satu fakta menarik atau tips edukasi tentang sejarah, bahan, atau manfaat makanan ini."
                },
                savingTip: {
                    type: Type.STRING,
                    description: "Satu tips praktis untuk menghemat biaya saat membeli bahan atau memasak makanan ini."
                }
            },
            required: ["educationalTip", "savingTip"]
        },
        servingSuggestion: {
            type: Type.STRING,
            description: "Saran cara terbaik menyajikan makanan ini, contoh: 'Sajikan selagi hangat dengan taburan bawang goreng'."
        },
        consumptionSuggestion: {
            type: Type.STRING,
            description: "Saran konsumsi umum, contoh: 'Baik dikonsumsi sebagai lauk pendamping nasi' atau 'Cocok dinikmati bersama teh hangat'."
        },
        consumptionTime: {
            type: Type.STRING,
            description: "Waktu yang paling cocok untuk mengonsumsi makanan ini, contoh: 'Sarapan', 'Makan Siang', 'Makan Malam', atau 'Camilan Sore'."
        },
        flavorProfile: {
            type: Type.STRING,
            description: "Deskripsi naratif tentang profil rasa makanan ini (misalnya, gurih, manis, pedas, umami) dan teksturnya."
        },
        foodPairing: {
            type: Type.OBJECT,
            description: "Saran padu padan makanan dan minuman halal.",
            properties: {
                drinkPairings: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Daftar saran minuman halal yang cocok (hindari minuman beralkohol)."
                },
                foodPairings: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Daftar saran makanan pendamping halal yang melengkapi makanan ini (hindari babi atau bahan non-halal lainnya)."
                }
            },
            required: ["drinkPairings", "foodPairings"]
        }
    },
    required: ["foodName", "recipe", "nutrition", "healthAnalysis", "smartTips", "servingSuggestion", "consumptionSuggestion", "consumptionTime", "flavorProfile", "foodPairing"]
};

const isFoodImage = async (base64Image: string): Promise<{ isFood: boolean; reason: string }> => {
    const imagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
        },
    };

    const textPart = {
       text: `You are a strict food detection system. Your only task is to determine if the image contains edible food or a drink.
- If the image contains humans, animals, landscapes, non-food objects, buildings, or religious activities, it is NOT food.
- Respond ONLY with JSON that adheres to the provided schema.
- If it IS food or a drink, set "isFood" to true and "reason" to an empty string.
- If it is NOT food or a drink, set "isFood" to false and "reason" must be exactly this string: "Foto ini bukan makanan. Silakan unggah foto makanan atau minuman."`
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: foodCheckSchema,
        }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
};


export const analyzeFoodImage = async (base64Image: string): Promise<FoodData> => {
    try {
        // Step 1: Check if the image is food
        const foodCheck = await isFoodImage(base64Image);
        if (!foodCheck.isFood) {
            throw new Error(foodCheck.reason || "Tidak ditemukan makanan pada foto.");
        }

        // Step 2: If it is food, proceed with the detailed analysis
        const imagePart = {
            inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image,
            },
        };

        const textPart = {
           text: `Analisis gambar makanan ini secara mendalam sebagai seorang ahli kuliner dan gizi dengan fokus pada makanan halal. Berikan respons dalam format JSON sesuai skema. Hindari semua saran yang mengandung bahan non-halal seperti babi dan alkohol. Informasi yang harus disertakan:
1.  **foodName**: Nama makanan dalam Bahasa Indonesia.
2.  **recipe**: Resep lengkap (bahan, langkah-langkah, waktu memasak, estimasi biaya dalam IDR). Pastikan resep ini halal.
3.  **nutrition**: Informasi gizi lengkap per porsi.
4.  **healthAnalysis**: Analisis kesehatan mendalam (ringkasan, efek positif, potensi risiko).
5.  **smartTips**: Tips edukasi dan hemat.
6.  **servingSuggestion**: Saran penyajian terbaik.
7.  **consumptionSuggestion**: Saran konsumsi umum.
8.  **consumptionTime**: Waktu konsumsi yang ideal.
9.  **flavorProfile**: Deskripsi mendetail tentang profil rasa dan tekstur makanan ini.
10. **foodPairing**: Rekomendasi padu padan halal:
    *   **drinkPairings**: Daftar saran minuman yang halal (contoh: jus, teh, mocktail, dll.). Jangan menyarankan minuman beralkohol.
    *   **foodPairings**: Daftar saran makanan pendamping yang halal. Jangan menyarankan babi atau bahan non-halal lainnya.`
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });

        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText);

        return parsedData as FoodData;

    } catch (error) {
        console.error("Error analyzing food image with Gemini:", error);
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unknown error occurred while analyzing the image.");
    }
};