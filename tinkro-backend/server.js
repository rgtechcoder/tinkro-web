// server.js
import express from "express";
import fs from "fs/promises";
import path from "path";
import cors from "cors";
import multer from "multer";

const app = express();
app.use(cors());
app.use(express.json());

// Public folder (place tinkro-logo-chatbot.png in /public)
app.use(express.static(path.join(process.cwd(), "public")));

// uploads folder (store uploaded files here)
const uploadsDir = path.join(process.cwd(), "data", "uploads");
await fs.mkdir(uploadsDir, { recursive: true });

// multer config (files saved to data/uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    // keep timestamped safe filename
    const safe = Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
    cb(null, safe);
  }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

const dataPath = path.join(process.cwd(), "data", "products.json");

async function readProducts() {
  const text = await fs.readFile(dataPath, "utf8");
  return JSON.parse(text);
}

// Chat endpoint (bilingual per-message detection)
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.json({ reply: "Please type something so I can help 😊" });

    const text = message.toLowerCase();

    // detect language using keywords (hinglish vs english)
    const hindiWords = ["kya", "kaise", "nahi", "krna", "mujhe", "hai", "sabse", "kitna", "dikhao", "batao", "bhai"];
    const englishWords = ["what", "how", "price", "show", "find", "list", "kit", "product", "help", "hello", "hi"];
    const hindiCount = hindiWords.filter(w => text.includes(w)).length;
    const englishCount = englishWords.filter(w => text.includes(w)).length;
    const lang = hindiCount >= englishCount ? "hinglish" : "english";

    const all = await readProducts();

    if (lang === "hinglish") {
      // Hinglish replies
      if (text.includes("hi") || text.includes("hello") || text.includes("hey")) {
        return res.json({ reply: "👋 Hi! Main Tinkro Buddy hoon — kaise madad karoon aaj?" });
      }
      if (text.includes("price") || text.includes("kit") || text.includes("cheapest")) {
        const kits = all.filter(p => p.category === "kit");
        if (!kits.length) return res.json({ reply: "Maaf kijiye — koi kits data me nahi mili." });
        kits.sort((a,b) => (a.price||0) - (b.price||0));
        const cheapest = kits[0];
        return res.json({ reply: `Sabse sasti kit: *${cheapest.name}* — ₹${cheapest.price}. Link: ${cheapest.url || 'N/A'}` });
      }
      if (text.includes("products") || text.includes("list")) {
        const names = all.slice(0,10).map(p => `${p.name} — ₹${p.price || 'N/A'}`).join("\n");
        return res.json({ reply: `Available products:\n${names}` });
      }
      const found = all.find(p => text.includes((p.name||"").toLowerCase()));
      if (found) {
        return res.json({ reply: `Found: *${found.name}*\nPrice: ₹${found.price}\nStock: ${found.stock || 'N/A'}\nLink: ${found.url || 'N/A'}` });
      }
      return res.json({ reply: "Sorry, mujhe exact samajh nahi aaya. Aap product name ya 'cheapest kit' type karke dekhiye." });
    } else {
      // English replies
      if (text.includes("hi") || text.includes("hello") || text.includes("hey")) {
        return res.json({ reply: "👋 Hi! I’m Tinkro Buddy — how can I help you today?" });
      }
      if (text.includes("price") || text.includes("kit") || text.includes("cheapest")) {
        const kits = all.filter(p => p.category === "kit");
        if (!kits.length) return res.json({ reply: "Sorry — no kits found in data." });
        kits.sort((a,b) => (a.price||0) - (b.price||0));
        const cheapest = kits[0];
        return res.json({ reply: `Cheapest kit: *${cheapest.name}* — ₹${cheapest.price}. Link: ${cheapest.url || 'N/A'}` });
      }
      if (text.includes("products") || text.includes("list")) {
        const names = all.slice(0,10).map(p => `${p.name} — ₹${p.price || 'N/A'}`).join("\n");
        return res.json({ reply: `Available products:\n${names}` });
      }
      const found = all.find(p => text.includes((p.name||"").toLowerCase()));
      if (found) {
        return res.json({ reply: `Found: *${found.name}*\nPrice: ₹${found.price}\nStock: ${found.stock || 'N/A'}\nLink: ${found.url || 'N/A'}` });
      }
      return res.json({ reply: "Sorry, I didn’t quite understand. Try typing a product name or 'cheapest kit'." });
    }
  } catch (e) {
    console.error("chat error:", e);
    res.status(500).json({ reply: "Server error — please try again later." });
  }
});

// File upload endpoint
// Form field name: "file"
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    // Build public url (assuming server URL will be same host)
    // Use process.env.BASE_URL if you set it (like https://tinkro-backend.onrender.com)
    const base = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
    const fileUrl = `${base}/uploads/${req.file.filename}`;
    return res.json({ url: fileUrl, filename: req.file.filename });
  } catch (err) {
    console.error("upload error:", err);
    return res.status(500).json({ error: "Upload failed" });
  }
});

// Serve uploaded files statically
app.use("/uploads", express.static(uploadsDir));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log("API running on port", port));

