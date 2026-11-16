/* XSS (Cross-Site Scripting) халдлагаас хамгаалах зориулалттай.
   Хэрэглэгчийн оруулсан текстийг HTML-д аюулгүй гаргахын тулд тусгай тэмдэгтүүдийг HTML entity-ээр солино. */
export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// null, undefined, хоосон утгыг "-" болгож харуулах, XSS хамгаалах функц.
export function safeValue(value) {
  return escapeHtml(value === "" ? "-" : (value ?? "-"));
}

// JSON key → хүний уншихад ойлгомжтой title. "collection_information" → "Collection Information"
export function titleFromKey(key) {
  return escapeHtml(
    String(key ?? "")
      .replaceAll("_", " ")
      .replace(/\b\w/g, (ch) => ch.toUpperCase()),
  );
}
