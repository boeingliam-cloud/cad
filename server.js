// server.js - PRC v2 backend proxy
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const SERVER_KEY = process.env.SERVER_KEY;

if (!SERVER_KEY) {
  console.warn("WARNING: SERVER_KEY is not set in .env");
}

app.use(cors());
app.use(express.json());

const PRC_BASE = "https://api.policeroleplay.community/v2/server";

async function fetchSnapshot() {
  const url =
    PRC_BASE +
    "?Players=true&Staff=true&JoinLogs=true&Queue=true&KillLogs=true&CommandLogs=true&ModCalls=true&Vehicles=true";

  const res = await fetch(url, {
    headers: {
      "server-key": SERVER_KEY
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PRC ${res.status}: ${text}`);
  }

  return res.json();
}

app.get("/api/all", async (_req, res) => {
  try {
    const data = await fetchSnapshot();
    res.json(data);
  } catch (err) {
    console.error("Error in /api/all:", err.message);
    res.status(502).json({ error: "Failed to fetch PRC v2 data", detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
