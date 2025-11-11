
// // src/chatbot/ChatBot.jsx
// import React, { useState, useRef, useEffect } from "react";
// import "./ChatBot.css";
// import { Paperclip, Smile, Send, X } from "lucide-react";
// import EmojiPicker from "./EmojiPicker";
// import API_URL from "../config/api";
// import QuickButtons from "../components/QuickButtons";

// const ChatBot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     { sender: "bot", text: "👋 Hi! I’m Tinkro Buddy — how can I help you today?" }
//   ]);
//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [showButtons, setShowButtons] = useState(false);  // ✅ NEW
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);

//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, isTyping, uploading]);

//   const toggleChat = () => setIsOpen(v => !v);

//   // ✅ Quick button click handler
//   const handleSelectQuick = async (text) => {
//     setInput(text);
//     await sendMessage(text, true);
//   };

//   // ✅ Send Message
//   const sendMessage = async (overrideMessage = null, fromQuick = false) => {
//     const msg = overrideMessage || input.trim();
//     if (!msg) return;

//     const userMsg = { sender: "user", text: msg };
//     setMessages(m => [...m, userMsg]);

//     if (!fromQuick) setInput("");

//     // ✅ After first message, show buttons
//     setShowButtons(true);

//     setIsTyping(true);

//     // ✅ If user clicks "Talk to support"
//     if (msg.toLowerCase().includes("support")) {
//       setIsTyping(false);
//       return setMessages(m => [
//         ...m,
//         {
//           sender: "bot",
//           text:
//             "✅ You can reach our support team here:<br/><a href='https://tinkro.in/contact' target='_blank'>https://tinkro.in/contact</a>"
//         }
//       ]);
//     }

//     try {
//       const resp = await fetch(`${API_URL}/api/chat`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: msg })
//       });

//       const json = await resp.json();
//       const botText = json.reply || "Sorry, I couldn't process that.";

//       setIsTyping(false);

//       setMessages(m => [...m, { sender: "bot", text: botText }]);
//     } catch (err) {
//       setIsTyping(false);
//       setMessages(m => [...m, { sender: "bot", text: "⚠️ Connection issue. Try again later." }]);
//     }
//   };

//   const onKeyDown = (e) => {
//     if (e.key === "Enter") sendMessage();
//   };

//   // ✅ File Upload
//   const handleFileChange = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setUploading(true);
//     setMessages(m => [...m, { sender: "user", text: `Uploading: ${file.name} ...` }]);

//     try {
//       const fd = new FormData();
//       fd.append("file", file);

//       const resp = await fetch(`${API_URL}/api/upload`, { method: "POST", body: fd });
//       const json = await resp.json();

//       if (json.url) {
//         setMessages(m => [
//           ...m,
//           {
//             sender: "bot",
//             text: `✅ File uploaded: <a href="${json.url}" target="_blank">View file</a>`
//           }
//         ]);
//       }
//     } catch {
//       setMessages(m => [...m, { sender: "bot", text: "⚠️ Upload failed." }]);
//     }

//     setUploading(false);
//   };

//   return (
//     <div className="chatbot-container">
//       {isOpen && (
//         <div className="chat-window">
//           <div className="chat-header">
//             <div className="chat-title">
//               <img src="/tinkro-logo-chatbot.png" alt="logo" className="chat-logo" />
//               <div>
//                 <div className="title-main">Tinkro Buddy</div>
//                 {/* <div className="title-sub">How can I help?</div> */}
//               </div>
//             </div>
//             <button className="close-btn" onClick={toggleChat}>
//               <X size={18} />
//             </button>
//           </div>

//           <div className="chat-body">
//             {/* ✅ Quick buttons only after first message */}
//             {showButtons && (
//               <QuickButtons onSelect={handleSelectQuick} />
//             )}

//             {messages.map((m, i) => (
//               <div key={i} className={`chat-bubble ${m.sender}`}>
//                 <div
//                   className="bubble-text"
//                   dangerouslySetInnerHTML={{ __html: m.text.replace(/\n/g, "<br/>") }}
//                 />
//               </div>
//             ))}

//             {isTyping && <div className="typing">Tinkro Buddy is typing…</div>}
//             {uploading && <div className="typing">Uploading file…</div>}

//             <div ref={messagesEndRef} />
//           </div>

//           <div className="chat-input">
//             <label className="icon-btn">
//               <Paperclip size={18} />
//               <input type="file" hidden onChange={handleFileChange} />
//             </label>

//             <button className="icon-btn" onClick={() => setShowEmojiPicker(true)} title="Emoji">
//               <Smile size={18} />
//             </button>

//             <input
//               type="text"
//               placeholder="Ask about kits, products or support..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={onKeyDown}
//             />

//             <button className="send-btn" onClick={() => sendMessage()}>
//               <Send size={18} />
//             </button>
//           </div>

//           {showEmojiPicker && (
//             <EmojiPicker
//               onSelect={emoji => {
//                 setInput(input + emoji.native);
//                 setShowEmojiPicker(false);
//               }}
//               onClose={() => setShowEmojiPicker(false)}
//             />
//           )}
//         </div>
//       )}

//       <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
//         <button
//           className="chat-toggle chatbot-toggle-rocket"
//           onClick={toggleChat}
//           style={{ background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, overflow: 'hidden', border: 'none', boxShadow: '0 4px 24px rgba(25,118,210,0.18)', cursor: 'pointer', width: 48, height: 48 }}
//         >
//           <img
//             src="/tinkro-rocket-logo-new.png"
//             alt="Tinkro Rocket"
//             style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', objectFit: 'contain', display: 'block', margin: '0 auto' }}
//           />
//         </button>
//         <span style={{
//           marginTop: 4,
//           color: '#1976d2',
//           fontWeight: 500,
//           fontSize: '11px',
//           borderRadius: '8px',
//           padding: '0 6px',
//           letterSpacing: '0.3px',
//           background: 'none',
//           boxShadow: 'none',
//           border: 'none',
//         }}>Tinkro Bot</span>
//       </div>
//     </div>
//   );
// };

// export default ChatBot;







// // frontend/src/chatbot/ChatBot.jsx
// import React, { useEffect, useRef, useState } from "react";
// import { Paperclip, Smile, Send, X } from "lucide-react";
// import API_URL from "../config/api";

// /**
//  * Tinkro ChatBot (Card buttons, professional)
//  * - Backend: POST ${API_URL}/api/chat  { message }
//  * - Expects response: { reply: string, buttons?: [{ id, label, url? }]}
//  *
//  * Notes:
//  * - Make sure API_URL is set (VITE_API_URL) in your .env for dev/production
//  * - Uses ChatBot.css for styling (professional card buttons)
//  */

// export default function ChatBot() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     {
//       id: `bot-0`,
//       sender: "bot",
//       text: "Hi! I’m Tinkro Buddy — how can I help you today?",
//       buttons: [
//         { id: "what_is_tinkro", label: "What is Tinkro?" },
//         { id: "see_kits", label: "See Our Kits" },
//         { id: "learning_benefits", label: "Learning Benefits" },
//         { id: "contact_support", label: "Contact Support" }
//       ]
//     }
//   ]);

//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [productChips, setProductChips] = useState([]); // parsed quick product buttons
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);

//   const chatRef = useRef(null);
//   const fileRef = useRef(null);
//   const nextId = useRef(1);

//   useEffect(() => {
//     // autoscroll
//     if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
//   }, [messages, isTyping, uploading, productChips]);

//   // Helper: append message
//   const pushMessage = (msg) => {
//     setMessages((prev) => [...prev, { id: `msg-${nextId.current++}`, ...msg }]);
//   };

//   // Parse server reply for product list lines like "Name — ₹price"
//   const parseProductList = (text) => {
//     if (!text) return [];
//     const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
//     const items = [];
//     const re = /^(.+?)\s*—\s*₹?\s*([\d,]+)/; // e.g. "Beginner Robotics Kit — ₹2499"
//     for (const ln of lines) {
//       const m = ln.match(re);
//       if (m) {
//         items.push({ name: m[1].trim(), price: m[2].replace(/,/g, "") });
//       }
//     }
//     return items;
//   };

//   // Call backend
//   const callChatApi = async (message) => {
//     if (!API_URL) {
//       pushMessage({ sender: "bot", text: "Server configuration error: API_URL not set." });
//       return;
//     }

//     setIsTyping(true);
//     setProductChips([]);
//     try {
//       const resp = await fetch(`${API_URL}/api/chat`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message })
//       });
//       const json = await resp.json();
//       const replyText = json.reply || "Sorry, I couldn't process that.";
//       // parse product chips from reply
//       const parsed = parseProductList(replyText);
//       if (parsed.length) setProductChips(parsed);

//       pushMessage({
//         sender: "bot",
//         text: replyText,
//         buttons: json.buttons || []
//       });
//     } catch (err) {
//       console.error("Chat API error:", err);
//       pushMessage({ sender: "bot", text: "⚠️ Connection issue. Please try again later." });
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   const onSend = async (override = null) => {
//     const text = (override ?? input).trim();
//     if (!text) return;
//     // push user message
//     pushMessage({ sender: "user", text });
//     setInput("");
//     // If message is "contact" quick phrase, we can shortcut locally
//     const lower = text.toLowerCase();
//     if (lower.includes("support") || lower.includes("contact")) {
//       // local quick contact reply
//       pushMessage({
//         sender: "bot",
//         text: "You can reach support at support@tinkro.in or call +91-XXXXXXXXXX"
//       });
//       return;
//     }
//     await callChatApi(text);
//   };

//   // When user clicks a button returned by backend
//   const handleCardButton = (btn) => {
//     if (!btn) return;
//     if (btn.url) {
//       // navigate in same tab to product deep link (per requirement)
//       window.location.href = btn.url;
//       return;
//     }
//     // otherwise send its label as a message to backend
//     onSend(btn.label);
//   };

//   // Handle product chip click (parsed product quick list)
//   const onProductChipClick = async (chip) => {
//     try {
//       // find product by name via API and navigate to its id page
//       const resp = await fetch(`${API_URL}/api/product?name=${encodeURIComponent(chip.name)}`);
//       if (!resp.ok) {
//         // fallback: send as chat query (server may return product info)
//         onSend(chip.name);
//         return;
//       }
//       const product = await resp.json();
//       // navigate in same tab
//       window.location.hash = `product?id=${product.id}`;
//       setIsOpen(false);
//     } catch (err) {
//       onSend(chip.name);
//     }
//   };

//   // File upload handler
//   const onFileChange = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setUploading(true);
//     pushMessage({ sender: "user", text: `Uploading file: ${file.name} ...` });
//     try {
//       const fd = new FormData();
//       fd.append("file", file);
//       const resp = await fetch(`${API_URL}/api/upload`, { method: "POST", body: fd });
//       const json = await resp.json();
//       if (json.url) {
//         pushMessage({ sender: "bot", text: `File uploaded: <a href="${json.url}" target="_blank" rel="noreferrer">View file</a>` });
//       } else {
//         pushMessage({ sender: "bot", text: "Upload succeeded but no file URL returned." });
//       }
//     } catch (err) {
//       console.error("Upload error:", err);
//       pushMessage({ sender: "bot", text: "⚠️ Upload failed. Please try again." });
//     } finally {
//       setUploading(false);
//       // reset input value so same file can be uploaded again if needed
//       if (fileRef.current) fileRef.current.value = "";
//     }
//   };

//   // Keyboard Enter
//   const onKeyDown = (e) => {
//     if (e.key === "Enter") onSend();
//   };

//   // Small UI helpers: card button component
//   const CardButton = ({ btn }) => (
//     <button
//       onClick={() => handleCardButton(btn)}
//       className="chat-card-btn"
//       style={{
//         background: "#fff",
//         border: "1px solid rgba(25,118,210,0.08)",
//         boxShadow: "0 6px 18px rgba(25,118,210,0.06)",
//         padding: "10px 12px",
//         borderRadius: 12,
//         minWidth: 140,
//         textAlign: "left",
//         cursor: "pointer",
//         display: "flex",
//         alignItems: "center",
//         gap: 8
//       }}
//     >
//       <div style={{ flex: 1, fontSize: 14, color: "#0b2540", fontWeight: 600 }}>{btn.label}</div>
//       {/* optional chevron */}
//       <div style={{ fontSize: 12, color: "rgba(11,37,64,0.6)" }}>→</div>
//     </button>
//   );

//   return (
//     <div style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}>
//       {/* Toggle */}
//       {!isOpen && (
//         <button
//           onClick={() => setIsOpen(true)}
//           aria-label="Open chat"
//           style={{
//             background: "#1976d2",
//             border: "none",
//             color: "#fff",
//             width: 56,
//             height: 56,
//             borderRadius: "50%",
//             boxShadow: "0 10px 30px rgba(25,118,210,0.24)",
//             cursor: "pointer",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center"
//           }}
//         >
//           <img src="/tinkro-rocket-logo-new.png" alt="Tinkro" style={{ width: 36, height: 36, borderRadius: "50%" }} />
//         </button>
//       )}

//       {/* Chat Window */}
//       {isOpen && (
//         <div
//           className="chat-window"
//           style={{
//             width: 380,
//             maxWidth: "92vw",
//             height: 520,
//             maxHeight: "86vh",
//             background: "#ffffff",
//             borderRadius: 14,
//             boxShadow: "0 20px 60px rgba(11,37,64,0.12)",
//             display: "flex",
//             flexDirection: "column",
//             overflow: "hidden"
//           }}
//         >
//           {/* header */}
//           <div style={{ background: "linear-gradient(90deg,#1976d2,#1565c0)", color: "#fff", padding: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//               <img src="/tinkro-logo-chatbot.png" alt="Tinkro" style={{ width: 40, height: 40, borderRadius: 8 }} />
//               <div>
//                 <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1 }}>Tinkro Buddy</div>
//                 <div style={{ fontSize: 12, opacity: 0.95 }}>How can I help?</div>
//               </div>
//             </div>
//             <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
//               <button onClick={() => { setShowEmojiPicker((s) => !s); }} style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer" }} title="Emoji"><Smile size={18} /></button>
//               <button onClick={() => setIsOpen(false)} style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer" }} title="Close"><X size={18} /></button>
//             </div>
//           </div>

//           {/* body */}
//           <div ref={chatRef} style={{ flex: 1, padding: 12, overflowY: "auto", background: "#f6f9fc", display: "flex", flexDirection: "column", gap: 10 }}>
//             {/* product chips */}
//             {productChips.length > 0 && (
//               <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//                 {productChips.map((c, i) => (
//                   <button key={i} onClick={() => onProductChipClick(c)} style={{ padding: "8px 12px", borderRadius: 999, border: "1px solid rgba(11,37,64,0.06)", background: "#fff", cursor: "pointer", fontSize: 13 }}>
//                     {c.name}
//                   </button>
//                 ))}
//               </div>
//             )}

//             {/* messages */}
//             {messages.map((m) => (
//               <div key={m.id} style={{ display: "flex", flexDirection: "column", alignItems: m.sender === "bot" ? "flex-start" : "flex-end" }}>
//                 <div style={{
//                   maxWidth: "80%",
//                   padding: "10px 12px",
//                   borderRadius: 12,
//                   background: m.sender === "bot" ? "#fff" : "#1976d2",
//                   color: m.sender === "bot" ? "#0b2540" : "#fff",
//                   boxShadow: m.sender === "bot" ? "0 6px 18px rgba(11,37,64,0.04)" : "0 6px 18px rgba(25,118,210,0.12)",
//                   fontSize: 14,
//                   lineHeight: 1.4
//                 }} dangerouslySetInnerHTML={{ __html: (m.text || "").replace(/\n/g, "<br/>") }} />

//                 {/* card buttons under this message (if any) */}
//                 {m.buttons?.length > 0 && (
//                   <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
//                     {m.buttons.map((b, idx) => (
//                       <CardButton key={idx} btn={b} />
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}

//             {/* typing or uploading indicator */}
//             {isTyping && <div style={{ fontSize: 13, color: "#6b7280" }}>Tinkro Buddy is typing…</div>}
//             {uploading && <div style={{ fontSize: 13, color: "#6b7280" }}>Uploading file…</div>}
//           </div>

//           {/* footer */}
//           <div style={{ padding: 10, borderTop: "1px solid rgba(11,37,64,0.04)", background: "#fff", display: "flex", gap: 8, alignItems: "center" }}>
//             <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
//               <Paperclip size={18} />
//               <input ref={fileRef} type="file" style={{ display: "none" }} onChange={onFileChange} />
//             </label>

//             <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
//               <button onClick={() => setShowEmojiPicker((s) => !s)} style={{ background: "transparent", border: "none", cursor: "pointer" }} title="Emoji"><Smile size={18} /></button>
//             </div>

//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={onKeyDown}
//               placeholder="Ask about kits, price or support..."
//               style={{
//                 flex: 1,
//                 padding: "10px 12px",
//                 borderRadius: 10,
//                 border: "1px solid rgba(11,37,64,0.06)",
//                 outline: "none",
//                 fontSize: 14
//               }}
//             />

//             <button onClick={() => onSend()} style={{ background: "#1976d2", border: "none", color: "#fff", padding: "9px 12px", borderRadius: 8, cursor: "pointer" }} title="Send">
//               <Send size={16} />
//             </button>
//           </div>

//           {/* optional inline emoji picker placeholder (if you have a picker component, you can plug it in here) */}
//           {showEmojiPicker && (
//             <div style={{ padding: 8, borderTop: "1px solid rgba(11,37,64,0.04)", background: "#fff" }}>
//               {/* placeholder simple emoji list - replace with your EmojiPicker component if available */}
//               <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
//                 {["😊", "👍", "🎉", "🤖", "📦", "💡"].map((e) => (
//                   <button key={e} onClick={() => { setInput((v) => v + e); setShowEmojiPicker(false); }} style={{ padding: 8, borderRadius: 8, border: "1px solid rgba(11,37,64,0.04)", background: "#fff", cursor: "pointer" }}>{e}</button>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }



// // src/chatbot/ChatBot.jsx
// import React, { useState, useRef, useEffect } from "react";
// import "./ChatBot.css";
// import { Paperclip, Smile, Send, X } from "lucide-react";
// import EmojiPicker from "./EmojiPicker";
// import API_URL from "../config/api";
// import QuickButtons from "../components/QuickButtons";

// const ChatBot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     { sender: "bot", text: "👋 Hi! I’m Tinkro Buddy — how can I help you today?" }
//   ]);
//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [showButtons, setShowButtons] = useState(false);  // keep original
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);

//   // product chips parsed from bot reply (e.g. "Name — ₹price" lines)
//   const [productChips, setProductChips] = useState([]);

//   const messagesEndRef = useRef(null);
//   const fileRef = useRef(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, isTyping, uploading, productChips]);

//   const toggleChat = () => setIsOpen(v => !v);

//   const pushMessage = (msg) => setMessages(m => [...m, msg]);

//   // parse product lines like "Beginner Robotics Kit — ₹2499"
//   const parseProductList = (text) => {
//     if (!text) return [];
//     const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
//     const items = [];
//     const re = /^(.+?)\s*—\s*₹?\s*([\d,]+)/;
//     for (const ln of lines) {
//       const m = ln.match(re);
//       if (m) items.push({ name: m[1].trim(), price: m[2].replace(/,/g, "") });
//     }
//     return items;
//   };

//   // handle button clicks returned by backend
//   const handleBotButton = async (btn) => {
//     if (!btn) return;
//     // if backend provided url, open in same tab (per your requirement)
//     if (btn.url) {
//       window.location.href = btn.url;
//       return;
//     }
//     // else send the button label as a message to backend
//     await sendMessage(btn.label);
//   };

//   // when a product chip is clicked -> try to fetch product by name and open product page
//   const handleProductChipClick = async (chip) => {
//     try {
//       const resp = await fetch(`${API_URL}/api/product?name=${encodeURIComponent(chip.name)}`);
//       if (!resp.ok) {
//         // fallback: send as a query to chatbot
//         await sendMessage(chip.name);
//         return;
//       }
//       const prod = await resp.json();
//       // navigate in-site to product hash page in same tab
//       window.location.hash = `product?id=${prod.id}`;
//       setIsOpen(false);
//     } catch (err) {
//       await sendMessage(chip.name);
//     }
//   };

//   // send message to backend
//   const sendMessage = async (overrideMessage = null, fromQuick = false) => {
//     const msg = (overrideMessage ?? input).trim();
//     if (!msg) return;

//     // push user message
//     pushMessage({ sender: "user", text: msg });
//     if (!fromQuick) setInput("");
//     setShowButtons(true);
//     setIsTyping(true);
//     setProductChips([]);

//     // quick local handling for support/contact
//     if (msg.toLowerCase().includes("support") || msg.toLowerCase().includes("contact")) {
//       setIsTyping(false);
//       pushMessage({
//         sender: "bot",
//         text:
//           "✅ You can reach our support team here:<br/><a href='https://tinkro.in/contact' target='_blank' rel='noreferrer'>https://tinkro.in/contact</a>"
//       });
//       return;
//     }

//     try {
//       const resp = await fetch(`${API_URL}/api/chat`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: msg })
//       });

//       const json = await resp.json();
//       const botText = json.reply || "Sorry, I couldn't process that.";

//       // parse product chips and set
//       const parsed = parseProductList(botText);
//       if (parsed.length) setProductChips(parsed);

//       // push bot message and include buttons if returned by backend
//       pushMessage({ sender: "bot", text: botText, buttons: json.buttons || [] });
//     } catch (err) {
//       pushMessage({ sender: "bot", text: "⚠️ Connection issue. Try again later." });
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   const onKeyDown = (e) => {
//     if (e.key === "Enter") sendMessage();
//   };

//   // file upload
//   const handleFileChange = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setUploading(true);
//     pushMessage({ sender: "user", text: `Uploading: ${file.name} ...` });

//     try {
//       const fd = new FormData();
//       fd.append("file", file);

//       const resp = await fetch(`${API_URL}/api/upload`, { method: "POST", body: fd });
//       const json = await resp.json();

//       if (json.url) {
//         pushMessage({
//           sender: "bot",
//           text: `✅ File uploaded: <a href="${json.url}" target="_blank" rel="noreferrer">View file</a>`
//         });
//       } else {
//         pushMessage({ sender: "bot", text: "⚠️ Upload succeeded but no file URL returned." });
//       }
//     } catch (err) {
//       console.error("Upload error:", err);
//       pushMessage({ sender: "bot", text: "⚠️ Upload failed. Please try again." });
//     } finally {
//       setUploading(false);
//       if (fileRef.current) fileRef.current.value = "";
//     }
//   };

//   return (
//     <div className="chatbot-container">
//       {isOpen && (
//         <div className="chat-window" role="dialog" aria-label="Tinkro Buddy chat">
//           <div className="chat-header">
//             <div className="chat-title">
//               <img src="/tinkro-logo-chatbot.png" alt="logo" className="chat-logo" />
//               <div>
//                 <div className="title-main">Tinkro Buddy</div>
//                 {/* keep original title-sub hidden as before */}
//               </div>
//             </div>
//             <button className="close-btn" onClick={toggleChat}>
//               <X size={18} />
//             </button>
//           </div>

//           <div className="chat-body">
//             {/* show product chips (parsed from last bot reply) */}
//             {productChips.length > 0 && (
//               <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
//                 {productChips.map((p, i) => (
//                   <button
//                     key={i}
//                     className="quick-chip"
//                     onClick={() => handleProductChipClick(p)}
//                     style={{
//                       padding: "8px 12px",
//                       borderRadius: 999,
//                       border: "1px solid rgba(15,30,60,0.06)",
//                       background: "#fff",
//                       cursor: "pointer",
//                       fontSize: 13
//                     }}
//                   >
//                     {p.name}
//                   </button>
//                 ))}
//               </div>
//             )}

//             {/* QuickButtons (initial suggested quick replies) */}
//             {showButtons && <QuickButtons onSelect={async (t) => { setInput(t); await sendMessage(t, true); }} />}

//             {messages.map((m, i) => (
//               <div key={i} className={`chat-bubble ${m.sender}`}>
//                 <div
//                   className="bubble-text"
//                   dangerouslySetInnerHTML={{ __html: (m.text || "").replace(/\n/g, "<br/>") }}
//                 />

//                 {/* if backend returned buttons for this message, render them as cards (preserve old UI look) */}
//                 {m.sender === "bot" && m.buttons && Array.isArray(m.buttons) && m.buttons.length > 0 && (
//                   <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
//                     {m.buttons.map((b, idx) => {
//                       // backend button may be { id, label, url }
//                       const label = b.label || b.title || b.text || "";
//                       return (
//                         <button
//                           key={idx}
//                           onClick={() => handleBotButton(b)}
//                           className="card-btn"
//                           style={{
//                             background: "#fff",
//                             border: "1px solid rgba(15,30,60,0.06)",
//                             padding: "10px 14px",
//                             borderRadius: 12,
//                             boxShadow: "0 6px 18px rgba(11,37,64,0.04)",
//                             cursor: "pointer",
//                             fontWeight: 600,
//                             color: "#0b2540",
//                             minWidth: 150,
//                             textAlign: "left"
//                           }}
//                         >
//                           <span>{label}</span>
//                           <span style={{ float: "right", opacity: 0.7, marginLeft: 8 }}>→</span>
//                         </button>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             ))}

//             {isTyping && <div className="typing">Tinkro Buddy is typing…</div>}
//             {uploading && <div className="typing">Uploading file…</div>}
//             <div ref={messagesEndRef} />
//           </div>

//           <div className="chat-input">
//             <label className="icon-btn">
//               <Paperclip size={18} />
//               <input ref={fileRef} type="file" hidden onChange={handleFileChange} />
//             </label>

//             <button className="icon-btn" onClick={() => setShowEmojiPicker(true)} title="Emoji">
//               <Smile size={18} />
//             </button>

//             <input
//               type="text"
//               placeholder="Ask about kits, products or support..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={onKeyDown}
//             />

//             <button className="send-btn" onClick={() => sendMessage()}>
//               <Send size={18} />
//             </button>
//           </div>

//           {showEmojiPicker && (
//             <EmojiPicker
//               onSelect={emoji => {
//                 setInput(i => (i || "") + emoji.native);
//                 setShowEmojiPicker(false);
//               }}
//               onClose={() => setShowEmojiPicker(false)}
//             />
//           )}
//         </div>
//       )}

//       <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
//         <button
//           className="chat-toggle chatbot-toggle-rocket"
//           onClick={toggleChat}
//           style={{ background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, overflow: 'hidden', border: 'none', boxShadow: '0 4px 24px rgba(25,118,210,0.18)', cursor: 'pointer', width: 48, height: 48 }}
//         >
//           <img
//             src="/tinkro-rocket-logo-new.png"
//             alt="Tinkro Rocket"
//             style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', objectFit: 'contain', display: 'block', margin: '0 auto' }}
//           />
//         </button>
//         <span style={{
//           marginTop: 4,
//           color: '#1976d2',
//           fontWeight: 500,
//           fontSize: '11px',
//           borderRadius: '8px',
//           padding: '0 6px',
//           letterSpacing: '0.3px',
//           background: 'none',
//           boxShadow: 'none',
//           border: 'none',
//         }}>Tinkro Bot</span>
//       </div>
//     </div>
//   );
// };

// export default ChatBot;








// // src/chatbot/ChatBot.jsx
// import React, { useState, useRef, useEffect } from "react";
// import "./ChatBot.css";
// import { Paperclip, Smile, Send, X } from "lucide-react";
// import EmojiPicker from "./EmojiPicker";
// import API_URL from "../config/api";
// import QuickButtons from "../components/QuickButtons";
// import SupportPopup from "./SupportPopup";

// const ChatBot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     { sender: "bot", text: "👋 Hi! I’m Tinkro Buddy — how can I help you today?" }
//   ]);
//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [showButtons, setShowButtons] = useState(false);
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [productChips, setProductChips] = useState([]);
//   const [showSupportPopup, setShowSupportPopup] = useState(false);
//   const [supportInitialQuestion, setSupportInitialQuestion] = useState("");
//   const [supportLang, setSupportLang] = useState("en");

//   const messagesEndRef = useRef(null);
//   const fileRef = useRef(null);
//   const nextId = useRef(1);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, isTyping, uploading, productChips, showSupportPopup]);

//   const toggleChat = () => setIsOpen(v => !v);

//   const pushMessage = (msg) => setMessages(m => [...m, { id: `msg-${nextId.current++}`, ...msg }]);

//   // parse product lines
//   const parseProductList = (text) => {
//     if (!text) return [];
//     const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
//     const items = [];
//     const re = /^(.+?)\s*—\s*₹?\s*([\d,]+)/;
//     for (const ln of lines) {
//       const m = ln.match(re);
//       if (m) items.push({ name: m[1].trim(), price: m[2].replace(/,/g, "") });
//     }
//     return items;
//   };

//   // Quick-buttons trigger keywords (only these should show quick buttons)
//   const buttonTriggers = ["kit", "kits", "product", "products", "see kits", "show kits", "all kits", "shop", "catalog"];

//   function shouldShowButtonsForText(text) {
//     if (!text) return false;
//     const t = text.toLowerCase();
//     return buttonTriggers.some(k => t.includes(k));
//   }

//   // handle backend buttons
//   const handleBotButton = async (btn) => {
//     if (!btn) return;
//     if (btn.url) {
//       // same tab navigation requirement
//       window.location.href = btn.url;
//       return;
//     }
//     await sendMessage(btn.label);
//   };

//   // product chip click
//   const handleProductChipClick = async (chip) => {
//     try {
//       const resp = await fetch(`${API_URL}/api/product?name=${encodeURIComponent(chip.name)}`);
//       if (!resp.ok) {
//         await sendMessage(chip.name);
//         return;
//       }
//       const prod = await resp.json();
//       window.location.hash = `product?id=${prod.id}`;
//       setIsOpen(false);
//     } catch (err) {
//       await sendMessage(chip.name);
//     }
//   };

//   // send message to backend
//   const sendMessage = async (overrideMessage = null, fromQuick = false) => {
//     const msg = (overrideMessage ?? input).trim();
//     if (!msg) return;
//     pushMessage({ sender: "user", text: msg });
//     if (!fromQuick) setInput("");
//     setIsTyping(true);
//     setProductChips([]);
//     // set quick buttons only if message contains product trigger
//     setShowButtons(shouldShowButtonsForText(msg));

//     // quick local support shortcut
//     if (msg.toLowerCase().includes("support") || msg.toLowerCase().includes("contact") || msg.toLowerCase().includes("help")) {
//       setIsTyping(false);
//       const supportPrompt = "Would you like to talk to our support team? (Click 'Talk to Support')";
//       pushMessage({ sender: "bot", text: supportPrompt });
//       // show Talk to Support button below immediately
//       pushMessage({ sender: "bot", text: "", buttons: [{ id: "talk_support", label: "Talk to Support" }] });
//       return;
//     }

//     try {
//       const resp = await fetch(`${API_URL}/api/chat`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: msg })
//       });
//       const json = await resp.json();
//       const botText = json.reply || "Sorry, I couldn't process that.";

//       // parse product chips
//       const parsed = parseProductList(botText);
//       if (parsed.length) setProductChips(parsed);

//       // if fallback true -> open support popup automatically (with language)
//       if (json.fallback) {
//         // determine lang using returned fallback_lang if available
//         const lang = json.fallback_lang === "hinglish" || json.fallback_lang === "hi" ? "hi" : "en";
//         setSupportLang(lang === "hi" ? "hi" : "en");
//         setSupportInitialQuestion(msg);
//         // show bot fallback message then open popup
//         pushMessage({ sender: "bot", text: botText });
//         setTimeout(() => {
//           setShowSupportPopup(true);
//         }, 600);
//       } else {
//         pushMessage({ sender: "bot", text: botText, buttons: json.buttons || [] });
//       }
//     } catch (err) {
//       console.error("Chat API error:", err);
//       pushMessage({ sender: "bot", text: "⚠️ Connection issue. Please try again later." });
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   const onKeyDown = (e) => {
//     if (e.key === "Enter") sendMessage();
//   };

//   // file upload
//   const handleFileChange = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setUploading(true);
//     pushMessage({ sender: "user", text: `Uploading: ${file.name} ...` });
//     try {
//       const fd = new FormData();
//       fd.append("file", file);
//       const resp = await fetch(`${API_URL}/api/upload`, { method: "POST", body: fd });
//       const json = await resp.json();
//       if (json.url) {
//         pushMessage({ sender: "bot", text: `✅ File uploaded: <a href="${json.url}" target="_blank" rel="noreferrer">View file</a>` });
//       } else {
//         pushMessage({ sender: "bot", text: "⚠️ Upload succeeded but no file URL returned." });
//       }
//     } catch (err) {
//       console.error("Upload error:", err);
//       pushMessage({ sender: "bot", text: "⚠️ Upload failed. Please try again." });
//     } finally {
//       setUploading(false);
//       if (fileRef.current) fileRef.current.value = "";
//     }
//   };

//   // handle special backend-sent "Talk to Support" button (id match)
//   const handleBackendButtonClick = async (b) => {
//     if (!b) return;
//     const label = (b.label || "").toLowerCase();
//     if (label.includes("support") || label.includes("contact")) {
//       // open support popup
//       setSupportInitialQuestion(input || "");
//       // determine language roughly by message content
//       const lang = (input || "").toLowerCase().match(/kya|kaise|nahi|batao|sasti|krna/) ? "hi" : "en";
//       setSupportLang(lang);
//       setShowSupportPopup(true);
//       return;
//     }
//     await handleBotButton(b);
//   };

//   return (
//     <div className="chatbot-container">
//       {isOpen && (
//         <div className="chat-window" role="dialog" aria-label="Tinkro Buddy chat">
//           <div className="chat-header">
//             <div className="chat-title">
//               <img src="/tinkro-logo-chatbot.png" alt="logo" className="chat-logo" />
//               <div>
//                 <div className="title-main">Tinkro Buddy</div>
//               </div>
//             </div>
//             <button className="close-btn" onClick={toggleChat}>
//               <X size={18} />
//             </button>
//           </div>

//           <div className="chat-body">
//             {/* product chips */}
//             {productChips.length > 0 && (
//               <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
//                 {productChips.map((p, i) => (
//                   <button key={i} className="quick-chip" onClick={() => handleProductChipClick(p)}>{p.name}</button>
//                 ))}
//               </div>
//             )}

//             {/* QuickButtons only when triggered */}
//             {showButtons && <QuickButtons onSelect={async (t) => { setInput(t); await sendMessage(t, true); }} />}

//             {messages.map((m) => (
//               <div key={m.id} className={`chat-bubble ${m.sender}`}>
//                 <div className="bubble-text" dangerouslySetInnerHTML={{ __html: (m.text || "").replace(/\n/g, "<br/>") }} />

//                 {/* backend buttons */}
//                 {m.sender === "bot" && m.buttons && Array.isArray(m.buttons) && m.buttons.length > 0 && (
//                   <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
//                     {m.buttons.map((b, idx) => (
//                       <button key={idx} onClick={() => handleBackendButtonClick(b)} className="card-btn">{b.label || b.title || b.text || ""} <span style={{ float: "right", opacity: 0.7, marginLeft: 8 }}>→</span></button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}

//             {isTyping && <div className="typing">Tinkro Buddy is typing…</div>}
//             {uploading && <div className="typing">Uploading file…</div>}
//             <div ref={messagesEndRef} />
//           </div>

//           <div className="chat-input">
//             <label className="icon-btn">
//               <Paperclip size={18} />
//               <input ref={fileRef} type="file" hidden onChange={handleFileChange} />
//             </label>

//             <button className="icon-btn" onClick={() => setShowEmojiPicker(true)} title="Emoji">
//               <Smile size={18} />
//             </button>

//             <input type="text" placeholder="Ask about kits, products or support..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKeyDown} />

//             <button className="send-btn" onClick={() => sendMessage()}>
//               <Send size={18} />
//             </button>
//           </div>

//           {showEmojiPicker && (
//             <EmojiPicker onSelect={emoji => { setInput(i => (i || "") + emoji.native); setShowEmojiPicker(false); }} onClose={() => setShowEmojiPicker(false)} />
//           )}
//         </div>
//       )}

//       {/* floating toggle (preserve old UI) */}
//       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//         <button className="chat-toggle chatbot-toggle-rocket" onClick={toggleChat} style={{ background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, overflow: 'hidden', border: 'none', boxShadow: '0 4px 24px rgba(25,118,210,0.18)', cursor: 'pointer', width: 48, height: 48 }}>
//           <img src="/tinkro-rocket-logo-new.png" alt="Tinkro Rocket" style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', objectFit: 'contain', display: 'block', margin: '0 auto' }} />
//         </button>
//         <span style={{ marginTop: 4, color: '#1976d2', fontWeight: 500, fontSize: '11px', borderRadius: '8px', padding: '0 6px', letterSpacing: '0.3px', background: 'none', boxShadow: 'none', border: 'none' }}>Tinkro Bot</span>
//       </div>

//       {/* Support popup */}
//       {showSupportPopup && (
//         <SupportPopup
//           initialQuestion={supportInitialQuestion}
//           onClose={() => setShowSupportPopup(false)}
//           onSuccess={(entry) => {
//             // show confirmation bot message
//             const lang = supportLang === "hi" ? "hi" : "en";
//             const conf = lang === "hi" ? "Aapka request submit ho gaya. Hamari team jald contact karegi." : "Your request has been submitted. Our team will contact you shortly.";
//             pushMessage({ sender: "bot", text: conf });
//           }}
//           lang={supportLang}
//         />
//       )}
//     </div>
//   );
// };

// export default ChatBot;






// // src/chatbot/ChatBot.jsx
// import React, { useEffect, useRef, useState } from "react";
// import "./ChatBot.css";
// import { Paperclip, Smile, Send, X } from "lucide-react";
// import EmojiPicker from "./EmojiPicker";
// import API_URL from "../config/api";
// import QuickButtonsGeneral from "./components/QuickButtonsGeneral";
// import QuickButtonsProduct from "./components/QuickButtonsProduct";
// import SupportPopup from "./SupportPopup";

// const GREETINGS = ["hi", "hello", "hey", "namaste"];

// export default function ChatBot() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     { id: "bot-0", sender: "bot", text: "👋 Hi! I’m Tinkro Buddy — how can I help you today?" }
//   ]);
//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);

//   // which group of quick buttons to show: "none" | "general" | "product"
//   const [quickGroup, setQuickGroup] = useState("none");
//   const [productChips, setProductChips] = useState([]);

//   // support popup
//   const [showSupportPopup, setShowSupportPopup] = useState(false);
//   const [supportInitialQuestion, setSupportInitialQuestion] = useState("");
//   const [supportLang, setSupportLang] = useState("en");

//   const messagesEndRef = useRef(null);
//   const fileRef = useRef(null);
//   const nextId = useRef(1);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, isTyping, uploading, productChips, quickGroup, showSupportPopup]);

//   const pushMessage = (msg) => {
//     setMessages((m) => [...m, { id: `msg-${nextId.current++}`, ...msg }]);
//   };

//   const toggleChat = () => setIsOpen((v) => !v);

//   // utility: is greeting message (single short greeting)
//   const isGreetingOnly = (text) => {
//     if (!text) return false;
//     const t = text.trim().toLowerCase();
//     // exact greeting or greeting with punctuation
//     return GREETINGS.includes(t) || GREETINGS.includes(t.replace(/[!?.]/g, ""));
//   };

//   // detect category: "product" or "general"
//   const detectCategory = (msg) => {
//     if (!msg) return "general";
//     const t = msg.toLowerCase();
//     const productWords = [
//       "kit", "kits", "robot", "robotics", "price", "sensor", "arduino",
//       "ai kit", "starter", "electronics", "project", "sasti", "cheapest",
//       "school", "bulk", "competition", "buy", "order", "catalog", "show kits", "show all"
//     ];
//     return productWords.some((w) => t.includes(w)) ? "product" : "general";
//   };

//   // parse simple product list lines: "Name — ₹price"
//   const parseProductList = (text) => {
//     if (!text) return [];
//     const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
//     const items = [];
//     const re = /^(.+?)\s*—\s*₹?\s*([\d,]+)/; // e.g. "Beginner Robotics Kit — ₹2499"
//     for (const ln of lines) {
//       const m = ln.match(re);
//       if (m) items.push({ name: m[1].trim(), price: m[2].replace(/,/g, "") });
//     }
//     return items;
//   };

//   // open product page in same tab by id (hash)
//   const openProductById = (id) => {
//     if (!id) return;
//     // use hash-based routing as requested
//     window.location.hash = `product?id=${id}`;
//     setIsOpen(false);
//   };

//   // get product by name via backend API
//   const fetchProductByName = async (name) => {
//     try {
//       const resp = await fetch(`${API_URL}/api/product?name=${encodeURIComponent(name)}`);
//       if (!resp.ok) return null;
//       const json = await resp.json();
//       return json;
//     } catch (err) {
//       return null;
//     }
//   };

//   // when user clicks a product chip parsed from a bot reply
//   const handleProductChipClick = async (chip) => {
//     const p = await fetchProductByName(chip.name);
//     if (p && p.id) {
//       openProductById(p.id);
//     } else {
//       // fallback: send chip text to chat to get more info
//       await sendMessage(chip.name);
//     }
//   };

//   // handle backend button click (may include url)
//   const handleBackendButton = async (btn) => {
//     if (!btn) return;
//     const label = (btn.label || btn.title || btn.text || "").trim();
//     if (btn.url) {
//       // open in same tab per requirement
//       window.location.href = btn.url;
//       return;
//     }

//     // special: "talk to support" label
//     if (label.toLowerCase().includes("support") || label.toLowerCase().includes("contact")) {
//       // open support popup
//       setSupportInitialQuestion(input || "");
//       // basic lang detection
//       setSupportLang((input || "").match(/kya|kaise|nahi|batao|sasti|krna/) ? "hi" : "en");
//       setShowSupportPopup(true);
//       return;
//     }

//     // otherwise send the label as a chat message
//     await sendMessage(label);
//   };

//   // when user clicks one of our quick buttons (general or product)
//   const handleQuickSelect = async (text) => {
//     // put user message and send it as a real query (so backend handles)
//     setInput(text);
//     await sendMessage(text, true);
//   };

//   // send message to backend
//   const sendMessage = async (overrideMessage = null, fromQuick = false) => {
//     const raw = overrideMessage ?? input;
//     const msg = String(raw || "").trim();
//     if (!msg) return;

//     // push user message
//     pushMessage({ sender: "user", text: msg });

//     // clear input (unless fromQuick we leave cleared anyway)
//     setInput("");

//     // determine if greeting-only
//     const greetingOnly = isGreetingOnly(msg);

//     // if greeting-only, reply with greeting and do not show quick buttons yet
//     if (greetingOnly) {
//       setIsTyping(true);
//       // simulate a small typing delay for natural feel
//       setTimeout(() => {
//         pushMessage({ sender: "bot", text: "👋 Hi! I’m Tinkro Buddy — what would you like help with?" });
//         setIsTyping(false);
//         setQuickGroup("none"); // no quick buttons yet
//       }, 700);
//       return;
//     }

//     // for other messages, determine group
//     const cat = detectCategory(msg);
//     setQuickGroup("none"); // hide until backend reply
//     setProductChips([]);
//     setIsTyping(true);

//     // quick local "support" shortcut (user typed support)
//     if (msg.toLowerCase().includes("support") || msg.toLowerCase().includes("contact") || msg.toLowerCase().includes("help")) {
//       // show bot prompt with Talk to Support button
//       pushMessage({
//         sender: "bot",
//         text: (msg.match(/kya|kaise|nahi|batao|sasti|krna/) ? "Kya aap support team se baat karna chahenge?" : "Would you like to talk to our support team?"),
//         buttons: [{ label: "Talk to Support" }]
//       });
//       setIsTyping(false);
//       return;
//     }

//     // call API
//     try {
//       const resp = await fetch(`${API_URL}/api/chat`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: msg })
//       });
//       const json = await resp.json();

//       const botText = json.reply || "Sorry, I couldn't process that.";

//       // parse product chips
//       const parsed = parseProductList(botText);
//       if (parsed.length) setProductChips(parsed);

//       // show bot reply
//       pushMessage({ sender: "bot", text: botText, buttons: json.buttons || [] });

//       // if backend flagged fallback -> open support popup automatically
//       if (json.fallback) {
//         const lang = json.fallback_lang === "hinglish" || json.fallback_lang === "hi" ? "hi" : "en";
//         setSupportLang(lang);
//         setSupportInitialQuestion(msg);
//         // open popup shortly after reply
//         setTimeout(() => setShowSupportPopup(true), 600);
//       } else {
//         // show quick buttons based on detected category after reply,
//         // but only if backend didn't return its own buttons.
//         if (!json.buttons || json.buttons.length === 0) {
//           setQuickGroup(cat === "product" ? "product" : "general");
//         } else {
//           setQuickGroup("none");
//         }
//       }
//     } catch (err) {
//       console.error("Chat API error:", err);
//       pushMessage({ sender: "bot", text: "⚠️ Connection issue. Please try again later." });
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   // keyboard Enter handler
//   const onKeyDown = (e) => {
//     if (e.key === "Enter") sendMessage();
//   };

//   // file upload
//   const handleFileChange = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setUploading(true);
//     pushMessage({ sender: "user", text: `Uploading: ${file.name} ...` });
//     try {
//       const fd = new FormData();
//       fd.append("file", file);
//       const resp = await fetch(`${API_URL}/api/upload`, { method: "POST", body: fd });
//       const json = await resp.json();
//       if (json.url) {
//         pushMessage({ sender: "bot", text: `✅ File uploaded: <a href="${json.url}" target="_blank" rel="noreferrer">View file</a>` });
//       } else {
//         pushMessage({ sender: "bot", text: "⚠️ Upload succeeded but no file URL returned." });
//       }
//     } catch (err) {
//       console.error("Upload error:", err);
//       pushMessage({ sender: "bot", text: "⚠️ Upload failed. Please try again." });
//     } finally {
//       setUploading(false);
//       if (fileRef.current) fileRef.current.value = "";
//     }
//   };

//   // handle when a backend button is clicked (one shown under a bot message)
//   const onBackendButtonClick = async (b) => {
//     if (!b) return;
//     const label = (b.label || b.title || b.text || "").toString();
//     // detect if it's support
//     if (label.toLowerCase().includes("support") || label.toLowerCase().includes("contact")) {
//       setSupportInitialQuestion(input || "");
//       setSupportLang((input || "").match(/kya|kaise|nahi|batao|sasti|krna/) ? "hi" : "en");
//       setShowSupportPopup(true);
//       return;
//     }
//     if (b.url) {
//       // open same-tab
//       window.location.href = b.url;
//       return;
//     }
//     await sendMessage(label);
//   };

//   return (
//     <div className="chatbot-container">
//       {isOpen && (
//         <div className="chat-window" role="dialog" aria-label="Tinkro Buddy chat">
//           <div className="chat-header">
//             <div className="chat-title">
//               <img src="/tinkro-logo-chatbot.png" alt="logo" className="chat-logo" />
//               <div>
//                 <div className="title-main">Tinkro Buddy</div>
//               </div>
//             </div>
//             <button className="close-btn" onClick={toggleChat}>
//               <X size={18} />
//             </button>
//           </div>

//           <div className="chat-body">
//             {/* product chips (parsed from bot reply) */}
//             {productChips.length > 0 && (
//               <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
//                 {productChips.map((c, i) => (
//                   <button key={i} className="quick-chip" onClick={() => handleProductChipClick(c)}>
//                     {c.name}
//                   </button>
//                 ))}
//               </div>
//             )}

//             {/* quick buttons (only after user's follow-up and depending on category) */}
//             {quickGroup === "general" && <QuickButtonsGeneral onSelect={handleQuickSelect} />}
//             {quickGroup === "product" && <QuickButtonsProduct onSelect={handleQuickSelect} />}

//             {/* messages */}
//             {messages.map((m) => (
//               <div key={m.id} className={`chat-bubble ${m.sender}`}>
//                 <div className="bubble-text" dangerouslySetInnerHTML={{ __html: (m.text || "").replace(/\n/g, "<br/>") }} />

//                 {/* backend-provided buttons for this message */}
//                 {m.sender === "bot" && m.buttons && Array.isArray(m.buttons) && m.buttons.length > 0 && (
//                   <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
//                     {m.buttons.map((b, idx) => (
//                       <button key={idx} className="card-btn" onClick={() => onBackendButtonClick(b)}>
//                         {(b.label || b.title || b.text || "").toString()} <span style={{ float: "right", opacity: 0.7 }}>→</span>
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}

//             {isTyping && <div className="typing">Tinkro Buddy is typing…</div>}
//             {uploading && <div className="typing">Uploading file…</div>}
//             <div ref={messagesEndRef} />
//           </div>

//           <div className="chat-input">
//             <label className="icon-btn" title="Upload file">
//               <Paperclip size={18} />
//               <input ref={fileRef} type="file" hidden onChange={handleFileChange} />
//             </label>

//             <button className="icon-btn" onClick={() => setShowEmojiPicker((s) => !s)} title="Emoji">
//               <Smile size={18} />
//             </button>

//             <input
//               type="text"
//               placeholder="Ask about kits, products or support..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={onKeyDown}
//             />

//             <button className="send-btn" onClick={() => sendMessage()}>
//               <Send size={18} />
//             </button>
//           </div>

//           {showEmojiPicker && (
//             <div style={{ position: "absolute", bottom: 86, right: 22 }}>
//               <EmojiPicker
//                 onSelect={(emoji) => {
//                   setInput((v) => (v || "") + (emoji.native || emoji));
//                   setShowEmojiPicker(false);
//                 }}
//                 onClose={() => setShowEmojiPicker(false)}
//               />
//             </div>
//           )}
//         </div>
//       )}

//       {/* floating toggle (same styling as original) */}
//       <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
//         <button
//           className="chat-toggle chatbot-toggle-rocket"
//           onClick={toggleChat}
//           style={{
//             background: "#fff",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: 0,
//             overflow: "hidden",
//             border: "none",
//             boxShadow: "0 4px 24px rgba(25,118,210,0.18)",
//             cursor: "pointer",
//             width: 48,
//             height: 48
//           }}
//         >
//           <img src="/tinkro-rocket-logo-new.png" alt="Tinkro Rocket" style={{ width: 40, height: 40, borderRadius: "50%", background: "#fff", objectFit: "contain" }} />
//         </button>
//         <span style={{ marginTop: 4, color: "var(--tinkro-blue)", fontWeight: 500, fontSize: "11px" }}>Tinkro Bot</span>
//       </div>

//       {/* Support Popup */}
//       {showSupportPopup && (
//         <SupportPopup
//           initialQuestion={supportInitialQuestion}
//           lang={supportLang}
//           onClose={() => setShowSupportPopup(false)}
//           onSuccess={(entry) => {
//             // show a confirmation message inside chat
//             pushMessage({ sender: "bot", text: supportLang === "hi" ? "Aapka request submit ho gaya. Hamari team jald contact karegi." : "Your request has been submitted. Our team will contact you shortly." });
//           }}
//         />
//       )}
//     </div>
//   );
// }



// ============================================
// File: src/chatbot/ChatBot.jsx
// Purpose: Master chatbot UI + frontend logic
// Includes: Quick buttons, support popup,
// emoji picker, file upload, fallback, typing.
// ============================================

// import React, { useState, useRef, useEffect } from "react";
// import "./ChatBot.css";
// import { Paperclip, Smile, Send, X } from "lucide-react";
// import EmojiPicker from "./EmojiPicker";
// import API_URL from "../config/api";
// import QuickButtons from "../components/QuickButtons";
// import SupportPopup from "./SupportPopup";

// const ChatBot = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   const [messages, setMessages] = useState([
//     {
//       sender: "bot",
//       text: "👋 Hi! I’m Tinkro Buddy — how can I help you today?"
//     }
//   ]);

//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [uploading, setUploading] = useState(false);

//   const [showButtons, setShowButtons] = useState(false);
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [showSupportPopup, setShowSupportPopup] = useState(false);

//   const messagesEndRef = useRef(null);

//   // ✅ Auto-scroll bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, isTyping, uploading]);

//   const toggleChat = () => setIsOpen((v) => !v);

//   // ✅ USER CLICKS QUICK BUTTON (e.g., "Show all kits")
//   const handleSelectQuick = async (text) => {
//     setInput(text);
//     await sendMessage(text, true);
//   };

//   // ✅ SEND MESSAGE FUNCTION
//   const sendMessage = async (override = null, fromQuick = false) => {
//     const msg = override || input.trim();
//     if (!msg) return;

//     // ✅ Show user message
//     setMessages((m) => [...m, { sender: "user", text: msg }]);

//     if (!fromQuick) setInput("");
//     setIsTyping(true);

//     // ✅ Buttons ON after first real message
//     if (!showButtons) setShowButtons(true);

//     // ✅ Support keywords → open popup immediately
//     if (
//       msg.toLowerCase().includes("support") ||
//       msg.toLowerCase().includes("help")
//     ) {
//       setIsTyping(false);
//       setShowSupportPopup(true);
//       return;
//     }

//     // ✅ Send message to backend
//     try {
//       const resp = await fetch(`${API_URL}/api/chat`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: msg })
//       });

//       const json = await resp.json();
//       setIsTyping(false);

//       // ✅ Backend fallback → open support popup
//       if (json.fallback === true) {
//         setShowSupportPopup(true);
//       }

//       setMessages((m) => [...m, { sender: "bot", text: json.reply }]);
//     } catch (err) {
//       setIsTyping(false);
//       setMessages((m) => [
//         ...m,
//         { sender: "bot", text: "⚠️ Connection issue, please try again." }
//       ]);
//     }
//   };

//   // ✅ Enter key sends message
//   const onKeyDown = (e) => {
//     if (e.key === "Enter") sendMessage();
//   };

//   // ✅ File Upload Handler
//   const handleFileChange = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setUploading(true);

//     setMessages((m) => [
//       ...m,
//       { sender: "user", text: `Uploading: ${file.name} ...` }
//     ]);

//     try {
//       const fd = new FormData();
//       fd.append("file", file);

//       const resp = await fetch(`${API_URL}/api/upload`, {
//         method: "POST",
//         body: fd
//       });

//       const json = await resp.json();

//       if (json.url) {
//         setMessages((m) => [
//           ...m,
//           {
//             sender: "bot",
//             text: `✅ File uploaded:<br/><a href="${json.url}" target="_blank">Click to view</a>`
//           }
//         ]);
//       }
//     } catch {
//       setMessages((m) => [
//         ...m,
//         { sender: "bot", text: "⚠️ Upload failed. Try again." }
//       ]);
//     }

//     setUploading(false);
//   };

//   return (
//     <div className="chatbot-container">

//       {/* ✅ CHAT WINDOW */}
//       {isOpen && (
//         <div className="chat-window">
          
//           {/* ✅ HEADER */}
//           <div className="chat-header">
//             <div className="chat-title">
//               <img
//                 src="/tinkro-logo-chatbot.png"
//                 alt="logo"
//                 className="chat-logo"
//               />
//               <div>
//                 <div className="title-main">Tinkro Buddy</div>
//               </div>
//             </div>

//             <button className="close-btn" onClick={toggleChat}>
//               <X size={18} />
//             </button>
//           </div>

//           {/* ✅ CHAT BODY */}
//           <div className="chat-body">

//             {/* ✅ Quick Buttons */}
//             {showButtons && <QuickButtons onSelect={handleSelectQuick} />}

//             {/* ✅ Chat Messages */}
//             {messages.map((m, i) => (
//   <div key={i} className={`chat-bubble ${m.sender}`}>
//     <div
//       className="bubble-text"
//       dangerouslySetInnerHTML={{
//         __html: (m.text || "")
//           .toString()
//           .replace(/\n/g, "<br/>")
//       }}
//     />
//   </div>
// ))}


//             {isTyping && <div className="typing">Tinkro Buddy is typing…</div>}
//             {uploading && <div className="typing">Uploading…</div>}

//             <div ref={messagesEndRef} />
//           </div>

//           {/* ✅ INPUT AREA */}
//           <div className="chat-input">

//             <label className="icon-btn">
//               <Paperclip size={18} />
//               <input type="file" hidden onChange={handleFileChange} />
//             </label>

//             <button
//               className="icon-btn"
//               onClick={() => setShowEmojiPicker(true)}
//             >
//               <Smile size={18} />
//             </button>

//             <input
//               type="text"
//               placeholder="Ask about kits, products or help..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={onKeyDown}
//             />

//             <button className="send-btn" onClick={() => sendMessage()}>
//               <Send size={18} />
//             </button>
//           </div>

//           {/* ✅ EMOJI PICKER */}
//           {showEmojiPicker && (
//             <EmojiPicker
//               onSelect={(emoji) => {
//                 setInput(input + emoji.native);
//                 setShowEmojiPicker(false);
//               }}
//               onClose={() => setShowEmojiPicker(false)}
//             />
//           )}
//         </div>
//       )}

//       {/* ✅ Floating Rocket Button */}
//       <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
//         <button className="chat-toggle" onClick={toggleChat}>
//           <img
//             src="/tinkro-rocket-logo-new.png"
//             alt="Tinkro Rocket"
//             style={{
//               width: 40,
//               height: 40,
//               borderRadius: "50%",
//               objectFit: "contain"
//             }}
//           />
//         </button>
//         <span
//           style={{
//             marginTop: 4,
//             color: "#1976d2",
//             fontWeight: 500,
//             fontSize: "11px"
//           }}
//         >
//           Tinkro Bot
//         </span>
//       </div>

//       {/* ✅ Support Popup */}
//       {showSupportPopup && (
//         <SupportPopup onClose={() => setShowSupportPopup(false)} />
//       )}
//     </div>
//   );
// };

// export default ChatBot;




// ✅ FINAL — Tinkro ChatBot (Intent-based Buttons + Emoji + Upload + Support Popup)

import React, { useState, useRef, useEffect } from "react";
import "./ChatBot.css";
import { Paperclip, Smile, Send, X } from "lucide-react";
import EmojiPicker from "./EmojiPicker";
import API_URL from "../config/api";
import QuickButtons from "../components/QuickButtons";
import SupportPopup from "./SupportPopup";

// ✅ Intent detection function
function detectIntent(text) {
  const msg = text.toLowerCase();

  const kitWords = [
    "kit", "arduino", "robot", "sensor", "price", "cost",
    "project", "robotics", "electronics", "cheapest", "starter kit"
  ];

  const infoWords = [
    "tinkro", "learning", "benefit", "school",
    "workshop", "program", "details", "what is", "explain", "info"
  ];

  if (kitWords.some(w => msg.includes(w))) return "kits";
  if (infoWords.some(w => msg.includes(w))) return "info";

  return "none";
}

const ChatBot = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi! I’m Tinkro Buddy — how can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [showButtons, setShowButtons] = useState(false);
  const [buttonType, setButtonType] = useState("kits"); // kits or info

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSupportPopup, setShowSupportPopup] = useState(false);

  const messagesEndRef = useRef(null);

  // ✅ Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, uploading]);

  const toggleChat = () => setIsOpen(v => !v);

  // ✅ Quick button click
  const handleSelectQuick = async (text) => {
    setInput(text);
    await sendMessage(text, true);
  };

  // ✅ MAIN SEND FUNCTION
  const sendMessage = async (overrideMessage = null, fromQuick = false) => {

    const msg = overrideMessage || input.trim();
    if (!msg) return;

    // user message print
    setMessages(m => [...m, { sender: "user", text: msg }]);
    if (!fromQuick) setInput("");

    setIsTyping(true);

    // ❌ First user message → no buttons
    if (messages.length === 1) {
      setShowButtons(false);
    }

    // ✅ Support keyword check - more specific
    const lowerMsg = msg.toLowerCase().trim();
    if (lowerMsg === "support" || lowerMsg === "contact support" || lowerMsg.includes("talk to support") || lowerMsg.includes("need support")) {
      setIsTyping(false);
      setShowSupportPopup(true);
      return;
    }

    try {
      const resp = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });

      const json = await resp.json();
      setIsTyping(false);

      // ✅ Bot reply
      setMessages(m => [...m, { sender: "bot", text: json.reply }]);

      // ✅ Intent detection
      const intent = detectIntent(msg);

      if (intent === "kits") {
        setButtonType("kits");
        setShowButtons(true);
      } 
      else if (intent === "info") {
        setButtonType("info");
        setShowButtons(true);
      } 
      else {
        setShowButtons(false);
      }

      // ✅ Backend fallback opens support form (disabled for now)
      // if (json.fallback) {
      //   setShowSupportPopup(true);
      // }

    } catch (err) {
      setIsTyping(false);

      setMessages(m => [
        ...m,
        { sender: "bot", text: "⚠️ Internet issue. Please try again." }
      ]);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  // ✅ FILE UPLOAD
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    setMessages(m => [
      ...m,
      { sender: "user", text: `Uploading: ${file.name} ...` },
    ]);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const resp = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        body: fd,
      });

      const json = await resp.json();

      if (json.url) {
        setMessages(m => [
          ...m,
          {
            sender: "bot",
            text: `✅ File uploaded:<br/><a href="${json.url}" target="_blank">View file</a>`,
          },
        ]);
      }
    } catch (err) {
      setMessages(m => [
        ...m,
        { sender: "bot", text: "⚠️ Upload failed. Try again." },
      ]);
    }

    setUploading(false);
  };

  return (
    <div className="chatbot-container">
      
      {/* ✅ CHAT WINDOW */}
      {isOpen && (
        <div className="chat-window">

          {/* ✅ Header */}
          <div className="chat-header">
            <div className="chat-title">
              <img
                src="/tinkro-logo-chatbot.png"
                alt="logo"
                className="chat-logo"
              />
              <div className="title-main">Tinkro Buddy</div>
            </div>

            <button className="close-btn" onClick={toggleChat}>
              <X size={18} />
            </button>
          </div>

          {/* ✅ Chat Body */}
          <div className="chat-body">

            {/* ✅ Buttons only AFTER intent */}
            {showButtons && (
              <QuickButtons type={buttonType} onSelect={handleSelectQuick} />
            )}

            {/* ✅ Messages */}
            {messages.map((msg, i) => {
              const safeText = (msg.text || "").replace(/\n/g, "<br/>");
              return (
                <div
                  key={i}
                  className={`chat-bubble ${msg.sender === "bot" ? "bot" : "user"}`}
                  dangerouslySetInnerHTML={{ __html: safeText }}
                />
              );
            })}

            {isTyping && <div className="typing">Tinkro Buddy is typing…</div>}
            {uploading && <div className="typing">Uploading…</div>}

            <div ref={messagesEndRef} />
          </div>

          {/* ✅ Input Area */}
          <div className="chat-input">
            <label className="icon-btn">
              <Paperclip size={18} />
              <input type="file" hidden onChange={handleFileChange} />
            </label>

            <button
              className="icon-btn"
              onClick={() => setShowEmojiPicker(true)}
            >
              <Smile size={18} />
            </button>

            <input
              type="text"
              placeholder="Ask about kits, products or help..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
            />

            <button className="send-btn" onClick={() => sendMessage()}>
              <Send size={18} />
            </button>
          </div>

          {/* ✅ Emoji Popup */}
          {showEmojiPicker && (
            <EmojiPicker
              onSelect={(emoji) => {
                setInput(input + emoji.native);
                setShowEmojiPicker(false);
              }}
              onClose={() => setShowEmojiPicker(false)}
            />
          )}
        </div>
      )}

      {/* ✅ Launcher Button */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <button className="chat-toggle" onClick={toggleChat}>
          <img
            src="/tinkro-rocket-logo-new.png"
            alt="Tinkro Rocket"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              objectFit: "contain",
            }}
          />
        </button>

        <span style={{ marginTop: 4, color: "#1976d2", fontWeight: 500, fontSize: "11px" }}>
          Tinkro Bot
        </span>
      </div>

      {/* ✅ Support Popup */}
      {showSupportPopup && (
        <SupportPopup onClose={() => setShowSupportPopup(false)} />
      )}
    </div>
  );
};

export default ChatBot;
