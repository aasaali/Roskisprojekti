import { useState } from "react";

export default function Containers({ containers, setContainers }) {
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [newContainer, setNewContainer] = useState({
    location: "",
    fillLevel: 0,
    capacity: 100,
    status: "normal",
    isOnline: true,
    lastUpdate: "00:00",
  });

  // Aloita muokkaus
  const startEditing = (container) => {
    setEditingId(container.id);
    setEditedData(container);
  };

  // Muokkauslomakkeen kenttien muutokset
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setEditedData({
      ...editedData,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  // Tallenna muokkaukset
  const saveChanges = () => {
    const updated = containers.map((c) =>
      c.id === editingId ? editedData : c
    );
    setContainers(updated);
    setEditingId(null);
  };

  // Poista säiliö
  const deleteContainer = (id) => {
    if (window.confirm("Haluatko varmasti poistaa säiliön?")) {
      setContainers(containers.filter((c) => c.id !== id));
    }
  };

  // Uuden säiliön lomakekenttien muutos
  const handleNewChange = (e) => {
    const { name, value, type } = e.target;
    setNewContainer({
      ...newContainer,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  // Lisää uusi säiliö
  const addContainer = () => {
    if (!newContainer.location) {
      alert("Sijainti on pakollinen");
      return;
    }
    const id = (Math.max(...containers.map(c => Number(c.id))) + 1).toString();
    setContainers([...containers, { ...newContainer, id }]);
    setNewContainer({
      location: "",
      fillLevel: 0,
      capacity: 100,
      status: "normal",
      isOnline: true,
      lastUpdate: "00:00",
    });
  };

  // Käännä status suomeksi
  const translateStatus = (status) => {
    switch (status) {
      case "normal":
        return "Normaali";
      case "warning":
        return "Varoitus";
      case "critical":
        return "Kriittinen";
      default:
        return status;
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Säiliöiden hallinta</h2>

      {/* Uuden säiliön lisäys */}
      <div className="card mb-4 p-3" style={{ maxWidth: "400px" }}>
        <h5>Lisää uusi säiliö</h5>
        <div className="mb-2">
          <label>Sijainti</label>
          <input
            name="location"
            placeholder="Sijainti"
            value={newContainer.location}
            onChange={handleNewChange}
            className="form-control mb-2"
          />
          <label>Kapasiteetti</label>
          <input
            name="capacity"
            type="number"
            placeholder="Kapasiteetti"
            value={newContainer.capacity}
            onChange={handleNewChange}
            className="form-control mb-2"
          />
          <button className="btn btn-success btn-sm" onClick={addContainer}>
            Lisää säiliö
          </button>
        </div>
      </div>

      {/* Säiliöt taulukossa */}
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
                    className="form-control"
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
                    className="form-control"
                  />
                ) : (
                  c.capacity
                )}
              </td>
              <td>{translateStatus(c.status)}</td>
              <td>{c.isOnline ? "Kyllä" : "Ei"}</td>
              <td>
                {editingId === c.id ? (
                  <>
                    <button className="btn btn-success btn-sm me-1" onClick={saveChanges}>
                      Tallenna
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>
                      Peruuta
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-primary btn-sm me-1" onClick={() => startEditing(c)}>
                      Muokkaa
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteContainer(c.id)}>
                      Poista
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
