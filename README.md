# Mongolian Food Composition Database — SPA (2.6–2.13 туршилт)

"Хүнсний найрлагын мэдээллийн сангаар Single Page Application бүтээх" номын II бүлгийн
жишээнүүдийг өөрийн болгож туршсан төсөл. Vanilla JavaScript (ES modules), Bulma, Sass.

**Сайт:** https://swe2461066-cpu.github.io/spa-mfcd/

| Хэсэг | Агуулга |
|---|---|
| 2.6 | Services/data layer — `config.js`, `services/nutritionService.js` |
| 2.7 | Хайлтын хуудас — sidebar layout, хүнсний нэр/бүлгээр шүүх, хүснэгтүүд |
| 2.8 | Дээжийн зураг — `tools/generate-images-json.mjs`, `services/imageService.js`, `components/imageModal.js` |
| 2.9 | Хэл солих (MN/EN) — `tools/convertNutritionsEnMn.js`, `i18n/` |
| 2.10 | Тойм — газрын зураг (`components/map.js`), аймгийн modal (`infoModal.js`), танилцуулга, `splitPageLayout.js` |
| 2.11 | Хүнсний тооцоолуур — `calculationTable.js`, `nutrientRequirementService.js`, хоногийн хэрэгцээ |
| 2.12 | Ном — `gridPageLayout.js`, `bookCard.js`, `pdfModal.js` |
| 2.13 | Footer — `components/footer.js` |

## Ажиллуулах

```bash
npm install
npm run generate:images   # src/data/images.json үүсгэнэ
npm run convert:enmn      # src/data/nutritionsEnMn.json үүсгэнэ
npm run requirements      # src/data/nutrientRequirements.json үүсгэнэ
npm run sass:build        # src/css/main.css
npm start                 # http://127.0.0.1:5500/
```

GitHub Pages: `src`-ийг `docs` руу хуулна (`npm run docs`), Pages-ийн эх үүсвэр нь `master /docs`.

## Номын кодоос өөрчилсөн зүйлс

### 2.6–2.9
- `tableLayout.js` — баганын `render()` функцийг дэмждэг болгосон (номд 2.8.3-т `render` нэмэгдсэн ч
  `tableLayout.js` дэмжээгүй тул зургийн тоо харагдахгүй байсан).
- `convertNutritionsEnMn.js` — илүү/дутуу зайтай утгуудыг `normalize()`-оор таньж орчуулдаг болгосон,
  орчуулга олдоогүй утгуудыг хэвлэдэг болгосон, номд байхгүй 4 утгын орчуулгыг нэмсэн.
- `searchUniqueField.js` — талбарын нэрийг командын мөрөөс авдаг болгосон.
- `nutritionTables.js` — олдсон хүнсний тоог харуулдаг болгосон.
- `imageModal.js` — зургийн дугаар (1 / 10), ← → товчлуураар зураг солих.
- `foodSearchEvents.js` — `change` event-ийг `document` биш sidebar дээр холбож, хуудас руу дахин
  ороход listener давхардахаас сэргийлсэн; нэрийг таслалаар ч хувааж хайдаг болгосон.

### 2.10–2.13
- `map.js` — дээжтэй аймгуудыг өөр өнгөөр будаж, өнгөний тайлбар нэмсэн; hover хийхэд дээжийн тоо гарна.
  Номын `provinceNameMap`-д давхардсан `Uvs`-ийг арилгаж, Орхон, Говьсүмбэрийг нэмсэн.
- `mapService.js` — "Arkhangai " гэх мэт илүү зайтай аймгийн нэрийг ч таньдаг болгосон.
- `infoModal.js` — хүнс сонгоогүй үед "Хайх" товч идэвхгүй, ESC-ээр хаагдана; `alert()`-ийг арилгасан.
- `foodSearchEvents.js` — Тойм хуудаснаас ирэхэд сонгосон хүнсний бүлгийг sidebar дээр автоматаар задална.
- `calculationTable.js` — 8 шимт бодис бүрт давтагдсан кодыг `NUTRIENTS` тохиргооны массив болгосон
  (~520 мөр → ~260 мөр). Хүнс нэмэх бүрт өмнө оруулсан хэмжээ 100 г болж буцдаг алдааг зассан.
  Хэрэгцээний хувийг өнгөөр ялгасан (>100% улаан, 50–100% ногоон).
- `calculationPage.js` — `change` listener-ийг `document` биш sidebar дээр холбосон (давхардалгүй).
- `tools/buildNutrientRequirements.js` — 20 объектыг гараар бичихийн оронд хүснэгтээс JSON үүсгэдэг скрипт.
- `overviewText.js` — `\n\n`-ээр догол мөр болгон хувааж харуулдаг болгосон.
- `footer.js` — давтагдсан `<li>`-уудыг массиваас үүсгэдэг болгож, inline style-ийг SCSS руу шилжүүлсэн.
- `bookCard.js` — номын гарчиг, hover эффект нэмсэн.

> `src/pdf/` доторх PDF-үүд нь түр жишээ файл (жинхэнэ PDF-үүд хичээлийн материалд байгаагүй).
