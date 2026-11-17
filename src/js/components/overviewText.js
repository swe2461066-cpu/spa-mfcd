import { getTxt } from "../services/txtService.js";
import { escapeHtml } from "../fn/format.js";

// 2.10.9 — Танилцуулгын текст. Миний засвар: "\n\n"-ээр догол мөр болгон хувааж <p> болгосон.
export function renderOverviewText(lang = "en") {
  const paragraphs = getTxt(lang, "overviewText")
    .split(/\n\s*\n/)
    .map((para) => `<p class="app-txt">${escapeHtml(para)}</p>`)
    .join("");

  return `<div class="app-overview-text">${paragraphs}</div>`;
}
