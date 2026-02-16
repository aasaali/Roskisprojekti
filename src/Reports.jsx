import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

export default function Reports({ containers, tasks }) {
  const [selectedContainer, setSelectedContainer] = useState(containers[0]);

  // Generoi päivähistoria 14 päivälle
  const generateDailyHistory = () => {
    const days = 14;
    let history = [];
    let fill = 0; // aloitetaan tyhjästä
    for (let i = days - 1; i >= 0; i--) {
      // Pisteen päivämäärä (esim. "2.2")
      const date = new Date();
      date.setDate(date.getDate() - i);
      const timestamp = `${date.getDate()}.${date.getMonth() + 1}`;

      // Satunnainen täyttöaste (täyttö tapahtuu kerran päivässä)
      fill += Math.floor(Math.random() * 50); // 0–49% täyttö per päivä
      if (fill > 100) fill = 100;

      history.push({
        timestamp,
        fillLevel: fill,
      });
    }
    return history;
  };

  const containerHistory = selectedContainer.history || generateDailyHistory();

  // Työtehtävien yhteenveto
  const tasksSummary = tasks.reduce((acc, t) => {
    acc[t.assignedTo] = (acc[t.assignedTo] || 0) + 1;
    return acc;
  }, {});

  const barData = Object.entries(tasksSummary).map(([name, count]) => ({
    name,
    count,
  }));

  return (
    <section className="p-6 flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4 text-center">Raportointi</h2>

      {/* Valitse säiliö */}
      <div className="mb-6 text-center">
        <label className="mr-2 font-medium">Valitse säiliö:</label>
        <select
          value={selectedContainer.id}
          onChange={(e) =>
            setSelectedContainer(
              containers.find((c) => c.id === e.target.value)
            )
          }
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
      <div className="mb-6 text-center p-4 bg-white rounded shadow w-80">
        <h3 className="font-semibold mb-2">{selectedContainer.location}</h3>
        <p>Kapasiteetti: {selectedContainer.capacity} L</p>
        <p>Täyttöaste: {selectedContainer.fillLevel}%</p>
        <p>Viimeisin päivitys: {selectedContainer.lastUpdate}</p>
        <p>Status: {selectedContainer.isOnline ? "Online" : "Offline"}</p>
      </div>

      {/* Täyttöasteen trendi päivätasolla */}
      <div className="mb-6 flex justify-center">
        <div>
          <h3 className="font-semibold mb-2 text-center">
            Täyttöasteen trendi (päiväkohtainen): {selectedContainer.location}
          </h3>
          <LineChart width={600} height={300} data={containerHistory}>
            <XAxis dataKey="timestamp" />
            <YAxis unit="%" domain={[0, 100]} />
            <Tooltip />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="fillLevel" stroke="#646cff" />
          </LineChart>
        </div>
      </div>

      {/* Suoritetut työtehtävät */}
      <div className="mb-6 flex justify-center">
        <div>
          <h3 className="font-semibold mb-2 text-center">
            Suoritetut työtehtävät per työntekijä
          </h3>
          <BarChart width={500} height={250} data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Bar dataKey="count" fill="#61dafb" />
          </BarChart>
        </div>
      </div>
    </section>
  );
}