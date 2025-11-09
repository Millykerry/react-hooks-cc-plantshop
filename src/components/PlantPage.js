import React, { useEffect, useState } from "react";
import PlantCard from "./PlantCard";
import PlantForm from "./PlantForm";
import Search from "./Search";

const API = "http://localhost:6001/plants";

export default function PlantPage() {
  const [plants, setPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch plants on mount
  useEffect(() => {
    setLoading(true);
    fetch(API)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch plants");
        return r.json();
      })
      .then((data) => {
        // normalize - ensure soldOut property exists locally
        const normalized = data.map(p => ({ ...p, soldOut: p.soldOut || false }));
        setPlants(normalized);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  function handleAddPlant({ name, image, price }) {
    // POST new plant
    const newPlant = { name, image, price: parseFloat(price) };

    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPlant),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to add plant");
        return r.json();
      })
      .then((created) => {
        // ensure soldOut property for UI
        setPlants((prev) => [...prev, { ...created, soldOut: created.soldOut || false }]);
      })
      .catch((err) => {
        alert("Error adding plant: " + err.message);
      });
  }

  function handleToggleSoldOut(id) {
    setPlants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, soldOut: !p.soldOut } : p))
    );

    // NOTE:
    // Core deliverables don't require persisting soldOut.
    // If you want to persist soldOut then uncomment and ensure your backend accepts a PATCH for soldOut:
    /*
    const plant = plants.find(p => p.id === id);
    fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ soldOut: !plant.soldOut })
    }).then(...)
    */
  }

  // Optional advanced: delete plant (persisted)
  function handleDeletePlant(id) {
    // optimistic UI:
    // setPlants(prev => prev.filter(p => p.id !== id));

    // Actually delete on server:
    fetch(`${API}/${id}`, { method: "DELETE" })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to delete");
        // remove locally
        setPlants((prev) => prev.filter((p) => p.id !== id));
      })
      .catch((err) => {
        alert("Delete failed: " + err.message);
      });
  }

  // Optional advanced: update price (persisted)
  function handleUpdatePrice(id, newPrice) {
    const parsed = parseFloat(newPrice);
    if (Number.isNaN(parsed)) {
      alert("Enter a valid number for price");
      return;
    }

    fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: parsed }),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to update price");
        return r.json();
      })
      .then((updated) => {
        setPlants((prev) => prev.map((p) => (p.id === id ? { ...p, price: updated.price } : p)));
      })
      .catch((err) => {
        alert("Update price failed: " + err.message);
      });
  }

  const filteredPlants = plants.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="controls">
        <Search value={searchTerm} onChange={setSearchTerm} placeholder="Search plants by name..." />
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 280 }} className="add-form">
          <h3>Add a New Plant</h3>
          <PlantForm onAddPlant={handleAddPlant} />
        </div>

        <div style={{ flex: 2, minWidth: 280 }}>
          <h3>Plants</h3>
          {loading && <p>Loading plants...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {!loading && filteredPlants.length === 0 && <p>No plants found.</p>}

          <div className="plant-grid" style={{ marginTop: 8 }}>
            {filteredPlants.map((plant) => (
              <PlantCard
                key={plant.id}
                plant={plant}
                onToggleSoldOut={() => handleToggleSoldOut(plant.id)}
                onDelete={() => handleDeletePlant(plant.id)} // optional, un-tested if your backend supports delete
                onUpdatePrice={(newPrice) => handleUpdatePrice(plant.id, newPrice)} // optional advanced
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
