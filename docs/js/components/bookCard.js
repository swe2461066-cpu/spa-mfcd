import { escapeHtml } from "../fn/format.js";
import { t, getLocalizedValue } from "../i18n/i18n.js";

// 2.12.3 — Номын карт: хавтас, тайлбар, "Үзэх" товч.
export function renderBookCard(book) {
  return `
    <div class="card book-card">
      <figure class="image">
        <img src="${escapeHtml(book.cover)}" alt="${escapeHtml(book.alt)}" class="book-cover" loading="lazy" />
      </figure>
      <div class="card-content book-description">
        <p class="book-title">${escapeHtml(book.alt)}</p>
        <p class="content">${escapeHtml(getLocalizedValue(book.description))}</p>
      </div>
      <footer class="card-footer book-footer">
        <button class="button is-primary book-view-btn" type="button" data-pdf="${escapeHtml(book.pdf)}">
          <span class="icon"><i class="fas fa-book-open"></i></span>
          <span>${t("books.view")}</span>
        </button>
      </footer>
    </div>
  `;
}
