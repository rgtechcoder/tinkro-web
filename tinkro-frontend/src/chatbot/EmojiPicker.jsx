import React from 'react';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import './EmojiPicker.css';

function EmojiPicker({ onSelect, onClose }) {
  return (
    <div className="emoji-picker-modal">
      <Picker onSelect={onSelect} style={{ width: 260, maxHeight: 260 }} showPreview={false} showSkinTones={false} />
  <button className="emoji-picker-close" onClick={onClose} aria-label="Close">×</button>
    </div>
  );
}

export default EmojiPicker;
