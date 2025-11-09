import React, { useState } from "react";

function PlantCard({ plant, onToggleSoldOut, onUpdatePrice, onDeletePlant }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newPrice, setNewPrice] = useState(plant.price);

  function handlePriceSubmit(e) {
    e.preventDefault();
    onUpdatePrice(plant.id, parseFloat(newPrice));
    setIsEditing(false);
  }

  return (
    <li className="card" data-testid="plant-item">
      <img src={plant.image} alt={plant.name} />
      <h4>{plant.name}</h4>
      
      <p className="price">Price: {plant.price}</p>
      
      {isEditing && (
        <form onSubmit={handlePriceSubmit} className="price-edit-form">
          <input
            type="number"
            step="0.01"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            className="price-input"
          />
          <button type="submit" className="update-btn">Update</button>
          <button 
            type="button" 
            onClick={() => setIsEditing(false)}
            className="cancel-btn"
          >
            Cancel
          </button>
        </form>
      )}
      
      {!isEditing && (
        <button 
          onClick={() => setIsEditing(true)}
          className="edit-price-btn"
        >
          Edit Price
        </button>
      )}
      
      <button
        className={plant.soldOut ? "" : "primary"}
        onClick={() => onToggleSoldOut(plant.id)}
      >
        {plant.soldOut ? "Out of Stock" : "In Stock"}
      </button>
      
      <button 
        onClick={() => onDeletePlant(plant.id)}
        className="delete-btn"
      >
        Delete
      </button>
    </li>
  );
}

 export default PlantCard;