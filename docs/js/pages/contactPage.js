import { renderPageLayout } from "../layouts/pageLayout.js";

export function renderContactPage() {
  const app = document.getElementById("app");
  app.innerHTML = renderPageLayout({
    id: "contact",
    title: "Contact",
    content: `
      <p>Contact хуудас (дараагийн бүлгүүдэд хийгдэнэ).</p>
    `,
  });
}
