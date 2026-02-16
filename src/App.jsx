import React, { useState, useEffect } from "react";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Dashboard from "./Dashboard";
import Tasks from "./Tasks";
import Containers from "./Containers";
import Reports from "./Reports";

export default function App() {
  const [containers, setContainers] = useState([
    { id: "1", location: "Nilsiä", fillLevel: 45, capacity: 100, status: "normal", lastUpdate: "10:30", isOnline: true },
    { id: "2", location: "Nurmes", fillLevel: 70, capacity: 120, status: "warning", lastUpdate: "10:25", isOnline: true },
    { id: "3", location: "Sonkajärvi", fillLevel: 95, capacity: 150, status: "critical", lastUpdate: "10:20", isOnline: true },
    { id: "4", location: "Kaavi", fillLevel: 30, capacity: 80, status: "normal", lastUpdate: "10:35", isOnline: false },
    { id: "5", location: "Lieksa", fillLevel: 60, capacity: 100, status: "warning", lastUpdate: "10:28", isOnline: true },
  ]);

  const [tasks, setTasks] = useState([
    { id: "t1", containerName: "Nilsiä", alertLevel: 80, assignedTo: "Matti"},
    { id: "t2", containerName: "Kaavi", alertLevel: 95, assignedTo: "Liisa"},
  ]);

  
useEffect(() => {
  setTasks(prevTasks => {

    const updatedTasks = [...prevTasks];

    containers.forEach(container => {

      if (container.fillLevel >= 70) {

        const exists = updatedTasks.some(
          task => task.containerId === container.id
        );

        if (!exists) {
          updatedTasks.push({
            id: "auto-" + container.id,
            containerId: container.id,
            containerName: container.location,
            alertLevel: container.fillLevel,
            priority:
              container.fillLevel >= 85 ? "Kriittinen" : "Varoitus",
            assignedTo: "Ei osoitettu"
          });
        }
      }

    });

    return updatedTasks;

  });
}, [containers]);

const [completedTasks, setCompletedTasks] = useState([]);

const handleCompleteTask = (taskId, containerId) => {

  // 1️⃣ Nollaa säiliön täyttöaste
  setContainers(prev =>
    prev.map(c =>
      c.id === containerId
        ? { ...c, fillLevel: 0 }
        : c
    )
  );

  // 2️⃣ Siirrä tehtävä raportteihin
  setTasks(prevTasks => {
    const taskToComplete = prevTasks.find(t => t.id === taskId);

    if (taskToComplete) {

      setCompletedTasks(prevCompleted => {

        // 🔒 tarkistus
        const alreadyExists = prevCompleted.some(
          t => t.id === taskId
        );

        if (alreadyExists) return prevCompleted;

        return [
          ...prevCompleted,
          {
            ...taskToComplete,
            completedAt: new Date().toLocaleString()
          }
        ];
      });
    }


    // Poista avoimista
    return prevTasks.filter(t => t.id !== taskId);
  });

};



  return (
    <Router>
      <div className="app">

        {/* Header */}
        <header className="header">
          <div className="header-title">
            <h1>Älykäs jäteastioiden seuranta</h1>
            <p>Pilotissa 5 kohdetta</p>
          </div>

          <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav justify-content-center w-100">
                  <Link className="nav-link mx-3" to="/">Tilannekuva</Link>
                  <Link className="nav-link mx-3" to="/tehtavat">Työtehtävät</Link>
                  <Link className="nav-link mx-3" to="/sailiot">Säiliöt</Link>
                  <Link className="nav-link mx-3" to="/raportit">Raportit</Link>
                </div>
              </div>
            </div>
          </nav>
        </header>

        {/* Content */}
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard containers={containers} tasks={tasks} />} />
            <Route   path="/sailiot" element={<Containers containers={containers} setContainers={setContainers} />} />
            <Route path="/tehtavat" element={<Tasks tasks={tasks} onCompleteTask={handleCompleteTask} /> }/>
            <Route path="/raportit" element={<Reports containers={containers} completedTasks={completedTasks} /> } />
          </Routes>
        </main>



      </div>
    </Router>
  );
}
