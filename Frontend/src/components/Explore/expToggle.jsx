// src/components/ToggleBtn.jsx
import React from "react";

const ToggleBtn = ({ label, active, setActive }) => {
  return (
    <button
      onClick={() => setActive(!active)}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all
        ${active 
          ? "bg-primary text-white scale-105" 
          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}
      `}
    >
      {label}
    </button>
  );
};

export default ToggleBtn;
