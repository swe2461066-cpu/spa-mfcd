import { renderPageLayout } from "../layouts/pageLayout.js";

export function renderNotFoundPage() {
  const app = document.getElementById("app");
  app.innerHTML = renderPageLayout({
    id: "notFound",
    title: "404",
    content: `
      <p>404 хуудас (дараагийн бүлгүүдэд хийгдэнэ).</p>
    `,
  });
}
