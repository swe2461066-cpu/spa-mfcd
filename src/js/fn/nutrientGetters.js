// 2.11.6 — Хүнсний JSON-оос тодорхой шимт бодисын утгыг аюулгүй (тоо болгож) авах туслах функцууд.
import { getLocalizedValue } from "../i18n/i18n.js";

export function getFoodCode(food) {
  return food.food_code;
}

export function getFoodName(food) {
  return getLocalizedValue(food.food_name);
}

// Утга байхгүй бол 0 гэж үзнэ.
export function getNutrient(food, group, key) {
  return Number(food?.[group]?.[key] ?? 0);
}

export const getEnergy = (food) => getNutrient(food, "proximates", "Energy (kcal)");
export const getProtein = (food) => getNutrient(food, "proximates", "Protein (g)");
export const getFat = (food) => getNutrient(food, "proximates", "Fat (g)");
export const getCarbohydrate = (food) => getNutrient(food, "proximates", "Carbohydrate (g)");
export const getCalcium = (food) => getNutrient(food, "minerals", "Calcium (mg)");
export const getIron = (food) => getNutrient(food, "minerals", "Iron (mg)");
export const getPhosphorus = (food) => getNutrient(food, "minerals", "Phosphorus (mg)");
export const getVitaminC = (food) => getNutrient(food, "vitamins", "Vitamin C (mg)");
