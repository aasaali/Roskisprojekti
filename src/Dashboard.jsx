import React from "react";
import BinCard from "./BinCard";

export default function Dashboard({ containers, tasks, onRefresh }) {

  const criticalBins = containers.filter(bin => bin.fillLevel >= 85);
  const warningBins = containers.filter(bin => bin.fillLevel >= 70 && bin.fillLevel < 85);
  const normalBins = containers.filter(bin => bin.fillLevel < 70);

  const renderBinsColumn = (bins) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
      {bins.map(bin => (
        <BinCard
          key={bin.id}
          id={bin.id}
          location={bin.location}
          fillLevel={bin.fillLevel}
          capacity={bin.capacity}
          lastUpdate={bin.lastUpdate}
          isOnline={bin.isOnline}
        />
      ))}
    </div>
  );

  const totalBins = containers.length;

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", marginBottom: "20px" }}>
        <h2 className="m-0">Tilannekuva</h2>
        <button 
          className="btn btn-primary" 
          onClick={onRefresh} 
          style={{ position: "absolute", right: 0 }}
        >
          Päivitä säiliötiedot
        </button>
      </div>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "20px"
      }}>



        {/* 🔴 Kriittiset vasemmalla */}
        <div>
          <h3 style={{ color: "red", textAlign: "center" }}>
            Kriittiset ({criticalBins.length}/{totalBins})
          </h3>
          {criticalBins.length > 0 ? renderBinsColumn(criticalBins) : <p>Ei kriittisiä säiliöitä</p>}
        </div>

        {/* 🟠 Varoitustason säiliöt keskellä */}
        <div>
          <h3 style={{ color: "orange", textAlign: "center" }}>
            Varoitustason säiliöt ({warningBins.length}/{totalBins})
          </h3>
          {warningBins.length > 0 ? renderBinsColumn(warningBins) : <p>Ei varoitustason säiliöitä</p>}
        </div>

        {/* 🟢 Normaalit oikealla */}
        <div>
          <h3 style={{ color: "green", textAlign: "center" }}>
            Normaalit ({normalBins.length}/{totalBins})
          </h3>
          {normalBins.length > 0 ? renderBinsColumn(normalBins) : <p>Ei normaaleja säiliöitä</p>}
        </div>
      </div>
    </div>
  );
}
