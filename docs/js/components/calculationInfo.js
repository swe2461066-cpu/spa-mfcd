import { renderNotification } from "../layouts/notificationLayout.js";
import { t } from "../i18n/i18n.js";

// 2.11.1 — Хүнс сонгоогүй үед тооцоолуурын тайлбарыг харуулна.
export function renderCalculationInfo() {
  return `
    ${renderNotification(t("calculation.selectedAmount"), "info")}
    ${renderNotification(t("calculation.dailyRequirement"), "warning")}
  `;
}
