import React, { useState } from "react";
import Dashboard from "./Dashboard";
import Tasks from "./Tasks";
import Reports from "./Reports";

export default function App() {
  const [containers] = useState([
    { id: "1", location: "Nilsiä", fillLevel: 45, capacity: 100, status: "normal", lastUpdate: "10:30", isOnline: true },
    { id: "2", location: "Nurmes", fillLevel: 70, capacity: 120, status: "warning", lastUpdate: "10:25", isOnline: true },
    { id: "3", location: "Sonkajärvi", fillLevel: 95, capacity: 150, status: "critical", lastUpdate: "10:20", isOnline: true },
    { id: "4", location: "Kaavi", fillLevel: 30, capacity: 80, status: "normal", lastUpdate: "10:35", isOnline: false },
    { id: "5", location: "Lieksa", fillLevel: 60, capacity: 100, status: "warning", lastUpdate: "10:28", isOnline: true },
  ]);

  const [tasks] = useState([
    { id: "t1", containerName: "Nilsiä", alertLevel: 80, assignedTo: "Matti" },
    { id: "t2", containerName: "Kaavi", alertLevel: 95, assignedTo: "Liisa" },
  ]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <header style={{ textAlign: "center", padding: "2rem 1rem" }}>
        <h1>Älykäs jäteastioiden seuranta</h1>
        <p>Pilotissa 5 kohdetta</p>
      </header>

      <Dashboard containers={containers} />
      <Tasks tasks={tasks} />
      <Reports containers={containers} tasks={tasks} />

    </div>
  );
}
