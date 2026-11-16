# Mongolian Food Composition Database — SPA (2.6–2.9 туршилт)

"Хүнсний найрлагын мэдээллийн сангаар Single Page Application бүтээх" номын II бүлгийн
2.6–2.9 жишээг өөрийн болгож туршсан төсөл. Vanilla JavaScript (ES modules), Bulma, Sass.

| Хэсэг | Агуулга |
|---|---|
| 2.6 | Services/data layer — `config.js`, `services/nutritionService.js` |
| 2.7 | Хайлтын хуудас — sidebar layout, хүнсний нэр/бүлгээр шүүх, хүснэгтүүд |
| 2.8 | Дээжийн зураг — `tools/generate-images-json.mjs`, `services/imageService.js`, `components/imageModal.js` |
| 2.9 | Хэл солих (MN/EN) — `tools/convertNutritionsEnMn.js`, `i18n/` |

## Ажиллуулах

```bash
npm install
npm run generate:images   # src/data/images.json үүсгэнэ
npm run convert:enmn      # src/data/nutritionsEnMn.json үүсгэнэ
npm run sass:build        # src/css/main.css
npm start                 # http://127.0.0.1:5500/#/search
```

## Номын кодоос өөрчилсөн зүйлс

- `tableLayout.js` — баганын `render()` функцийг дэмждэг болгосон (номд 2.8.3-т `render` нэмэгдсэн ч
  `tableLayout.js` дэмжээгүй тул зургийн тоо харагдахгүй байсан).
- `convertNutritionsEnMn.js` — илүү/дутуу зайтай утгуудыг `normalize()`-оор таньж орчуулдаг болгосон,
  орчуулга олдоогүй утгуудыг хэвлэдэг болгосон, номд байхгүй 4 утгын орчуулгыг нэмсэн.
- `searchUniqueField.js` — талбарын нэрийг командын мөрөөс авдаг болгосон.
- `nutritionTables.js` — олдсон хүнсний тоог харуулдаг болгосон.
- `imageModal.js` — зургийн дугаар (1 / 10), ← → товчлуураар зураг солих.
- `foodSearchEvents.js` — `change` event-ийг `document` биш sidebar дээр холбож, хуудас руу дахин
  ороход listener давхардахаас сэргийлсэн; нэрийг таслалаар ч хувааж хайдаг болгосон.
- Анхдагч хуудас `#/search`.
