/**
 * ---------------------------------------------------------
 * ✅ matchFAQ.js
 * ---------------------------------------------------------
 * This file is responsible for matching:
 *   ✅ User message → Correct FAQ answer
 *   ✅ English + Hinglish keywords
 *   ✅ Fuzzy partial matching (kit, kids, robotics, sensor…)
 *   ✅ Multi-language Q/A stored in faq.json
 *
 * If no FAQ matches → returns null (chatbot will try flows → products → emoji)
 * ---------------------------------------------------------
 */

// import fs from "fs/promises";
// import path from "path";
// import { fileURLToPath } from "url";

// // ✅ Resolve file paths
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const FAQ_PATH = path.join(__dirname, "../data/faq.json");

// /**
//  * ✅ Normalize text (remove symbols for better matching)
//  */
// const clean = (str = "") =>
//   str
//     .toLowerCase()
//     .replace(/[^\w\s]/g, "")
//     .trim();

// /**
//  * ✅ Soft fuzzy match (partial match allowed)
//  */
// const fuzzy = (text, keyword) =>
//   clean(text).includes(clean(keyword)) ||
//   clean(keyword).includes(clean(text));

// /**
//  * ✅ Load FAQ file once (cached in memory)
//  */
// let FAQ_DATA = null;

// async function loadFAQ() {
//   if (FAQ_DATA) return FAQ_DATA; // cache
//   const raw = await fs.readFile(FAQ_PATH, "utf8");
//   FAQ_DATA = JSON.parse(raw);
//   return FAQ_DATA;
// }

// /**
//  * ---------------------------------------------------------
//  * ✅ matchFAQ(message, lang)
//  * ---------------------------------------------------------
//  * Returns:
//  *   { answer: "...", lang: "en" } OR null
//  * ---------------------------------------------------------
//  */
// export default async function matchFAQ(message, lang = "en") {
//   const faq = await loadFAQ();
//   const cleanedMsg = clean(message);

//   // ✅ search all faq items
//   for (const item of faq) {
//     const qEn = item.q.en || "";
//     const qHi = item.q.hi || "";

//     const matchEn = fuzzy(cleanedMsg, qEn);
//     const matchHi = fuzzy(cleanedMsg, qHi);

//     if (matchEn || matchHi) {
//       return {
//         answer: item.a[lang] || item.a.en, // fallback to English
//         lang,
//       };
//     }

//     // ✅ Keyword-based matching
//     if (item.keywords && item.keywords.length > 0) {
//       for (const key of item.keywords) {
//         if (fuzzy(cleanedMsg, key)) {
//           return {
//             answer: item.a[lang] || item.a.en,
//             lang,
//           };
//         }
//       }
//     }
//   }

//   // ❌ No match found
//   return null;
// }




import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FAQ_PATH = path.join(__dirname, "../data/faq.json");

const clean = (str = "") =>
  str.toLowerCase().replace(/[^\w\s]/g, "").trim();

const fuzzy = (text, keyword) =>
  clean(text).includes(clean(keyword));

let FAQ_DATA = null;

async function loadFAQ() {
  if (!FAQ_DATA) {
    const raw = await fs.readFile(FAQ_PATH, "utf8");
    FAQ_DATA = JSON.parse(raw);
  }
  return FAQ_DATA;
}

export default async function matchFAQ(message, lang = "en") {
  const faq = await loadFAQ();
  const cleaned = clean(message);

  for (const item of faq) {
    // ✅ Language-based matching
    if (fuzzy(cleaned, item.q.en) || fuzzy(cleaned, item.q.hi)) {
      return {
        answer: item.a[lang] || item.a.en,
      };
    }

    // ✅ Keyword matching
    for (const key of item.keywords) {
      if (fuzzy(cleaned, key)) {
        return {
          answer: item.a[lang] || item.a.en,
        };
      }
    }
  }

  return null;
}
