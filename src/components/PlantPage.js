import React, { useState, useEffect } from "react";
import NewPlantForm from "./NewPlantForm";
import PlantList from "./PlantList";
import Search from "./Search";

function PlantPage() {
  const [plants, setPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch plants when component mounts
  useEffect(() => {
    fetch("http://localhost:6001/plants")
      .then((response) => response.json())
      .then((data) => setPlants(data))
      .catch((error) => console.error("Error fetching plants:", error));
  }, []);

  // Add new plant
  function handleAddPlant(newPlant) {
    fetch("http://localhost:6001/plants", {
      method: "POST",
      headers: {
        "Content-Type": "Application/JSON",
      },
      body: JSON.stringify(newPlant),
    })
      .then((response) => response.json())
      .then((data) => setPlants([...plants, data]))
      .catch((error) => console.error("Error adding plant:", error));
  }

  // Mark plant as sold out
  function handleToggleSoldOut(id) {
    setPlants(
      plants.map((plant) =>
        plant.id === id ? { ...plant, soldOut: !plant.soldOut } : plant
      )
    );
  }

  // Update plant price (Advanced)
  function handleUpdatePrice(id, newPrice) {
    fetch(`http://localhost:6001/plants/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ price: newPrice }),
    })
      .then((response) => response.json())
      .then((updatedPlant) => {
        setPlants(
          plants.map((plant) =>
            plant.id === id ? updatedPlant : plant
          )
        );
      })
      .catch((error) => console.error("Error updating price:", error));
  }

  // Delete plant (Advanced)
  function handleDeletePlant(id) {
    fetch(`http://localhost:6001/plants/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setPlants(plants.filter((plant) => plant.id !== id));
      })
      .catch((error) => console.error("Error deleting plant:", error));
  }

  // Filter plants based on search term
  const displayedPlants = plants.filter((plant) =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main>
      <NewPlantForm onAddPlant={handleAddPlant} />
      <Search searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <PlantList
        plants={displayedPlants}
        onToggleSoldOut={handleToggleSoldOut}
        onUpdatePrice={handleUpdatePrice}
        onDeletePlant={handleDeletePlant}
      />
    </main>
  );
}

 export default PlantPage;