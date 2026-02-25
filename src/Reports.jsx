import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function Reports({ containers = [], completedTasks = [] }) {

  const [selectedContainer, setSelectedContainer] = useState(
    containers.length > 0 ? containers[0] : null
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


  /* SIMULAATIO (POISTA BACKENDIN TULLESSA) */

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

  const generateEmptyHistory = () => {
    const days = 14;
    let history = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const timestamp = `${date.getDate()}.${date.getMonth() + 1}`;

      const emptied = Math.random() < 0.3 ? 1 : 0;
      history.push({ timestamp, emptied });
    }

    return history;
  };

  
  /* HISTORIAN LATAUS (BACKEND READY) */
  
  useEffect(() => {

    if (!selectedContainer) return;

    // Backend tulee palauttamaan nämä kentät:
    // selectedContainer.history
    // selectedContainer.emptyHistory

    setContainerHistory(
      selectedContainer.history || generateDailyHistory(selectedContainer.fillLevel)
    );

    setEmptyHistory(
      selectedContainer.emptyHistory || generateEmptyHistory()
    );

  }, [selectedContainer]);


  /* RAPORTOINTILASKENNAT */

  const fillLevels = containerHistory.map(h => h.fillLevel);
  const averageFill = fillLevels.length
    ? Math.round(fillLevels.reduce((sum, val) => sum + val, 0) / fillLevels.length)
    : 0;

  const maxFill = fillLevels.length ? Math.max(...fillLevels) : 0;
  const minFill = fillLevels.length ? Math.min(...fillLevels) : 0;
  const criticalDays = fillLevels.filter(val => val > 80).length;

  const emptiedDays = emptyHistory.filter(h => h.emptied).length;

  // Hälytysten määrä (warning + critical)
  const alertCount = containerHistory.filter(
    h => h.fillLevel >= 70
  ).length;


  /* TYÖTEHTÄVIEN KÄSITTELYAIKA */

  // Suodata vain valitun säiliön suoritetut tehtävät
const filteredCompletedTasks = completedTasks.filter(
  task => task.containerId === selectedContainer.id
);

  const averageHandlingTime = (() => {

  const tasksWithTime = filteredCompletedTasks.filter(
    t => t.createdAt && t.completedAt
  );

  if (tasksWithTime.length === 0) return null;

  const totalMs = tasksWithTime.reduce((sum, task) => {
    const created = new Date(task.createdAt);
    const completed = new Date(task.completedAt);
    return sum + (completed - created);
  }, 0);

  const avgMs = totalMs / tasksWithTime.length;

  const totalMinutes = Math.floor(avgMs / (1000 * 60));

  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  let result = "";

  if (days > 0) result += `${days} pv `;
  if (hours > 0) result += `${hours} h `;
  if (minutes > 0 || result === "") result += `${minutes} min`;

  return result.trim();

})();


 
  /* UI */

  return (
    <section className="p-6 flex flex-col items-center space-y-6">

      <h2 className="text-2xl font-bold text-center mb-4">
        Raportointi
      </h2>

      {/* Säiliön valinta */}
      <div className="w-full max-w-md p-4 bg-white rounded shadow text-center">
        <label className="font-medium mr-2">Valitse säiliö:</label>
        <select
          value={selectedContainer?.id || ""}
          onChange={(e) => {
            const found = containers.find(
              c => c.id === e.target.value
            );
            if (found) setSelectedContainer(found);
          }}
          className="border px-2 py-1 rounded"
        >
          {containers.map(c => (
            <option key={c.id} value={c.id}>
              {c.location}
            </option>
          ))}
        </select>
      </div>

      {/* Trendikaavio */}
      <div className="w-full max-w-3xl p-4 bg-white rounded shadow">
        <h3 className="font-semibold mb-4 text-center">
          Täyttöasteen trendi (14 pv)
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
          />
        </LineChart>
      </div>

      {/* Tilastoanalyysi */}
      <div className="w-full max-w-md p-4 bg-white rounded shadow text-center space-y-2">
        <h3 className="font-semibold mb-2">
          {selectedContainer.location} – analyysi
        </h3>

        <p>Keskimääräinen täyttöaste: {averageFill}%</p>
        <p>Minimi: {minFill}%</p>
        <p>Maksimi: {maxFill}%</p>
        <p>Kriittiset päivät: {criticalDays}</p>
        <p>Hälytyksiä yhteensä: {alertCount}</p>
        <p>Tyhjennykset (14 pv): {emptiedDays}</p>

        {averageHandlingTime && (
          <p>Keskimääräinen käsittelyaika: {averageHandlingTime} h</p>
        )}
      </div>

    </section>
  );
}
