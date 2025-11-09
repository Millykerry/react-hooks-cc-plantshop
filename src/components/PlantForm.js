import React, { useState } from "react";

export default function PlantForm({ onAddPlant }) {
  const [form, setForm] = useState({ name: "", image: "", price: "" });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return alert("Please provide a name");
    if (!form.image.trim()) return alert("Please provide an image URL");
    if (form.price === "" || Number.isNaN(Number(form.price))) return alert("Please provide a valid price");

    onAddPlant(form);
    setForm({ name: "", image: "", price: "" });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Plant name"
          type="text"
        />
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price e.g. 12.99"
          type="number"
          step="0.01"
        />
      </div>

      <div className="form-row">
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL (or ./images/...)"
          type="text"
        />
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit">Add Plant</button>
      </div>
    </form>
  );
}
