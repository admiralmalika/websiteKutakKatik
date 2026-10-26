// ============================================================================
// NIGHTWORKS® · KUTAK KATIK STUDIO — POSTGRESQL (DATABASE_URL) & HYBRID ADAPTER
// Automatically syncs relational tables (products, orders, users, vouchers) +
// full state in PostgreSQL when DATABASE_URL is configured, with seamless
// local JSON fallback when offline or before DATABASE_URL is set.
// ============================================================================

const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, "data");
const STORE_FILE = path.join(DATA_DIR, "store.json");
const DB_CONFIG_FILE = path.join(DATA_DIR, "db-config.json");
const ENV_FILE = path.join(ROOT_DIR, ".env");
const SCHEMA_FILE = path.join(ROOT_DIR, "schema.sql");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Simple .env loader (no external dotenv dependency needed)
function loadDotEnv() {
  if (!fs.existsSync(ENV_FILE)) return;
  try {
    const lines = fs.readFileSync(ENV_FILE, "utf8").split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  } catch (err) {
    console.warn("Could not parse .env file:", err.message);
  }
}

loadDotEnv();

let pgPool = null;
let dbState = {
  connected: false,
  mode: "local_json", // "postgresql" | "local_json"
  databaseUrlMasked: null,
  lastSyncAt: null,
  lastError: null,
  pgVersion: null,
  tablesSynced: []
};

function maskConnectionString(connStr) {
  if (!connStr) return null;
  try {
    const u = new URL(connStr);
    if (u.password) u.password = "****";
    return u.toString();
  } catch (_) {
    return connStr.replace(/:[^:@/]+@/, ":****@");
  }
}

function getConfiguredDatabaseUrl() {
  if (fs.existsSync(DB_CONFIG_FILE)) {
    try {
      const cfg = JSON.parse(fs.readFileSync(DB_CONFIG_FILE, "utf8"));
      if (cfg && cfg.databaseUrl && cfg.databaseUrl.trim()) {
        return cfg.databaseUrl.trim();
      }
    } catch (_) {}
  }
  return process.env.DATABASE_URL ? process.env.DATABASE_URL.trim() : "";
}

function saveConfiguredDatabaseUrl(databaseUrl) {
  fs.writeFileSync(
    DB_CONFIG_FILE,
    JSON.stringify({ databaseUrl: (databaseUrl || "").trim(), updatedAt: new Date().toISOString() }, null, 2),
    "utf8"
  );
  // Also write/update .env so CLI tools see DATABASE_URL
  try {
    const envContent = `PORT=${process.env.PORT || 3000}\nDATABASE_URL=${(databaseUrl || "").trim()}\n`;
    fs.writeFileSync(ENV_FILE, envContent, "utf8");
  } catch (_) {}
}

async function initPostgresPool(customUrl) {
  const connStr = customUrl !== undefined ? customUrl : getConfiguredDatabaseUrl();
  if (!connStr) {
    if (pgPool) {
      await pgPool.end().catch(() => {});
      pgPool = null;
    }
    dbState = {
      connected: false,
      mode: "local_json",
      databaseUrlMasked: null,
      lastSyncAt: null,
      lastError: "DATABASE_URL belum diatur (menggunakan penyimpanan lokal data/store.json)",
      pgVersion: null,
      tablesSynced: []
    };
    return dbState;
  }

  dbState.databaseUrlMasked = maskConnectionString(connStr);

  try {
    if (pgPool) {
      await pgPool.end().catch(() => {});
    }

    const useSsl =
      connStr.includes("sslmode=require") ||
      connStr.includes("neon.tech") ||
      connStr.includes("supabase.co") ||
      connStr.includes("railway.app") ||
      connStr.includes("render.com") ||
      connStr.includes("aivencloud.com");

    pgPool = new Pool({
      connectionString: connStr,
      ssl: useSsl ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 6000
    });

    const client = await pgPool.connect();
    try {
      const verRes = await client.query("SELECT version()");
      const schemaSql = fs.readFileSync(SCHEMA_FILE, "utf8");
      await client.query(schemaSql);

      dbState = {
        connected: true,
        mode: "postgresql",
        databaseUrlMasked: maskConnectionString(connStr),
        lastSyncAt: new Date().toISOString(),
        lastError: null,
        pgVersion: (verRes.rows[0]?.version || "PostgreSQL").split(",")[0],
        tablesSynced: ["store_kv", "products", "orders", "users", "vouchers"]
      };
      console.log(`[PostgreSQL] Connected & schema verified: ${dbState.pgVersion}`);
    } finally {
      client.release();
    }
  } catch (err) {
    console.warn(`[PostgreSQL] Connection failed (${err.message}). Using local JSON fallback.`);
    dbState = {
      connected: false,
      mode: "local_json",
      databaseUrlMasked: maskConnectionString(connStr),
      lastSyncAt: null,
      lastError: err.message,
      pgVersion: null,
      tablesSynced: []
    };
  }

  return dbState;
}

// Sync full store object into relational PostgreSQL tables + store_kv
async function syncStoreToPostgres(storeData) {
  if (!pgPool || !dbState.connected || !storeData) return false;
  const client = await pgPool.connect();
  try {
    await client.query("BEGIN");

    // 1. Upsert full state in store_kv
    await client.query(
      `INSERT INTO store_kv (key, payload, updated_at)
       VALUES ('main_store', $1::jsonb, NOW())
       ON CONFLICT (key) DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()`,
      [JSON.stringify(storeData)]
    );

    // 2. Sync relational products table
    if (Array.isArray(storeData.products)) {
      const keepIds = storeData.products.map((p) => p.id);
      if (keepIds.length > 0) {
        await client.query(`DELETE FROM products WHERE NOT (id = ANY($1::text[]))`, [keepIds]);
      }
      for (const p of storeData.products) {
        await client.query(
          `INSERT INTO products (
            id, name, slug, category, price, compare_at_price, stock, featured,
            featured_slot, badge, rating, review_count, finishes, dimensions,
            lead_time, image, hover_image, description, updated_at
          ) VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13::jsonb,$14,$15,$16,$17,$18,NOW()
          )
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            slug = EXCLUDED.slug,
            category = EXCLUDED.category,
            price = EXCLUDED.price,
            compare_at_price = EXCLUDED.compare_at_price,
            stock = EXCLUDED.stock,
            featured = EXCLUDED.featured,
            featured_slot = EXCLUDED.featured_slot,
            badge = EXCLUDED.badge,
            rating = EXCLUDED.rating,
            review_count = EXCLUDED.review_count,
            finishes = EXCLUDED.finishes,
            dimensions = EXCLUDED.dimensions,
            lead_time = EXCLUDED.lead_time,
            image = EXCLUDED.image,
            hover_image = EXCLUDED.hover_image,
            description = EXCLUDED.description,
            updated_at = NOW()`,
          [
            p.id,
            p.name,
            p.slug || p.id,
            p.category || "Lighting",
            Number(p.price || 0),
            p.compareAtPrice ? Number(p.compareAtPrice) : null,
            Number(p.stock || 0),
            Boolean(p.featured),
            p.featuredSlot ? Number(p.featuredSlot) : null,
            p.badge || null,
            Number(p.rating || 5),
            Number(p.reviewCount || 0),
            JSON.stringify(p.finishes || []),
            p.dimensions || "",
            p.leadTime || "",
            p.image || "",
            p.hoverImage || p.image || "",
            p.description || ""
          ]
        );
      }
    }

    // 3. Sync relational orders table (including QRIS & payment proof columns)
    if (Array.isArray(storeData.orders)) {
      for (const o of storeData.orders) {
        await client.query(
          `INSERT INTO orders (
            id, created_at, customer_name, customer_email, customer_phone,
            shipping_address, shipping_method, payment_method, status,
            payment_status, payment_proof_url, payment_sender_name,
            payment_sender_bank, payment_notes, payment_uploaded_at,
            payment_verified_at, payment_verified_by, voucher_code,
            subtotal, discount, shipping_cost, total, items
          ) VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23::jsonb
          )
          ON CONFLICT (id) DO UPDATE SET
            status = EXCLUDED.status,
            payment_status = EXCLUDED.payment_status,
            payment_proof_url = EXCLUDED.payment_proof_url,
            payment_sender_name = EXCLUDED.payment_sender_name,
            payment_sender_bank = EXCLUDED.payment_sender_bank,
            payment_notes = EXCLUDED.payment_notes,
            payment_uploaded_at = EXCLUDED.payment_uploaded_at,
            payment_verified_at = EXCLUDED.payment_verified_at,
            payment_verified_by = EXCLUDED.payment_verified_by,
            total = EXCLUDED.total,
            items = EXCLUDED.items`,
          [
            o.id,
            o.createdAt || new Date().toISOString(),
            o.customerName || "Client",
            o.customerEmail || "",
            o.customerPhone || "",
            o.shippingAddress || "",
            o.shippingMethod || "",
            o.paymentMethod || "",
            o.status || "Pending",
            o.paymentStatus || "Unpaid",
            o.paymentProofUrl || null,
            o.paymentSenderName || null,
            o.paymentSenderBank || null,
            o.paymentNotes || null,
            o.paymentUploadedAt || null,
            o.paymentVerifiedAt || null,
            o.paymentVerifiedBy || null,
            o.voucherCode || null,
            Number(o.subtotal || 0),
            Number(o.discount || 0),
            Number(o.shippingCost || 0),
            Number(o.total || 0),
            JSON.stringify(o.items || [])
          ]
        );
      }
    }

    // 4. Sync relational users table
    if (Array.isArray(storeData.users)) {
      for (const u of storeData.users) {
        await client.query(
          `INSERT INTO users (id, name, email, username, password, role, company, joined_at)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
           ON CONFLICT (id) DO UPDATE SET
             name = EXCLUDED.name,
             email = EXCLUDED.email,
             role = EXCLUDED.role,
             company = EXCLUDED.company`,
          [
            u.id,
            u.name,
            u.email,
            u.username || u.email,
            u.password || "user123",
            u.role || "customer",
            u.company || "",
            u.joinedAt || "2026"
          ]
        );
      }
    }

    // 5. Sync relational vouchers table
    if (Array.isArray(storeData.vouchers)) {
      await client.query("DELETE FROM vouchers");
      for (const v of storeData.vouchers) {
        await client.query(
          `INSERT INTO vouchers (code, discount_percent, description, active)
           VALUES ($1,$2,$3,$4)
           ON CONFLICT (code) DO UPDATE SET
             discount_percent = EXCLUDED.discount_percent,
             description = EXCLUDED.description,
             active = EXCLUDED.active`,
          [v.code, Number(v.discountPercent || 10), v.description || "", Boolean(v.active)]
        );
      }
    }

    await client.query("COMMIT");
    dbState.lastSyncAt = new Date().toISOString();
    return true;
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("[PostgreSQL] Sync error:", err.message);
    dbState.lastError = err.message;
    return false;
  } finally {
    client.release();
  }
}

async function readStore() {
  // 1. Try PostgreSQL first if connected
  if (pgPool && dbState.connected) {
    try {
      const res = await pgPool.query(`SELECT payload FROM store_kv WHERE key = 'main_store' LIMIT 1`);
      if (res.rows.length > 0 && res.rows[0].payload) {
        return res.rows[0].payload;
      }
    } catch (err) {
      console.warn("[PostgreSQL] Read error, falling back to local store.json:", err.message);
    }
  }

  // 2. Fallback to local data/store.json
  try {
    if (fs.existsSync(STORE_FILE)) {
      return JSON.parse(fs.readFileSync(STORE_FILE, "utf8"));
    }
  } catch (err) {
    console.error("Error reading store.json:", err.message);
  }
  return null;
}

async function writeStore(data) {
  // Always keep local backup in data/store.json
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing store.json:", err.message);
  }

  // If PostgreSQL is active, sync to relational tables + store_kv
  if (pgPool && dbState.connected) {
    await syncStoreToPostgres(data);
  }
  return true;
}

async function configureAndTestPostgres(databaseUrl, currentStoreData) {
  saveConfiguredDatabaseUrl(databaseUrl);
  const status = await initPostgresPool(databaseUrl);
  if (status.connected && currentStoreData) {
    await syncStoreToPostgres(currentStoreData);
  }
  return status;
}

function getDbStatus() {
  return {
    ...dbState,
    hasDatabaseUrl: Boolean(getConfiguredDatabaseUrl())
  };
}

module.exports = {
  initPostgresPool,
  readStore,
  writeStore,
  configureAndTestPostgres,
  getDbStatus,
  syncStoreToPostgres
};
