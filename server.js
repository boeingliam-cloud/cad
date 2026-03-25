/**
 * ER:LC Australian CAD — Backend Proxy Server
 * Node.js / Express
 *
 * SETUP:
 *   npm install express cors dotenv node-fetch
 *   Create a .env file with: SERVER_KEY=your_prc_key_here
 *   node server.js
 *
 * This proxy handles CORS so the frontend can call the PRC v2 API
 * from the browser without CORS errors.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const PRC_BASE = 'https://api.policeroleplay.community/v1/server';
const SERVER_KEY = process.env.SERVER_KEY;

if (!SERVER_KEY) {
  console.error('❌ ERROR: SERVER_KEY not set in .env file');
  console.error('   Create a .env file: SERVER_KEY=your_prc_key');
  process.exit(1);
}

// Allow requests from the frontend (update origin for production)
app.use(cors({ origin: '*' }));
app.use(express.json());

// ─── HELPER: Fetch from PRC API ─────────────────────────────
async function fetchPRC(endpoint) {
  const url = endpoint ? `${PRC_BASE}/${endpoint}` : PRC_BASE;

  const res = await fetch(url, {
    headers: {
      'Server-Key': SERVER_KEY,
      'Content-Type': 'application/json'
    },
    signal: AbortSignal.timeout(10000)
  });

  if (!res.ok) {
    const text = await res.text();
    throw { status: res.status, message: text };
  }

  return res.json();
}

// ─── ROUTES ─────────────────────────────────────────────────

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ER:LC Australian CAD Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Server info
app.get('/api/server', async (req, res) => {
  try {
    const data = await fetchPRC('');
    res.json(data);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || 'Failed to fetch server info' });
  }
});

// Players
app.get('/api/players', async (req, res) => {
  try {
    const data = await fetchPRC('players');
    res.json(data);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || 'Failed to fetch players' });
  }
});

// Mod calls (000 calls)
app.get('/api/modcalls', async (req, res) => {
  try {
    const data = await fetchPRC('modcalls');
    res.json(data);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || 'Failed to fetch mod calls' });
  }
});

// Vehicles
app.get('/api/vehicles', async (req, res) => {
  try {
    const data = await fetchPRC('vehicles');
    res.json(data);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || 'Failed to fetch vehicles' });
  }
});

// Join logs
app.get('/api/joinlogs', async (req, res) => {
  try {
    const data = await fetchPRC('joinlogs');
    res.json(data);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || 'Failed to fetch join logs' });
  }
});

// Kill logs
app.get('/api/killlogs', async (req, res) => {
  try {
    const data = await fetchPRC('killlogs');
    res.json(data);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || 'Failed to fetch kill logs' });
  }
});

// Command logs
app.get('/api/commandlogs', async (req, res) => {
  try {
    const data = await fetchPRC('commandlogs');
    res.json(data);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || 'Failed to fetch command logs' });
  }
});

// Queue
app.get('/api/queue', async (req, res) => {
  try {
    const data = await fetchPRC('queue');
    res.json(data);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || 'Failed to fetch queue' });
  }
});

// All-in-one endpoint (fetches everything at once)
app.get('/api/all', async (req, res) => {
  const endpoints = ['', 'players', 'modcalls', 'vehicles', 'joinlogs', 'killlogs', 'commandlogs', 'queue'];

  const results = await Promise.allSettled(endpoints.map(e => fetchPRC(e)));

  res.json({
    server:      results[0].status === 'fulfilled' ? results[0].value : null,
    players:     results[1].status === 'fulfilled' ? results[1].value : [],
    modcalls:    results[2].status === 'fulfilled' ? results[2].value : [],
    vehicles:    results[3].status === 'fulfilled' ? results[3].value : [],
    joinlogs:    results[4].status === 'fulfilled' ? results[4].value : [],
    killlogs:    results[5].status === 'fulfilled' ? results[5].value : [],
    commandlogs: results[6].status === 'fulfilled' ? results[6].value : [],
    queue:       results[7].status === 'fulfilled' ? results[7].value : [],
    fetched_at:  Date.now()
  });
});

// ─── START ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  🛡️  ER:LC Australian CAD — Backend');
  console.log(`  ✅  Running on http://localhost:${PORT}`);
  console.log(`  🔑  Server Key: ${SERVER_KEY.substring(0, 6)}...`);
  console.log('');
  console.log('  Endpoints:');
  console.log('    GET /api/server      — Server info');
  console.log('    GET /api/players     — Player list');
  console.log('    GET /api/modcalls    — 000 Calls');
  console.log('    GET /api/vehicles    — Vehicles');
  console.log('    GET /api/joinlogs    — Join/Leave log');
  console.log('    GET /api/killlogs    — Kill log');
  console.log('    GET /api/commandlogs — Command log');
  console.log('    GET /api/queue       — Queue');
  console.log('    GET /api/all         — All at once');
  console.log('');
});
