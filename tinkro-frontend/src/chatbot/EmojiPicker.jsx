// import React from 'react';
// import { Picker } from 'emoji-mart';
// import 'emoji-mart/css/emoji-mart.css';
// import './EmojiPicker.css';

// function EmojiPicker({ onSelect, onClose }) {
//   return (
//     <div className="emoji-picker-modal">
//       <Picker onSelect={onSelect} style={{ width: 260, maxHeight: 260 }} showPreview={false} showSkinTones={false} />
//   <button className="emoji-picker-close" onClick={onClose} aria-label="Close">×</button>
//     </div>
//   );
// }

// export default EmojiPicker;





import React from "react";

const EmojiPicker = ({ onSelect, onClose }) => {
  const emojis = ["👋", "🙏", "🙂", "😊", "😄", "🤝", "👍", "❤️", "✨"];

  return (
    <div
      style={{
        position: "absolute",
        bottom: "70px",
        right: "20px",
        background: "#fff",
        padding: "10px",
        borderRadius: "10px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        width: "200px",
        zIndex: 9999
      }}
    >
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          fontSize: "18px",
          position: "absolute",
          right: "6px",
          top: "6px",
          cursor: "pointer"
        }}
      >
        ×
      </button>

      {emojis.map((e) => (
        <button
          key={e}
          onClick={() => onSelect({ native: e })}
          style={{
            background: "none",
            border: "none",
            fontSize: "22px",
            cursor: "pointer"
          }}
        >
          {e}
        </button>
      ))}
    </div>
  );
};

export default EmojiPicker;
