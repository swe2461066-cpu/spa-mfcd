import { safeValue } from "../fn/format.js";
import { renderNotification } from "./notificationLayout.js";

/* Дахин ашиглагдах хүснэгтийн layout (2.11.3 шинэчлэлт).
   columns = [{ key, label, render?, thClass?, tdClass? }]
   - render(row) өгсөн бол нүдэнд HTML-ийг шууд гаргана, үгүй бол row[key]-г safeValue-ээр хамгаалж гаргана.
   - footer — <tfoot> дотор нийлбэр, хувь зэргийг харуулах мөрүүд. */
export function renderTable({
  title = "",
  columns = [],
  rows = [],
  footer = "",
  emptyMessage = "No data available.",
  wrapperClass = "table-container app-tbl",
  tableClass = "table is-striped is-bordered is-hoverable is-fullwidth",
  titleClass = "subtitle app-subtitle",
}) {
  return `
    <div class="${wrapperClass}">
      ${title ? `<h2 class="${titleClass}">${safeValue(title)}</h2>` : ""}
      ${
        rows.length
          ? `
        <table class="${tableClass}">
          <thead>
            <tr>
              ${columns.map((col) => `<th class="${col.thClass || ""}">${safeValue(col.label)}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (row) => `
              <tr>
                ${columns
                  .map((col) => {
                    const value = typeof col.render === "function" ? col.render(row) : safeValue(row[col.key]);
                    return `<td class="${col.tdClass || ""}">${value}</td>`;
                  })
                  .join("")}
              </tr>
            `,
              )
              .join("")}
          </tbody>
          ${footer ? `<tfoot>${footer}</tfoot>` : ""}
        </table>
      `
          : renderNotification(safeValue(emptyMessage))
      }
    </div>
    <br>
  `;
}
