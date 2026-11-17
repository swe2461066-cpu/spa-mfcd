// 2.11.4 — nutrientRequirements.json-ийг (ЭМС-ын 2017 оны А/74 тушаалын хавсралт) хүснэгтээс үүсгэнэ.
// Миний нэмэлт: 20 объектыг гараар бичихийн оронд нэг мөр = нэг нас/хүйс байдлаар бичээд JSON болгодог.
// Ажиллуулах: node ./src/tools/buildNutrientRequirements.js
const fs = require("fs");

// [age_en, age_mn, gender, energy, protein, fat, carbohydrate, calcium, iron, phosphorus, vitaminC]
const rows = [
  ["0-6 months", "0-6 сар", "male", 720, 10, 32, 97, 300, 0, 100, 25],
  ["0-6 months", "0-6 сар", "female", 660, 9, 29, 90, 300, 0, 100, 25],
  ["7-12 months", "7-12 сар", "male", 820, 12, 32, 120, 400, 7.7, 275, 30],
  ["7-12 months", "7-12 сар", "female", 750, 11, 29, 111, 400, 7.7, 275, 30],
  ["1-3 years", "1-3 жил", "male", 1060, 15, 41, 158, 500, 4.8, 460, 30],
  ["1-3 years", "1-3 жил", "female", 980, 14, 38, 144, 500, 4.8, 460, 30],
  ["4-6 years", "4-6 жил", "male", 1470, 22, 49, 235, 600, 5.3, 500, 30],
  ["4-6 years", "4-6 жил", "female", 1330, 20, 44, 212, 600, 5.3, 500, 30],
  ["7-10 years", "7-10 жил", "male", 1820, 28, 61, 290, 700, 7.4, 500, 35],
  ["7-10 years", "7-10 жил", "female", 1650, 29, 55, 260, 700, 7.4, 500, 35],
  ["11-14 years", "11-14 жил", "male", 2500, 45, 78, 405, 1300, 12.2, 1250, 40],
  ["11-14 years", "11-14 жил", "female", 2170, 46, 67, 344, 1300, 11.7, 1250, 40],
  ["15-18 years", "15-18 жил", "male", 2700, 60, 84, 426, 1300, 15.7, 1250, 40],
  ["15-18 years", "15-18 жил", "female", 2280, 52, 71, 358, 1300, 25.8, 1250, 40],
  ["19-29 years", "19-29 жил", "male", 2400, 90, 67, 360, 1000, 11.4, 700, 45],
  ["19-29 years", "19-29 жил", "female", 1990, 72, 55, 302, 1000, 24.5, 700, 45],
  ["30-59 years", "30-59 жил", "male", 2380, 76, 66, 370, 1000, 11.4, 700, 45],
  ["30-59 years", "30-59 жил", "female", 1850, 66, 51, 280, 1300, 24.5, 700, 45],
  ["60 years and older", "60 жил болон түүнээс дээш", "male", 1920, 62, 53, 297, 1300, 11.4, 700, 45],
  ["60 years and older", "60 жил болон түүнээс дээш", "female", 1680, 54, 47, 261, 1300, 9.4, 700, 45],
];

const data = rows.map(([en, mn, gender, energy, protein, fat, carbohydrate, calcium, iron, phosphorus, vitaminC]) => ({
  age: { en, mn },
  gender,
  proximates: { "Energy (kcal)": energy, "Protein (g)": protein, "Fat (g)": fat, "Carbohydrate (g)": carbohydrate },
  minerals: { "Calcium (mg)": calcium, "Iron (mg)": iron, "Phosphorus (mg)": phosphorus },
  vitamins: { "Vitamin C (mg)": vitaminC },
}));

fs.writeFileSync("./src/data/nutrientRequirements.json", JSON.stringify(data, null, 2), "utf8");
console.log(`nutrientRequirements.json үүслээ: ${data.length} мөр`);
