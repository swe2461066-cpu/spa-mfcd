import { renderNotification } from "../layouts/notificationLayout.js";
import { renderNutritionTables } from "../components/nutritionTables.js";
import { nutritionGroups } from "../components/searchSettingsSidebar.js";
import { getLocalizedValue, t } from "../i18n/i18n.js";

/* food_group бүрээр бүлэглэнэ.
   [{ groupName: {en, mn}, items: [{ food_code, food_name: {en, mn} }, ...] }, ...] */
export function buildFoodGroups(data) {
  const grouped = new Map(); // key → value бүтэц

  for (const item of data) {
    const groupKey = item.food_group?.en || "Other";
    if (!grouped.has(groupKey)) {
      grouped.set(groupKey, { groupName: item.food_group, items: new Map() });
    }
    grouped.get(groupKey).items.set(item.food_code, {
      food_code: item.food_code,
      food_name: item.food_name,
    });
  }

  return Array.from(grouped.values()).map((group) => ({
    groupName: group.groupName,
    items: Array.from(group.items.values()).sort((a, b) =>
      getLocalizedValue(a.food_name).localeCompare(getLocalizedValue(b.food_name)),
    ),
  }));
}

let nutritionData = [];

export function initNutritionData(data) {
  nutritionData = data;
}

// Анхдагчаар checked байгаа ангиллууд: ["proximates", "minerals", "vitamins"]
const DEFAULT_TYPES = nutritionGroups
  .flatMap((group) => group.items)
  .filter((item) => item.checked)
  .map((item) => item.value);

const DEFAULT_ITEM_COUNT = 3;

// UI дээрх бүх event (click, change, keydown)-ийг холбоно.
export function bindSearchEvents() {
  const searchBtn = document.getElementById("searchBtn");
  const searchTxt = document.getElementById("searchTxt");
  const sidebar = document.getElementById("docsSidebar");

  searchBtn?.addEventListener("click", handleTextSearch);

  searchTxt?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleTextSearch();
    }
  });

  // Миний засвар: event-ийг document биш sidebar дээр холбосон.
  // Ингэснээр хуудас руу дахин ороход listener давхардахгүй.
  sidebar?.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.matches('input[name="foodcode"]')) {
      handleFoodCodeSearch();
      return;
    }
    if (target.matches('input[name="nutrition"]')) {
      renderCurrentResults();
    }
  });
}

// Текст бичиж food_name-ээр хайх
function handleTextSearch() {
  clearCheckedFoodCodes();
  const keyword = getSearchKeyword();
  if (!keyword) {
    setResultHtml(renderNotification(t("notification.enterFoodName")));
    return;
  }
  renderCurrentResults();
}

// Хүнсний жагсаалтаас checkbox сонгож food_code-оор хайх
function handleFoodCodeSearch() {
  const searchTxt = document.getElementById("searchTxt");
  if (searchTxt) searchTxt.value = "";

  if (!getSelectedFoodCodes().length) {
    setResultHtml(renderDefaultTables(nutritionData));
    return;
  }
  renderCurrentResults();
}

function renderCurrentResults() {
  setResultHtml(renderNutritionTables(getMatchedItems(), getSelectedNutritionTypes()));
}

// Сонгосон food_code эсвэл keyword-оор шүүнэ. Хоёулаа хоосон бол эхний DEFAULT_ITEM_COUNT-ийг.
function getMatchedItems() {
  const selectedCodes = getSelectedFoodCodes();
  const keyword = getSearchKeyword();

  if (selectedCodes.length) {
    return nutritionData.filter((item) => selectedCodes.includes(item.food_code));
  }

  if (keyword) {
    if (keyword.length < 2) return []; // 2-оос бага тэмдэгт бол хайхгүй

    return nutritionData.filter((item) => {
      // Идэвхтэй хэл дээрх нэрийн аль нэг үг keyword-оор эхэлбэл тохирно.
      const foodName = getLocalizedValue(item.food_name).toLowerCase();
      return foodName.split(/[\s,]+/).some((word) => word.startsWith(keyword));
    });
  }

  return nutritionData.slice(0, DEFAULT_ITEM_COUNT);
}

function getSearchKeyword() {
  return document.getElementById("searchTxt")?.value.trim().toLowerCase() || "";
}

function getSelectedFoodCodes() {
  return Array.from(document.querySelectorAll('input[name="foodcode"]:checked')).map((cb) => cb.value);
}

function getSelectedNutritionTypes() {
  return Array.from(document.querySelectorAll('input[name="nutrition"]:checked')).map((cb) => cb.value);
}

function clearCheckedFoodCodes() {
  document.querySelectorAll('input[name="foodcode"]:checked').forEach((cb) => {
    cb.checked = false;
  });
}

function setResultHtml(html) {
  const resultTbl = document.getElementById("resultTbl");
  if (resultTbl) resultTbl.innerHTML = html;
}

// Анхдагч: эхний 3 хүнсийг proximates, minerals, vitamins хүснэгтээр харуулна.
export function renderDefaultTables(data) {
  return renderNutritionTables(data.slice(0, DEFAULT_ITEM_COUNT), DEFAULT_TYPES);
}
