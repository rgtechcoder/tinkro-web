// import faqData from "../data/faq.json";
// import flowData from "../data/flow.json";

// /* ---------------------------------------------------------
//  ✅ 1. Detect Language (EN / HI)
// ----------------------------------------------------------*/
// function detectLanguage(message) {
//   message = message.toLowerCase();

//   const hindiWords = [
//     "kya", "kaise", "kidhar", "hai", "hota", "kitna", "kab", "karna", 
//     "krna", "chahiye", "discount", "sahi", "bataye", "batao"
//   ];

//   const foundHindi = hindiWords.some(word => message.includes(word));

//   return foundHindi ? "hi" : "en";
// }

// /* ---------------------------------------------------------
//  ✅ 2. Normalize Text For Better Matching  
// ----------------------------------------------------------*/
// function normalize(text) {
//   return text.toLowerCase().replace(/[^a-z0-9\s]/g, "");
// }

// /* ---------------------------------------------------------
//  ✅ 3. Match FAQ Based on Keywords
// ----------------------------------------------------------*/
// function matchFAQ(userMessage, lang) {
//   const msg = normalize(userMessage);

//   for (const faq of faqData) {
//     const found = faq.keywords.some(keyword => msg.includes(keyword.toLowerCase()));

//     if (found) {
//       return lang === "hi" ? faq.answer_hi : faq.answer_en;
//     }
//   }

//   return null;
// }

// /* ---------------------------------------------------------
//  ✅ 4. Quick Reply Buttons (Reusable)
// ----------------------------------------------------------*/
// function createButtons(list) {
//   return list.map(item => ({
//     id: item.id,
//     label: item.label
//   }));
// }

// /* ---------------------------------------------------------
//  ✅ 5. Product Buttons (Auto-Generated)
// ----------------------------------------------------------*/
// function generateProductButtons(products) {
//   return products.map(p => ({
//     id: `product_${p.id}`,
//     label: p.name,
//     url: `https://tinkro.in/#product?id=${p.id}`
//   }));
// }

// /* ---------------------------------------------------------
//  ✅ 6. Auto Identify Product Queries
// ----------------------------------------------------------*/
// function matchProduct(userMessage, products) {
//   const msg = normalize(userMessage);

//   return products.find(p =>
//     msg.includes(p.name.toLowerCase()) ||
//     msg.includes(normalize(p.category)) ||
//     msg.split(" ").some(w => p.name.toLowerCase().includes(w))
//   );
// }

// /* ---------------------------------------------------------
//  ✅ 7. MAIN PROCESSOR
// ----------------------------------------------------------*/
// export function processChatbotMessage(message, products) {
//   const lang = detectLanguage(message);

//   const response = {
//     reply: "",
//     buttons: []
//   };

//   const msg = normalize(message);

//   /* ---------------------------------------------------------
//     ✅ A. GREETING
//   ----------------------------------------------------------*/
//   if (
//     msg.includes("hi") ||
//     msg.includes("hello") ||
//     msg.includes("hey") ||
//     msg.includes("namaste")
//   ) {
//     response.reply = lang === "hi" ? flowData.greeting.hi : flowData.greeting.en;
//     response.buttons = createButtons(flowData.main_menu);
//     return response;
//   }

//   /* ---------------------------------------------------------
//     ✅ B. MAIN MENU OPTIONS
//   ----------------------------------------------------------*/
//   if (msg.includes("what is tinkro")) {
//     response.reply = lang === "hi" ? flowData.what_is_tinkro.hi : flowData.what_is_tinkro.en;
//     response.buttons = createButtons(flowData.main_menu);
//     return response;
//   }

//   if (msg.includes("see kits") || msg.includes("kits") || msg.includes("products")) {
//     response.reply = lang === "hi"
//       ? "Yeh hamare popular kits hain:"
//       : "Here are our most popular kits:";

//     response.buttons = generateProductButtons(products);
//     return response;
//   }

//   if (msg.includes("benefits") || msg.includes("learning")) {
//     response.reply = lang === "hi" ? flowData.benefits.hi : flowData.benefits.en;
//     response.buttons = createButtons(flowData.main_menu);
//     return response;
//   }

//   if (msg.includes("school") || msg.includes("workshop")) {
//     response.reply = lang === "hi" ? flowData.schools.hi : flowData.schools.en;
//     response.buttons = createButtons(flowData.main_menu);
//     return response;
//   }

//   if (msg.includes("contact") || msg.includes("support") || msg.includes("help")) {
//     response.reply = lang === "hi" ? flowData.contact.hi : flowData.contact.en;
//     response.buttons = createButtons(flowData.main_menu);
//     return response;
//   }

//   /* ---------------------------------------------------------
//     ✅ C. PRODUCT-SPECIFIC TALK
//   ----------------------------------------------------------*/
//   const matchedProduct = matchProduct(message, products);

//   if (matchedProduct) {
//     response.reply =
//       lang === "hi"
//         ? `Yeh raha **${matchedProduct.name}** ka link 👇`
//         : `Here is the link for **${matchedProduct.name}** 👇`;

//     response.buttons = [
//       {
//         id: "open_product",
//         label: matchedProduct.name,
//         url: `https://tinkro.in/#product?id=${matchedProduct.id}`
//       }
//     ];

//     return response;
//   }

//   /* ---------------------------------------------------------
//     ✅ D. FAQ ANSWERS
//   ----------------------------------------------------------*/
//   const faqAnswer = matchFAQ(message, lang);

//   if (faqAnswer) {
//     response.reply = faqAnswer;
//     response.buttons = createButtons(flowData.main_menu);
//     return response;
//   }

//   /* ---------------------------------------------------------
//     ✅ E. FALLBACK DEFAULT REPLY
//   ----------------------------------------------------------*/
//   response.reply =
//     lang === "hi"
//       ? "Mujhe aapka question samajh nahi aaya. Kya aap yeh options try karna chahenge?"
//       : "I couldn’t understand that. Would you like to choose from these options?";

//   response.buttons = createButtons(flowData.main_menu);

//   return response;
// }






// // File: backend/utils/chatbot.js
// }
// }
// }


// // 5) cheapest detection
// if (low.includes('cheapest') || low.includes('sasti') || low.includes('sabse sasti')) {
// const kits = products.filter(p => ['Arduino Kits','Advanced Kits','AI Kits'].includes(p.category));
// const cheapest = kits.length ? [...kits].sort((a,b) => a.price - b.price)[0] : null;
// if (cheapest) {
// const baseUrl = process.env.BASE_URL && process.env.BASE_URL !== '' ? process.env.BASE_URL.replace(/\/+$/, '') : '';
// const productUrl = cheapest.url || (baseUrl ? `${baseUrl}/#product?id=${cheapest.id}` : `/#product?id=${cheapest.id}`);
// const text = lang === 'hinglish' ? `✅ Sabse sasti kit: ${cheapest.name} — ₹${cheapest.price}\nLink: ${productUrl}` : `✅ Cheapest kit: ${cheapest.name} — ₹${cheapest.price}\nLink: ${productUrl}`;
// return { reply: text, fallback: false };
// }
// }


// // 6) show all kits / catalog
// if (low.includes('show all') || low.includes('show kits') || low.includes('all kits') || low.includes('catalog')) {
// const visible = products.filter(p => p.status !== 'draft');
// const list = formatProductList(visible);
// const text = lang === 'hinglish' ? `✅ Yeh sab kits hain:\n${list}` : `✅ Here are the kits:\n${list}`;
// // include buttons for first few products so user can click
// const buttons = visible.slice(0,6).map(p => ({ label: p.name, url: p.url || `/#product?id=${p.id}` }));
// return { reply: text, buttons, fallback: false };
// }


// // 7) support/contact intent
// if (low.includes('support') || low.includes('contact') || low.includes('help')) {
// const text = lang === 'hinglish' ? 'Kya aap support team se baat karna chahenge?' : 'Would you like to talk to our support team?';
// return { reply: text, buttons: [{ label: 'Talk to Support' }], fallback: false };
// }


// // 8) fallback: no match found
// const fallbackText = lang === 'hinglish' ? (flow?.fallback?.hi || flow?.fallback?.en) : (flow?.fallback?.en || flow?.fallback?.hi);
// return { reply: fallbackText || "Sorry, I don't have an answer.", fallback: true, fallback_lang: lang === 'hinglish' ? 'hinglish' : 'english' };
// }


// // -----------------------------
// // saveSupportRequest: persist support form submissions to data/support.json
// // Returns the saved entry
// // -----------------------------
// export async function saveSupportRequest({ name, phone, email, question }) {
// try {
// // ensure file exists
// try {
// await fs.access(SUPPORT_PATH);
// } catch {
// await fs.writeFile(SUPPORT_PATH, '[]', 'utf8');
// }


// const raw = await fs.readFile(SUPPORT_PATH, 'utf8');
// const arr = JSON.parse(raw || '[]');
// const entry = {
// id: Date.now(),
// name: name || '',
// phone: phone || '',
// email: email || '',
// question: question || '',
// time: new Date().toISOString(),
// status: 'pending'
// };
// arr.unshift(entry);
// await fs.writeFile(SUPPORT_PATH, JSON.stringify(arr, null, 2), 'utf8');
// return entry;
// } catch (err) {
// throw err;
// }
// }


// // =============================
// // End of Part 1: backend/server.js + backend/utils/chatbot.js
// // Next: Part 2 will include data files (faq.json, flow.json, products.json) with full content.
// // =============================







// File: backend/utils/chatbot.js
// Purpose: Main chatbot intelligence (processMessage + saveSupportRequest)
// Comments: Mixed English + Hinglish
// File: backend/utils/chatbot.js
// Purpose: Core chatbot intelligence used by server.js
// Exports:
//   - processMessage(message) => { reply: string, fallback?: boolean, buttons?: "info"|"product" }
//   - saveSupportRequestAuto(obj) => savedEntry
//
// Notes:
//  - Uses simple heuristics for FAQ, flow, product match and emoji-intent.
//  - Saves automatic support entries to backend/data/support.json
//  - Designed to be stateless (backend doesn't hold conversation history).
//  - Language selection uses detectLang() on message text. For emoji-only first messages,
//    default language = "english" (per your Option A).
//
// Author: ChatGPT for Tinkro
// Mixed comments (English + Hinglish) for clarity.// utils/chatbot.js
// ✅ Handles: FAQ, product flow, emoji replies, language detection,
//    fallback logic, and saving support requests.
import fs from "fs/promises";
import path from "path";
import detectLang from "./detectLang.js";
import matchFAQ from "./matchFAQ.js";

// ✅ Data folder
const DATA_DIR = path.join(process.cwd(), "data");

const FAQ_PATH = path.join(DATA_DIR, "faq.json");
const FLOW_PATH = path.join(DATA_DIR, "flow.json");
const PRODUCTS_PATH = path.join(DATA_DIR, "products.json");
const SUPPORT_PATH = path.join(DATA_DIR, "support.json");

// ✅ Load/Save JSON
async function load(file) {
  return JSON.parse(await fs.readFile(file, "utf8"));
}

async function save(file, data) {
  return await fs.writeFile(file, JSON.stringify(data, null, 2));
}

// ✅ Detect emoji-only
function isEmojiOnly(text) {
  return /^[\p{Emoji}\s]+$/u.test(text);
}

// ✅ Emoji-based replies
function emojiReply(msg, lang) {
  const greet = ["👋", "🙏", "🙂", "😊", "😄", "🤝"];
  const love = ["❤️", "💙", "💛", "👍", "✨"];

  if (greet.some((e) => msg.includes(e)))
    return lang === "hi"
      ? "🙏 Dhanyavaad! Main aapki kis tarah madad kar sakta hoon?"
      : "🙏 Thank you! How can I help you today?";

  if (love.some((e) => msg.includes(e)))
    return lang === "hi"
      ? "😊 Dhanyavaad! Aap kya dhund rahe ho?"
      : "😊 Thank you! What would you like to explore?";

  return lang === "hi"
    ? "🙂 Main hoon Tinkro Buddy! Aap kya dhund rahe ho?"
    : "🙂 I'm Tinkro Buddy! How can I help you today?";
}

// ✅ Product Search — FIXED
async function productSearch(message) {
  const msg = message.toLowerCase();
  const products = await load(PRODUCTS_PATH);

  for (const p of products) {
    if (!p.keywords) continue;

    if (p.keywords.some((kw) => msg.includes(kw.toLowerCase()))) {
      return {
        reply:
          `✅ <b>${p.name}</b><br>` +
          `${p.description}<br><br>` +
          `👉 <a href="${p.url}" target="_blank">View Product</a>`
      };
    }
  }

  return null;
}

// ✅ Info Intent — FIXED
function detectInfoIntent(msg) {
  msg = msg.toLowerCase();

  const intents = {
    cheapest: ["cheapest", "lowest", "sasta", "low price"],
    allkits: ["all kits", "show kits", "list kits", "kit list"],
    arduino: ["arduino kit", "arduino", "coding kit"],
    sensor: ["sensor kit", "sensor", "motion sensor", "light sensor"],
  };

  for (const key in intents) {
    if (intents[key].some((w) => msg.includes(w))) return key;
  }

  return null;
}

// ✅ MAIN BOT LOGIC
export async function processMessage(message) {
  const lang = detectLang(message);

  // ✅ (1) Emoji-only
  if (isEmojiOnly(message)) {
    return { reply: emojiReply(message, lang), fallback: false };
  }

  // ✅ (2) FAQ Match
  const faqAns = await matchFAQ(message, lang);
  if (faqAns) {
    return { reply: faqAns.answer, fallback: false };
  }

  // ✅ (3) Product Search
  const prod = await productSearch(message);
  if (prod) return { ...prod, fallback: false };

  // ✅ (4) Info Intent
  const flow = await load(FLOW_PATH);
  const intent = detectInfoIntent(message);
  if (intent && flow[intent]) {
    return { reply: flow[intent], fallback: false };
  }

  // ✅ (5) Support related keywords
  if (
    ["support", "help", "issue", "problem", "customer care"].some((w) =>
      message.toLowerCase().includes(w)
    )
  ) {
    return {
      reply: "✅ Please fill the support form.",
      fallback: true
    };
  }

  // ✅ (6) Final fallback ONLY when nothing matches
  return {
    reply:
      lang === "hi"
        ? "⚠️ Maafi chahta hoon, main nahi samajh paya. Kripya support form bhar dijiye."
        : "⚠️ Sorry, I didn’t understand. Please fill the support form.",
    fallback: true
  };
}

// ✅ Save Support Request
export async function saveSupportRequest(entry) {
  let list = [];

  try {
    list = JSON.parse(await fs.readFile(SUPPORT_PATH, "utf8"));
  } catch {
    list = [];
  }

  const newEntry = { ...entry, time: Date.now() };
  list.push(newEntry);
  await save(SUPPORT_PATH, list);

  return newEntry;
}
