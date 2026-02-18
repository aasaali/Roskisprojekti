const express = require("express");
const app = express();

app.use(express.json());

// Demon perusasetukset
const SITES = ["SITE-001", "SITE-002", "SITE-003", "SITE-004", "SITE-005"];

// ei vielä tietokantaa
const SITE_TO_BIN = {
  "SITE-001": 1,
  "SITE-002": 2,
  "SITE-003": 3,
  "SITE-004": 4,
  "SITE-005": 5,
};

// Tallennetaan muistiin, kun ei vielä db
const measurementsByBin = {
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
};

// Raja-arvot
const WARNING = 70;
const CRITICAL = 85;
const STALE_MINUTES = 45; //datakatkos

// 
function computeState(fillPercent, isStale) {
  if (isStale) return "OFFLINE";
  if (fillPercent >= CRITICAL) return "CRITICAL";
  if (fillPercent >= WARNING) return "WARNING";
  return "OK";
}

function minutesBetween(nowMs, isoTime) {
  return (nowMs - Date.parse(isoTime)) / 60000;
}

// ---- Reitit ----
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

/**
 * Mittaus sisään (IoT / simulaattori)
 * Odottaa JSON:
 *  - site_id: "SITE-001"..."SITE-005"
 *  - measured_at: UTC)
 *  - fill_percent: 0-100
 */
app.post("/api/measurements", (req, res) => {
  const { site_id, measured_at, fill_percent } = req.body;

  // 1) Tarkista pakolliset 
  if (!site_id || !measured_at || fill_percent === undefined) {
    return res.status(400).json({
      error: "Missing fields. Required: site_id, measured_at, fill_percent",
    });
  }

  // 2) Tarkista site id
  if (!SITES.includes(site_id)) {
    return res.status(400).json({
      error: `Unknown site_id. Must be one of: ${SITES.join(", ")}`,
    });
  }

  // 3) Tarkista aikaleima
  const t = Date.parse(measured_at);
  if (Number.isNaN(t)) {
    return res.status(400).json({
      error: "Invalid measured_at. Use ISO-8601 datetime (UTC preferred, e.g. ...Z)",
    });
  }

  // 4) Tarkista täyttöaste
  if (typeof fill_percent !== "number" || fill_percent < 0 || fill_percent > 100) {
    return res.status(400).json({
      error: "fill_percent must be a number between 0 and 100",
    });
  }

  // 5) Muunna bin id:ksi
  const bin_id = SITE_TO_BIN[site_id];

  // 6) Aikaleiman normalisointi (UTC) 
  const measuredIso = new Date(t).toISOString();

  // 7) Tallennetaan muistiin 
  const row = {
    bin_id,
    site_id,
    measured_at: measuredIso,
    fill_percent,
  };

  measurementsByBin[bin_id].push(row);

  console.log("Stored measurement:", row);

  return res.status(201).json({ status: "stored", bin_id });
});

/**
 * Tilannekuva frontille
 * Palauttaa aina 5 kohdetta.
 * Laskee:
 *  - state: OK/WARNING/CRITICAL/OFFLINE/NO_DATA
 *  - is_stale: true/false
 */
app.get("/api/sites/status", (req, res) => {
  const now = Date.now();

  const data = SITES.map((site_id) => {
    const bin_id = SITE_TO_BIN[site_id];
    const arr = measurementsByBin[bin_id];
    const latest = arr.length ? arr[arr.length - 1] : null;

    // Ei dataa vielä
    if (!latest) {
      return {
        site_id,
        bin_id,
        fill_percent: null,
        state: "NO_DATA",
        last_measured_at: null,
        is_stale: true,
        open_task: false, // taskit tehdään myöhemmin
      };
    }

    const ageMin = minutesBetween(now, latest.measured_at);
    const is_stale = ageMin > STALE_MINUTES;

    return {
      site_id,
      bin_id,
      fill_percent: latest.fill_percent,
      state: computeState(latest.fill_percent, is_stale),
      last_measured_at: latest.measured_at,
      is_stale,
      open_task: false, // taskit tehdään myöhemmin
    };
  });

  res.json(data);
});


 // debug: näe kaikki mittaukset muistista
 
app.get("/api/debug/measurements", (req, res) => {
  res.json(measurementsByBin);
});

app.listen(3000, () => {
  console.log("Backend käynnissä: http://localhost:3000");
});