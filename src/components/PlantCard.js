import React, { useState } from "react";

export default function PlantCard({ plant, onToggleSoldOut, onDelete, onUpdatePrice }) {
  const [editingPrice, setEditingPrice] = useState(false);
  const [priceValue, setPriceValue] = useState(plant.price);

  function submitPriceUpdate(e) {
    e.preventDefault();
    onUpdatePrice && onUpdatePrice(priceValue);
    setEditingPrice(false);
  }

  return (
    <div className={`plant-card ${plant.soldOut ? "sold-out" : ""}`} style={{ position: "relative" }}>
      {plant.soldOut && <div className="sold-badge">SOLD</div>}
      <img src={plant.image} alt={plant.name} />
      <div className="name">{plant.name}</div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="price">${Number(plant.price).toFixed(2)}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onToggleSoldOut}>
            {plant.soldOut ? "Mark Available" : "Mark Sold Out"}
          </button>

          {/* Optional delete button (advanced) */}
          {onDelete && (
            <button onClick={() => {
              if (window.confirm(`Delete ${plant.name}?`)) onDelete();
            }}>
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Optional price editing (advanced) */}
      {onUpdatePrice && (
        <div style={{ marginTop: 8 }}>
          {!editingPrice ? (
            <button onClick={() => { setEditingPrice(true); setPriceValue(plant.price); }}>
              Edit Price
            </button>
          ) : (
            <form onSubmit={submitPriceUpdate} style={{ display: "flex", gap: 8 }}>
              <input
                type="number"
                step="0.01"
                value={priceValue}
                onChange={(e) => setPriceValue(e.target.value)}
              />
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditingPrice(false)}>Cancel</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
