// src/chatbot/ChatBot.jsx
import React, { useState, useRef, useEffect } from "react";
import "./ChatBot.css";
import { Paperclip, Smile, Send, X } from "lucide-react";
import API_URL from "../config/api"; // uses VITE_API_URL or fallback

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hi! I’m Tinkro Buddy — how can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, uploading]);

  const toggleChat = () => setIsOpen(v => !v);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input.trim() };
    setMessages(m => [...m, userMsg]);
    const payload = input.trim();
    setInput("");
    setIsTyping(true);

    try {
      const resp = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: payload })
      });
      const json = await resp.json();
      setIsTyping(false);
      const botText = json.reply || "Sorry, I couldn't process that.";
      setMessages(m => [...m, { sender: "bot", text: botText }]);
    } catch (err) {
      setIsTyping(false);
      setMessages(m => [...m, { sender: "bot", text: "⚠️ Connection issue. Please try again later." }]);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  // File upload handler
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    // show user message about upload start
    setMessages(m => [...m, { sender: "user", text: `Uploading file: ${file.name} ...` }]);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const resp = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        body: fd
      });
      const json = await resp.json();
      if (json.url) {
        // show bot reply containing link (you can also send this link to /api/chat if you want bot to process file)
        setMessages(m => [...m, { sender: "bot", text: `File uploaded: <a href="${json.url}" target="_blank" rel="noreferrer">Open file</a>` }]);
      } else {
        setMessages(m => [...m, { sender: "bot", text: "Upload succeeded but no file URL returned." }]);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setMessages(m => [...m, { sender: "bot", text: "⚠️ Upload failed. Please try again." }]);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chat-window" role="dialog" aria-label="Tinkro Buddy chat">
          <div className="chat-header">
            <div className="chat-title">
              <img src="/tinkro-logo-chatbot.png" alt="Tinkro logo" className="chat-logo" />
              <div>
                <div className="title-main">Tinkro Buddy</div>
                <div className="title-sub">How can I help?</div>
              </div>
            </div>
            <button className="close-btn" onClick={toggleChat}><X size={18} /></button>
          </div>

          <div className="chat-body">
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.sender}`}>
                <div className="bubble-text" dangerouslySetInnerHTML={{ __html: m.text.replace(/\n/g, "<br/>") }} />
              </div>
            ))}
            {isTyping && <div className="typing">Tinkro Buddy is typing…</div>}
            {uploading && <div className="typing">Uploading file…</div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <label className="icon-btn" title="Upload file">
              <Paperclip size={18} />
              <input type="file" hidden onChange={handleFileChange} />
            </label>
            <button className="icon-btn" title="Emoji"><Smile size={18} /></button>
            <input
              type="text"
              placeholder="Ask about kits, price, or product name..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
            />
            <button className="send-btn" onClick={sendMessage}><Send size={18} /></button>
          </div>
        </div>
      )}

      <button className="chat-toggle" onClick={toggleChat} aria-label="Open chat">
        <span className="chat-emoji">🤖</span>
      </button>
    </div>
  );
};

export default ChatBot;
