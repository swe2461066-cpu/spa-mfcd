import { escapeHtml } from "../fn/format.js";
import { t, getLocalizedValue } from "../i18n/i18n.js";
import { getFoodCode, getFoodName, getEnergy, getProtein, getFat, getCarbohydrate, getCalcium, getIron, getPhosphorus, getVitaminC } from "../fn/nutrientGetters.js";
import { getRequirementByAgeGender, getRequirementAgeOptions, getAgeLabel, getAgeObject } from "../services/nutrientRequirementService.js";
import { renderCalculationInfo } from "./calculationInfo.js";
import { renderTable } from "../layouts/tableLayout.js";

/* 2.11.7 — Хүнсний тооцоолуурын хүснэгтүүд.
   Миний өөрчлөлт: номд 8 шимт бодис бүрт ижил код (getter, data-*, id, нийлбэр, хувь) давтагдаж байсныг
   NUTRIENTS тохиргооны массив болгон нэгтгэсэн. Шинэ шимт бодис нэмэхэд зөвхөн энэ массивт нэг мөр нэмнэ. */
const NUTRIENTS = [
  { id: "energy", table: "macro", group: "proximates", key: "Energy (kcal)", get: getEnergy },
  { id: "protein", table: "macro", group: "proximates", key: "Protein (g)", get: getProtein },
  { id: "fat", table: "macro", group: "proximates", key: "Fat (g)", get: getFat },
  { id: "carbohydrate", table: "macro", group: "proximates", key: "Carbohydrate (g)", get: getCarbohydrate },
  { id: "calcium", table: "micro", group: "minerals", key: "Calcium (mg)", get: getCalcium },
  { id: "iron", table: "micro", group: "minerals", key: "Iron (mg)", get: getIron },
  { id: "phosphorus", table: "micro", group: "minerals", key: "Phosphorus (mg)", get: getPhosphorus },
  { id: "vitaminc", table: "micro", group: "vitamins", key: "Vitamin C (mg)", get: getVitaminC },
];

const DEFAULT_AMOUNT = 100;

// Хэрэгцээний хэдэн хувийг хангасныг тооцно.
function formatPercent(intake, requirement) {
  if (!requirement || requirement <= 0) return "";
  return `${((intake / requirement) * 100).toFixed(2)}%`;
}

// Миний нэмэлт: хувиас хамааран өнгө — 100%-иас их бол улаан, 50–100% ногоон, бага бол саарал.
function percentClass(intake, requirement) {
  if (!requirement) return "";
  const p = (intake / requirement) * 100;
  if (p > 100) return "has-text-danger has-text-weight-bold";
  if (p >= 50) return "has-text-success has-text-weight-bold";
  return "has-text-grey";
}

// 100 г-д ногдох утгыг хэрэглэх хэмжээгээр хөрвүүлнэ.
const scale = (per100g, amount) => (per100g * amount) / 100;

function collectTotals(container) {
  const totals = Object.fromEntries([["amount", 0], ...NUTRIENTS.map((n) => [n.id, 0])]);
  container.querySelectorAll(".amount-input").forEach((input) => {
    const amount = Number(input.value) || 0;
    totals.amount += amount;
    NUTRIENTS.forEach((n) => {
      totals[n.id] += scale(Number(input.dataset[n.id]) || 0, amount);
    });
  });
  return totals;
}

function renderAgeOptions(ageOptions = [], selectedAge = "") {
  return `
    <option value="" ${!selectedAge ? "selected" : ""} disabled>${t("form.age")}</option>
    ${ageOptions
      .map(
        (age) => `<option value="${escapeHtml(age.value)}" ${selectedAge === age.value ? "selected" : ""}>${escapeHtml(getAgeLabel(age.label))}</option>`,
      )
      .join("")}
  `;
}

function renderGenderOptions(selectedGender = "") {
  return `
    <option value="" ${!selectedGender ? "selected" : ""} disabled>${t("form.gender")}</option>
    <option value="male" ${selectedGender === "male" ? "selected" : ""}>${t("form.male")}</option>
    <option value="female" ${selectedGender === "female" ? "selected" : ""}>${t("form.female")}</option>
  `;
}

const removeButton = (food) => `
  <button type="button" class="button is-small is-danger is-light remove-row-btn" data-code="${escapeHtml(getFoodCode(food))}">×</button>
`;

// Шимт бодисын багана: 100 г-ийн утгаар эхэлж, хэмжээ өөрчлөгдөхөд updateRowValues() шинэчилнэ.
function nutrientColumn(n) {
  return {
    label: t(`nutrients.${n.key}`),
    thClass: "has-text-right",
    tdClass: "has-text-right",
    render: (food) => `<span id="${n.id}-${escapeHtml(getFoodCode(food))}">${n.get(food).toFixed(2)}</span>`,
  };
}

// Нийт / хэрэгцээ / хувь гэсэн 3 мөр footer.
function renderFooter(list, prefix, firstCells) {
  const cells = (cellPrefix) => list.map((n) => `<td id="${cellPrefix}-${n.id}" class="has-text-right"></td>`).join("");
  return `
    <tr class="has-background-light has-text-weight-semibold">
      <td>${t("calculation.total")}</td>
      <td id="${prefix}total-amount" class="has-text-right">0.00</td>
      ${list.map((n) => `<td id="total-${n.id}" class="has-text-right">0.00</td>`).join("")}
      <td></td>
    </tr>
    <tr class="has-text-weight-semibold">
      ${firstCells}
      ${cells("req")}
      <td></td>
    </tr>
    <tr>
      <td colspan="2" class="has-text-centered has-text-weight-semibold">${t("calculation.percentRequirement")}</td>
      ${cells("percent")}
      <td></td>
    </tr>
  `;
}

function renderMacrosTable(selectedFoods, ageOptions, selectedAge, selectedGender) {
  const macro = NUTRIENTS.filter((n) => n.table === "macro");
  return renderTable({
    title: t("calculation.macroTitle"),
    rows: selectedFoods,
    columns: [
      { label: t("table.foodName"), render: (food) => escapeHtml(getFoodName(food)) },
      {
        label: `${t("calculation.amount")} (g)`,
        render: (food) => `
          <input id="amount-${escapeHtml(getFoodCode(food))}" class="input is-small amount-input" type="number" min="0" step="1"
            value="${DEFAULT_AMOUNT}" ${NUTRIENTS.map((n) => `data-${n.id}="${n.get(food)}"`).join(" ")} />
        `,
      },
      ...macro.map(nutrientColumn),
      { label: "", tdClass: "has-text-centered", render: removeButton },
    ],
    footer: renderFooter(
      macro,
      "",
      `
        <td><div class="select is-small is-fullwidth"><select id="requirement-age">${renderAgeOptions(ageOptions, selectedAge)}</select></div></td>
        <td><div class="select is-small is-fullwidth"><select id="requirement-gender">${renderGenderOptions(selectedGender)}</select></div></td>
      `,
    ),
  });
}

function renderMicrosTable(selectedFoods) {
  const micro = NUTRIENTS.filter((n) => n.table === "micro");
  return renderTable({
    title: t("calculation.microTitle"),
    rows: selectedFoods,
    columns: [
      { label: t("table.foodName"), render: (food) => escapeHtml(getFoodName(food)) },
      {
        label: `${t("calculation.amount")} (g)`,
        tdClass: "has-text-right",
        render: (food) => `<span id="micro-amount-${escapeHtml(getFoodCode(food))}">${DEFAULT_AMOUNT.toFixed(2)}</span>`,
      },
      ...micro.map(nutrientColumn),
      { label: "", tdClass: "has-text-centered", render: removeButton },
    ],
    footer: renderFooter(micro, "micro-", `<td id="selected-age-micro"></td><td id="selected-gender-micro"></td>`),
  });
}

export function renderCalculationTable(selectedFoods = [], ageOptions = [], selectedAge = "", selectedGender = "") {
  if (!selectedFoods.length) return renderCalculationInfo();
  return `
    <div id="calculationTableWrap" class="mt-4">
      ${renderMacrosTable(selectedFoods, ageOptions, selectedAge, selectedGender)}
      ${renderMicrosTable(selectedFoods)}
    </div>
  `;
}

// Нэг мөрийн хэмжээ өөрчлөгдөхөд тухайн хүнсний бүх шимт бодисыг шинэчилнэ.
function updateRowValues(code) {
  const input = document.getElementById(`amount-${code}`);
  if (!input) return;
  const amount = Number(input.value) || 0;
  document.getElementById(`micro-amount-${code}`)?.replaceChildren(amount.toFixed(2));
  NUTRIENTS.forEach((n) => {
    document.getElementById(`${n.id}-${code}`)?.replaceChildren(scale(Number(input.dataset[n.id]) || 0, amount).toFixed(2));
  });
}

const setText = (container, selector, value) => {
  const el = container.querySelector(selector);
  if (el) el.textContent = value;
};

export function updateTotals(container = document) {
  const totals = collectTotals(container);
  setText(container, "#total-amount", totals.amount.toFixed(2));
  setText(container, "#micro-total-amount", totals.amount.toFixed(2));
  NUTRIENTS.forEach((n) => setText(container, `#total-${n.id}`, totals[n.id].toFixed(2)));
}

function getGenderLabel(gender) {
  if (gender === "male") return t("form.male");
  if (gender === "female") return t("form.female");
  return "";
}

// Нас, хүйсийг сонгосон бол хоногийн хэрэгцээ болон хангасан хувийг харуулна.
export async function updateRequirementSummary(container = document) {
  const age = container.querySelector("#requirement-age")?.value || "";
  const gender = container.querySelector("#requirement-gender")?.value || "";
  const totals = collectTotals(container);

  if (!age || !gender) {
    ["#selected-age-micro", "#selected-gender-micro", ...NUTRIENTS.flatMap((n) => [`#req-${n.id}`, `#percent-${n.id}`])].forEach((s) =>
      setText(container, s, ""),
    );
    return;
  }

  const requirement = await getRequirementByAgeGender(age, gender);
  const ageObject = await getAgeObject(age);
  setText(container, "#selected-age-micro", typeof ageObject === "object" ? getLocalizedValue(ageObject) : ageObject);
  setText(container, "#selected-gender-micro", getGenderLabel(gender));

  NUTRIENTS.forEach((n) => {
    const req = Number(requirement?.[n.group]?.[n.key] ?? 0);
    setText(container, `#req-${n.id}`, req.toFixed(2));
    const cell = container.querySelector(`#percent-${n.id}`);
    if (cell) {
      cell.textContent = formatPercent(totals[n.id], req);
      cell.className = `has-text-right ${percentClass(totals[n.id], req)}`;
    }
  });
}

function bindTableEvents(container, nutritionData) {
  container.querySelector("#requirement-age")?.addEventListener("change", () => updateRequirementSummary(container));
  container.querySelector("#requirement-gender")?.addEventListener("change", () => updateRequirementSummary(container));

  container.querySelectorAll(".amount-input").forEach((input) => {
    input.addEventListener("input", async () => {
      updateRowValues(input.id.replace("amount-", ""));
      updateTotals(container);
      await updateRequirementSummary(container);
    });
  });

  // × товч: sidebar дээрх checkbox-ийг арилгаад хүснэгтийг дахин зурна.
  container.querySelectorAll(".remove-row-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      const checkbox = document.querySelector(`input[name="foodcode"][value="${CSS.escape(button.dataset.code)}"]`);
      if (checkbox) checkbox.checked = false;
      await refreshCalculationTable(nutritionData);
    });
  });
}

// Sidebar дээр сонгосон хүнснүүдээр хүснэгтийг дахин зурна. Өмнө оруулсан хэмжээ, нас, хүйсийг хадгална.
export async function refreshCalculationTable(nutritionData) {
  const resultBox = document.getElementById("resultCalculatedTbl");
  if (!resultBox) return;

  const checkedCodes = [...document.querySelectorAll('input[name="foodcode"]:checked')].map((el) => el.value);
  const selectedFoods = checkedCodes.map((code) => nutritionData.find((food) => food.food_code === code)).filter(Boolean);

  const currentAge = resultBox.querySelector("#requirement-age")?.value || "";
  const currentGender = resultBox.querySelector("#requirement-gender")?.value || "";
  // Миний засвар: номын кодонд хүнс нэмэх бүрт бүх хэмжээ 100 г болж буцдаг байсныг хадгалдаг болгосон.
  const previousAmounts = Object.fromEntries([...resultBox.querySelectorAll(".amount-input")].map((i) => [i.id, i.value]));

  resultBox.innerHTML = renderCalculationTable(selectedFoods, await getRequirementAgeOptions(), currentAge, currentGender);

  Object.entries(previousAmounts).forEach(([id, value]) => {
    const input = resultBox.querySelector(`#${CSS.escape(id)}`);
    if (input) {
      input.value = value;
      updateRowValues(id.replace("amount-", ""));
    }
  });

  bindTableEvents(resultBox, nutritionData);
  updateTotals(resultBox);
  await updateRequirementSummary(resultBox);
}
