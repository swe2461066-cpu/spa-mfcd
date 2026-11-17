import { renderGridPageLayout } from "../layouts/gridPageLayout.js";
import { renderPageLayout } from "../layouts/pageLayout.js";
import { renderNotification } from "../layouts/notificationLayout.js";
import { renderBookCard } from "../components/bookCard.js";
import { renderPdfModal, bindPdfModalEvents } from "../components/pdfModal.js";
import { getBooks } from "../services/bookService.js";
import { t } from "../i18n/i18n.js";

// 2.12.7 — Ном хуудас: номнуудыг grid-ээр харуулж, PDF-ийг modal-д нээнэ.
export async function renderBooksPage() {
  const app = document.getElementById("app");

  try {
    app.innerHTML =
      renderGridPageLayout({
        pageId: "books",
        pageTitle: t("books.title"),
        items: getBooks(),
        renderItem: renderBookCard,
        emptyContent: renderNotification(t("books.empty"), "warning"),
      }) + renderPdfModal();

    bindPdfModalEvents();
  } catch (error) {
    app.innerHTML = renderPageLayout({ content: renderNotification(t("books.failed"), "danger") });
    console.error("Failed to render books page:", error);
  }
}
