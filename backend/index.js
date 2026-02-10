const express = require("express");
const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/measurements", (req, res) => {
  console.log("Mittaus vastaanotettu:", req.body);
  res.status(201).json({ status: "received" });
});

app.listen(3000, () => {
  console.log("Backend käynnissä: http://localhost:3000");
});