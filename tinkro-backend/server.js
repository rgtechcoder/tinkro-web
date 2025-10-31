// server.js
import express from "express";
import fs from "fs/promises";
import path from "path";
import cors from "cors";
import multer from "multer";

const app = express();
app.use(cors());
app.use(express.json());

// Serve public folder (logo etc.)
app.use(express.static(path.join(process.cwd(), "public")));

// Create uploads folder
const uploadsDir = path.join(process.cwd(), "data", "uploads");
await fs.mkdir(uploadsDir, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const safe = Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
    cb(null, safe);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// PRODUCT FILE PATH
const dataPath = path.join(process.cwd(), "data", "products.json");

// READ PRODUCTS JSON
async function readProducts() {
  const text = await fs.readFile(dataPath, "utf8");
  return JSON.parse(text);
}

/* ---------------------- CHAT API ---------------------- */
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.json({ reply: "Please type something 😊" });

    const text = message.toLowerCase();

    const hindiWords = ["kya", "kaise", "nahi", "krna", "mujhe", "hai", "sabse", "kitna", "dikhao", "batao", "bhai"];
    const englishWords = ["what", "how", "price", "show", "find", "list", "kit", "product", "help", "hello", "hi"];

    const hindiCount = hindiWords.filter(w => text.includes(w)).length;
    const englishCount = englishWords.filter(w => text.includes(w)).length;

    const lang = hindiCount >= englishCount ? "hinglish" : "english";

    const all = await readProducts();

    // -------- Replies ----------
    if (lang === "hinglish") {
      if (text.includes("hi") || text.includes("hello")) {
        return res.json({ reply: "👋 Hi! Main Tinkro Buddy hoon — kaise madad karoon aaj?" });
      }

      if (text.includes("price") || text.includes("kit") || text.includes("sasti")) {
        const kits = all.filter(p => p.category === "kit");
        kits.sort((a,b) => (a.price||0) - (b.price||0));
        const cheapest = kits[0];
        return res.json({
          reply: `Sabse sasti kit: *${cheapest.name}* — ₹${cheapest.price}.\nLink: ${cheapest.url || "N/A"}`
        });
      }

      const found = all.find(p => text.includes((p.name||"").toLowerCase()));
      if (found) {
        return res.json({
          reply: `Found: *${found.name}*\nPrice: ₹${found.price}\nStock: ${found.stock}`
        });
      }

      return res.json({ reply: "Sorry, mujhe samajh nahi aaya. Product name try karein." });
    }

    // -------- English Replies ----------
    if (text.includes("hi") || text.includes("hello")) {
      return res.json({ reply: "👋 Hi! I'm Tinkro Buddy — how can I help you?" });
    }

    const kits = all.filter(p => p.category === "kit");
    kits.sort((a,b) => (a.price||0) - (b.price||0));

    if (text.includes("price") || text.includes("kit")) {
      const cheapest = kits[0];
      return res.json({
        reply: `Cheapest kit: *${cheapest.name}* — ₹${cheapest.price}\nLink: ${cheapest.url}`
      });
    }

    const found = all.find(p => text.includes((p.name||"").toLowerCase()));
    if (found) {
      return res.json({
        reply: `Product: *${found.name}*\nPrice: ₹${found.price}\nStock: ${found.stock}`
      });
    }

    return res.json({ reply: "Sorry, I didn't understand. Try a product name." });

  } catch (e) {
    console.error("chat error:", e);
    res.status(500).json({ reply: "Server error — try again later." });
  }
});

/* ---------------------- FILE UPLOAD API ---------------------- */
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const BASE = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
    const fileUrl = `${BASE}/uploads/${req.file.filename}`;

    return res.json({ url: fileUrl });
  } catch (err) {
    console.error("upload error:", err);
    return res.status(500).json({ error: "Upload failed" });
  }
});

// Static serve uploads
app.use("/uploads", express.static(uploadsDir));

/* ---------------------- START SERVER ---------------------- */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ API running on port ${PORT}`);
});
