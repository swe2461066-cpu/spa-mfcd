import { titleFromKey, escapeHtml } from "../fn/format.js";
import { renderTable } from "../layouts/tableLayout.js";
import { renderNotification } from "../layouts/notificationLayout.js";
import { getImagesByFoodCode } from "../services/imageService.js";
import { getLocalizedValue, formatDate, t } from "../i18n/i18n.js";

/* Хайлтын үр дүнгийн хүснэгтүүд.
   items = хайгаад олсон хүнсний найрлагын json өгөгдөл
   selectedTypes = ["proximates", "minerals", "vitamins", ...] */
export function renderNutritionTables(items, selectedTypes) {
  if (!items.length) {
    return renderNotification(t("notification.noMatchFound"));
  }
  if (!selectedTypes.length) {
    return renderNotification(t("notification.selectAtLeastOneCategory"));
  }

  // Миний нэмэлт: хэдэн хүнс олдсоныг хүснэгтийн дээр харуулна.
  const summary = `
    <p class="app-found-count">
      <span class="tag is-warning is-light is-medium">${t("searchPage.foundCount")}: <strong class="ml-1">${items.length}</strong></span>
    </p>
  `;

  return summary + selectedTypes.map((type) => renderTableByType(type, items)).join("");
}

// Тухайн төрлийн (proximates, minerals, ...) хүснэгтийг үүсгэнэ.
function renderTableByType(type, items) {
  // description — талбарууд нь өөр учраас тусад нь
  if (type === "description") {
    return renderTable({
      title: t("table.description"),
      columns: [
        { key: "food_name", label: t("table.foodName") },
        { key: "food_group", label: t("table.foodGroup") },
        { key: "scientific_name", label: t("table.scientificName") },
        { key: "province", label: t("table.province") },
      ],
      rows: items.map((item) => ({
        ...item,
        food_name: getLocalizedValue(item.food_name),
        food_group: getLocalizedValue(item.food_group),
        province: getLocalizedValue(item.province),
      })),
    });
  }

  // images — зургийн тоог дарахад modal нээгдэнэ
  if (type === "images") {
    return renderTable({
      title: t("table.images"),
      columns: [
        { key: "food_name", label: t("table.foodName") },
        {
          key: "number_of_images",
          label: t("table.numberOfImages"),
          render: (item) => {
            const count = getImagesByFoodCode(item.food_code).length;
            return count > 0
              ? `<span class="tag is-primary image-count-tag open-image-btn"
                       data-foodcode="${escapeHtml(item.food_code)}"
                       data-foodname="${escapeHtml(item.food_name)}">${count}</span>`
              : "-";
          },
        },
      ],
      rows: items.map((item) => ({
        ...item,
        food_name: getLocalizedValue(item.food_name),
      })),
    });
  }

  /* 1. Бүх item-ийн тухайн type доторх key-үүдийг давхардалгүй цуглуулна.
        type = "vitamins" → ["Vitamin A (μg)", "Thiamin (mg)", ...] */
  const nutrientKeys = Array.from(
    new Set(
      items.flatMap((item) => {
        const data = item?.[type];
        return data && typeof data === "object" && !Array.isArray(data) ? Object.keys(data) : [];
      }),
    ),
  );

  // 2. Багануудыг үүсгэнэ. Гарчгийг table.* эсвэл nutrients.* орчуулгаас авна.
  const columns = [
    { key: "food_name", label: t("table.foodName") },
    ...nutrientKeys.map((key) => ({
      key,
      label:
        t(`table.${key}`) !== `table.${key}`
          ? t(`table.${key}`)
          : t(`nutrients.${key}`) !== `nutrients.${key}`
            ? t(`nutrients.${key}`)
            : key,
    })),
  ];

  // 3. Мөрүүд — {en, mn} утгуудыг одоогийн хэл рүү хөрвүүлж, огноог форматлана.
  const rows = items.map((item) => {
    const rowData = getLocalizedValue(item?.[type] && typeof item[type] === "object" ? item[type] : {});
    if (rowData["Collection date"]) {
      rowData["Collection date"] = formatDate(rowData["Collection date"]);
    }
    return {
      food_name: getLocalizedValue(item.food_name),
      ...rowData,
    };
  });

  return renderTable({
    title: t(`sidebar.${type}`) !== `sidebar.${type}` ? t(`sidebar.${type}`) : titleFromKey(type),
    columns,
    rows,
  });
}
