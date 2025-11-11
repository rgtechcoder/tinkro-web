// File: backend/utils/detectLang.js
// Purpose: Detect whether a message is English or Hinglish
// Logic:
//   - If user types Hindi words (in English letters), treat as "hinglish"
//   - Otherwise default = English
// Notes: This does NOT look at emoji-only messages.

export default function detectLang(text) {
  if (!text) return "english";
  const t = text.toLowerCase();

  // Hinglish indicators (common Hindi words typed in English)
  const hindiWords = [
    "kya","kaise","madad","kr","kar","bta","bataye","hoga","hai","hain","hume","mujhe",
    "kidhar","kyuki","kitna","kitne","bache","bacche","school","workshop","sasti",
    "sabse","dikhao","banao","banane","seekhna"
  ];

  for (const w of hindiWords) {
    if (t.includes(w)) return "hinglish";
  }

  return "english";
}
