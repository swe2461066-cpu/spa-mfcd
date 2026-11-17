import { getNutritions } from "../services/nutritionService.js"; // Хүнсний найрлагын өгөгдөл
import { loadImages } from "../services/imageService.js"; // Дээжийн зургийн жагсаалт
import {
  buildFoodGroups,
  bindSearchEvents,
  renderDefaultTables,
  initNutritionData,
  applyPendingSelectedFoodsFromOverview,
} from "../fn/foodSearchEvents.js";
import { renderSidebarPageLayout } from "../layouts/sidebarPageLayout.js";
import { bindSidebar, bindMenuListToggle } from "../fn/sidebarEvents.js";
import { renderPageLayout } from "../layouts/pageLayout.js";
import { renderNotification } from "../layouts/notificationLayout.js";
import { renderSearchFoodName } from "../components/searchFoodNameSidebar.js";
import { renderSearchSettings } from "../components/searchSettingsSidebar.js";
import { renderFoodGroupList } from "../components/searchFoodGroupListSidebar.js";
import { renderImageModal, bindImageModalEvents } from "../components/imageModal.js";
import { t } from "../i18n/i18n.js";

export async function renderSearchPage() {
  const app = document.getElementById("app");

  app.innerHTML = renderPageLayout({
    content: renderNotification(t("notification.loadingData")),
  });

  try {
    const nutritionData = await getNutritions(); // 2.6: service-ээс өгөгдөл авна
    await loadImages(); // 2.8: images.json ачаална
    initNutritionData(nutritionData);

    const groupedFoods = buildFoodGroups(nutritionData); // 2.7: food_group-ээр бүлэглэнэ

    app.innerHTML =
      renderSidebarPageLayout({
        sidebarContent: `${renderSearchFoodName()} ${renderSearchSettings()} ${renderFoodGroupList(groupedFoods)}`,
        pageId: "search",
        pageTitle: t("searchPage.title"),
        mainContent: `
          <div id="resultTbl">
            ${renderDefaultTables(nutritionData)}
          </div>
        `,
      }) + renderImageModal();

    bindSidebar();
    bindMenuListToggle();
    bindSearchEvents();
    bindImageModalEvents(); // дотроо нэг л удаа холбогдоно
    applyPendingSelectedFoodsFromOverview(); // 2.10.15: Тойм хуудаснаас сонгосон хүнс байвал автоматаар хайна
  } catch (error) {
    app.innerHTML = renderPageLayout({
      content: renderNotification(t("notification.failedToLoadNutritionData"), "danger"),
    });
    console.error("Failed to load nutrition data:", error);
  }
}
