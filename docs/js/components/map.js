import { loadMapSvg, getFoodsByProvince, countFoodsByProvince } from "../services/mapService.js";
import { openModal, renderModalFoodList } from "./infoModal.js";
import { t } from "../i18n/i18n.js";

// 2.10.3 — Монголын газрын зураг. Аймаг дээр дарахад тухайн аймгийн дээжүүд modal-д гарна.
export function renderMap() {
  return `
    <div class="map-wrap">
      <div id="svg-container"></div>
      <p class="map-legend">
        <span class="map-legend-dot has-data"></span> ${t("map.hasData")}
        <span class="map-legend-dot no-data ml-4"></span> ${t("map.noData")}
      </p>
    </div>
  `;
}

// Газрын зургийг ачаалж, аймаг бүр дээр click event холбоно.
export async function bindMapEvents(nutritionData, lang = "en") {
  const svgContainer = document.getElementById("svg-container");
  if (!svgContainer) return;

  svgContainer.innerHTML = await loadMapSvg();
  updateMapLabels(svgContainer, lang);

  // Миний нэмэлт: дээжтэй аймгуудыг ялгаж будах, hover хийхэд дээжийн тоог tooltip-оор харуулах.
  const counts = countFoodsByProvince(nutritionData);

  svgContainer.querySelectorAll("svg path[name]").forEach((path) => {
    const provinceNameEn = path.getAttribute("name")?.trim();
    if (!provinceNameEn) return;

    const count = counts[provinceNameEn] || 0;
    path.classList.toggle("has-data", count > 0);

    const tooltip = document.createElementNS("http://www.w3.org/2000/svg", "title");
    tooltip.textContent = `${getProvinceDisplayName(provinceNameEn, lang)}: ${count} ${t("map.samples")}`;
    path.appendChild(tooltip);

    path.addEventListener("click", () => {
      const title = getProvinceDisplayName(provinceNameEn, lang);
      const matchedFoods = getFoodsByProvince(nutritionData, provinceNameEn);

      if (matchedFoods.length > 0) {
        const foods = matchedFoods.map((item) => ({ food_code: item.food_code, food_name: item.food_name }));
        openModal({ title, content: renderModalFoodList(foods) });
      } else {
        openModal({
          title,
          content: `<p class="has-text-grey">${t("notification.noFoodData")}</p>`,
        });
      }
    });
  });
}

function getProvinceDisplayName(provinceNameEn, lang) {
  return (
    provinceTitleMap[provinceNameEn]?.[lang] ||
    `${provinceNameMap[provinceNameEn]?.[lang] || provinceNameEn} ${t("modal.province")}`
  );
}

// Миний засвар: номын жагсаалтад Uvs давхар байсныг арилгаж, Орхон, Говьсүмбэр-ийг нэмсэн.
const provinceNameMap = {
  Uvs: { en: "Uvs", mn: "Увс" },
  Khovd: { en: "Khovd", mn: "Ховд" },
  Dornod: { en: "Dornod", mn: "Дорнод" },
  Dornogovi: { en: "Dornogovi", mn: "Дорноговь" },
  Umnugovi: { en: "Umnugovi", mn: "Өмнөговь" },
  Khuvsgul: { en: "Khuvsgul", mn: "Хөвсгөл" },
  Bulgan: { en: "Bulgan", mn: "Булган" },
  Selenge: { en: "Selenge", mn: "Сэлэнгэ" },
  "Darkhan-Uul": { en: "Darkhan-Uul", mn: "Дархан-Уул" },
  Khentii: { en: "Khentii", mn: "Хэнтий" },
  Tuv: { en: "Tuv", mn: "Төв" },
  Ulaanbaatar: { en: "Ulaanbaatar", mn: "Улаанбаатар" },
  Arkhangai: { en: "Arkhangai", mn: "Архангай" },
  Dundgovi: { en: "Dundgovi", mn: "Дундговь" },
  Uvurkhangai: { en: "Uvurkhangai", mn: "Өвөрхангай" },
  Zavkhan: { en: "Zavkhan", mn: "Завхан" },
  "Govi-Altai": { en: "Govi-Altai", mn: "Говь-Алтай" },
  Sukhbaatar: { en: "Sukhbaatar", mn: "Сүхбаатар" },
  Bayankhongor: { en: "Bayankhongor", mn: "Баянхонгор" },
  "Bayan-Ulgii": { en: "Bayan-Ulgii", mn: "Баян-Өлгий" },
  Orkhon: { en: "Orkhon", mn: "Орхон" },
  "Govi-Sumber": { en: "Govi-Sumber", mn: "Говьсүмбэр" },
};

const provinceTitleMap = {
  Ulaanbaatar: { en: "Ulaanbaatar city", mn: "Улаанбаатар хот" },
};

// SVG доторх англи нэрүүдийг сонгосон хэл рүү сольно.
function updateMapLabels(svgContainer, lang = "en") {
  svgContainer.querySelectorAll("svg text").forEach((text) => {
    const names = provinceNameMap[text.textContent.trim()];
    if (names) {
      text.textContent = names[lang] || names.en;
    }
  });
}
