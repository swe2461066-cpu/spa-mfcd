import { translations } from "./translations.js";

/* Апп эхлэхэд ашиглах үндсэн хэл.
   localStorage-д хэл хадгалагдаагүй бол энэ хэл ашиглагдана. */
const DEFAULT_LANGUAGE = "mn";

// Одоогоор сонгогдсон хэл (localStorage → эсвэл DEFAULT_LANGUAGE)
export function getCurrentLanguage() {
  return localStorage.getItem("language") || DEFAULT_LANGUAGE;
}

// Хэрэглэгчийн сонгосон хэлийг localStorage-д хадгална. setLanguage("en")
export function setLanguage(language) {
  localStorage.setItem("language", language);
}

/* translations объект дотроос текст хайж авна.
   t("nav.search") → translations["mn"]["nav"]["search"] → "Хайлт"
   Орчуулга байхгүй бол path-ийг өөрийг нь буцаана. */
export function t(path) {
  const language = getCurrentLanguage();
  const keys = path.split(".");
  let value = translations[language];
  for (const key of keys) {
    value = value?.[key];
  }
  return value ?? path;
}

// Хэлийг MN <-> EN хооронд сольж хадгална.
export function toggleLanguage() {
  const current = getCurrentLanguage();
  const next = current === "mn" ? "en" : "mn";
  setLanguage(next);
  return next;
}

/* { en, mn } бүтэцтэй өгөгдлөөс одоогийн хэлний утгыг авах helper.
   Шинэ бүтэц: { en: "Barley flour", mn: "Арвайн гурил" }, хуучин бүтэц: "Barley flour" — хоёуланг дэмжинэ. */
export function getLocalizedValue(value, fallback = "") {
  const language = getCurrentLanguage();
  if (value == null) return fallback;

  if (typeof value === "object" && !Array.isArray(value)) {
    // {en, mn} бүтэц
    if ("en" in value || "mn" in value) {
      return value[language] || value.en || value.mn || fallback;
    }
    // Энгийн object бол бүх value-г давтаж хөрвүүлнэ
    return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, getLocalizedValue(val, fallback)]));
  }
  return value;
}

/* "25.11.2021", "2021.11.25", "2021-11-25" форматуудыг таниад
   mn → 2021.11.25, en → November 25, 2021 болгоно. */
export function formatDate(dateString) {
  if (!dateString) return "";
  const language = getCurrentLanguage();
  let day, month, year;
  const parts = dateString.split(/[.-]/);
  if (parts.length !== 3) {
    return dateString;
  }

  if (parts[0].length === 4) {
    [year, month, day] = parts; // yyyy.mm.dd
  } else if (parts[2].length === 4) {
    [day, month, year] = parts; // dd.mm.yyyy
  } else {
    return dateString;
  }

  day = String(day).padStart(2, "0");
  month = String(month).padStart(2, "0");

  if (language === "mn") {
    return `${year}.${month}.${day}`;
  }

  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
