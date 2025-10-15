import React from 'react';

const DebugModal = () => {
  return (
    <div 
      className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
      style={{ pointerEvents: 'auto' }}
    >
      <div 
        className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative z-10"
        onClick={(e) => e.stopPropagation()}
        style={{ pointerEvents: 'auto' }}
      >
        <h2 className="text-xl font-bold mb-4">Debug Modal Test</h2>
        <p className="mb-4">If you can click this button, modal is working:</p>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => alert('Modal is working!')}
        >
          Test Click
        </button>
      </div>
    </div>
  );
};

export default DebugModal;