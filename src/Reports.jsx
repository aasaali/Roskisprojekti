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

  // Mock-historia jokaiselle säiliölle
  const containerHistory = selectedContainer.history || [
    { timestamp: "08:00", fillLevel: 20 },
    { timestamp: "12:00", fillLevel: 45 },
    { timestamp: "16:00", fillLevel: 60 },
    { timestamp: "20:00", fillLevel: 80 },
  ];

  // Yksinkertainen yhteenveto työtehtävistä
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

      {/* Säiliön täyttöasteen trendi */}
      <div className="mb-6 flex justify-center">
        <div>
          <h3 className="font-semibold mb-2 text-center">
            Täyttöasteen trendi: {selectedContainer.location}
          </h3>
          <LineChart width={500} height={250} data={containerHistory}>
            <XAxis dataKey="timestamp" />
            <YAxis unit="%" />
            <Tooltip />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="fillLevel" stroke="#646cff" />
          </LineChart>
        </div>
      </div>

      {/* Yksittäisen säiliön tiedot */}
      <div className="mb-6 text-center p-4 bg-white rounded shadow w-80">
        <h3 className="font-semibold mb-2">{selectedContainer.location}</h3>
        <p>Kapsiteetti: {selectedContainer.capacity} L</p>
        <p>Täyttöaste: {selectedContainer.fillLevel}%</p>
        <p>Viimeisin päivitys: {selectedContainer.lastUpdate}</p>
        <p>Status: {selectedContainer.isOnline ? "Online" : "Offline"}</p>
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
