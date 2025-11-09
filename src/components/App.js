import React from "react";
import PlantPage from "./PlantPage"; // ✅ correct path

function App() {
  return (
    <div className="container">
      <header>
        <h1>Plantsy Admin</h1>
        <small>Manage plants — add, mark sold out, search</small>
      </header>

      <PlantPage />
    </div>
  );
}

export default App;

