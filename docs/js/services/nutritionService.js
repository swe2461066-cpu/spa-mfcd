import { DATA_MODE, LOCAL_NUTRITIONS_URL, API_NUTRITIONS_URL } from "../config.js";

// Нэг удаа татсан өгөгдлийг санах ойд хадгалж, дахин fetch хийхгүй (cache).
let nutritionCache = null;

/* Page нь өгөгдлийг хаанаас авч байгааг мэдэхгүй, зөвхөн getNutritions() гэж дуудна.
   API болгоход зөвхөн config.js өөрчлөгдөнө. */
export async function getNutritions() {
  if (nutritionCache) {
    return nutritionCache;
  }

  const url = DATA_MODE === "api" ? API_NUTRITIONS_URL : LOCAL_NUTRITIONS_URL;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to load nutritions data");
  }

  const data = await response.json();
  nutritionCache = data;
  return data;
}
