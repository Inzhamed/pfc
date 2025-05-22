// src/components/Checkbox.jsx
import React from "react";

export default function Checkbox({ label, checked, onChange }) {
  return (
    <label className="inline-flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
      />
      <span className="select-none">{label}</span>
    </label>
  );
}
