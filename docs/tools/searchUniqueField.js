// 2.9.1 — nutritions.json-оос тухайн талбарын давхцахгүй утгуудыг шүүж хэвлэнэ.
// Эдгээр утгыг convertNutritionsEnMn.js дотор монгол руу орчуулахад ашигласан.
// Ажиллуулах: node ./src/tools/searchUniqueField.js [талбар]
//   жишээ: node ./src/tools/searchUniqueField.js province
const fs = require("fs");

const data = JSON.parse(fs.readFileSync("./src/data/nutritions.json", "utf8"));

// Миний нэмэлт: талбарын нэрийг командын мөрөөс авдаг болгосон (default: Collection area).
const field = process.argv[2] || "Collection area";

const getValue = (item) => item[field] ?? item.collection_information?.[field] ?? item.edible_inedible_part?.[field] ?? item.pretreatment_conditions?.[field];

const uniqueFields = [...new Set(data.map(getValue))];

console.log(`"${field}" талбарын давхцахгүй утга: ${uniqueFields.length}`);
console.log(uniqueFields);
