import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function Reports({ containers, completedTasks }) {

  const [selectedContainer, setSelectedContainer] = useState(
    containers && containers.length > 0 ? containers[0] : null
  );

  const [containerHistory, setContainerHistory] = useState([]);
  const [emptyHistory, setEmptyHistory] = useState([]);

  useEffect(() => {
    if (containers.length > 0) {
      setSelectedContainer(containers[0]);
    }
  }, [containers]);

  if (!containers || containers.length === 0) {
    return <p>Ei säiliödataa</p>;
  }

  if (!selectedContainer) {
    return <p>Ladataan...</p>;
  }


  // Luo päivähistoria 14 päivälle (täyttöaste)
  const generateDailyHistory = (fillLevel) => {
    const days = 14;
    let history = [];
    let fill = Math.max(0, fillLevel - 50);
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const timestamp = `${date.getDate()}.${date.getMonth() + 1}`;
      fill += Math.floor(Math.random() * 50);
      if (fill > 100) fill = 100;
      history.push({ timestamp, fillLevel: fill });
    }
    return history;
  };

  // Luo tyhjennyshistoria viimeiseltä 14 päivältä
  const generateEmptyHistory = () => {
    const days = 14;
    let history = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const timestamp = `${date.getDate()}.${date.getMonth() + 1}`;
      const emptied = Math.random() < 0.3 ? 1 : 0; // 30% mahdollisuus tyhjentää
      history.push({ timestamp, emptied });
    }
    return history;
  };

  useEffect(() => {

    if (!selectedContainer) return;

    setContainerHistory(
      selectedContainer.history ||
      generateDailyHistory(selectedContainer.fillLevel)
    );

    setEmptyHistory(generateEmptyHistory());

  }, [selectedContainer]);


  // Tilastoanalyysi
  const fillLevels = containerHistory.map((h) => h.fillLevel);
  const emptiedDays = emptyHistory.filter((h) => h.emptied).length;
  const averageFill = Math.round(
    fillLevels.reduce((sum, val) => sum + val, 0) / fillLevels.length
  );
  const maxFill = Math.max(...fillLevels);
  const minFill = Math.min(...fillLevels);
  const criticalDays = fillLevels.filter((val) => val > 80).length;

  // Suodata vain tämän säiliön suoritetut tehtävät
  const filteredCompletedTasks = completedTasks.filter(
    task => task.containerId === selectedContainer.id
  );

  return (
    <section className="p-6 flex flex-col items-center space-y-6">
      <h2 className="text-2xl font-bold text-center mb-4">Raportointi</h2>

      {/* Säiliön valinta */}
      <div className="w-full max-w-md p-4 bg-white rounded shadow text-center">
        <label className="font-medium mr-2">Valitse säiliö:</label>
        <select
          value={selectedContainer?.id || ""}
          onChange={(e) => {
            const found = containers.find(
              (c) => c.id === e.target.value
            );

            if (found) {
              setSelectedContainer(found);
            }
          }}
          className="border px-2 py-1 rounded"
        >

          {containers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.location}
            </option>
          ))}
        </select>
      </div>

      {/* Säiliön tiedot */}
      <div className="w-full max-w-md p-4 bg-white rounded shadow text-center space-y-1">
        <h3 className="font-semibold mb-2">{selectedContainer.location}</h3>
        <p>Kapasiteetti: {selectedContainer.capacity} L</p>
        <p>Täyttöaste: {selectedContainer.fillLevel}%</p>
        <p>Viimeisin päivitys: {selectedContainer.lastUpdate}</p>
        <p>Status: {selectedContainer.isOnline ? "Online" : "Offline"}</p>
      </div>

      {/* Täyttöasteen trendi */}
      <div className="w-full max-w-3xl p-4 bg-white rounded shadow">
        <h3 className="font-semibold mb-4 text-center">
          Täyttöasteen trendi (päiväkohtainen): {selectedContainer.location}
        </h3>
        <LineChart width={600} height={300} data={containerHistory}>
          <XAxis dataKey="timestamp" />
          <YAxis unit="%" domain={[0, 100]} />
          <Tooltip />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Line
            type="monotone"
            dataKey="fillLevel"
            stroke="#646cff"
            dot={{ r: 4, fill: "#646cff" }}
          />
        </LineChart>
      </div>

      {/* Tilastoanalyysi */}
      <div className="w-full max-w-md p-4 bg-white rounded shadow text-center space-y-2">
        <h3 className="font-semibold mb-2">{selectedContainer.location} - tilastoanalyysi</h3>
        <p>Keskimääräinen täyttöaste: {averageFill}%</p>
        <p>Minimi täyttöaste: {minFill}%</p>
        <p>Maksimi täyttöaste: {maxFill}%</p>
        <p>Tyhjennykset viimeisen 14 päivän aikana: {emptiedDays}</p>
        <p>{`Kriittiset päivät (>80% täyttöaste): ${criticalDays}`}</p>
      </div>

      {/* Suoritetut työtehtävät */}
      <div className="w-full max-w-md p-4 bg-white rounded shadow text-center space-y-2">
        <h3 className="font-semibold mb-2">Suoritetut tyhjennykset</h3>

        {filteredCompletedTasks.length === 0 ? (
          <p>Ei suoritettuja tehtäviä</p>
        ) : (
          filteredCompletedTasks.map(task => (
            <div key={task.id}>
              {task.containerName} tyhjennetty – {task.completedAt}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
