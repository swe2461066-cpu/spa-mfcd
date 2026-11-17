import { escapeHtml } from "../fn/format.js";
import { getLocalizedValue, t } from "../i18n/i18n.js";

// 2.10.5 — Аймгийн дээжүүдийг checkbox-оор сонгоод Хайлт хуудас руу дамжуулах modal.
export function renderInfoModal() {
  return `
    <div class="modal" id="infoModal">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title" id="modalTitle">${t("modal.province")}</p>
          <button class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
          <div id="modalContent">${t("modal.informationWillAppear")}</div>
        </section>
        <footer class="modal-card-foot is-flex is-justify-content-space-between">
          <div>
            <span id="selectedCount" class="tag is-warning is-light is-medium">0 ${t("modal.selected")}</span>
          </div>
          <div class="buttons">
            <button class="button is-link is-small" id="clearFoodsBtn" type="button">${t("modal.clear")}</button>
            <button class="button is-link is-small" id="selectAllFoodsBtn" type="button">${t("modal.selectAll")}</button>
            <button class="button is-primary is-small" id="searchSelectedFoodsBtn" type="button">${t("modal.search")}</button>
            <button class="button modal-close-btn is-dark is-small" type="button">${t("modal.close")}</button>
          </div>
        </footer>
      </div>
    </div>
  `;
}

// Modal дотор хүнсний жагсаалтыг checkbox хэлбэрээр гаргана.
export function renderModalFoodList(foods) {
  return `
    <div class="content">
      ${foods
        .map((food) => {
          const safeFoodCode = escapeHtml(food.food_code);
          const safeFoodName = escapeHtml(getLocalizedValue(food.food_name));
          return `
            <label class="checkbox is-block mb-2 app-sublist-item">
              <input type="checkbox" class="overview-food-checkbox" value="${safeFoodCode}" data-foodname="${safeFoodName}" />
              <span>${safeFoodName}</span>
            </label>
          `;
        })
        .join("")}
    </div>
  `;
}

export function openModal({ title, content }) {
  const modal = document.getElementById("infoModal");
  const titleEl = document.getElementById("modalTitle");
  const contentEl = document.getElementById("modalContent");
  if (!modal || !titleEl || !contentEl) return;

  titleEl.textContent = title;
  contentEl.innerHTML = content;
  modal.classList.add("is-active");
  updateSelectedCount();
}

export function closeModal() {
  document.getElementById("infoModal")?.classList.remove("is-active");
}

// Сонгосон хүнсний тоог шинэчилнэ. "Хайх" товчийг сонголтгүй үед идэвхгүй болгоно (миний нэмэлт).
function updateSelectedCount() {
  const count = document.querySelectorAll(".overview-food-checkbox:checked").length;
  const el = document.getElementById("selectedCount");
  if (el) el.textContent = `${count} ${t("modal.selected")}`;
  const searchBtn = document.getElementById("searchSelectedFoodsBtn");
  if (searchBtn) searchBtn.disabled = count === 0;
}

export function bindModalEvents() {
  const modal = document.getElementById("infoModal");
  if (!modal) return;

  modal.querySelector(".modal-background")?.addEventListener("click", closeModal);
  modal.querySelector(".delete")?.addEventListener("click", closeModal);
  modal.querySelector(".modal-close-btn")?.addEventListener("click", closeModal);

  modal.addEventListener("change", (e) => {
    if (e.target.classList.contains("overview-food-checkbox")) updateSelectedCount();
  });

  const setAll = (checked) => {
    modal.querySelectorAll(".overview-food-checkbox").forEach((checkbox) => {
      checkbox.checked = checked;
    });
    updateSelectedCount();
  };
  modal.querySelector("#clearFoodsBtn")?.addEventListener("click", () => setAll(false));
  modal.querySelector("#selectAllFoodsBtn")?.addEventListener("click", () => setAll(true));

  // Сонгосон хүнснүүдийг sessionStorage-д хадгалаад Хайлт хуудас руу шилжинэ.
  modal.querySelector("#searchSelectedFoodsBtn")?.addEventListener("click", () => {
    const checkedFoods = Array.from(modal.querySelectorAll(".overview-food-checkbox:checked")).map((input) => ({
      food_code: input.value,
      food_name: input.dataset.foodname,
    }));
    if (!checkedFoods.length) return;

    sessionStorage.setItem("pendingSelectedFoods", JSON.stringify(checkedFoods));
    closeModal();
    window.location.hash = "#/search";
  });

  // ESC дарахад хаана (миний нэмэлт).
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
  });
}
