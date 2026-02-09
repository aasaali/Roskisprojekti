import React from "react";

export default function BinCard({ id, location, fillLevel, capacity, lastUpdate, isOnline, createTask }) {

  // Väri täyttöasteen mukaan, mutta offline = harmaa
  let color = "green";
  if (!isOnline) color = "#aaa";       // Offline harmaa
  else if (fillLevel >= 90) color = "red";
  else if (fillLevel >= 70) color = "orange";

  // Kortin tausta
  const cardBg = isOnline ? "#fff" : "#f0f0f0"; // Offline vaalea harmaa
  const textColor = isOnline ? "#000" : "#666";

  return (
    <div style={{
      backgroundColor: cardBg,
      color: textColor,
      padding: "1rem",
      borderRadius: "1rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      width: "250px",
      textAlign: "center",
      margin: "0.5rem"
    }}>
      {/* ID / Nimi */}
      <h3 style={{ marginBottom: "0.5rem" }}>Roska-astia {id}</h3>

      {/* Sijainti logolla */}
      <p style={{ marginBottom: "0.5rem" }}>
        <span role="img" aria-label="location">📍</span> {location}
      </p>

      {/* Täyttöastepalkki */}
      <div style={{
        height: "16px",
        backgroundColor: "#eee",
        borderRadius: "8px",
        overflow: "hidden",
        margin: "0.5rem 0"
      }}>
        <div style={{
          width: `${fillLevel}%`,
          backgroundColor: color,
          height: "100%",
          transition: "width 0.5s"
        }}></div>
      </div>
      <p>{fillLevel}% täynnä</p>

      {/* Lisätiedot */}
      <p>Kapasiteetti: {capacity} L</p>
      <p>Viimeksi päivitetty: {lastUpdate}</p>
      <p>Status: {isOnline ? "Online" : "Offline"}</p>


      <button
        onClick={() =>
          createTask({
            id,
            location,
            fillLevel
          })
        }
        style={{
          marginTop: "10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "8px 12px",
          cursor: "pointer"
        }}
      >
        Aloita tyhjennys
      </button>
    </div>
  );



}
