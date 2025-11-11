// // src/components/QuickButtons.jsx
// import React from "react";
// import "./QuickButtons.css";

// const QuickButtons = ({ onSelect }) => {
//   const buttons = [
//     "Cheapest kit",
//     "Show all kits",
//     "Arduino Starter Kit",
//     "Sensor Kit",
//     "Talk to support"
//   ];

//   return (
//     <div className="quick-btn-container">
//       {buttons.map((btn, i) => (
//         <button key={i} className="quick-btn" onClick={() => onSelect(btn)}>
//           {btn}
//         </button>
//       ))}
//     </div>
//   );
// };

// export default QuickButtons;


// ✅ QuickButtons.jsx — Intent Based Buttons (Product + Info)
// ✅ FINAL — Intent-Based Quick Buttons (Kits + Info)

import React from "react";
import "./QuickButtons.css";

const QuickButtons = ({ type, onSelect }) => {
  
  const kitsButtons = [
    "Cheapest kit",
    "Show all kits",
    "Arduino Starter Kit",
    "Sensor Kit",
    "Competition Kit",
  ];

  const infoButtons = [
    "What is Tinkro?",
    "Learning Benefits",
    "For Schools",
    "Workshop Details",
    "Contact Support",
  ];

  const buttons = type === "info" ? infoButtons : kitsButtons;

  return (
    <div className="quick-btn-container">
      {buttons.map((btn, i) => (
        <button
          key={i}
          className="quick-btn"
          onClick={() => onSelect(btn)}
        >
          {btn}
        </button>
      ))}
    </div>
  );
};

export default QuickButtons;
