import React from "react";

const Alerts = ({ alerts }) => {
  const handleCreateTask = async (alertId) => {
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alertId }),
    });
  };

  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Hälytykset</h2>
      {alerts.length === 0 ? (
        <p>Ei aktiivisia hälytyksiä</p>
      ) : (
        <ul>
          {alerts.map((a) => (
            <li
              key={a.id}
              className="p-3 mb-2 bg-yellow-100 rounded-2xl shadow-sm flex justify-between items-center"
            >
              <span>
                {a.containerName} - {a.level}% täyttöaste
              </span>
              <button
                onClick={() => handleCreateTask(a.id)}
                className="px-3 py-1 bg-blue-500 text-white rounded-xl"
              >
                Luo tehtävä
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Alerts;
