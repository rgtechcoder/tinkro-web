// // server.js
// import express from "express";
// import fs from "fs/promises";
// import path from "path";
// import { fileURLToPath } from "url";
// import cors from "cors";

// const app = express();
// app.use(cors());
// app.use(express.json());

// // ✅ Correct path for Render
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const dataPath = path.join(__dirname, "data", "products.json");

// async function readProducts() {
//   const text = await fs.readFile(dataPath, "utf8");
//   return JSON.parse(text);
// }

// app.get("/api/cheapest-kit", async (req, res) => {
//   try {
//     const all = await readProducts();
//     const kits = all.filter(p => p.category === "kit");
//     if (!kits.length) return res.status(404).json({ error: "No kits found" });
//     kits.sort((a, b) => (a.price || 0) - (b.price || 0));
//     res.json(kits[0]);
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: "server error" });
//   }
// });

// app.get("/api/products", async (req, res) => {
//   try {
//     const all = await readProducts();
//     res.json(all);
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: "server error" });
//   }
// });

// const port = process.env.PORT || 10000;
// app.listen(port, () => console.log("API running on port", port));







// --- add near other routes in server.js ---
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.json({ reply: "Please type something so I can help 😊" });

    const text = message.toLowerCase();

    // detect language
    const hindiWords = ["kya", "kaise", "nahi", "krna", "mujhe", "hai", "sabse", "kitna", "dikhao", "batao", "bhai"];
    const englishWords = ["what", "how", "price", "show", "find", "list", "kit", "product", "help", "hello", "hi"];
    
    const hindiCount = hindiWords.filter(w => text.includes(w)).length;
    const englishCount = englishWords.filter(w => text.includes(w)).length;

    const lang = hindiCount >= englishCount ? "hinglish" : "english";

    const all = await readProducts();

    // ------------------ replies ------------------
    if (lang === "hinglish") {
      if (text.includes("hi") || text.includes("hello") || text.includes("hey")) {
        return res.json({ reply: "👋 Hi! Main Tinkro Buddy hoon — kaise madad karoon aaj?" });
      }
      if (text.includes("price") || text.includes("kit") || text.includes("cheapest")) {
        const kits = all.filter(p => p.category === "kit");
        if (!kits.length) return res.json({ reply: "Maaf kijiye — koi kits data me nahi mili." });
        kits.sort((a,b) => (a.price||0) - (b.price||0));
        const cheapest = kits[0];
        return res.json({
          reply: `Sabse sasti kit: *${cheapest.name}* — ₹${cheapest.price}. Link: ${cheapest.url || 'N/A'}`
        });
      }
      if (text.includes("products") || text.includes("list")) {
        const names = all.slice(0,10).map(p => `${p.name} — ₹${p.price || 'N/A'}`).join("\n");
        return res.json({ reply: `Available products:\n${names}` });
      }
      const found = all.find(p => text.includes((p.name||"").toLowerCase()));
      if (found) {
        return res.json({
          reply: `Found: *${found.name}*\nPrice: ₹${found.price}\nStock: ${found.stock || 'N/A'}\nLink: ${found.url || 'N/A'}`
        });
      }
      return res.json({ reply: "Sorry, mujhe exact samajh nahi aaya. Aap product name ya 'cheapest kit' type karke dekhiye." });
    } 
    else {
      // English replies
      if (text.includes("hi") || text.includes("hello") || text.includes("hey")) {
        return res.json({ reply: "👋 Hi! I’m Tinkro Buddy — how can I help you today?" });
      }
      if (text.includes("price") || text.includes("kit") || text.includes("cheapest")) {
        const kits = all.filter(p => p.category === "kit");
        if (!kits.length) return res.json({ reply: "Sorry — no kits found in data." });
        kits.sort((a,b) => (a.price||0) - (b.price||0));
        const cheapest = kits[0];
        return res.json({
          reply: `Cheapest kit: *${cheapest.name}* — ₹${cheapest.price}. Link: ${cheapest.url || 'N/A'}`
        });
      }
      if (text.includes("products") || text.includes("list")) {
        const names = all.slice(0,10).map(p => `${p.name} — ₹${p.price || 'N/A'}`).join("\n");
        return res.json({ reply: `Available products:\n${names}` });
      }
      const found = all.find(p => text.includes((p.name||"").toLowerCase()));
      if (found) {
        return res.json({
          reply: `Found: *${found.name}*\nPrice: ₹${found.price}\nStock: ${found.stock || 'N/A'}\nLink: ${found.url || 'N/A'}`
        });
      }
      return res.json({ reply: "Sorry, I didn’t quite understand. Try typing a product name or 'cheapest kit'." });
    }

  } catch (e) {
    console.error("chat error:", e);
    res.status(500).json({ reply: "Server error — please try again later." });
  }
});
