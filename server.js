// ============================================================================
// NIGHTWORKS® · KUTAK KATIK STUDIO — NODE.JS + POSTGRESQL E-COMMERCE SERVER
// Supports PostgreSQL (DATABASE_URL), QRIS Dynamic/Static, & Payment Proof Upload
// ============================================================================

const http = require("http");
const fs = require("fs");
const path = require("path");
const db = require("./db");

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const UPLOADS_DIR = path.join(ROOT_DIR, "uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function readJsonBody(req, maxBytes = 12 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > maxBytes) {
        req.destroy();
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // 1. API: GET or POST /api/state (Store & PostgreSQL Persistence)
  if (pathname === "/api/state") {
    if (req.method === "GET") {
      const data = await db.readStore();
      return sendJson(res, 200, data || {});
    }

    if (req.method === "POST") {
      try {
        const parsed = await readJsonBody(req);
        await db.writeStore(parsed);
        return sendJson(res, 200, { ok: true, dbStatus: db.getDbStatus() });
      } catch (e) {
        return sendJson(res, 400, { error: "Invalid JSON payload" });
      }
    }
  }

  // 2. API: GET /api/db-status (PostgreSQL Connection Status)
  if (pathname === "/api/db-status" && req.method === "GET") {
    return sendJson(res, 200, db.getDbStatus());
  }

  // 3. API: POST /api/db-config (Configure & Test DATABASE_URL from Admin UI)
  if (pathname === "/api/db-config" && req.method === "POST") {
    try {
      const { databaseUrl, storeState } = await readJsonBody(req);
      const status = await db.configureAndTestPostgres(databaseUrl, storeState);
      return sendJson(res, 200, status);
    } catch (err) {
      return sendJson(res, 500, { connected: false, lastError: err.message });
    }
  }

  // 4. API: POST /api/upload-proof (Save Bukti Transfer Image to /uploads)
  if (pathname === "/api/upload-proof" && req.method === "POST") {
    try {
      const { orderId, imageDataUrl } = await readJsonBody(req);
      if (!imageDataUrl || !imageDataUrl.startsWith("data:image/")) {
        return sendJson(res, 400, { error: "Invalid image data URL" });
      }
      const matches = imageDataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (!matches) {
        return sendJson(res, 400, { error: "Malformed image base64" });
      }
      const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
      const buffer = Buffer.from(matches[2], "base64");
      const safeOrder = String(orderId || "order").replace(/[^a-zA-Z0-9_-]/g, "");
      const fileName = `proof-${safeOrder}-${Date.now()}.${ext}`;
      const filePath = path.join(UPLOADS_DIR, fileName);
      fs.writeFileSync(filePath, buffer);
      return sendJson(res, 200, { ok: true, proofUrl: `/uploads/${fileName}` });
    } catch (err) {
      return sendJson(res, 500, { error: err.message });
    }
  }

  // 5. Serve Static Files (including /uploads/*)
  let safePath = pathname === "/" ? "/index.html" : pathname;
  safePath = path.normalize(safePath).replace(/^(\.\.[\/\\])+/, "");
  const filePath = path.join(ROOT_DIR, safePath);

  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const indexFile = path.join(ROOT_DIR, "index.html");
      fs.readFile(indexFile, (readErr, content) => {
        if (readErr) {
          res.writeHead(404);
          res.end("Not Found");
          return;
        }
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(content);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500);
        res.end("Internal Server Error");
        return;
      }
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    });
  });
});

// Initialize PostgreSQL on boot (if DATABASE_URL is present) and start HTTP server
db.initPostgresPool().finally(() => {
  server.listen(PORT, () => {
    const status = db.getDbStatus();
    console.log("==================================================================");
    console.log(`  Nightworks® · Kutak Katik Online Shop & Admin Server Running!`);
    console.log(`  Storefront URL : http://localhost:${PORT}`);
    console.log(`  Database Mode  : ${status.connected ? "PostgreSQL (" + status.pgVersion + ")" : "Local JSON Fallback (Set DATABASE_URL to connect PostgreSQL)"}`);
    console.log(`  Admin Login    : admin@kutakkatik.com / admin123`);
    console.log("==================================================================");
  });
});
