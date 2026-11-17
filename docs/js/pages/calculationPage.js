import { getNutritions } from "../services/nutritionService.js";
import { buildFoodGroups } from "../fn/foodSearchEvents.js";
import { renderSidebarPageLayout } from "../layouts/sidebarPageLayout.js";
import { bindSidebar, bindMenuListToggle } from "../fn/sidebarEvents.js";
import { renderPageLayout } from "../layouts/pageLayout.js";
import { renderNotification } from "../layouts/notificationLayout.js";
import { renderFoodGroupList } from "../components/searchFoodGroupListSidebar.js";
import { renderCalculationTable, refreshCalculationTable } from "../components/calculationTable.js";
import { getNutrientRequirements } from "../services/nutrientRequirementService.js";
import { t } from "../i18n/i18n.js";

// 2.11.8 — Хүнсний тооцоолуур: зүүн талд хүнсний бүлгүүд, баруун талд тооцооны хүснэгт.
export async function renderCalculationPage() {
  const app = document.getElementById("app");
  app.innerHTML = renderPageLayout({ content: renderNotification(t("notification.loadingData")) });

  try {
    const nutritionData = await getNutritions();
    await getNutrientRequirements(); // хэрэгцээний өгөгдлийг урьдчилан ачаална
    const groupedFoods = buildFoodGroups(nutritionData);

    app.innerHTML = renderSidebarPageLayout({
      sidebarContent: renderFoodGroupList(groupedFoods),
      pageId: "calculation",
      pageTitle: t("calculation.title"),
      mainContent: `<div id="resultCalculatedTbl">${renderCalculationTable([])}</div>`,
    });

    bindSidebar();
    bindMenuListToggle();

    // Миний засвар: номд change event-ийг document дээр холбодог тул хуудас руу дахин орох бүрт давхардаж байсан.
    // Одоо sidebar элемент дээр холбосон тул хуудас дахин зурагдахад хуучин listener хамт устна.
    document.getElementById("docsSidebar")?.addEventListener("change", async (event) => {
      if (event.target instanceof HTMLInputElement && event.target.matches('input[name="foodcode"]')) {
        await refreshCalculationTable(nutritionData);
      }
    });
  } catch (error) {
    app.innerHTML = renderPageLayout({
      content: renderNotification(t("notification.failedToLoadNutritionData"), "danger"),
    });
    console.error("Failed to load nutrition data:", error);
  }
}
