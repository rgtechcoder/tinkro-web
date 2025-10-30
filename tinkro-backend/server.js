// server.js
import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Correct path for Render
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "data", "products.json");

async function readProducts() {
  const text = await fs.readFile(dataPath, "utf8");
  return JSON.parse(text);
}

app.get("/api/cheapest-kit", async (req, res) => {
  try {
    const all = await readProducts();
    const kits = all.filter(p => p.category === "kit");
    if (!kits.length) return res.status(404).json({ error: "No kits found" });
    kits.sort((a, b) => (a.price || 0) - (b.price || 0));
    res.json(kits[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server error" });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const all = await readProducts();
    res.json(all);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server error" });
  }
});

const port = process.env.PORT || 10000;
app.listen(port, () => console.log("API running on port", port));
