import React from "react";

export default function Search({ value, onChange, placeholder }) {
  return (
    <input
      className="search-input"
      type="text"
      placeholder={placeholder || "Search..."}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
 }
