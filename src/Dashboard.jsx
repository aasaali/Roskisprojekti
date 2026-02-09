import React from "react";
import BinCard from "./BinCard";

export default function Dashboard({ containers, tasks, createTask }) {

  // 🔹 Luokittelu
  const criticalBins = containers.filter(
    (bin) => bin.fillLevel >= 85
  );

  const warningBins = containers.filter(
    (bin) => bin.fillLevel >= 70 && bin.fillLevel < 85
  );

  const normalBins = containers.filter(
    (bin) => bin.fillLevel < 70
  );

  const ongoing = tasks.filter(t => t.status === "Työn alla");

  
  // 🔹 Apufunktio renderöintiin
  const renderBins = (bins) => (
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "10px",
      marginBottom: "30px"
    }}>
      {bins.map((bin) => (
        <BinCard
          key={bin.id}
          id={bin.id}
          location={bin.location}
          fillLevel={bin.fillLevel}
          capacity={bin.capacity}
          lastUpdate={bin.lastUpdate}
          isOnline={bin.isOnline}
          createTask={createTask}
        />
      ))}
    </div>
  );

  return (
    <div style={{ padding: "20px" }}>

      {/* 🔴 KRIITTINEN */}
      <h2 style={{ color: "red", marginTop: "10px" }}>
        Kriittinen täyttöaste
      </h2>
      {criticalBins.length > 0
        ? renderBins(criticalBins)
        : <p>Ei kriittisiä säiliöitä</p>
      }

      {/* 🟠 VAROITUS */}
      <h2 style={{ color: "orange" }}>
        Varoitusrajan ylittäneet
      </h2>
      {warningBins.length > 0
        ? renderBins(warningBins)
        : <p>Ei varoitustason säiliöitä</p>
      }

      {/* 🟢 NORMAALI */}
      <h2 style={{ color: "green" }}>
        Normaalit säiliöt
      </h2>
      {normalBins.length > 0
        ? renderBins(normalBins)
        : <p>Ei normaaleja säiliöitä</p>
      }

    </div>
  );

  
}
