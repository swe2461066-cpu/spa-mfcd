import { renderPageLayout } from "./pageLayout.js";
import { renderNotification } from "./notificationLayout.js";

// 2.12.2 — Олон баганатай grid layout. items-ийн элемент бүрийг renderItem()-ээр дүрсэлнэ.
export function renderGridPageLayout({
  items = [],
  renderItem = () => "",
  pageId = "",
  pageTitle = "",
  columnClass = "column is-half-tablet is-one-quarter-desktop",
  columnsClass = "columns is-multiline",
  emptyContent = renderNotification("No data available.", "warning"),
}) {
  const gridContent = items.length
    ? `
      <div class="${columnsClass}">
        ${items
          .map(
            (item, index) => `
          <div class="${columnClass}">
            ${renderItem(item, index)}
          </div>
        `,
          )
          .join("")}
      </div>
    `
    : emptyContent;

  return renderPageLayout({
    id: pageId,
    title: pageTitle,
    content: gridContent,
  });
}
