// src/components/ui/Switch.jsx
import { useState } from "react";

export function Switch({ checked: defaultChecked = false, onChange }) {
  const [checked, setChecked] = useState(defaultChecked);

  const toggle = () => {
    const newValue = !checked;
    setChecked(newValue);
    onChange?.(newValue);
  };

  return (
    <button
      onClick={toggle}
      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
        checked ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
          checked ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
}
