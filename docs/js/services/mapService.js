// 2.10.2 — Газрын зураг ачаалах, аймгаар хүнс шүүх service.

// SVG газрын зургийг текст хэлбэрээр ачаална (DOM-д шууд оруулахын тулд).
export async function loadMapSvg() {
  const response = await fetch("./img/map.svg");
  if (!response.ok) {
    throw new Error("Failed to load map.svg");
  }
  return await response.text();
}

// Аймгийн англи нэрээр (Uvs, Khovd ...) хүнсний өгөгдлийг шүүнэ.
export function getFoodsByProvince(nutritionData, provinceNameEn) {
  if (!Array.isArray(nutritionData)) return [];
  return nutritionData.filter((item) => {
    const province = typeof item.province === "object" ? item.province?.en : item.province;
    return province?.trim() === provinceNameEn; // Миний засвар: "Arkhangai " гэх мэт илүү зайтай утгыг ч таньна.
  });
}

// Миний нэмэлт: аймаг бүрт хэдэн дээж байгааг тоолно (газрын зураг дээр өнгөөр ялгахад).
export function countFoodsByProvince(nutritionData) {
  const counts = {};
  for (const item of nutritionData || []) {
    const province = (typeof item.province === "object" ? item.province?.en : item.province)?.trim();
    if (province) counts[province] = (counts[province] || 0) + 1;
  }
  return counts;
}
