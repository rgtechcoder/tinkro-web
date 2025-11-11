// utils/matchProduct.js
// Match user message with product list

const products = require("../data/products.json");

module.exports = function matchProduct(userMsg) {
  const msg = userMsg.toLowerCase();

  // Mapping for variations
  const alias = {
    "basic kit": "beginner robotics kit",
    "robot kit": "beginner robotics kit",
    "starter": "beginner robotics kit",
    "ai kit": "ai programming kit",
    "arduino kit": "beginner robotics kit",
    "sensor kit": "sensor expansion pack",
    "electronics kit": "sensor expansion pack",
    "school pack": "school bulk pack (10 kits)"
  };

  // Check alias match
  for (let key in alias) {
    if (msg.includes(key)) {
      return products.find(p => p.name.toLowerCase() === alias[key]);
    }
  }

  // Fallback → direct match or partial match
  return products.find(p =>
    msg.includes(p.name.toLowerCase()) ||
    p.name.toLowerCase().includes(msg) ||
    msg.includes(p.category.toLowerCase())
  ) || null;
};
