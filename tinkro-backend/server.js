
// import express from "express";
// import fs from "fs/promises";
// import path from "path";
// import cors from "cors";
// import multer from "multer";
// import fetch from "node-fetch";

// const app = express();
// app.use(cors());
// app.use(express.json());

// // ✅ Public folder (logo / static)
// app.use(express.static(path.join(process.cwd(), "public")));

// // ✅ Uploads folder
// const uploadsDir = path.join(process.cwd(), "data", "uploads");
// await fs.mkdir(uploadsDir, { recursive: true });

// // ✅ Multer setup
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadsDir),
//   filename: (req, file, cb) => {
//     const safe = Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
//     cb(null, safe);
//   }
// });
// const upload = multer({ storage });

// // ✅ Products JSON
// const productsFile = path.join(process.cwd(), "data", "products.json");

// async function loadProducts() {
//   try {
//     const txt = await fs.readFile(productsFile, "utf8");
//     return JSON.parse(txt);
//   } catch {
//     console.error("❌ products.json missing");
//     return [];
//   }
// }

// // ✅ Language detection
// function detectLang(msg) {
//   const t = msg.toLowerCase();
//   const hindi = ["kya", "kaise", "nahi", "batao", "sasti", "krna"];
//   const english = ["what", "price", "show", "help", "kit"];

//   const h = hindi.filter(w => t.includes(w)).length;
//   const e = english.filter(w => t.includes(w)).length;

//   return h > e ? "hinglish" : "english";
// }

// // ✅ Groq AI
// async function askGroq(systemPrompt, userPrompt) {
//   const key = process.env.GROQ_API_KEY;
//   const model = process.env.GROQ_MODEL || "llama3-70b-versatile";

//   if (!key) return null;

//   const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//     method: "POST",
//     headers: {
//       "Authorization": `Bearer ${key}`,
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       model,
//       messages: [
//         { role: "system", content: systemPrompt },
//         { role: "user", content: userPrompt }
//       ],
//       temperature: 0.6
//     })
//   });

//   const json = await resp.json();
//   return json?.choices?.[0]?.message?.content || "";
// }

// // ✅ Category keyword mapping
// const categoryKeywords = {
//   "school": "Bulk Packs",
//   "bulk": "Bulk Packs",
//   "beginner": "Arduino Kits",
//   "starter": "Arduino Kits",
//   "kids": "Arduino Kits",
//   "student": "Arduino Kits",

//   "advanced": "Advanced Kits",
//   "pro": "Advanced Kits",

//   "ai": "AI Kits",
//   "machine learning": "AI Kits",

//   "competition": "Competition Kits",
//   "contest": "Competition Kits",

//   "accessory": "Accessories",
//   "sensor": "Accessories",
//   "expansion": "Accessories"
// };

// // ✅ ✅ ✅ CHATBOT MAIN API
// app.post("/api/chat", async (req, res) => {
//   try {
//     const { message } = req.body;
//     if (!message) return res.json({ reply: "Please type something 😊" });

//     const txt = message.toLowerCase();
//     const lang = detectLang(txt);
//     const products = await loadProducts();

//     // ✅ Direct product matching (partial match)
//     const matched = products.find(p => {
//       const name = (p.name || "").toLowerCase();
//       return txt.includes(name) || name.includes(txt);
//     });

//     // ✅ Cheapest kit detection
//     const kits = products.filter(p => p.category === "Arduino Kits" || p.category === "Advanced Kits" || p.category === "AI Kits");
//     let cheapest = kits.length ? kits.sort((a, b) => a.price - b.price)[0] : null;

//     // ✅ CATEGORY DETECTION
//     let detectedCategory = null;

//     for (const key in categoryKeywords) {
//       if (txt.includes(key)) {
//         detectedCategory = categoryKeywords[key];
//         break;
//       }
//     }

//     if (detectedCategory) {
//       const items = products.filter(
//         p => (p.category || "").toLowerCase() === detectedCategory.toLowerCase()
//       );

//       if (items.length) {
//         const list = items
//           .map(p => `${p.name} — ₹${p.price}`)
//           .join("\n");

//         return res.json({
//           reply:
//             lang === "hinglish"
//               ? `✅ *${detectedCategory}* ke products:\n${list}`
//               : `✅ Products in *${detectedCategory}*:\n${list}`
//         });
//       }
//     }

//     // ✅ If Groq AI enabled
//     if (process.env.USE_AI === "true" && process.env.GROQ_API_KEY) {
//       try {
//         const systemPrompt = `
// You are Tinkro Buddy. Reply in ${lang}.
// Use Hinglish if needed.
// Use product information if matching:
// Matched: ${matched ? JSON.stringify(matched) : "none"}
// Cheapest kit: ${cheapest ? JSON.stringify(cheapest) : "none"}
// Keep replies short, friendly.
// `;

//         const aiReply = await askGroq(systemPrompt, message);
//         if (aiReply) return res.json({ reply: aiReply });

//       } catch (err) {
//         console.log("⚠️ Groq AI failed, using fallback.");
//       }
//     }

//     // ✅ === FALLBACK LOGIC ===

//     if (txt.includes("hi") || txt.includes("hello")) {
//       return res.json({
//         reply:
//           lang === "hinglish"
//             ? "👋 Hi! Main Tinkro Buddy hoon — kaise help karu?"
//             : "👋 Hi! I’m Tinkro Buddy — how can I help you today?"
//       });
//     }

//     if (cheapest && txt.includes("cheapest")) {
//       return res.json({
//         reply:
//           lang === "hinglish"
//             ? `✅ Sabse sasti kit: ${cheapest.name} — ₹${cheapest.price}`
//             : `✅ Cheapest kit: ${cheapest.name} — ₹${cheapest.price}`
//       });
//     }

//     if (matched) {
//       return res.json({
//         reply: `${matched.name}\nPrice: ₹${matched.price}\nLink: ${matched.url}`
//       });
//     }

//     return res.json({
//       reply:
//         lang === "hinglish"
//           ? "Sorry bhai, samajh nahi aaya. Product name try karo."
//           : "Sorry, I didn’t understand. Try a product name."
//     });

//   } catch (err) {
//     console.error("Chat Error:", err);
//     res.json({ reply: "Server error, try again later." });
//   }
// });

// // ✅ SUPPORT API (no email system right now)
// app.post("/api/support", async (req, res) => {
//   const { email, userMessage, time } = req.body;

//   console.log("📩 SUPPORT REQUEST RECEIVED");
//   console.log("Email:", email);
//   console.log("Message:", userMessage);
//   console.log("Time:", time);

//   return res.json({ ok: true, message: "Support request logged." });
// });

// // ✅ File Upload
// app.post("/api/upload", upload.single("file"), (req, res) => {
//   if (!req.file) return res.status(400).json({ error: "No file uploaded" });

//   const base = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
//   return res.json({ url: `${base}/uploads/${req.file.filename}` });
// });

// app.use("/uploads", express.static(uploadsDir));

// // ✅ Health
// app.get("/", (req, res) => {
//   res.send("✅ Tinkro Backend Running with Groq AI + Smart Categories");
// });

// // ✅ PORT (Render)
// const port = process.env.PORT || 10000;
// app.listen(port, () => console.log("✅ Server running on port", port));



// backend/server.js
// CommonJS version — compatible with utils files exported using module.exports








// const express = require("express");
// const fs = require("fs");
// const fsp = fs.promises;
// const path = require("path");
// const cors = require("cors");
// const multer = require("multer");

// // utils (assumes you created these with module.exports)
// const detectLanguage = require("./utils/detectLang");      // returns "hinglish" or "english"
// const matchFAQ = require("./utils/matchFAQ");              // (userMsg, lang) => matchedAnswer or null
// const matchProduct = require("./utils/matchProduct");      // (userMsg) => product object or null

// const app = express();
// app.use(cors());
// app.use(express.json());

// // static public (for logos etc)
// app.use(express.static(path.join(process.cwd(), "public")));

// // ensure uploads dir exists
// const uploadsDir = path.join(process.cwd(), "data", "uploads");
// fsp.mkdir(uploadsDir, { recursive: true }).catch(() => {});

// // multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadsDir),
//   filename: (req, file, cb) => {
//     const safe = Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
//     cb(null, safe);
//   }
// });
// const upload = multer({ storage });

// // paths to data files
// const DATA_DIR = path.join(process.cwd(), "data");
// const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
// const FAQ_FILE = path.join(DATA_DIR, "faq.json");
// const FLOW_FILE = path.join(DATA_DIR, "flow.json");

// // helper to read JSON safely
// async function loadJSON(filePath) {
//   try {
//     const txt = await fsp.readFile(filePath, "utf8");
//     return JSON.parse(txt);
//   } catch (err) {
//     console.error("Failed to load JSON:", filePath, err.message || err);
//     return null;
//   }
// }

// function slugify(s = "") {
//   return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
// }

// // build absolute product url using BASE_URL env or runtime host
// function buildProductUrl(req, product) {
//   const base = process.env.BASE_URL && process.env.BASE_URL !== ""
//     ? process.env.BASE_URL.replace(/\/+$/, "")
//     : `${req.protocol}://${req.get("host")}`;
//   return product.url || `${base}/#product?id=${product.id}`;
// }

// /* -----------------------------------------------------------
//   GET /api/products
//   Return products list with slug and url fields
// ----------------------------------------------------------- */
// app.get("/api/products", async (req, res) => {
//   const products = (await loadJSON(PRODUCTS_FILE)) || [];
//   const base = process.env.BASE_URL && process.env.BASE_URL !== ""
//     ? process.env.BASE_URL.replace(/\/+$/, "")
//     : `${req.protocol}://${req.get("host")}`;

//   const mapped = products.map(p => ({
//     ...p,
//     slug: p.slug || slugify(p.name || ""),
//     url: p.url || `${base}/#product?id=${p.id}`
//   }));

//   res.json(mapped);
// });

// /* -----------------------------------------------------------
//   GET /api/product?id= or /api/product?name=
// ----------------------------------------------------------- */
// app.get("/api/product", async (req, res) => {
//   const products = (await loadJSON(PRODUCTS_FILE)) || [];
//   const { id, name } = req.query;

//   if (id) {
//     const p = products.find(x => String(x.id) === String(id));
//     if (!p) return res.status(404).json({ error: "product not found" });
//     return res.json({
//       ...p,
//       url: p.url || buildProductUrl(req, p)
//     });
//   }

//   if (name) {
//     const lower = String(name).toLowerCase();
//     const p = products.find(x => (x.name || "").toLowerCase() === lower || (x.name || "").toLowerCase().includes(lower));
//     if (!p) return res.status(404).json({ error: "product not found" });
//     return res.json({
//       ...p,
//       url: p.url || buildProductUrl(req, p)
//     });
//   }

//   return res.status(400).json({ error: "id or name required" });
// });

// /* -----------------------------------------------------------
//   GET /api/flow
//   Return conversational flow for buttons
// ----------------------------------------------------------- */
// app.get("/api/flow", async (req, res) => {
//   const flow = (await loadJSON(FLOW_FILE)) || {};
//   res.json(flow);
// });

// /* -----------------------------------------------------------
//   POST /api/chat
//   Main chatbot endpoint:
//   - detect language
//   - try FAQ match
//   - try flow trigger (button labels)
//   - try category detection
//   - try product fuzzy match
//   - specials: cheapest, greetings
// ----------------------------------------------------------- */
// app.post("/api/chat", async (req, res) => {
//   try {
//     const { message } = req.body;
//     if (!message || !String(message).trim()) {
//       return res.json({ reply: "Please type something 😊" });
//     }

//     const txtRaw = String(message);
//     const txt = txtRaw.toLowerCase();
//     const lang = detectLanguage(txt); // returns "hinglish" or "english"
//     const products = (await loadJSON(PRODUCTS_FILE)) || [];
//     const faqs = (await loadJSON(FAQ_FILE)) || [];
//     const flow = (await loadJSON(FLOW_FILE)) || {};

//     // 1) FAQ match (priority)
//     try {
//       const faqAnswer = matchFAQ(txtRaw, lang); // your matchFAQ returns language-specific string or null
//       if (faqAnswer) {
//         return res.json({ reply: faqAnswer });
//       }
//     } catch (e) {
//       // swallow faq errors and continue
//       console.warn("FAQ match error:", e?.message || e);
//     }

//     // 2) Flow button label match (scan flow for labels)
//     try {
//       for (const key in flow) {
//         const node = flow[key];
//         if (!node) continue;

//         // some flow forms store menu array like main_menu; account for both shapes
//         if (Array.isArray(node)) {
//           // array of button entries (some flow.json versions)
//           for (const b of node) {
//             const lab = (b.label || b.label_en || "").toLowerCase();
//             if (lab && txt.includes(lab)) {
//               // return the node text if exists
//               const target = flow[b.id] || {};
//               const text = (lang === "hinglish" || lang === "hi") ? (target.hi || target.text_hi || target.text_en) : (target.en || target.text_en || target.text_hi);
//               return res.json({ reply: text || (lang === "hinglish" ? target.hi : target.en) || lab });
//             }
//           }
//         } else {
//           // node object with text_en/text_hi or en/hi
//           if (node.buttons && Array.isArray(node.buttons)) {
//             for (const b of node.buttons) {
//               const en = (b.label_en || b.label || "").toLowerCase();
//               const hi = (b.label_hi || "").toLowerCase();
//               if ((en && txt.includes(en)) || (hi && txt.includes(hi))) {

//                 // if this button represents a product action and has product_query
//                 if (b.action === "product" && b.product_query) {
//                   // try find product
//                   const prod = products.find(p => (p.name || "").toLowerCase() === b.product_query.toLowerCase() || (p.name || "").toLowerCase().includes(b.product_query.toLowerCase()));
//                   if (prod) {
//                     const reply = lang === "hinglish"
//                       ? `✅ ${prod.name}\n₹${prod.price}\n${prod.description}\nLink: ${buildProductUrl(req, prod)}`
//                       : `✅ ${prod.name}\n₹${prod.price}\n${prod.description}\nLink: ${buildProductUrl(req, prod)}`;
//                     return res.json({ reply });
//                   }
//                 }

//                 // if goto navigation (node id)
//                 if (b.goto && flow[b.goto]) {
//                   const target = flow[b.goto];
//                   const replyText = (lang === "hinglish" || lang === "hi") ? (target.text_hi || target.hi || target.text_en) : (target.text_en || target.en || target.text_hi);
//                   return res.json({ reply: replyText });
//                 }

//                 // default return the label itself
//                 return res.json({ reply: lang === "hinglish" ? (b.label_hi || b.label || b.label_en) : (b.label_en || b.label || b.label_hi) });
//               }
//             }
//           }
//         }
//       }
//     } catch (e) {
//       console.warn("Flow matching error:", e?.message || e);
//     }

//     // 3) Category detection (keywords to categories)
//     const categoryKeywords = {
//       "school": "Bulk Packs",
//       "bulk": "Bulk Packs",
//       "beginner": "Arduino Kits",
//       "starter": "Arduino Kits",
//       "kids": "Arduino Kits",
//       "advanced": "Advanced Kits",
//       "pro": "Advanced Kits",
//       "ai": "AI Kits",
//       "machine learning": "AI Kits",
//       "competition": "Competition Kits",
//       "contest": "Competition Kits",
//       "accessory": "Accessories",
//       "sensor": "Accessories",
//       "expansion": "Accessories"
//     };

//     let detectedCategory = null;
//     for (const key in categoryKeywords) {
//       if (txt.includes(key)) {
//         detectedCategory = categoryKeywords[key];
//         break;
//       }
//     }
//     if (detectedCategory) {
//       const items = products.filter(p => (p.category || "").toLowerCase() === detectedCategory.toLowerCase());
//       if (items.length) {
//         const list = items.map(p => `${p.name} — ₹${p.price}`).join("\n");
//         return res.json({
//           reply: lang === "hinglish" ? `✅ *${detectedCategory}* ke products:\n${list}` : `✅ Products in *${detectedCategory}*:\n${list}`
//         });
//       }
//     }

//     // 4) Product fuzzy match
//     const matchedProduct = matchProduct(txtRaw);
//     if (matchedProduct) {
//       const reply = (lang === "hinglish")
//         ? `✅ ${matchedProduct.name}\n₹${matchedProduct.price}\n${matchedProduct.description}\nLink: ${buildProductUrl(req, matchedProduct)}`
//         : `✅ ${matchedProduct.name}\n₹${matchedProduct.price}\n${matchedProduct.description}\nLink: ${buildProductUrl(req, matchedProduct)}`;
//       return res.json({ reply });
//     }

//     // 5) Cheapest kit detection (if user asked for 'cheapest' or 'sasti')
//     if (txt.includes("cheapest") || txt.includes("sasti") || txt.includes("sabka sasta") || txt.includes("sabse sasti")) {
//       const kits = products.filter(p => ["Arduino Kits", "Advanced Kits", "AI Kits"].includes(p.category));
//       const cheapest = kits.length ? [...kits].sort((a, b) => a.price - b.price)[0] : null;
//       if (cheapest) {
//         return res.json({
//           reply: lang === "hinglish"
//             ? `✅ Sabse sasti kit: ${cheapest.name} — ₹${cheapest.price}\nLink: ${buildProductUrl(req, cheapest)}`
//             : `✅ Cheapest kit: ${cheapest.name} — ₹${cheapest.price}\nLink: ${buildProductUrl(req, cheapest)}`
//         });
//       }
//     }

//     // 6) greetings
//     if (txt.includes("hi") || txt.includes("hello") || txt.includes("namaste")) {
//       return res.json({
//         reply: lang === "hinglish"
//           ? "👋 Hi! Main Tinkro Buddy hoon — kaise help karu?"
//           : "👋 Hi! I’m Tinkro Buddy — how can I help you today?"
//       });
//     }

//     // fallback
//     return res.json({
//       reply: lang === "hinglish"
//         ? "Sorry, samajh nahi aaya. Aap product name ya koi FAQ try karein."
//         : "Sorry, I didn't understand. Try a product name or one of the FAQ questions."
//     });
//   } catch (err) {
//     console.error("Chat error:", err);
//     return res.json({ reply: "Server error, try again later." });
//   }
// });

// /* -----------------------------------------------------------
//   Support endpoint (logs request)
// ----------------------------------------------------------- */
// app.post("/api/support", async (req, res) => {
//   const { email, userMessage, time } = req.body || {};
//   console.log("SUPPORT REQUEST:", { email, userMessage, time });
//   // You can forward this to an email service or DB later
//   return res.json({ ok: true, message: "Support request logged." });
// });

// /* -----------------------------------------------------------
//   Upload endpoint
// ----------------------------------------------------------- */
// app.post("/api/upload", upload.single("file"), (req, res) => {
//   if (!req.file) return res.status(400).json({ error: "No file uploaded" });
//   const base = process.env.BASE_URL && process.env.BASE_URL !== ""
//     ? process.env.BASE_URL.replace(/\/+$/, "")
//     : `${req.protocol}://${req.get("host")}`;
//   return res.json({ url: `${base}/uploads/${req.file.filename}` });
// });
// app.use("/uploads", express.static(uploadsDir));

// /* -----------------------------------------------------------
//   Health
// ----------------------------------------------------------- */
// app.get("/", (req, res) => res.send("✅ Tinkro Backend Running"));

// const port = process.env.PORT || 10000;
// app.listen(port, () => console.log("✅ Server running on port", port));








// // backend/server.js
// const express = require("express");
// const fs = require("fs");
// const fsp = fs.promises;
// const path = require("path");
// const cors = require("cors");
// const multer = require("multer");

// // utils (your files)
// const detectLanguage = require("./utils/detectLang");      // returns "hinglish" or "english"
// const matchFAQ = require("./utils/matchFAQ");              // (userMsg, lang) => matchedAnswer or null
// const matchProduct = require("./utils/matchProduct");      // (userMsg) => product object or null

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use(express.static(path.join(process.cwd(), "public")));

// // ensure data folders exist
// const DATA_DIR = path.join(process.cwd(), "data");
// const uploadsDir = path.join(DATA_DIR, "uploads");
// const SUPPORT_FILE = path.join(DATA_DIR, "support.json");
// const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
// const FAQ_FILE = path.join(DATA_DIR, "faq.json");
// const FLOW_FILE = path.join(DATA_DIR, "flow.json");

// async function ensureFiles() {
//   try { await fsp.mkdir(uploadsDir, { recursive: true }); } catch (e) {}
//   try {
//     await fsp.access(SUPPORT_FILE);
//   } catch (e) {
//     await fsp.writeFile(SUPPORT_FILE, "[]", "utf8");
//   }
// }
// ensureFiles().catch(() => {});

// // multer for uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadsDir),
//   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "-"))
// });
// const upload = multer({ storage });

// // helper: load JSON
// async function loadJSON(filePath) {
//   try {
//     const txt = await fsp.readFile(filePath, "utf8");
//     return JSON.parse(txt);
//   } catch (err) {
//     return null;
//   }
// }

// function slugify(s = "") {
//   return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
// }

// function buildProductUrl(req, product) {
//   const base = process.env.BASE_URL && process.env.BASE_URL !== "" ? process.env.BASE_URL.replace(/\/+$/, "") : `${req.protocol}://${req.get("host")}`;
//   return product.url || `${base}/#product?id=${product.id}`;
// }

// /* ----------------- public endpoints ----------------- */

// app.get("/api/products", async (req, res) => {
//   const products = (await loadJSON(PRODUCTS_FILE)) || [];
//   const base = process.env.BASE_URL && process.env.BASE_URL !== "" ? process.env.BASE_URL.replace(/\/+$/, "") : `${req.protocol}://${req.get("host")}`;
//   const mapped = products.map(p => ({ ...p, slug: p.slug || slugify(p.name || ""), url: p.url || `${base}/#product?id=${p.id}` }));
//   res.json(mapped);
// });

// app.get("/api/product", async (req, res) => {
//   const products = (await loadJSON(PRODUCTS_FILE)) || [];
//   const { id, name } = req.query;
//   if (id) {
//     const p = products.find(x => String(x.id) === String(id));
//     if (!p) return res.status(404).json({ error: "product not found" });
//     return res.json({ ...p, url: p.url || buildProductUrl(req, p) });
//   }
//   if (name) {
//     const lower = String(name).toLowerCase();
//     const p = products.find(x => (x.name || "").toLowerCase() === lower || (x.name || "").toLowerCase().includes(lower));
//     if (!p) return res.status(404).json({ error: "product not found" });
//     return res.json({ ...p, url: p.url || buildProductUrl(req, p) });
//   }
//   return res.status(400).json({ error: "id or name required" });
// });

// app.get("/api/flow", async (req, res) => {
//   const flow = (await loadJSON(FLOW_FILE)) || {};
//   res.json(flow);
// });

// /* ----------------- Chat endpoint with fallback flag ----------------- */
// app.post("/api/chat", async (req, res) => {
//   try {
//     const { message } = req.body;
//     if (!message || !String(message).trim()) return res.json({ reply: "Please type something 😊" });

//     const txtRaw = String(message);
//     const txt = txtRaw.toLowerCase();
//     const lang = detectLanguage(txtRaw); // "hinglish" or "english"
//     const products = (await loadJSON(PRODUCTS_FILE)) || [];
//     const flow = (await loadJSON(FLOW_FILE)) || {};

//     // 1) FAQ
//     try {
//       const faqAnswer = matchFAQ(txtRaw, lang);
//       if (faqAnswer) return res.json({ reply: faqAnswer, fallback: false });
//     } catch (e) {}

//     // 2) Flow button/label matching (basic)
//     try {
//       if (Array.isArray(flow.main_menu)) {
//         for (const b of flow.main_menu) {
//           const lab = (b.label || "").toLowerCase();
//           if (lab && txt.includes(lab)) {
//             const target = flow[b.id] || {};
//             const text = (lang === "hinglish" || lang === "hi") ? (target.hi || target.text_hi || target.text_en) : (target.en || target.text_en || target.text_hi);
//             if (text) return res.json({ reply: text, fallback: false });
//           }
//         }
//       }
//     } catch (e) {}

//     // 3) category detection
//     const categoryKeywords = {
//       "school": "Bulk Packs",
//       "bulk": "Bulk Packs",
//       "beginner": "Arduino Kits",
//       "starter": "Arduino Kits",
//       "kids": "Arduino Kits",
//       "advanced": "Advanced Kits",
//       "ai": "AI Kits",
//       "competition": "Competition Kits",
//       "accessory": "Accessories",
//       "sensor": "Accessories",
//       "expansion": "Accessories"
//     };
//     let detectedCategory = null;
//     for (const key in categoryKeywords) {
//       if (txt.includes(key)) { detectedCategory = categoryKeywords[key]; break; }
//     }
//     if (detectedCategory) {
//       const items = products.filter(p => (p.category || "").toLowerCase() === detectedCategory.toLowerCase());
//       if (items.length) {
//         const list = items.map(p => `${p.name} — ₹${p.price}`).join("\n");
//         const reply = lang === "hinglish" ? `✅ *${detectedCategory}* ke products:\n${list}` : `✅ Products in *${detectedCategory}*:\n${list}`;
//         return res.json({ reply, fallback: false });
//       }
//     }

//     // 4) product fuzzy match
//     try {
//       const matched = matchProduct(txtRaw);
//       if (matched) {
//         const reply = lang === "hinglish"
//           ? `✅ ${matched.name}\n₹${matched.price}\n${matched.description}\nLink: ${buildProductUrl(req, matched)}`
//           : `✅ ${matched.name}\n₹${matched.price}\n${matched.description}\nLink: ${buildProductUrl(req, matched)}`;
//         return res.json({ reply, fallback: false });
//       }
//     } catch (e) {}

//     // 5) cheapest detection
//     if (txt.includes("cheapest") || txt.includes("sasti") || txt.includes("sabse sasti")) {
//       const kits = products.filter(p => ["Arduino Kits", "Advanced Kits", "AI Kits"].includes(p.category));
//       const cheapest = kits.length ? [...kits].sort((a,b) => a.price - b.price)[0] : null;
//       if (cheapest) {
//         const reply = lang === "hinglish"
//           ? `✅ Sabse sasti kit: ${cheapest.name} — ₹${cheapest.price}\nLink: ${buildProductUrl(req, cheapest)}`
//           : `✅ Cheapest kit: ${cheapest.name} — ₹${cheapest.price}\nLink: ${buildProductUrl(req, cheapest)}`;
//         return res.json({ reply, fallback: false });
//       }
//     }

//     // 6) greetings quick
//     if (txt.includes("hi") || txt.includes("hello") || txt.includes("namaste")) {
//       const reply = lang === "hinglish" ? "👋 Hi! Main Tinkro Buddy hoon — kaise help karu?" : "👋 Hi! I’m Tinkro Buddy — how can I help you today?";
//       return res.json({ reply, fallback: false });
//     }

//     // 7) fallback — no answer found
//     const fallbackReply = lang === "hinglish"
//       ? "Sorry, is sawaal ka exact jawab mere paas nahi hai. Kya aap support team se baat karna chahenge? (Click 'Talk to Support')"
//       : "Sorry, I don't have an exact answer for that. Would you like to talk to our support team? (Click 'Talk to Support')";
//     return res.json({ reply: fallbackReply, fallback: true, fallback_lang: lang });
//   } catch (err) {
//     console.error("Chat error:", err);
//     return res.json({ reply: "Server error, try again later.", fallback: false });
//   }
// });

// /* ----------------- Support request endpoint ----------------- */
// /*
//   POST /api/support-request
//   body: { name, phone, email?, question }
//   Saves to data/support.json and returns wa_url and mailto_url
// */
// app.post("/api/support-request", async (req, res) => {
//   try {
//     const { name, phone, email, question } = req.body || {};
//     if (!name || !phone || !question) return res.status(400).json({ error: "name, phone, question required" });

//     const timestamp = new Date().toISOString();
//     const entry = { id: Date.now(), name, phone, email: email || "", question, time: timestamp, status: "pending" };

//     // read existing
//     let arr = [];
//     try {
//       const txt = await fsp.readFile(SUPPORT_FILE, "utf8");
//       arr = JSON.parse(txt || "[]");
//     } catch (e) {
//       arr = [];
//     }
//     arr.unshift(entry);
//     await fsp.writeFile(SUPPORT_FILE, JSON.stringify(arr, null, 2), "utf8");

//     // prepare whatsapp and mailto links (properly encoded)
//     const waText = encodeURIComponent(`📩 New Support Request (Tinkro Chatbot)\nName: ${name}\nPhone: ${phone}${email ? `\nEmail: ${email}` : ""}\nQuestion: ${question}\nTime: ${new Date().toLocaleString()}`);
//     const waNumber = "91" + "9644525429"; // your number with country code (already given)
//     const wa_url = `https://wa.me/${waNumber}?text=${waText}`;

//     const mailSubject = encodeURIComponent("Tinkro Support Request");
//     const mailBody = encodeURIComponent(`New Support Request (via Chatbot)\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email || "-"}\nQuestion: ${question}\nTime: ${new Date().toLocaleString()}`);
//     const mailto_url = `mailto:hello@tinkro.in?subject=${mailSubject}&body=${mailBody}`;

//     return res.json({ ok: true, entry, wa_url, mailto_url });
//   } catch (err) {
//     console.error("Support-save err:", err);
//     return res.status(500).json({ error: "could not save support request" });
//   }
// });

// /* ----------------- Uploads & health ----------------- */
// app.post("/api/upload", upload.single("file"), (req, res) => {
//   if (!req.file) return res.status(400).json({ error: "No file uploaded" });
//   const base = process.env.BASE_URL && process.env.BASE_URL !== "" ? process.env.BASE_URL.replace(/\/+$/, "") : `${req.protocol}://${req.get("host")}`;
//   return res.json({ url: `${base}/uploads/${req.file.filename}` });
// });
// app.use("/uploads", express.static(uploadsDir));

// app.get("/", (req, res) => res.send("✅ Tinkro Backend Running"));
// const port = process.env.PORT || 10000;
// app.listen(port, () => console.log("✅ Server running on port", port));



// File: backend/server.js
// Purpose: Main Express server that exposes API endpoints used by the frontend ChatBot.
// This file is heavily commented (English + Hinglish) so you can understand what each
// section does and easily modify or extend it in future.
// Path: backend/server.js
// =============================

// File: backend/server.js
// Purpose: Full-featured Express server for Tinkro chatbot
// Comments: Mixed English + Hinglish (clear explanation)
// Node: ES module style (Node >= 18 recommended)
// File: backend/server.js
// Purpose: Full-featured Express server for Tinkro chatbot
// Comments: Mixed English + Hinglish (Option C)






// N// File: backend/server.js
// Purpose: Full-featured Express server for Tinkro chatbot
// Comments: Mixed English + Hinglish (clear explanations)
// Node: ES module style (Node >= 18 recommended)

// ---------------------- Imports ----------------------
/**
 * ----------------------------------------------------------
 * ✅ TINKRO BACKEND — FULL CHATBOT SERVER
 * ----------------------------------------------------------
 * This server handles:
 *   ✅ Chatbot message processing
 *   ✅ FAQ + Flow + Product matching
 *   ✅ Emoji auto-response
 *   ✅ Hinglish/English language detection
 *   ✅ File uploads (images/videos)
 *   ✅ Support request (popup form)
 *   ✅ WhatsApp + Email linking
 * ----------------------------------------------------------
 */

/**
 * ----------------------------------------------------------------
 * ✅ server.js — FULL BACKEND (FINAL LATEST VERSION)
 * ----------------------------------------------------------------
 * Ye file chatbot ka complete backend control karti hai:
 *
 * ✅ Chatbot intents
 * ✅ FAQ match (English + Hinglish)
 * ✅ Flow.json se informational answers
 * ✅ Products.json se product answers + auto product links
 * ✅ Emoji intent replies
 * ✅ File Upload API
 * ✅ Support Request submit → WhatsApp + Email links generate
 *
 * Ye FINAL version hai. Iske baad koi missing feature nahi hoga.
 * ----------------------------------------------------------------
 */
import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

// ✅ Import Chatbot Brain
import { processMessage, saveSupportRequest } from "./utils/chatbot.js";

// -----------------------------------------------------
// ✅ Basic server setup
// -----------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Optional public folder
app.use(express.static(path.join(process.cwd(), "public")));

// -----------------------------------------------------
// ✅ Ensure data + uploads folder exist
// -----------------------------------------------------

const DATA_DIR = path.join(__dirname, "data");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

await fs.mkdir(UPLOADS_DIR, { recursive: true });

// -----------------------------------------------------
// ✅ Multer for file uploads
// -----------------------------------------------------

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "-")),
});

const upload = multer({ storage });

// -----------------------------------------------------
// ✅ Health route
// -----------------------------------------------------

app.get("/", (req, res) => {
  res.send("✅ Tinkro Backend Running Successfully");
});

// -----------------------------------------------------
// ✅ MAIN CHAT ENDPOINT
// -----------------------------------------------------

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({ reply: "❌ No message provided." });
    }

    const result = await processMessage(message);

    return res.json(result);
  } catch (err) {
    console.error("❌ Chat Error:", err);
    return res.status(500).json({
      reply: "⚠️ Server issue—please try again later.",
    });
  }
});

// -----------------------------------------------------
// ✅ SUPPORT REQUEST ENDPOINT
// -----------------------------------------------------

app.post("/api/support-request", async (req, res) => {
  try {
    const { name, phone, email, question } = req.body || {};

    if (!name || !phone || !question) {
      return res.status(400).json({
        error: "Name, phone, and question are required.",
      });
    }

    const entry = await saveSupportRequest({
      name,
      phone,
      email,
      question,
    });

    // ✅ WhatsApp auto message
    const waNumber = process.env.SUPPORT_WHATSAPP || "919644525429";

    const waText = encodeURIComponent(
      `📩 New Support Request (Tinkro Chatbot)\n\nName: ${entry.name}\nPhone: ${entry.phone}\nEmail: ${
        entry.email || "-"
      }\nQuestion: ${entry.question}\nTime: ${new Date(
        entry.time
      ).toLocaleString()}`
    );

    const wa_url = `https://wa.me/${waNumber}?text=${waText}`;

    // ✅ Email auto-message
    const mailSub = encodeURIComponent("New Support Request - Tinkro");
    const mailBody = encodeURIComponent(
      `Support Request\n\nName: ${entry.name}\nPhone: ${entry.phone}\nEmail: ${
        entry.email || "-"
      }\nQuestion: ${entry.question}\nTime: ${new Date(
        entry.time
      ).toLocaleString()}`
    );

    const mailto_url = `mailto:hello@tinkro.in?subject=${mailSub}&body=${mailBody}`;

    return res.json({
      ok: true,
      entry,
      wa_url,
      mailto_url,
    });
  } catch (err) {
    console.error("❌ Support Request Error:", err);
    return res.status(500).json({ error: "Could not save support request." });
  }
});

// -----------------------------------------------------
// ✅ FILE UPLOAD ENDPOINT
// -----------------------------------------------------

app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const base =
      process.env.BASE_URL && process.env.BASE_URL !== ""
        ? process.env.BASE_URL.replace(/\/+$/, "")
        : `${req.protocol}://${req.get("host")}`;

    return res.json({
      url: `${base}/data/uploads/${req.file.filename}`,
    });
  } catch (err) {
    console.error("❌ Upload Error:", err);
    return res.status(500).json({ error: "Upload failed." });
  }
});

// ✅ Serve uploaded files
app.use("/data/uploads", express.static(UPLOADS_DIR));

// -----------------------------------------------------
// ✅ START SERVER
// -----------------------------------------------------

const port = process.env.PORT || 10000;
app.listen(port, () =>
  console.log(`✅ Tinkro backend running at http://localhost:${port}`)
);
