import React, { useState } from "react";
import EmojiPicker from "./EmojiPicker";
import './ChatBot.css';

const initialMessages = [
  { text: "Thank you for contacting Tinkro. How can I help you?", from: "bot" }
];


function ChatBot() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);

  const sendMessage = async (msg) => {
    setMessages([...messages, { text: msg, from: "user" }]);
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { text: data.answer, from: "bot" }]);
    } catch {
      setMessages(prev => [...prev, { text: "Server error. Please try again.", from: "bot" }]);
    }
    setLoading(false);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <>
      <button
        className="chatbot-fab"
        style={{ display: open ? 'none' : 'flex' }}
        onClick={() => setOpen(true)}
        aria-label="Open chat"
      >
        <span role="img" aria-label="chat">💬</span>
      </button>
      <div
        className="chatbot-ui"
        style={{ position: 'fixed', display: open ? 'flex' : 'none' }}
      >
        <div className="chatbot-header">
          <span className="chatbot-title chatbot-title-texture">Tinkro ChatBot</span>
          <button className="chatbot-close" onClick={() => setOpen(false)} title="Close">×</button>
        </div>
        <div className="chatbot-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chatbot-msg-row ${msg.from === 'bot' ? 'chatbot-msg-row-bot' : 'chatbot-msg-row-user'}`}>
              {msg.from === 'bot' && <div className="chatbot-avatar chatbot-avatar-bot" />}
              <div className={`chatbot-msg chatbot-msg-${msg.from}`}>{msg.text}</div>
              {msg.from === 'user' && <div className="chatbot-avatar chatbot-avatar-user" />}
            </div>
          ))}
          {loading && <div className="chatbot-msg-row chatbot-msg-row-bot"><div className="chatbot-avatar chatbot-avatar-bot" /><div className="chatbot-msg chatbot-msg-bot">...</div></div>}
        </div>
        <div className="chatbot-input-row">
          <button className="chatbot-emoji-btn" title="Emoji" onClick={() => setShowEmoji(v => !v)}>😊</button>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={e => e.key === "Enter" && handleSend()}
            className="chatbot-input"
          />
          <input type="file" className="chatbot-file-input" title="Upload file" style={{display: 'none'}} />
          <button className="chatbot-send-btn" onClick={handleSend}>
            Send
          </button>
        </div>
        {showEmoji && (
          <EmojiPicker
            onSelect={emoji => {
              setInput(input + (emoji.native || ""));
              setShowEmoji(false);
            }}
            onClose={() => setShowEmoji(false)}
          />
        )}
      </div>
    </>
  );
}

export default ChatBot;
