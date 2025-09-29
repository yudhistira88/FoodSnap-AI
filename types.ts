export interface Recipe {
  ingredients: string[];
  instructions: string[];
  cookingTime: string;
  estimatedCost: string;
}

export interface Nutrition {
  calories: string;
  totalFat: string;
  cholesterol: string;
  sodium: string;
  totalCarbohydrates: string;
  protein: string;
  sugar: string;
  vitaminsAndMinerals: string;
}

export interface HealthAnalysis {
  summary: string;
  positiveEffects: string[];
  potentialRisks: string[];
}

export interface SmartTips {
  educationalTip: string;
  savingTip: string;
}

export interface FoodPairing {
  drinkPairings: string[];
  foodPairings: string[];
}

export interface FoodData {
  foodName: string;
  recipe: Recipe;
  nutrition: Nutrition;
  healthAnalysis: HealthAnalysis;
  smartTips: SmartTips;
  servingSuggestion: string;
  consumptionSuggestion: string;
  consumptionTime: string;
  flavorProfile: string;
  foodPairing: FoodPairing;
}