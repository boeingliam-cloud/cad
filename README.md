# 🛡️ ER:LC Australian CAD — Setup Guide

A fully-featured, Australian-themed Computer Aided Dispatch system for ER:LC private servers using the PRC v2 API.

---

## Files

| File | Description |
|------|-------------|
| `erlc-au-cad.html` | Frontend — open in any browser |
| `server.js` | Node.js backend proxy (recommended for production) |
| `.env` | Your PRC server key (create this yourself) |

---

## Quick Start (Frontend Only)

1. Open `erlc-au-cad.html` in a browser
2. Enter your PRC v2 Server Key (from your PRC dashboard)
3. Select your primary agency
4. Click **ACTIVATE CAD SYSTEM**

> ⚠️ **CORS Note:** Direct browser-to-PRC-API calls may be blocked by CORS.
> For reliable live data, use the Node.js backend below.

**Demo Mode:** Leave the server key blank to run a demo with sample data.

---

## Backend Setup (Recommended)

The backend proxy bypasses browser CORS restrictions and keeps your server key secure on the server, not in the browser.

### Requirements
- Node.js v18+
- npm

### Installation

```bash
# Install dependencies
npm install express cors dotenv

# Create your .env file
echo "SERVER_KEY=your_prc_server_key_here" > .env

# Start the server
node server.js
```

The backend runs on **http://localhost:3000** by default.

### Connect Frontend to Backend

In `erlc-au-cad.html`, find the `apiFetch` function and update the URL:

```javascript
async function apiFetch(endpoint) {
  // Change this to your backend URL
  const res = await fetch(`http://localhost:3000/api/${endpoint || 'server'}`, {
    signal: AbortSignal.timeout(8000)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
```

Or use the `/api/all` endpoint for efficiency:

```javascript
const data = await fetch('http://localhost:3000/api/all').then(r => r.json());
```

---

## Australian Theming

### Agencies
| Code | Full Name |
|------|-----------|
| NSWPF | NSW Police Force |
| VICPOL | Victoria Police |
| QPS | Queensland Police Service |
| SAPOL | South Australia Police |
| WAPOL | WA Police Force |
| AFP | Australian Federal Police |
| NSWRFS | NSW Rural Fire Service |
| CFA | Country Fire Authority (VIC) |
| SES | State Emergency Service |

### Radio Codes
| Code | Meaning |
|------|---------|
| 10-8 | Available / In Service |
| 10-7 | Off Duty / Out of Service |
| 10-23 | On Scene / Arrived |
| Code 1 | No Lights & Sirens |
| Code 3 | Lights & Sirens Active |
| 10-4 | Message Received |
| 10-9 | Repeat Last Transmission |
| 10-20 | What is your location? |

### Callsign Format
Callsigns are auto-generated as **AU-###** from the player's Roblox UserId.

---

## PRC API Reference

- Documentation: https://apidocs.policeroleplay.community/for-developers/v2-api-reference
- Get your server key from your PRC private server dashboard

### Endpoints Used
- `GET /v1/server` — Server info
- `GET /v1/server/players` — Player list
- `GET /v1/server/modcalls` — 000 / Mod calls
- `GET /v1/server/vehicles` — Active vehicles
- `GET /v1/server/joinlogs` — Join/leave logs
- `GET /v1/server/killlogs` — Kill/incident logs
- `GET /v1/server/commandlogs` — Command logs
- `GET /v1/server/queue` — Queue count

---

## Deployment (Production)

For a permanent CAD accessible by your whole team:

1. Deploy `server.js` to a VPS or cloud service (Railway, Render, Fly.io, etc.)
2. Set the `SERVER_KEY` environment variable on your host
3. Host `erlc-au-cad.html` on any static host (Netlify, GitHub Pages, etc.)
4. Update the API URL in the frontend to point to your deployed backend

---

## Disclaimer

This CAD is for roleplay use only. Not affiliated with Roblox, ER:LC, Police Roleplay Community, or any Australian government agency.
