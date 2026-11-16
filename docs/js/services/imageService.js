import { LOCAL_IMAGES_URL } from "../config.js";

let imageMap = {};

// ./data/images.json файлаас бүх зургийн замыг нэг удаа ачаална.
export async function loadImages() {
  if (Object.keys(imageMap).length > 0) return;

  const response = await fetch(LOCAL_IMAGES_URL);
  if (!response.ok) {
    throw new Error("Failed to load images.json");
  }
  imageMap = await response.json(); // { "01_0001": ["img/foods/01_0001_001.jpg", ...], ... }
}

// "01_0001" → ["img/foods/01_0001_001.jpg", "img/foods/01_0001_002.jpg"]
export function getImagesByFoodCode(foodCode) {
  return imageMap[foodCode] || [];
}
