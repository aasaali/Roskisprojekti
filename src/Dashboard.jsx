import React from "react";
import BinCard from "./BinCard";

export default function Dashboard({ containers }) {
  return (
    <div className="dashboard">
      {containers.map((c) => (
        <BinCard key={c.id} {...c} />
      ))}
    </div>
  );
}
