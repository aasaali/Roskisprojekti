import { useState } from "react";

export default function Containers({ containers, setContainers }) {
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});

  const startEditing = (container) => {
    setEditingId(container.id);
    setEditedData(container);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setEditedData({
      ...editedData,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const saveChanges = () => {
    const updated = containers.map((c) =>
      c.id === editingId ? editedData : c
    );
    setContainers(updated);
    setEditingId(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Säiliöiden hallinta</h2>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Sijainti</th>
            <th>Täyttöaste</th>
            <th>Kapasiteetti</th>
            <th>Status</th>
            <th>Online</th>
            <th>Toiminnot</th>
          </tr>
        </thead>
        <tbody>
          {containers.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>
                {editingId === c.id ? (
                  <input
                    name="location"
                    value={editedData.location}
                    onChange={handleChange}
                  />
                ) : (
                  c.location
                )}
              </td>
              <td>{c.fillLevel}%</td>
              <td>
                {editingId === c.id ? (
                  <input
                    name="capacity"
                    type="number"
                    value={editedData.capacity}
                    onChange={handleChange}
                  />
                ) : (
                  c.capacity
                )}
              </td>
              <td>{c.status}</td>
              <td>{c.isOnline ? "Kyllä" : "Ei"}</td>
              <td>
                {editingId === c.id ? (
                  <>
                    <button className="btn btn-success btn-sm" onClick={saveChanges}>
                      Tallenna
                    </button>{" "}
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>
                      Peruuta
                    </button>
                  </>
                ) : (
                  <button className="btn btn-primary btn-sm" onClick={() => startEditing(c)}>
                    Muokkaa
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
