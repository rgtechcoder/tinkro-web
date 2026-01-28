import React from 'react';

export default function ATLParticles() {
  // Simple floating dots/particles SVG
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ filter: 'blur(1px)' }}>
      <circle cx="30%" cy="20%" r="8" fill="#ffb347" opacity="0.18">
        <animate attributeName="cy" values="20%;30%;20%" dur="6s" repeatCount="indefinite" />
      </circle>
      <circle cx="70%" cy="60%" r="12" fill="#ff9800" opacity="0.13">
        <animate attributeName="cy" values="60%;50%;60%" dur="7s" repeatCount="indefinite" />
      </circle>
      <circle cx="50%" cy="80%" r="6" fill="#fffbe6" opacity="0.15">
        <animate attributeName="cy" values="80%;70%;80%" dur="5.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="80%" cy="30%" r="5" fill="#ffb347" opacity="0.12">
        <animate attributeName="cy" values="30%;40%;30%" dur="8s" repeatCount="indefinite" />
      </circle>
      <circle cx="20%" cy="70%" r="7" fill="#ff9800" opacity="0.10">
        <animate attributeName="cy" values="70%;60%;70%" dur="6.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
