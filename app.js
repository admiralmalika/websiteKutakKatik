// ============================================================================
// NIGHTWORKS® · KUTAK KATIK STUDIO — E-COMMERCE & ADMIN APPLICATION ENGINE
// ============================================================================

const STORAGE_KEY = "kutakkatik_edukasi_store_v8";
const SESSION_KEY = "kutakkatik_edukasi_session_v3";

let storeState = null;
let sessionState = {
  currentUser: null,
  cart: [],
  wishlist: [],
  appliedVoucher: null,
  activeCategory: "ALL",
  activeSpaceIndex: 0, // Defaults to Space 03 (Code Cascade from Photo 3)
  activeAdminTab: "overview",
  editingProductId: null
};

// ============================================================================
// INITIALIZATION & PERSISTENCE (LOCALSTORAGE + OPTIONAL NODE API SYNC)
// ============================================================================
async function initApp() {
  loadStateFromStorage();
  await syncFromServerIfAvailable();
  renderAll();
}

function loadStateFromStorage() {
  try {
    const rawStore = localStorage.getItem(STORAGE_KEY);
    if (rawStore) {
      storeState = JSON.parse(rawStore);
    } else {
      storeState = JSON.parse(JSON.stringify(window.INITIAL_STORE_DATA));
      saveStoreState();
    }

    const rawSession = localStorage.getItem(SESSION_KEY);
    if (rawSession) {
      const parsed = JSON.parse(rawSession);
      sessionState = { ...sessionState, ...parsed };
    }
  } catch (err) {
    console.warn("Fallback to in-memory seed data:", err);
    storeState = JSON.parse(JSON.stringify(window.INITIAL_STORE_DATA));
  }
}

function saveStoreState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storeState));
  } catch (e) {
    console.warn("Could not save to localStorage:", e);
  }
  // Also push to Node backend if running via server.js
  if (window.location.protocol.startsWith("http")) {
    fetch("/api/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(storeState)
    }).catch(() => {});
  }
}

function saveSessionState() {
  try {
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        currentUser: sessionState.currentUser,
        cart: sessionState.cart,
        wishlist: sessionState.wishlist,
        appliedVoucher: sessionState.appliedVoucher
      })
    );
  } catch (e) {
    console.warn("Could not save session:", e);
  }
}

async function syncFromServerIfAvailable() {
  if (!window.location.protocol.startsWith("http")) return;
  try {
    const res = await fetch("/api/state");
    if (res.ok) {
      const serverData = await res.json();
      if (serverData && serverData.products && serverData.products.length > 0) {
        storeState = serverData;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storeState));
      }
    }
  } catch (_) {
    // Running as static file or server not started; localStorage handles everything seamlessly
  }
}

// ============================================================================
// CURRENCY & PRICE HELPERS
// ============================================================================
function formatPrice(usdAmount) {
  const currency = storeState?.settings?.currency || "USD";
  const rate = Number(storeState?.settings?.idrRate || 16000);
  if (currency === "IDR") {
    const idr = Math.round(Number(usdAmount) * rate);
    return "Rp " + idr.toLocaleString("id-ID");
  }
  return "$" + Number(usdAmount).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function getEffectiveUnitPrice(product) {
  const base = Number(product.price);
  if (isTradeOrAdminUser()) {
    const disc = Number(storeState.settings.tradeDiscountPercent || 20);
    return Math.round(base * (1 - disc / 100));
  }
  return base;
}

function isTradeOrAdminUser() {
  const role = sessionState.currentUser?.role;
  return role === "trade" || role === "admin";
}

function changeCurrency(newCurrency) {
  storeState.settings.currency = newCurrency;
  saveStoreState();
  renderAll();
  showToast(`Currency switched to ${newCurrency}`);
}

// ============================================================================
// MASTER RENDER ORCHESTRATOR
// ============================================================================
function renderAll() {
  renderBrandSettings();
  renderHeaderBadges();
  renderStaggeredFeatured();
  renderShopCatalog();
  renderFeaturedSpaces();
  renderJournal();
  renderCartDrawer();
  renderWishlistDrawer();
  if (document.getElementById("adminDashboardOverlay").classList.contains("open")) {
    renderAdminDashboard();
  }
}

function renderBrandSettings() {
  const s = storeState.settings;
  const wordmarkEl = document.getElementById("heroWordmarkTitle");
  if (wordmarkEl) {
    const heroText = (s.heroWordmark || "Mind Booster").trim();
    if (heroText.toLowerCase() === "mind booster") {
      wordmarkEl.innerHTML = `Mind <span class="brand-dot-id">Booster</span>`;
    } else if (heroText.toLowerCase().endsWith(".id")) {
      const base = heroText.slice(0, -3);
      wordmarkEl.innerHTML = `${escapeHtml(base)}<span class="brand-dot-id">.id</span>`;
    } else {
      wordmarkEl.innerHTML = escapeHtml(heroText);
    }
  }
  const subEl = document.getElementById("heroSubtitleText");
  if (subEl) {
    subEl.innerHTML = escapeHtml(s.brandSubtitle).replace("&", "&amp;<br/>");
  }
  const stmtEl = document.getElementById("heroStatementText");
  if (stmtEl) {
    stmtEl.textContent = s.heroStatement;
  }
  const instaEl = document.getElementById("instaHandleLink");
  if (instaEl) {
    instaEl.textContent = s.instagramHandle;
  }
  const footerBrand = document.getElementById("footerBrandTitle");
  if (footerBrand) {
    footerBrand.textContent = `${s.brandName}®`;
  }
  const currSelect = document.getElementById("currencySelect");
  if (currSelect) {
    currSelect.value = s.currency || "USD";
  }

  // Dynamic Website Page Content & Images (Editable from Admin Panel Tab 3)
  const heroBgImgEl = document.getElementById("heroBgImageEl");
  if (heroBgImgEl && s.heroImage) heroBgImgEl.src = s.heroImage;

  const heroPhotoLabelEl = document.getElementById("heroPhotoLabelEl");
  if (heroPhotoLabelEl && s.heroPhotoLabel) heroPhotoLabelEl.textContent = s.heroPhotoLabel;

  const bannerStripImgEl = document.getElementById("bannerStripImgEl");
  if (bannerStripImgEl && s.bannerStripImage) bannerStripImgEl.src = s.bannerStripImage;

  const bannerStripLabelEl = document.getElementById("bannerStripLabelEl");
  if (bannerStripLabelEl && s.bannerStripLabel) bannerStripLabelEl.textContent = s.bannerStripLabel;

  const foundersHeadingEl = document.getElementById("foundersHeadingEl");
  if (foundersHeadingEl && s.aboutTitle) foundersHeadingEl.textContent = s.aboutTitle;

  const foundersPara1El = document.getElementById("foundersPara1El");
  if (foundersPara1El && s.aboutPara1) foundersPara1El.textContent = s.aboutPara1;

  const foundersPara2El = document.getElementById("foundersPara2El");
  if (foundersPara2El && s.aboutPara2) foundersPara2El.textContent = s.aboutPara2;

  const foundersMainImgEl = document.getElementById("foundersMainImgEl");
  if (foundersMainImgEl && s.aboutMainImage) foundersMainImgEl.src = s.aboutMainImage;

  const foundersSecondImgEl = document.getElementById("foundersSecondImgEl");
  if (foundersSecondImgEl && s.aboutSecondImage) foundersSecondImgEl.src = s.aboutSecondImage;

  const tradeHeadingEl = document.getElementById("tradeHeadingEl");
  if (tradeHeadingEl && s.tradeTitle) tradeHeadingEl.textContent = s.tradeTitle;

  const tradePara1El = document.getElementById("tradePara1El");
  if (tradePara1El && s.tradePara1) tradePara1El.textContent = s.tradePara1;

  const tradePara2El = document.getElementById("tradePara2El");
  if (tradePara2El && s.tradePara2) tradePara2El.textContent = s.tradePara2;

  const tradeMainImgEl = document.getElementById("tradeMainImgEl");
  if (tradeMainImgEl && s.tradeMainImage) tradeMainImgEl.src = s.tradeMainImage;

  // Update top account button & user banner
  const topBtn = document.getElementById("topBarAccountBtn");
  const banner = document.getElementById("activeUserBanner");
  const user = sessionState.currentUser;
  if (user) {
    topBtn.textContent = `${user.name} (${user.role.toUpperCase()})`;
    if (user.role === "admin") {
      banner.innerHTML = `Login sebagai <strong>Admin (${escapeHtml(user.email)})</strong> · <button class="underlined-link" onclick="openAdminOrLogin()">Buka Admin Dashboard</button>`;
    } else if (user.role === "trade") {
      banner.innerHTML = `✦ <strong>Akun Mitra Sekolah / PAUD Aktif:</strong> Diskon otomatis ${storeState.settings.tradeDiscountPercent}% diterapkan pada seluruh katalog.`;
    } else {
      banner.innerHTML = `Halo, <strong>${escapeHtml(user.name)}</strong> · <button class="underlined-link" onclick="handleAccountButtonClick()">Pesanan Saya</button>`;
    }
  } else {
    topBtn.textContent = "Masuk / Admin";
    banner.innerHTML = `Pengelola Sekolah / PAUD atau Orang Tua? <button class="underlined-link" onclick="openAuthModal('login')">Login Akun / Mitra (-20%)</button>`;
  }
}

function renderHeaderBadges() {
  const count = sessionState.cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById("cartCountBadge");
  if (badge) badge.textContent = count;

  const wishDot = document.getElementById("wishlistDot");
  if (wishDot) {
    wishDot.style.display = sessionState.wishlist.length > 0 ? "block" : "none";
  }
}

// ============================================================================
// SECTION 2: STAGGERED 3-COLUMN FEATURED PRODUCTS (PHOTO 2)
// ============================================================================
function renderStaggeredFeatured() {
  const container = document.getElementById("staggeredFeaturedGrid");
  if (!container) return;

  // Find slot 1 (left), slot 2 (center tall), slot 3 (right) or fallback to first 3 products
  const slot1 =
    storeState.products.find((p) => Number(p.featuredSlot) === 1) || storeState.products[0];
  const slot2 =
    storeState.products.find((p) => Number(p.featuredSlot) === 2) || storeState.products[1];
  const slot3 =
    storeState.products.find((p) => Number(p.featuredSlot) === 3) || storeState.products[2];

  const trio = [
    { product: slot1, cls: "side-card" },
    { product: slot2, cls: "center-tall-card" },
    { product: slot3, cls: "side-card" }
  ].filter((x) => x.product);

  container.innerHTML = trio
    .map(({ product, cls }, idx) => {
      const effectivePrice = getEffectiveUnitPrice(product);
      const defaultFinish = (product.finishes && product.finishes[0]) || "Usia 3–5 Tahun (Pra-Sekolah)";
      const specLabel = `UNGGULAN 0${idx + 1} · ${product.category.toUpperCase()} · ${product.badge || "PILIHAN KURATOR"}`;
      return `
        <article class="staggered-card ${cls}">
          <div class="photo-labeled-wrap" onclick="openProductDetailModal('${product.id}')" style="cursor: pointer;">
            <span class="photo-spec-label">${escapeHtml(specLabel)}</span>
            <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.seoTitle || product.name)}" loading="lazy" />
          </div>
          <div class="staggered-card-caption" onclick="openProductDetailModal('${product.id}')" style="cursor: pointer;">
            <h3 class="staggered-card-title">${escapeHtml(product.name)}</h3>
            <span class="staggered-card-price">${formatPrice(effectivePrice)}</span>
          </div>
          <div style="margin-top: 8px;">
            <button
              type="button"
              class="btn-outline"
              style="width: 100%; padding: 8px 10px; font-size: 0.65rem;"
              onclick="addToCart('${product.id}', '${escapeJs(defaultFinish)}', 1)"
            >
              + Tambahkan ke Keranjang
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

// ============================================================================
// SECTION 2B: FULL INTERACTIVE ONLINE SHOP CATALOG
// ============================================================================
function setShopCategory(category) {
  sessionState.activeCategory = category;
  document.querySelectorAll("#categoryTabs .cat-tab").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.cat === category);
  });
  renderShopCatalog();
}

function focusShopSearch() {
  const el = document.getElementById("shopSearchInput");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => el.focus(), 350);
  }
}

function renderShopCatalog() {
  const grid = document.getElementById("shopProductsGrid");
  if (!grid) return;

  const query = (document.getElementById("shopSearchInput")?.value || "").trim().toLowerCase();
  const sortBy = document.getElementById("shopSortSelect")?.value || "featured";
  const cat = sessionState.activeCategory || "ALL";

  let list = storeState.products.filter((p) => {
    const matchesCat = cat === "ALL" || p.category === cat;
    const matchesQuery =
      !query ||
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      (p.description && p.description.toLowerCase().includes(query)) ||
      (p.finishes && p.finishes.some((f) => f.toLowerCase().includes(query)));
    return matchesCat && matchesQuery;
  });

  if (sortBy === "price-asc") {
    list.sort((a, b) => getEffectiveUnitPrice(a) - getEffectiveUnitPrice(b));
  } else if (sortBy === "price-desc") {
    list.sort((a, b) => getEffectiveUnitPrice(b) - getEffectiveUnitPrice(a));
  } else if (sortBy === "rating") {
    list.sort((a, b) => (b.rating || 5) - (a.rating || 5));
  } else {
    list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  if (list.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; border: 1px dashed var(--border-subtle);">
        <p class="serif-heading" style="font-size: 1.5rem; margin-bottom: 12px;">No matching architectural pieces found.</p>
        <button class="btn-outline" onclick="resetCatalogFilters()">Reset Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = list
    .map((p) => {
      const effectivePrice = getEffectiveUnitPrice(p);
      const isWishlisted = sessionState.wishlist.includes(p.id);
      const outOfStock = Number(p.stock) <= 0;
      const defaultFinish = (p.finishes && p.finishes[0]) || "Paket Standar";
      const photoSpec = `${p.category} · ${defaultFinish}`;

      return `
        <article class="product-card">
          <div class="product-media">
            ${
              outOfStock
                ? `<span class="product-badge out-of-stock">Sold Out</span>`
                : p.badge
                ? `<span class="product-badge">${escapeHtml(p.badge)}</span>`
                : ""
            }
            <span class="photo-spec-label bottom-left" style="bottom: 66px;">${escapeHtml(photoSpec)}</span>
            <button
              class="wishlist-card-btn ${isWishlisted ? "active" : ""}"
              onclick="toggleWishlistItem('${p.id}', event)"
              title="Simpan ke Wishlist"
              aria-label="Wishlist"
            >
              ${isWishlisted ? "♥" : "♡"}
            </button>

            <img
              class="main-img"
              src="${escapeHtml(p.image)}"
              alt="${escapeHtml(p.name)}"
              loading="lazy"
              onclick="openProductDetailModal('${p.id}')"
              style="cursor: pointer;"
            />
            <img
              class="hover-img"
              src="${escapeHtml(p.hoverImage || p.image)}"
              alt="${escapeHtml(p.name)} alternate view"
              loading="lazy"
              onclick="openProductDetailModal('${p.id}')"
              style="cursor: pointer;"
            />

            <div class="product-hover-actions">
              <button
                class="quick-add-btn"
                onclick="addToCart('${p.id}', '${escapeJs(defaultFinish)}', 1)"
                ${outOfStock ? "disabled style='opacity:0.5;cursor:not-allowed;'" : ""}
              >
                ${outOfStock ? "Stok Habis" : "+ Tambahkan ke Keranjang"}
              </button>
              <button class="quick-view-btn" onclick="openProductDetailModal('${p.id}')">
                Detail &amp; Safety
              </button>
            </div>
          </div>

          <div class="product-info">
            <div class="product-cat-row">
              <span>${escapeHtml(p.category)}</span>
              <span>★ ${Number(p.rating || 5).toFixed(1)} (${p.reviewCount || 12})</span>
            </div>
            <h3 class="product-title" onclick="openProductDetailModal('${p.id}')">
              ${escapeHtml(p.name)}
            </h3>
            <div class="product-price-row">
              <span>${formatPrice(effectivePrice)}</span>
              ${
                isTradeOrAdminUser()
                  ? `<span class="compare-price">${formatPrice(p.price)}</span><span class="trade-tag">Mitra -${storeState.settings.tradeDiscountPercent}%</span>`
                  : p.compareAtPrice
                  ? `<span class="compare-price">${formatPrice(p.compareAtPrice)}</span>`
                  : ""
              }
            </div>
            <p style="font-size: 0.74rem; color: var(--text-dark); line-height: 1.45; margin: 4px 0 6px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
              ${escapeHtml((p.seoDescription || p.description || "").split("\n")[0])}
            </p>
            <div style="font-size: 0.68rem; color: var(--text-bronze-dark); background: rgba(196, 158, 120, 0.12); padding: 5px 8px; border-left: 2px solid var(--text-bronze); line-height: 1.4; margin-bottom: 8px;">
              <strong>✓ ${escapeHtml(p.recommendedAge || "Aman untuk usia 3 tahun ke atas")}</strong> · Material Non-Toxic
            </div>
            <!-- Tombol CTA Tambahkan ke Keranjang -->
            <div style="margin-top: 4px;">
              <button
                type="button"
                class="btn-outline"
                style="padding: 9px 12px; font-size: 0.66rem; width: 100%;"
                onclick="addToCart('${p.id}', '${escapeJs(defaultFinish)}', 1)"
                ${outOfStock ? "disabled style='opacity:0.5;cursor:not-allowed;'" : ""}
              >
                ${outOfStock ? "Stok Habis" : "+ Tambahkan ke Keranjang"}
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function resetCatalogFilters() {
  const input = document.getElementById("shopSearchInput");
  if (input) input.value = "";
  setShopCategory("ALL");
}

// ============================================================================
// SECTION 3: FEATURED SPACES — MIDNIGHT ARCHWAY (PHOTO 3)
// ============================================================================
function renderFeaturedSpaces() {
  const container = document.getElementById("spacesEditorialContainer");
  if (!container || !storeState.spaces || storeState.spaces.length === 0) return;

  const idx = sessionState.activeSpaceIndex % storeState.spaces.length;
  const space = storeState.spaces[idx];

  container.innerHTML = `
    <!-- Left Column: Counter 03 / 04 + Small Space Photo + Location -->
    <div class="spaces-left-col">
      <div class="space-counter-wrap">
        <div class="space-counter">
          ${escapeHtml(space.number)} <small>/ ${escapeHtml(space.total)}</small>
        </div>
        <div class="counter-line"></div>
        <div class="space-switcher-btns">
          <button class="space-nav-btn" onclick="cycleFeaturedSpace(-1)" title="Previous Space" aria-label="Previous Space">←</button>
          <button class="space-nav-btn" onclick="cycleFeaturedSpace(1)" title="Next Space" aria-label="Next Space">→</button>
        </div>
      </div>

      <div class="space-left-thumb photo-labeled-wrap">
        <span class="photo-spec-label bottom-left">SUDUT EKSPLORASI · ${escapeHtml(space.title)}</span>
        <img src="${escapeHtml(space.leftThumbImage)}" alt="${escapeHtml(space.title)} overview" loading="lazy" />
      </div>

      <span class="space-location-caption">${escapeHtml(space.location)}</span>
    </div>

    <!-- Center Column: Tall Arched Photo (Photo 3 Signature Archway) -->
    <div class="spaces-center-arch">
      <div class="arch-frame photo-labeled-wrap" onclick="openSpaceModal('${space.id}')" style="cursor: pointer;">
        <span class="photo-spec-label bottom-left">RUANG UTAMA ${escapeHtml(space.number)} · ${escapeHtml(space.location)}</span>
        <img src="${escapeHtml(space.mainArchImage)}" alt="${escapeHtml(space.title)}" loading="lazy" />
      </div>
    </div>

    <!-- Right Column: Top-Right Square Detail + Title + Description + View Space -->
    <div class="spaces-right-col">
      <div class="space-right-detail-thumb photo-labeled-wrap">
        <span class="photo-spec-label bottom-left">DETAIL MODUL · ${escapeHtml(space.architect || "KUTAKKATIK.ID")}</span>
        <img src="${escapeHtml(space.rightDetailImage)}" alt="${escapeHtml(space.title)} detail" loading="lazy" />
      </div>

      <span class="micro-label" style="color: var(--accent-gold);">RUANG &amp; KELAS EKSPLORASI</span>
      <h2 class="space-title">${escapeHtml(space.title)}</h2>
      <p class="space-summary">${escapeHtml(space.summary)}</p>
      <button class="underlined-link light" onclick="openSpaceModal('${space.id}')">LIHAT DETAIL RUANG &amp; KIT</button>
    </div>
  `;
}

function cycleFeaturedSpace(direction) {
  const len = storeState.spaces.length;
  sessionState.activeSpaceIndex = (sessionState.activeSpaceIndex + direction + len) % len;
  renderFeaturedSpaces();
}

function openSpaceModal(spaceId) {
  const space = storeState.spaces.find((s) => s.id === spaceId) || storeState.spaces[0];
  const featuredProds = (space.featuredProductIds || [])
    .map((pid) => storeState.products.find((p) => p.id === pid))
    .filter(Boolean);

  const modalBody = document.getElementById("editorialModalBody");
  modalBody.innerHTML = `
    <span class="micro-label">${escapeHtml(space.location)} · ${escapeHtml(space.year || "2026")}</span>
    <h2 class="serif-heading" style="font-size: 2.3rem; color: var(--text-dark); margin: 8px 0 16px;">
      ${escapeHtml(space.title)}
    </h2>
    <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 22px;">
      Kurator Program &amp; Ruang: <strong>${escapeHtml(space.architect || "Tim Kurator KutakKatik.id")}</strong>
    </p>
    <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px; margin-bottom: 24px;">
      <img src="${escapeHtml(space.mainArchImage)}" alt="${escapeHtml(space.title)}" style="height: 320px; width: 100%; object-fit: cover;" />
      <img src="${escapeHtml(space.leftThumbImage)}" alt="${escapeHtml(space.title)}" style="height: 320px; width: 100%; object-fit: cover;" />
    </div>
    <p style="font-size: 0.92rem; line-height: 1.8; color: var(--text-dark); margin-bottom: 28px;">
      ${escapeHtml(space.story)}
    </p>
    <h4 class="micro-label" style="margin-bottom: 14px;">KIT EKSPLORASI &amp; PROGRAM YANG DIGUNAKAN</h4>
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px;">
      ${featuredProds
        .map(
          (p) => `
        <div style="border: 1px solid var(--border-subtle); padding: 12px; background: #fff; display: flex; gap: 12px; align-items: center;">
          <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" style="width: 60px; height: 68px; object-fit: cover;" />
          <div>
            <div style="font-family: var(--font-serif); font-size: 1.05rem;">${escapeHtml(p.name)}</div>
            <div style="font-size: 0.76rem; color: var(--text-bronze-dark); margin-bottom: 6px;">${formatPrice(getEffectiveUnitPrice(p))}</div>
            <button class="underlined-link" onclick="openProductDetailModal('${p.id}')">Lihat Detail Kit</button>
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  `;
  openModalById("editorialModal");
}

// ============================================================================
// SECTION 4 & 6: FOUNDERS, KONSULTASI GRATIS & JOURNAL MODALS
// ============================================================================
function openFoundersModal() {
  const modalBody = document.getElementById("editorialModalBody");
  modalBody.innerHTML = `
    <span class="micro-label">TENTANG KAMI (ABOUT US) · VISI, MISI &amp; NILAI KUTAKKATIK.ID</span>
    <h2 class="serif-heading" style="font-size: 2.15rem; color: var(--text-dark); margin: 10px 0 18px;">
      Visi Kami: Menghadirkan Mainan Edukatif Berkualitas yang Mengutamakan Tumbuh Kembang &amp; Keamanan Anak
    </h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 26px; align-items: start; margin-bottom: 22px;">
      <img
        src="https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=900&q=85"
        alt="Tim Kurator KutakKatik.id"
        style="width: 100%; height: 340px; object-fit: cover; border: 1px solid var(--border-subtle);"
      />
      <div>
        <p style="font-size: 0.88rem; line-height: 1.78; margin-bottom: 12px;">
          Lahir dari kepedulian para pendidik, terapis, dan orang tua terhadap tingginya paparan layar (<em>screen time</em>) pada anak usia dini, <strong>${escapeHtml(storeState.settings.brandName)}®</strong> didirikan dengan satu visi utama: <strong>mengembalikan keceriaan belajar anak melalui eksplorasi sensorik dan logika nyata yang aman di rumah maupun sekolah.</strong>
        </p>
        <p style="font-size: 0.88rem; line-height: 1.78; margin-bottom: 12px;">
          Kami percaya bahwa mainan terbaik bukanlah yang paling ramai suara atau lampunya, melainkan yang mampu memantik rasa ingin tahu anak, melatih <strong>motorik halus (persiapan menulis)</strong>, mengasah <strong>kognitif &amp; bahasa</strong>, serta menjadi pijakan awal <strong>problem-solving dan logika dasar (STEM)</strong>.
        </p>
        <div style="background: var(--bg-cream); border: 1px solid var(--border-subtle); border-left: 3px solid var(--text-bronze-dark); padding: 12px 16px; font-size: 0.8rem; line-height: 1.65; margin-bottom: 16px;">
          <strong style="color: var(--text-bronze-dark); display: block; margin-bottom: 4px;">3 NILAI UTAMA PENYEDIAAN MAINAN KUTAKKATIK.ID:</strong>
          <div>• <strong>100% Material Aman &amp; Non-Toxic:</strong> Menggunakan kayu solid lokal pilihan dengan <em>finishing beeswax</em> murni &amp; cat <em>water-based non-toxic</em>, plastik ABS <em>non-toxic</em>, serta sudut tumpul (<em>rounded corners</em>).</div>
          <div>• <strong>Kurasi Berbasis Tahap Usia:</strong> Setiap kit dirancang spesifik mengikuti milestone usia anak (1–3 tahun, 3–5 tahun Pra-Sekolah, dan 5–8 tahun).</div>
          <div>• <strong>Garansi Kepercayaan Orang Tua:</strong> Dilengkapi panduan pendampingan orang tua serta jaminan 100% ganti baru jika produk diterima cacat.</div>
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn-primary" onclick="openConsultationModal()">Konsultasi Gratis Pilih Kit →</button>
          <button class="btn-outline" onclick="openFaqModal()">Baca FAQ Material &amp; Pengiriman</button>
          <button class="btn-outline" onclick="openReturnPolicyModal()">Kebijakan Pengembalian</button>
        </div>
      </div>
    </div>
  `;
  openModalById("editorialModal");
}

function openFaqModal() {
  const modalBody = document.getElementById("editorialModalBody");
  modalBody.innerHTML = `
    <span class="micro-label">PUSAT INFORMASI ORANG TUA · PERTANYAAN YANG SERING DIAJUKAN (FAQ)</span>
    <h2 class="serif-heading" style="font-size: 2.1rem; color: var(--text-dark); margin: 8px 0 16px;">
      FAQ Seputar Material Produk, Pengemasan, &amp; Pengiriman
    </h2>
    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px;">
      Kami merangkum jawaban lengkap atas pertanyaan yang paling sering diajukan orang tua dan sekolah agar Anda merasa tenang dan aman saat berbelanja di <strong>KutakKatik.id®</strong>.
    </p>

    <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px;">
      <div style="background: #fff; border: 1px solid var(--border-subtle); padding: 16px 18px;">
        <h4 style="font-size: 0.9rem; color: var(--text-dark); margin-bottom: 6px;">
          1. Material Produk: Apakah bahan kayu, cat, dan plastik aman untuk anak usia dini?
        </h4>
        <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.7;">
          Ya, keamanan material adalah prioritas mutlak kami. Seluruh baki dan balok kayu menggunakan <strong>kayu solid lokal (Pinus &amp; Sungkai)</strong> yang diamplas berlapis hingga bebas serpihan (<em>splinter-free</em>) dan dilapisi <strong>beeswax alami / cat water-based non-toxic</strong> (bebas timbal, merkuri, BPA, dan ftalat). Untuk komponen peralatan sains dan kartu belajar, kami menggunakan <strong>plastik ABS non-toxic tebal</strong> serta kartu laminasi <em>food-grade</em> dengan sudut membulat (<em>rounded corners</em>).
        </p>
      </div>

      <div style="background: #fff; border: 1px solid var(--border-subtle); padding: 16px 18px;">
        <h4 style="font-size: 0.9rem; color: var(--text-dark); margin-bottom: 6px;">
          2. Pengemasan (Packaging): Bagaimana standar pengemasan agar produk kayu tidak patah/rusak di jalan?
        </h4>
        <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.7;">
          Setiap produk melewati <strong>Inspeksi Quality Control (QC) 3 Tahap</strong> sebelum dikirim. Kami mengemas setiap set di dalam boks penyimpanan eksklusif, lalu melapisinya dengan pelindung benturan berlapis (<em>honeycomb paper wrap</em> ramah lingkungan + <em>bubble wrap</em> tebal), pelindung sudut (<em>corner guard</em>) pada baki kayu, serta kardus luar berlapis ganda bersegel stiker <em>Fragile</em>. Tersedia juga opsi bungkus kado &amp; kartu ucapan gratis.
        </p>
      </div>

      <div style="background: #fff; border: 1px solid var(--border-subtle); padding: 16px 18px;">
        <h4 style="font-size: 0.9rem; color: var(--text-dark); margin-bottom: 6px;">
          3. Pengiriman (Shipping): Berapa lama pesanan dikirim &amp; ekspedisi apa yang digunakan?
        </h4>
        <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.7;">
          Pesanan <em>Ready Stock</em> yang terkonfirmasi sebelum pukul 15.00 WIB dikirim pada hari yang sama (atau maksimal 1–2 hari kerja). Kami melayani pengiriman Instan/Same-Day (area Jabodetabek &amp; Bandung), Kurir Reguler Terasuransi (2–4 hari kerja ke seluruh Indonesia), serta Kargo Sekolah. Seluruh pengiriman dilengkapi asuransi perlindungan barang.
        </p>
      </div>

      <div style="background: #fff; border: 1px solid var(--border-subtle); padding: 16px 18px;">
        <h4 style="font-size: 0.9rem; color: var(--text-dark); margin-bottom: 6px;">
          4. Perawatan &amp; Keamanan Usia: Bagaimana cara membersihkan baki kayu &amp; kartu belajar?
        </h4>
        <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.7;">
          Cukup usap permukaan kayu dan kartu menggunakan kain lembap lembut (jangan direndam air), lalu keringkan di tempat teduh. Setiap halaman produk juga mencantumkan batas usia aman (misal: <em>Aman untuk usia 3 tahun ke atas</em>) dan peringatan pendampingan orang tua bila terdapat komponen kecil.
        </p>
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
      <button type="button" class="btn-outline" onclick="openReturnPolicyModal()">Lihat Kebijakan Pengembalian (Return/Refund) →</button>
      <button type="button" class="btn-primary" onclick="closeAllOverlays()">Tutup Halaman FAQ</button>
    </div>
  `;
  openModalById("editorialModal");
}

function openReturnPolicyModal() {
  const modalBody = document.getElementById("editorialModalBody");
  modalBody.innerHTML = `
    <span class="micro-label">GARANSI PERLINDUNGAN ORANG TUA · RETURN &amp; REFUND POLICY</span>
    <h2 class="serif-heading" style="font-size: 2.1rem; color: var(--text-dark); margin: 8px 0 14px;">
      Kebijakan Pengembalian &amp; Jaminan 100% Ganti Baru Jika Barang Cacat
    </h2>
    <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.7; margin-bottom: 18px;">
      Orang tua berhak mendapatkan ketenangan penuh saat membeli mainan edukatif untuk buah hati. Oleh karena itu, <strong>KutakKatik.id®</strong> memberikan <strong>Garansi 100% Tukar Baru atau Pengembalian Dana Penuh (Full Refund)</strong> apabila produk diterima dalam kondisi cacat atau tidak sesuai.
    </p>

    <div style="background: var(--bg-cream); border: 1px solid var(--border-subtle); border-left: 4px solid var(--text-bronze-dark); padding: 18px 20px; margin-bottom: 18px; font-size: 0.82rem; line-height: 1.7;">
      <strong style="color: var(--text-bronze-dark); display: block; margin-bottom: 6px;">KONDISI YANG DIJAMIN 100% OLEH KUTAKKATIK.ID:</strong>
      <ul style="margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 4px;">
        <li>Produk kayu mengalami retak, patah, atau sudut kasar akibat cacat produksi maupun benturan ekspedisi pengiriman.</li>
        <li>Jumlah komponen, kartu belajar (<em>3-Part Cards</em>), atau bahan eksperimen di dalam boks kurang / tidak lengkap.</li>
        <li>Produk yang dikirimkan tidak sesuai dengan varian usia atau pesanan pada invoice.</li>
      </ul>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 14px; margin-bottom: 22px;">
      <div style="background: #fff; border: 1px solid var(--border-subtle); padding: 16px;">
        <span class="micro-label" style="color: var(--text-bronze-dark);">LANGKAH 01</span>
        <h4 style="font-size: 0.92rem; margin: 6px 0;">Foto / Video Bukti Kondisi</h4>
        <p style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.6;">
          Laporkan maksimal <strong>7 hari</strong> setelah paket diterima dengan mengirimkan foto/video bagian produk yang cacat atau kurang.
        </p>
      </div>
      <div style="background: #fff; border: 1px solid var(--border-subtle); padding: 16px;">
        <span class="micro-label" style="color: var(--text-bronze-dark);">LANGKAH 02</span>
        <h4 style="font-size: 0.92rem; margin: 6px 0;">Hubungi Layanan Orang Tua</h4>
        <p style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.6;">
          Kirimkan nomor pesanan ke WhatsApp <strong>0812-1881-490</strong> atau email <strong>admin@kutakkatik.id</strong>. Tim kami merespons cepat di hari yang sama.
        </p>
      </div>
      <div style="background: #fff; border: 1px solid var(--border-subtle); padding: 16px;">
        <span class="micro-label" style="color: var(--text-bronze-dark);">LANGKAH 03</span>
        <h4 style="font-size: 0.92rem; margin: 6px 0;">Ganti Baru Gratis Ongkir / Refund</h4>
        <p style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.6;">
          Unit pengganti baru dikirimkan <strong>100% Gratis Ongkir</strong> ke alamat Anda, atau dana dikembalikan 100% dalam 1×24 jam.
        </p>
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
      <button type="button" class="btn-outline" onclick="openFaqModal()">← Lihat Halaman FAQ</button>
      <div style="display: flex; gap: 10px;">
        <a href="https://wa.me/628121881490" target="_blank" rel="noopener" class="btn-outline" style="display: inline-flex; align-items: center;">Hubungi WhatsApp Garansi</a>
        <button type="button" class="btn-primary" onclick="closeAllOverlays()">Mengerti &amp; Tutup</button>
      </div>
    </div>
  `;
  openModalById("editorialModal");
}

function openConsultationModal() {
  const modalBody = document.getElementById("editorialModalBody");
  modalBody.innerHTML = `
    <span class="micro-label">PENDAMPINGAN ORANG TUA &amp; PENDIDIK</span>
    <h2 class="serif-heading" style="font-size: 2.15rem; color: var(--text-dark); margin: 6px 0 10px;">
      Konsultasi Gratis Pilih Program &amp; Kit Eksplorasi Anak
    </h2>
    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px;">
      Bingung memilih mainan edukatif, sensory kit, atau kelas yang paling pas untuk usia dan minat si kecil? Isi data singkat di bawah ini untuk mendapatkan rekomendasi kurator KutakKatik.id (Gratis).
    </p>

    <form onsubmit="submitConsultationForm(event)">
      <div class="form-grid">
        <div class="form-group">
          <label>Nama Orang Tua / Guru *</label>
          <input type="text" name="parentName" required placeholder="Contoh: Bunda Rania" value="${sessionState.currentUser ? escapeHtml(sessionState.currentUser.name) : ""}" />
        </div>
        <div class="form-group">
          <label>Nomor WhatsApp Aktif *</label>
          <input type="tel" name="whatsapp" required placeholder="+62 812 xxxx xxxx" />
        </div>
        <div class="form-group">
          <label>Kelompok Usia Anak *</label>
          <select name="ageGroup" required onchange="updateConsultationRecommendationPreview(this.value)">
            <option value="1-3">Usia 1–3 Tahun (Sensory Play &amp; Motorik Awal)</option>
            <option value="3-5" selected>Usia 3–5 Tahun (Pra-Sekolah, Imajinasi &amp; Kemandirian)</option>
            <option value="5-8">Usia 5–8 Tahun (Eksplorasi Sains, Logika &amp; Konstruksi)</option>
            <option value="sekolah">Pengadaan Sekolah / PAUD / Daycare / Terapis</option>
          </select>
        </div>
        <div class="form-group">
          <label>Fokus Tumbuh Kembang Utama *</label>
          <select name="focusGoal" required>
            <option value="Mengurangi Ketergantungan Gadget / Screen Time">Mengurangi Ketergantungan Gadget / Screen Time</option>
            <option value="Melatih Fokus, Motorik Halus & Persiapan Menulis">Melatih Fokus, Motorik Halus &amp; Persiapan Menulis</option>
            <option value="Eksplorasi Sains, Alam & Kreativitas Seni">Eksplorasi Sains, Alam &amp; Kreativitas Seni</option>
            <option value="Kurikulum Pojok Bermain Rumah / Sekolah">Kurikulum Pojok Bermain Rumah / Sekolah</option>
          </select>
        </div>
        <div class="form-group full">
          <label>Ceritakan Minat atau Tantangan Si Kecil Saat Ini (Opsional)</label>
          <textarea name="notes" rows="2" placeholder="Contoh: Anak saya usia 4 tahun cepat bosan di rumah dan sering meminta menonton YouTube..."></textarea>
        </div>
      </div>

      <div id="consultationRecBox" style="background: var(--bg-cream); border: 1px solid var(--border-subtle); padding: 14px 18px; margin: 14px 0 20px; font-size: 0.8rem;">
        <span class="micro-label" style="color: var(--text-bronze-dark);">REKOMENDASI INSTAN KURATOR KAMI:</span>
        <div style="margin-top: 6px;">
          ★ <strong>Kotak Kutak-Katik Sensory Play &amp; Motorik Lengkap</strong> + <strong>Kit Eksplorasi Sains &amp; Alam Montessori</strong>
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 12px; flex-wrap: wrap;">
        <button type="button" class="btn-outline" onclick="closeAllOverlays()">Tutup</button>
        <button type="submit" class="btn-primary">Kirim &amp; Dapatkan Rekomendasi Kurator →</button>
      </div>
    </form>
  `;
  openModalById("editorialModal");
}

function updateConsultationRecommendationPreview(ageGroup) {
  const box = document.getElementById("consultationRecBox");
  if (!box) return;
  let recText = "★ <strong>Kotak Kutak-Katik Sensory Play &amp; Motorik Lengkap</strong> + <strong>Kit Eksplorasi Sains &amp; Alam Montessori</strong>";
  if (ageGroup === "1-3") {
    recText = "★ <strong>Papan Aktivitas Busy Board Eksplorasi Mekanik</strong> + <strong>Kit Meronce, Tenun &amp; Koordinasi Motorik Halus</strong>";
  } else if (ageGroup === "5-8") {
    recText = "★ <strong>Kit Eksplorasi Sains &amp; Alam Montessori</strong> + <strong>Balok Kayu Konstruksi &amp; Geometri Natural</strong> + <strong>Kelas Eksperimen Akhir Pekan</strong>";
  } else if (ageGroup === "sekolah") {
    recText = "★ <strong>Paket Pojok Eksplorasi &amp; Pojok Baca PAUD / Sekolah</strong> (Termasuk Diskon Mitra 20% dengan kode <code>MITRA20</code>)";
  }
  box.innerHTML = `
    <span class="micro-label" style="color: var(--text-bronze-dark);">REKOMENDASI INSTAN KURATOR KAMI:</span>
    <div style="margin-top: 6px;">${recText}</div>
  `;
}

function submitConsultationForm(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const parentName = fd.get("parentName");
  const ageGroup = fd.get("ageGroup");
  const focusGoal = fd.get("focusGoal");

  closeAllOverlays();
  showToast(`Terima kasih ${parentName}! Rekomendasi Kit (${focusGoal}) telah disiapkan. Gunakan kode KUTAKKATIK10 untuk diskon 10%!`);

  if (ageGroup === "sekolah") {
    setShopCategory("Paket Sekolah");
  } else {
    setShopCategory("ALL");
  }
  const catalogEl = document.getElementById("shopCatalogSection");
  if (catalogEl) {
    catalogEl.scrollIntoView({ behavior: "smooth" });
  }
}

function renderJournal() {
  const grid = document.getElementById("journalGrid");
  if (!grid || !storeState.journalPosts) return;

  grid.innerHTML = storeState.journalPosts
    .map(
      (post, idx) => `
      <article class="journal-card" onclick="openJournalModal('${post.id}')">
        <div class="journal-img-wrap photo-labeled-wrap">
          <span class="photo-spec-label bottom-left">JURNAL 0${idx + 1} · ${escapeHtml(post.category)} (${escapeHtml(post.readTime)})</span>
          <img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}" loading="lazy" />
        </div>
        <span class="micro-label">${escapeHtml(post.category)} · ${escapeHtml(post.date)}</span>
        <h3 class="journal-title">${escapeHtml(post.title)}</h3>
        <p class="journal-excerpt">${escapeHtml(post.excerpt)}</p>
        <span class="underlined-link">${escapeHtml(post.readTime)}</span>
      </article>
    `
    )
    .join("");
}

function openJournalModal(postId) {
  const post = storeState.journalPosts.find((j) => j.id === postId);
  if (!post) return;
  const modalBody = document.getElementById("editorialModalBody");
  modalBody.innerHTML = `
    <span class="micro-label">${escapeHtml(post.category)} · ${escapeHtml(post.date)}</span>
    <h2 class="serif-heading" style="font-size: 2.1rem; color: var(--text-dark); margin: 8px 0 18px;">
      ${escapeHtml(post.title)}
    </h2>
    <img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}" style="width: 100%; height: 340px; object-fit: cover; margin-bottom: 22px;" />
    <p style="font-size: 0.92rem; line-height: 1.82; margin-bottom: 14px; color: var(--text-dark);">
      ${escapeHtml(post.excerpt)}
    </p>
    <p style="font-size: 0.88rem; line-height: 1.82; color: var(--text-muted); margin-bottom: 20px;">
      ${escapeHtml(
        post.content ||
          "Setiap program dan Kit Eksplorasi KutakKatik.id dirancang bersama kurator tumbuh kembang anak dengan material kayu solid water-based non-toxic, pengemasan tahan benturan berlapis, serta jaminan 100% tukar baru / refund jika produk diterima dalam keadaan cacat."
      )}
    </p>
    <div style="display: flex; gap: 10px; flex-wrap: wrap; padding-top: 14px; border-top: 1px solid var(--border-subtle);">
      <button type="button" class="btn-outline" onclick="openFaqModal()">Buka Halaman FAQ</button>
      <button type="button" class="btn-outline" onclick="openReturnPolicyModal()">Kebijakan Pengembalian (Return/Refund)</button>
      <button type="button" class="btn-primary" onclick="openFoundersModal()">Tentang Kami (Visi &amp; Nilai)</button>
    </div>
  `;
  openModalById("editorialModal");
}

// ============================================================================
// PRODUCT DETAIL MODAL + CUSTOMER REVIEWS
// ============================================================================
let currentDetailProductId = null;
let currentSelectedFinish = null;
let currentDetailQty = 1;

function updatePageSeoForProduct(p) {
  if (!p) return;
  const metaTitle =
    p.seoTitle ||
    `${p.name} | Mainan Edukasi Anak & Mainan Motorik Balita — KutakKatik.id`;
  const metaDesc =
    p.seoDescription ||
    `Jual ${p.name}. Mainan edukasi anak & mainan motorik balita berbahan kayu solid non-toxic untuk melatih motorik halus, kognitif, dan logika dasar STEM.`;
  const metaKeywords =
    p.seoKeywords ||
    "Mainan Edukasi Anak, Mainan Motorik Balita, Mainan Montessori Kayu, Kit Eksplorasi Anak, Sensory Play Anak";

  document.title = metaTitle;
  const descEl = document.getElementById("metaDescription");
  if (descEl) descEl.setAttribute("content", metaDesc);
  const kwEl = document.getElementById("metaKeywords");
  if (kwEl) kwEl.setAttribute("content", metaKeywords);
  const ogTitleEl = document.getElementById("ogTitle");
  if (ogTitleEl) ogTitleEl.setAttribute("content", metaTitle);
  const ogDescEl = document.getElementById("ogDescription");
  if (ogDescEl) ogDescEl.setAttribute("content", metaDesc);

  const jsonLdEl = document.getElementById("seoJsonLd");
  if (jsonLdEl) {
    const idrPrice = Math.round(Number(p.price || 18) * Number(storeState?.settings?.idrRate || 16000));
    jsonLdEl.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      description: metaDesc,
      category: p.category || "Mainan Edukasi Anak",
      keywords: metaKeywords,
      brand: { "@type": "Brand", name: "KutakKatik.id" },
      offers: {
        "@type": "Offer",
        priceCurrency: "IDR",
        price: idrPrice,
        availability: Number(p.stock) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
      }
    });
  }
}

function buyNowProduct(productId, finish, qty = 1) {
  addToCart(productId, finish, qty);
  closeAllOverlays();
  openCheckoutModal();
}

function orderProductViaWhatsApp(productId, finish, qty = 1) {
  const p = storeState.products.find((item) => item.id === productId);
  if (!p) return;
  const effectivePrice = getEffectiveUnitPrice(p);
  const totalFormatted = formatPrice(effectivePrice * qty);
  const chosenFinish = finish || (p.finishes && p.finishes[0]) || "Paket Standar";
  const text = `Halo KutakKatik.id, saya ingin memesan:\n• Produk: ${p.name}\n• Varian/Usia: ${chosenFinish}\n• Jumlah: ${qty} set\n• Estimasi Harga: ${totalFormatted}\n\nMohon info ketersediaan dan pengirimannya. Terima kasih!`;
  const waUrl = `https://wa.me/628121881490?text=${encodeURIComponent(text)}`;
  window.open(waUrl, "_blank", "noopener");
}

function openProductDetailModal(productId) {
  const p = storeState.products.find((item) => item.id === productId);
  if (!p) return;

  currentDetailProductId = p.id;
  currentSelectedFinish = (p.finishes && p.finishes[0]) || "Usia 3–5 Tahun (Pra-Sekolah)";
  currentDetailQty = 1;

  updatePageSeoForProduct(p);
  renderProductDetailModalContent();
  openModalById("productDetailModal");
}

function renderProductDetailModalContent() {
  const p = storeState.products.find((item) => item.id === currentDetailProductId);
  if (!p) return;

  const effectivePrice = getEffectiveUnitPrice(p);
  const prodReviews = (storeState.reviews || []).filter((r) => r.productId === p.id);
  const outOfStock = Number(p.stock) <= 0;
  const shortSummary =
    p.seoDescription ||
    (p.description || "").split("\n\n")[0];
  const metaTitle =
    p.seoTitle ||
    `${p.name} | Mainan Edukasi Anak & Mainan Motorik Balita — KutakKatik.id`;
  const metaDesc =
    p.seoDescription ||
    `Jual ${p.name}. Mainan edukasi anak & mainan motorik balita berbahan kayu solid non-toxic.`;

  const container = document.getElementById("productDetailBody");
  const galleryImages = [p.image, p.hoverImage].filter((url, idx, arr) => url && arr.indexOf(url) === idx);
  container.innerHTML = `
    <div class="product-detail-layout">
      <div class="product-detail-gallery photo-labeled-wrap" style="position: relative; display: flex; flex-direction: column;">
        <span class="photo-spec-label bottom-left">${escapeHtml(p.category)} · ${escapeHtml(currentSelectedFinish)}</span>
        <img src="${escapeHtml(p.image)}" alt="${escapeHtml(metaTitle)}" id="detailMainImg" style="flex: 1;" />
        ${
          galleryImages.length > 1
            ? `<div style="position: absolute; bottom: 16px; right: 16px; display: flex; gap: 8px; z-index: 5;">
                ${galleryImages
                  .map(
                    (imgUrl, i) => `
                  <button
                    type="button"
                    onclick="document.getElementById('detailMainImg').src='${escapeJs(imgUrl)}'"
                    style="width: 54px; height: 54px; padding: 0; border: 2px solid rgba(255,255,255,0.9); border-radius: 6px; overflow: hidden; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.35); background: #fff;"
                    title="Lihat Foto ${i + 1}"
                  >
                    <img src="${escapeHtml(imgUrl)}" alt="Foto ${i + 1}" style="width: 100%; height: 100%; object-fit: cover;" />
                  </button>
                `
                  )
                  .join("")}
              </div>`
            : ""
        }
      </div>

      <div class="product-detail-content">
        <span class="micro-label">${escapeHtml(p.category)} · ${p.stock > 0 ? `${p.stock} TERSEDIA DI STUDIO` : "STOK HABIS"}</span>
        <h2 class="serif-heading" style="font-size: 1.9rem; color: var(--text-dark); line-height: 1.2;">
          ${escapeHtml(p.name)}
        </h2>

        <div style="display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap;">
          <span style="font-size: 1.35rem; font-weight: 600;">${formatPrice(effectivePrice)}</span>
          ${
            isTradeOrAdminUser()
              ? `<span class="compare-price">${formatPrice(p.price)}</span><span class="trade-tag">Harga Mitra Sekolah</span>`
              : p.compareAtPrice
              ? `<span class="compare-price">${formatPrice(p.compareAtPrice)}</span>`
              : ""
          }
          <span style="font-size: 0.72rem; color: var(--text-bronze-dark); font-weight: 600;">
            ✓ ${escapeHtml(p.recommendedAge || "Aman Usia 3+ Tahun")}
          </span>
        </div>

        <!-- Ringkasan Singkat (Agar tidak menutupi tombol CTA di layar Handphone) -->
        <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.6; margin: 0;">
          ${escapeHtml(shortSummary)}
        </p>

        <!-- PILIHAN PAKET & 3 TOMBOL CTA UTAMA DI ATAS (MOBILE-FIRST ERGONOMICS) -->
        <div style="background: var(--bg-cream); border: 1px solid var(--border-subtle); padding: 14px 16px;">
          <label class="micro-label" style="display: block; margin-bottom: 6px;">
            PILIHAN PAKET &amp; KATEGORI USIA: <strong style="color: var(--text-dark);">${escapeHtml(currentSelectedFinish)}</strong>
          </label>
          <div class="swatch-list" style="margin-bottom: 12px;">
            ${(p.finishes || ["Usia 3–5 Tahun (Pra-Sekolah)"])
              .map(
                (fin) => `
              <button
                type="button"
                class="swatch-pill ${fin === currentSelectedFinish ? "active" : ""}"
                onclick="selectDetailFinish('${escapeJs(fin)}')"
              >
                ${escapeHtml(fin)}
              </button>
            `
              )
              .join("")}
          </div>

          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <div class="qty-control" style="height: 44px; display: flex; align-items: center; background: #fff;">
              <button type="button" onclick="adjustDetailQty(-1)" style="width: 36px; height: 100%;">−</button>
              <span id="detailQtyVal" style="padding: 0 12px; font-weight: 600;">${currentDetailQty}</span>
              <button type="button" onclick="adjustDetailQty(1)" style="width: 36px; height: 100%;">+</button>
            </div>

            <button
              type="button"
              class="btn-primary"
              style="flex: 1; min-width: 150px; padding: 12px 16px;"
              onclick="addToCart('${p.id}', '${escapeJs(currentSelectedFinish)}', ${currentDetailQty}); closeAllOverlays(); toggleCartDrawer(true);"
              ${outOfStock ? "disabled style='opacity:0.5;cursor:not-allowed;'" : ""}
            >
              ${outOfStock ? "Stok Habis" : `+ Tambahkan ke Keranjang — ${formatPrice(effectivePrice * currentDetailQty)}`}
            </button>
          </div>
        </div>

        <!-- 1. Deskripsi Produk Berbasis Edukasi dan Perkembangan -->
        <div style="background: #fff; border: 1px solid var(--border-subtle); padding: 14px 16px;">
          <span class="micro-label" style="color: var(--text-bronze-dark); display: block; margin-bottom: 6px;">
            1. MANFAAT EDUKASI &amp; TUMBUH KEMBANG ANAK (MOTORIK, KOGNITIF &amp; STEM)
          </span>
          <p style="font-size: 0.82rem; color: var(--text-dark); line-height: 1.68; margin-bottom: ${p.educationalBenefits && p.educationalBenefits.length ? "8px" : "0"};">
            ${escapeHtml((p.description || "").split("\n\n")[0])}
          </p>
          ${
            p.educationalBenefits && p.educationalBenefits.length
              ? `<ul style="margin: 0; padding-left: 18px; font-size: 0.77rem; color: var(--text-muted); line-height: 1.6; display: flex; flex-direction: column; gap: 4px;">
                  ${p.educationalBenefits.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}
                </ul>`
              : ""
          }
        </div>

        <!-- 2. Informasi Keamanan (Safety & Material) yang Eksplisit -->
        <div style="padding: 14px 16px; background: var(--bg-cream); border: 1px solid var(--border-subtle); border-left: 3px solid var(--text-bronze-dark); font-size: 0.77rem; line-height: 1.58;">
          <span class="micro-label" style="color: var(--text-bronze-dark); display: block; margin-bottom: 6px;">
            2. INFORMASI KEAMANAN &amp; MATERIAL (SAFETY &amp; MATERIAL)
          </span>
          <div style="display: flex; flex-direction: column; gap: 5px;">
            <div>
              <strong>• Bahan Mainan (Material):</strong>
              ${escapeHtml(
                p.safetyMaterial ||
                  "Kayu solid lokal dengan finishing beeswax alami & cat water-based non-toxic (bebas BPA, timbal & ftalat)."
              )}
            </div>
            <div>
              <strong>• Kategori Usia yang Disarankan:</strong>
              <span style="color: var(--text-bronze-dark); font-weight: 600;">
                ${escapeHtml(p.recommendedAge || "Aman untuk usia 3 tahun ke atas (3+ Tahun)")}
              </span>
            </div>
            <div>
              <strong>• Peringatan Keamanan:</strong>
              ${escapeHtml(
                p.safetyWarning ||
                  "Gunakan dengan pendampingan orang tua. Perhatikan apabila terdapat komponen kecil yang berisiko tertelan pada anak di bawah 3 tahun."
              )}
            </div>
          </div>
          <div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed var(--border-subtle); font-size: 0.72rem; color: var(--text-muted);">
            <div><strong>Pengemasan &amp; Pengiriman:</strong> ${escapeHtml(p.leadTime || "Ready Stock — Dikirim dalam 1–2 hari kerja")}</div>
            <div style="margin-top: 3px;"><strong>Garansi Kepercayaan (Return/Refund):</strong> Jaminan 100% Tukar Baru Gratis Ongkir / Refund Penuh jika produk diterima cacat.</div>
            <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 6px;">
              <button type="button" class="underlined-link" style="font-size: 0.68rem;" onclick="openFaqModal()">FAQ Pengiriman &amp; Material</button>
              <button type="button" class="underlined-link" style="font-size: 0.68rem;" onclick="openReturnPolicyModal()">Kebijakan Pengembalian (Return/Refund)</button>
              <button type="button" class="underlined-link" style="font-size: 0.68rem;" onclick="openFoundersModal()">Tentang Kami</button>
            </div>
          </div>
        </div>

        <!-- 3. Struktur SEO Konten Halaman Produk (Meta Title & Meta Description) -->
        <div style="padding: 10px 14px; background: #fff; border: 1px dashed var(--border-subtle); font-size: 0.72rem; color: var(--text-muted); line-height: 1.5;">
          <span class="micro-label" style="color: var(--text-bronze-dark); display: block; margin-bottom: 4px;">
            STRUKTUR SEO GOOGLE (META TITLE &amp; META DESCRIPTION)
          </span>
          <div><strong>Meta Title:</strong> ${escapeHtml(metaTitle)}</div>
          <div style="margin-top: 2px;"><strong>Meta Description:</strong> ${escapeHtml(metaDesc)}</div>
          <div style="margin-top: 2px;"><strong>Kata Kunci (Keywords):</strong> ${escapeHtml(p.seoKeywords || "Mainan Edukasi Anak, Mainan Motorik Balita, Mainan Montessori Kayu")}</div>
        </div>

        <!-- Reviews Section inside Product Modal -->
        <div style="margin-top: 10px; padding-top: 14px; border-top: 1px solid var(--border-subtle);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span class="micro-label">ULASAN ORANG TUA &amp; PENDIDIK (${prodReviews.length})</span>
            <span style="font-size: 0.78rem; color: var(--text-bronze-dark);">★ ${Number(p.rating || 5).toFixed(1)} / 5.0</span>
          </div>

          <div style="max-height: 130px; overflow-y: auto; margin-bottom: 12px; display: flex; flex-direction: column; gap: 8px;">
            ${
              prodReviews.length === 0
                ? `<p style="font-size: 0.76rem; color: var(--text-muted);">Belum ada ulasan. Jadilah orang tua pertama yang membagikan pengalaman tumbuh kembang si kecil.</p>`
                : prodReviews
                    .map(
                      (r) => `
                  <div style="background: #fff; padding: 9px 12px; border: 1px solid var(--border-subtle); font-size: 0.76rem;">
                    <div style="display: flex; justify-content: space-between; font-weight: 600;">
                      <span>${escapeHtml(r.author)}</span>
                      <span style="color: var(--text-bronze);">${"★".repeat(r.rating || 5)}</span>
                    </div>
                    <p style="color: var(--text-muted); margin-top: 3px;">${escapeHtml(r.comment)}</p>
                  </div>
                `
                    )
                    .join("")
            }
          </div>

          <form onsubmit="submitProductReview(event, '${p.id}')" style="display: flex; gap: 6px;">
            <input
              type="text"
              name="comment"
              placeholder="Tulis ulasan manfaat mainan ini untuk si kecil..."
              required
              style="flex: 1; padding: 8px 10px; font-size: 0.75rem; border: 1px solid var(--border-subtle); background: #fff;"
            />
            <button type="submit" class="btn-outline" style="padding: 8px 14px; font-size: 0.64rem;">Kirim</button>
          </form>
        </div>
      </div>
    </div>
  `;
}

function selectDetailFinish(finish) {
  currentSelectedFinish = finish;
  renderProductDetailModalContent();
}

function adjustDetailQty(delta) {
  const p = storeState.products.find((item) => item.id === currentDetailProductId);
  const maxStock = p ? Number(p.stock) : 99;
  currentDetailQty = Math.max(1, Math.min(maxStock, currentDetailQty + delta));
  renderProductDetailModalContent();
}

function submitProductReview(e, productId) {
  e.preventDefault();
  const comment = e.target.comment.value.trim();
  if (!comment) return;
  const author = sessionState.currentUser ? sessionState.currentUser.name : "Verified Studio Client";
  storeState.reviews.unshift({
    id: "rev-" + Date.now(),
    productId,
    author,
    rating: 5,
    date: new Date().toISOString().slice(0, 10),
    comment
  });
  const p = storeState.products.find((x) => x.id === productId);
  if (p) p.reviewCount = (p.reviewCount || 1) + 1;
  saveStoreState();
  renderProductDetailModalContent();
  renderShopCatalog();
  showToast("Thank you! Your review has been published.");
}

// ============================================================================
// SHOPPING BAG (CART) & WISHLIST LOGIC
// ============================================================================
function addToCart(productId, finish, quantity = 1) {
  const p = storeState.products.find((item) => item.id === productId);
  if (!p) return;
  if (Number(p.stock) <= 0) {
    showToast("Sorry, this piece is currently out of stock.");
    return;
  }

  const chosenFinish = finish || (p.finishes && p.finishes[0]) || "Standard Brass";
  const existing = sessionState.cart.find(
    (item) => item.productId === productId && item.finish === chosenFinish
  );

  if (existing) {
    existing.quantity = Math.min(Number(p.stock), existing.quantity + Number(quantity));
  } else {
    sessionState.cart.push({
      productId: p.id,
      finish: chosenFinish,
      quantity: Math.min(Number(p.stock), Number(quantity))
    });
  }

  saveSessionState();
  renderHeaderBadges();
  renderCartDrawer();
  showToast(`Added "${p.name}" (${chosenFinish}) to your Shopping Bag.`);
}

function updateCartItemQty(index, delta) {
  const item = sessionState.cart[index];
  if (!item) return;
  const p = storeState.products.find((x) => x.id === item.productId);
  const maxStock = p ? Number(p.stock) : 99;
  item.quantity += delta;
  if (item.quantity <= 0) {
    sessionState.cart.splice(index, 1);
  } else if (item.quantity > maxStock) {
    item.quantity = maxStock;
    showToast(`Only ${maxStock} units available in studio stock.`);
  }
  saveSessionState();
  renderHeaderBadges();
  renderCartDrawer();
}

function removeCartItem(index) {
  sessionState.cart.splice(index, 1);
  saveSessionState();
  renderHeaderBadges();
  renderCartDrawer();
}

function calculateCartTotals() {
  let subtotal = 0;
  const detailedItems = sessionState.cart
    .map((item) => {
      const p = storeState.products.find((x) => x.id === item.productId);
      if (!p) return null;
      const unitPrice = getEffectiveUnitPrice(p);
      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;
      return {
        ...item,
        product: p,
        unitPrice,
        lineTotal
      };
    })
    .filter(Boolean);

  let discount = 0;
  let activeVoucherObj = null;
  if (sessionState.appliedVoucher) {
    activeVoucherObj = storeState.vouchers.find(
      (v) => v.code.toUpperCase() === sessionState.appliedVoucher.toUpperCase() && v.active
    );
    if (activeVoucherObj) {
      discount = Math.round(subtotal * (Number(activeVoucherObj.discountPercent) / 100));
    } else {
      sessionState.appliedVoucher = null;
    }
  }

  const afterDiscount = Math.max(0, subtotal - discount);
  const freeThreshold = Number(storeState.settings.freeShippingThreshold || 1200);
  const shippingCost = afterDiscount === 0 || afterDiscount >= freeThreshold ? 0 : 45;
  const total = afterDiscount + shippingCost;

  return {
    detailedItems,
    subtotal,
    discount,
    activeVoucherObj,
    shippingCost,
    total
  };
}

function applyVoucherCode(e) {
  e.preventDefault();
  const input = document.getElementById("voucherInput");
  const code = (input?.value || "").trim().toUpperCase();
  if (!code) return;

  const found = storeState.vouchers.find((v) => v.code.toUpperCase() === code && v.active);
  if (!found) {
    showToast("Invalid or expired voucher code. Try WELCOME10 or KUTAKKATIK.");
    return;
  }

  sessionState.appliedVoucher = found.code;
  saveSessionState();
  renderCartDrawer();
  showToast(`Voucher ${found.code} (${found.discountPercent}% OFF) applied!`);
}

function removeVoucherCode() {
  sessionState.appliedVoucher = null;
  saveSessionState();
  renderCartDrawer();
}

function renderCartDrawer() {
  const body = document.getElementById("cartDrawerBody");
  const footer = document.getElementById("cartDrawerFooter");
  if (!body || !footer) return;

  const { detailedItems, subtotal, discount, activeVoucherObj, shippingCost, total } =
    calculateCartTotals();

  if (detailedItems.length === 0) {
    body.innerHTML = `
      <div style="text-align: center; padding: 64px 16px;">
        <p class="serif-heading" style="font-size: 1.5rem; margin-bottom: 10px;">Your Shopping Bag is Empty</p>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 24px;">
          Explore our architectural pendants, stone offcut sconces, and handcrafted objects.
        </p>
        <button class="btn-outline" onclick="toggleCartDrawer(false)">Explore Collection</button>
      </div>
    `;
    footer.innerHTML = "";
    return;
  }

  body.innerHTML = detailedItems
    .map(
      (item, idx) => `
      <div class="cart-item">
        <img src="${escapeHtml(item.product.image)}" alt="${escapeHtml(item.product.name)}" />
        <div>
          <div class="cart-item-title">${escapeHtml(item.product.name)}</div>
          <div class="cart-item-meta">Finish: ${escapeHtml(item.finish)}</div>
          <div class="qty-control">
            <button onclick="updateCartItemQty(${idx}, -1)">−</button>
            <span>${item.quantity}</span>
            <button onclick="updateCartItemQty(${idx}, 1)">+</button>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: 600; font-size: 0.86rem; margin-bottom: 10px;">
            ${formatPrice(item.lineTotal)}
          </div>
          <button
            onclick="removeCartItem(${idx})"
            style="font-size: 0.68rem; color: var(--text-muted); text-decoration: underline;"
          >
            Remove
          </button>
        </div>
      </div>
    `
    )
    .join("");

  footer.innerHTML = `
    <form class="voucher-box" onsubmit="applyVoucherCode(event)">
      <input
        type="text"
        id="voucherInput"
        placeholder="Promo code (e.g. WELCOME10)"
        value="${activeVoucherObj ? escapeHtml(activeVoucherObj.code) : ""}"
      />
      <button type="submit" class="btn-outline" style="padding: 9px 14px;">Apply</button>
    </form>
    ${
      activeVoucherObj
        ? `<div style="font-size: 0.72rem; color: var(--text-bronze-dark); margin-bottom: 10px; display: flex; justify-content: space-between;">
            <span>Voucher <strong>${escapeHtml(activeVoucherObj.code)}</strong> (-${activeVoucherObj.discountPercent}%)</span>
            <button onclick="removeVoucherCode()" style="text-decoration: underline;">Remove</button>
          </div>`
        : ""
    }
    <div class="summary-line">
      <span>Subtotal</span>
      <span>${formatPrice(subtotal)}</span>
    </div>
    ${
      discount > 0
        ? `<div class="summary-line" style="color: var(--accent-terracotta);">
            <span>Promo Discount</span>
            <span>−${formatPrice(discount)}</span>
          </div>`
        : ""
    }
    <div class="summary-line">
      <span>Insured Architectural Courier</span>
      <span>${shippingCost === 0 ? "COMPLIMENTARY" : formatPrice(shippingCost)}</span>
    </div>
    <div class="summary-line total">
      <span>Total</span>
      <span>${formatPrice(total)}</span>
    </div>
    <button class="btn-primary" style="width: 100%; margin-top: 14px;" onclick="openCheckoutModal()">
      Proceed to Checkout →
    </button>
  `;
}

// Wishlist Drawer
function toggleWishlistItem(productId, event) {
  if (event) event.stopPropagation();
  const idx = sessionState.wishlist.indexOf(productId);
  if (idx >= 0) {
    sessionState.wishlist.splice(idx, 1);
    showToast("Removed from your Saved Specification List.");
  } else {
    sessionState.wishlist.push(productId);
    showToast("Saved to your Specification Wishlist.");
  }
  saveSessionState();
  renderHeaderBadges();
  renderShopCatalog();
  renderWishlistDrawer();
}

function renderWishlistDrawer() {
  const body = document.getElementById("wishlistDrawerBody");
  if (!body) return;

  const items = sessionState.wishlist
    .map((id) => storeState.products.find((p) => p.id === id))
    .filter(Boolean);

  if (items.length === 0) {
    body.innerHTML = `
      <div style="text-align: center; padding: 60px 16px;">
        <p class="serif-heading" style="font-size: 1.4rem; margin-bottom: 8px;">No Saved Luminaires Yet</p>
        <p style="font-size: 0.78rem; color: var(--text-muted);">Click the heart icon on any piece to curate your project specification list.</p>
      </div>
    `;
    return;
  }

  body.innerHTML = items
    .map((p) => {
      const finish = (p.finishes && p.finishes[0]) || "Standard Finish";
      return `
        <div class="cart-item">
          <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" />
          <div>
            <div class="cart-item-title">${escapeHtml(p.name)}</div>
            <div class="cart-item-meta">${formatPrice(getEffectiveUnitPrice(p))}</div>
            <button
              class="underlined-link"
              onclick="addToCart('${p.id}', '${escapeJs(finish)}', 1); toggleWishlistDrawer(false); toggleCartDrawer(true);"
            >
              + Move to Bag
            </button>
          </div>
          <button onclick="toggleWishlistItem('${p.id}')" title="Remove">✕</button>
        </div>
      `;
    })
    .join("");
}

// ============================================================================
// MULTI-STEP CHECKOUT & PRINTABLE ORDER RECEIPT
// ============================================================================
function openCheckoutModal() {
  const { detailedItems, subtotal, discount, shippingCost, total } = calculateCartTotals();
  if (detailedItems.length === 0) {
    showToast("Your bag is empty.");
    return;
  }

  toggleCartDrawer(false);
  const user = sessionState.currentUser;

  const body = document.getElementById("checkoutModalBody");
  body.innerHTML = `
    <span class="micro-label">SECURE STUDIO CHECKOUT</span>
    <h2 class="serif-heading" style="font-size: 2rem; color: var(--text-dark); margin: 4px 0 22px;">
      Shipping &amp; Specification Order
    </h2>

    <form onsubmit="submitOrderCheckout(event)">
      <div class="form-grid">
        <div class="form-group">
          <label>Full Name / Recipient *</label>
          <input type="text" name="customerName" required value="${user ? escapeHtml(user.name) : ""}" placeholder="e.g. Elena Vance" />
        </div>
        <div class="form-group">
          <label>Email Address *</label>
          <input type="email" name="customerEmail" required value="${user ? escapeHtml(user.email) : ""}" placeholder="client@studio.com" />
        </div>
        <div class="form-group">
          <label>Phone / WhatsApp *</label>
          <input type="tel" name="customerPhone" required placeholder="+62 812 0000 0000" />
        </div>
        <div class="form-group">
          <label>Company / Project Name (Optional)</label>
          <input type="text" name="company" value="${user?.company ? escapeHtml(user.company) : ""}" placeholder="Residence / Architecture Firm" />
        </div>
        <div class="form-group full">
          <label>Full Delivery Address *</label>
          <textarea name="shippingAddress" rows="2" required placeholder="Street address, building/villa, city, postal code"></textarea>
        </div>
        <div class="form-group">
          <label>Delivery Method *</label>
          <select name="shippingMethod" required>
            <option value="Standard Insured Courier">Standard Insured Architectural Courier (${shippingCost === 0 ? "Free" : formatPrice(shippingCost)})</option>
            <option value="White-Glove Architectural Delivery">White-Glove Architectural Delivery &amp; Placement</option>
            <option value="Studio Showroom Pickup">Studio Showroom Pickup (Christchurch / Melbourne / Jakarta)</option>
          </select>
        </div>
        <div class="form-group">
          <label>Payment Method *</label>
          <select name="paymentMethod" required>
            <option value="QRIS (Statis / Dinamis)">QRIS (Scan QRIS Statis / Dinamis — GoPay, OVO, BCA, Mandiri)</option>
            <option value="Bank Transfer / Virtual Account">Bank Transfer Manual (BCA / Mandiri + Upload Bukti)</option>
            <option value="Credit Card (Visa / Mastercard / Amex)">Credit Card (Visa / Mastercard / Amex)</option>
            <option value="Trade Specifier Net-30 Invoice">Trade Specifier Net-30 Proforma Invoice</option>
          </select>
        </div>
      </div>

      <div style="background: var(--bg-cream); border: 1px solid var(--border-subtle); padding: 18px 20px; margin: 18px 0;">
        <div class="micro-label" style="margin-bottom: 10px;">ORDER SUMMARY (${detailedItems.length} ITEMS)</div>
        ${detailedItems
          .map(
            (i) => `
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 6px;">
            <span>${i.quantity}× ${escapeHtml(i.product.name)} <em>(${escapeHtml(i.finish)})</em></span>
            <span>${formatPrice(i.lineTotal)}</span>
          </div>
        `
          )
          .join("")}
        <div class="summary-line total" style="margin-top: 12px;">
          <span>Total Due</span>
          <span>${formatPrice(total)}</span>
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 12px;">
        <button type="button" class="btn-outline" onclick="closeAllOverlays()">Cancel</button>
        <button type="submit" class="btn-primary">Lanjut ke Pembayaran QRIS / Transfer (${formatPrice(total)}) →</button>
      </div>
    </form>
  `;

  openModalById("checkoutModal");
}

function submitOrderCheckout(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const { detailedItems, subtotal, discount, activeVoucherObj, shippingCost, total } =
    calculateCartTotals();

  const orderId = "NW-2026-" + Math.floor(1000 + Math.random() * 9000);
  const newOrder = {
    id: orderId,
    createdAt: new Date().toISOString(),
    customerName: fd.get("customerName"),
    customerEmail: fd.get("customerEmail"),
    customerPhone: fd.get("customerPhone"),
    shippingAddress: fd.get("shippingAddress"),
    shippingMethod: fd.get("shippingMethod"),
    paymentMethod: fd.get("paymentMethod"),
    status: "Pending",
    paymentStatus: "Unpaid",
    paymentProofUrl: null,
    paymentSenderName: fd.get("customerName"),
    paymentSenderBank: "",
    paymentNotes: "",
    voucherCode: activeVoucherObj ? activeVoucherObj.code : null,
    subtotal,
    discount,
    shippingCost,
    total,
    items: detailedItems.map((i) => ({
      productId: i.product.id,
      name: i.product.name,
      finish: i.finish,
      price: i.unitPrice,
      quantity: i.quantity,
      image: i.product.image
    }))
  };

  // Deduct product stock
  detailedItems.forEach((item) => {
    const prod = storeState.products.find((p) => p.id === item.product.id);
    if (prod) {
      prod.stock = Math.max(0, Number(prod.stock) - Number(item.quantity));
    }
  });

  storeState.orders.unshift(newOrder);
  sessionState.cart = [];
  sessionState.appliedVoucher = null;
  saveStoreState();
  saveSessionState();
  renderAll();

  renderOrderPaymentAndProofView(newOrder.id);
  showToast(`Order ${newOrder.id} dibuat! Silakan scan QRIS & upload bukti pembayaran.`);
}

// ============================================================================
// QRIS DYNAMIC / STATIC GENERATOR + BUKTI TRANSFER UPLOAD WORKFLOW
// ============================================================================
function crc16Ccitt(str) {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function buildQrisPayload(order) {
  const s = storeState.settings;
  const isDynamic = (s.qrisMode || "dynamic") === "dynamic";
  const rate = Number(s.idrRate || 16000);
  const amountIdr = String(Math.round(Number(order.total || 0) * rate));
  const merchantName = (s.qrisMerchantName || "KUTAK KATIK STUDIO").slice(0, 25);
  const merchantCity = (s.qrisMerchantCity || "JAKARTA").slice(0, 15);
  const nmid = s.qrisNmid || "ID1026000889901";

  const tag = (id, val) => `${id}${String(val.length).padStart(2, "0")}${val}`;
  let payload =
    tag("00", "01") +
    tag("01", isDynamic ? "12" : "11") +
    tag("26", tag("00", "ID.CO.QRIS.WWW") + tag("01", nmid) + tag("03", "UMI")) +
    tag("52", "5732") +
    tag("53", "360") +
    (isDynamic ? tag("54", amountIdr) : "") +
    tag("58", "ID") +
    tag("59", merchantName) +
    tag("60", merchantCity) +
    tag("62", tag("01", order.id)) +
    "6304";

  return payload + crc16Ccitt(payload);
}

function generateDeterministicQrSvg(dataString) {
  const size = 29;
  const grid = Array.from({ length: size }, () => Array(size).fill(false));
  const reserved = Array.from({ length: size }, () => Array(size).fill(false));

  function placeFinder(r0, c0) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = r0 + r;
        const cc = c0 + c;
        if (rr >= 0 && rr < size && cc >= 0 && cc < size) {
          reserved[rr][cc] = true;
          const inOuter = r >= 0 && r <= 6 && c >= 0 && c <= 6 && (r === 0 || r === 6 || c === 0 || c === 6);
          const inInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          grid[rr][cc] = inOuter || inInner;
        }
      }
    }
  }

  placeFinder(0, 0);
  placeFinder(0, size - 7);
  placeFinder(size - 7, 0);

  // Alignment pattern
  const ar = size - 9;
  const ac = size - 9;
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      reserved[ar + r][ac + c] = true;
      grid[ar + r][ac + c] = Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0);
    }
  }

  // Timing lines
  for (let i = 8; i < size - 8; i++) {
    reserved[6][i] = true;
    reserved[i][6] = true;
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }

  // Hash payload bytes into remaining modules
  let seed = 2166136261;
  for (let i = 0; i < dataString.length; i++) {
    seed ^= dataString.charCodeAt(i);
    seed = Math.imul(seed, 16777619) >>> 0;
  }

  let idx = 0;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!reserved[r][c]) {
        const charCode = dataString.charCodeAt(idx % dataString.length);
        const mix = ((seed >>> (idx % 16)) ^ (charCode * (r + 1) * (c + 3))) & 3;
        grid[r][c] = mix === 0 || mix === 2;
        idx++;
      }
    }
  }

  let rects = "";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c]) {
        rects += `<rect x="${c}" y="${r}" width="1" height="1" fill="#101C24"/>`;
      }
    }
  }

  return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">${rects}</svg>`;
}

function getPaymentStatusBadgeClass(paymentStatus) {
  if (paymentStatus === "Verified") return "Verified";
  if (paymentStatus === "Waiting Verification") return "Waiting";
  if (paymentStatus === "Rejected") return "Rejected";
  return "Unpaid";
}

function renderOrderPaymentAndProofView(orderId) {
  const order = storeState.orders.find((o) => o.id === orderId);
  if (!order) return;

  const s = storeState.settings;
  const isDynamic = (s.qrisMode || "dynamic") === "dynamic";
  const qrisPayload = buildQrisPayload(order);
  const amountIdr = Math.round(Number(order.total || 0) * Number(s.idrRate || 16000));
  const body = document.getElementById("checkoutModalBody");

  body.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; padding-bottom: 16px; border-bottom: 1px solid var(--border-subtle);">
      <div>
        <span class="micro-label">PEMBAYARAN QRIS &amp; VERIFIKASI BUKTI TRANSFER</span>
        <h2 class="serif-heading" style="font-size: 2rem; color: var(--text-dark); margin-top: 4px;">
          Order #${escapeHtml(order.id)}
        </h2>
      </div>
      <div style="text-align: right;">
        <span class="status-pill ${getPaymentStatusBadgeClass(order.paymentStatus)}">
          Payment: ${escapeHtml(order.paymentStatus || "Unpaid")}
        </span>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">
          Order Status: <strong>${escapeHtml(order.status)}</strong>
        </div>
      </div>
    </div>

    <div class="qris-payment-grid">
      <!-- Left: QRIS Statis / Dinamis Visual Card -->
      <div class="qris-frame-card">
        <div class="qris-header-bar">
          <span class="qris-badge-logo">QRIS</span>
          <span class="qris-gpn-tag">${isDynamic ? "DINAMIS" : "STATIS"} · GPN</span>
        </div>
        <div style="font-weight: 700; font-size: 0.82rem; color: var(--text-dark);">
          ${escapeHtml(s.qrisMerchantName || "KUTAK KATIK STUDIO")}
        </div>
        <div style="font-size: 0.66rem; color: var(--text-muted); margin-bottom: 6px;">
          NMID: ${escapeHtml(s.qrisNmid || "ID1026000889901")}
        </div>

        <div class="qris-svg-box">
          ${
            s.qrisCustomImage && !isDynamic
              ? `<img src="${escapeHtml(s.qrisCustomImage)}" alt="QRIS Statis Toko" />`
              : generateDeterministicQrSvg(qrisPayload)
          }
        </div>

        <div style="background: var(--bg-cream); padding: 8px 10px; margin-top: 8px; font-size: 0.76rem;">
          <div style="color: var(--text-muted); font-size: 0.66rem;">NOMINAL TAGIHAN</div>
          <strong style="font-size: 0.96rem; color: var(--text-dark);">
            Rp ${amountIdr.toLocaleString("id-ID")}
          </strong>
          <div style="font-size: 0.68rem; color: var(--text-bronze-dark);">(${formatPrice(order.total)})</div>
        </div>

        <div style="margin-top: 8px; font-size: 0.64rem; color: var(--text-muted); word-break: break-all; text-align: left; background: #f8f6f3; padding: 6px; border: 1px solid var(--border-subtle);">
          <strong>EMVCo Payload:</strong> ${escapeHtml(qrisPayload.slice(0, 44))}...${escapeHtml(qrisPayload.slice(-8))}
        </div>
      </div>

      <!-- Right: Rekening Bank + Form Upload Bukti Transfer -->
      <div class="proof-upload-card">
        <div style="background: var(--bg-cream); border: 1px solid var(--border-subtle); padding: 12px 14px; margin-bottom: 16px; font-size: 0.78rem;">
          <div class="micro-label" style="margin-bottom: 4px;">REKENING TRANSFER BANK / VIRTUAL ACCOUNT</div>
          <div style="font-weight: 600; color: var(--text-dark);">
            ${escapeHtml(s.bankAccounts || "BCA 8820-9910-22 a/n Kutak Katik Studio")}
          </div>
        </div>

        ${
          order.paymentProofUrl
            ? `
          <div style="background: #f2f9f4; border: 1px solid #c3e6cb; padding: 14px; margin-bottom: 16px; font-size: 0.8rem;">
            <strong style="color: #155724;">✓ Bukti Pembayaran Telah Diunggah</strong>
            <div style="color: var(--text-muted); margin: 4px 0 10px;">
              Pengirim: <strong>${escapeHtml(order.paymentSenderName || "-")}</strong> (${escapeHtml(order.paymentSenderBank || "-")})<br/>
              Status Verifikasi Admin: <strong>${escapeHtml(order.paymentStatus)}</strong>
            </div>
            <img src="${escapeHtml(order.paymentProofUrl)}" alt="Bukti Transfer" style="max-height: 150px; border: 1px solid var(--border-subtle); margin-bottom: 6px;" />
          </div>
        `
            : ""
        }

        <h4 class="serif-heading" style="font-size: 1.35rem; color: var(--text-dark); margin-bottom: 10px;">
          ${order.paymentProofUrl ? "Perbarui / Upload Ulang Bukti Transfer" : "Upload Bukti Pembayaran (QRIS / Transfer)"}
        </h4>

        <form onsubmit="submitPaymentProofUpload(event, '${escapeJs(order.id)}')">
          <div class="form-grid">
            <div class="form-group">
              <label>Nama Pengirim Rekening / E-Wallet *</label>
              <input
                type="text"
                name="senderName"
                required
                value="${escapeHtml(order.paymentSenderName || order.customerName)}"
                placeholder="Nama sesuai mutasi"
              />
            </div>
            <div class="form-group">
              <label>Bank / Aplikasi QRIS *</label>
              <input
                type="text"
                name="senderBank"
                required
                value="${escapeHtml(order.paymentSenderBank || "BCA / QRIS GoPay")}"
                placeholder="BCA / Mandiri / GoPay / OVO"
              />
            </div>
            <div class="form-group full">
              <label>Pilih Foto / Screenshot Bukti Transfer (JPG, PNG, WebP) *</label>
              <input type="file" name="proofFile" id="proofFileInput" accept="image/*" required />
            </div>
            <div class="form-group full">
              <label>Catatan Referensi (Opsional)</label>
              <input
                type="text"
                name="notes"
                value="${escapeHtml(order.paymentNotes || "")}"
                placeholder="Misal: Lunas sesuai tagihan Order ${escapeHtml(order.id)}"
              />
            </div>
          </div>

          <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;">
            <button type="submit" class="btn-primary" id="uploadProofSubmitBtn">
              ↑ Upload Bukti Pembayaran
            </button>
            <button type="button" class="btn-outline" onclick="window.print()">
              Cetak Invoice
            </button>
            <button type="button" class="btn-outline" onclick="closeAllOverlays()">
              Selesai
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  openModalById("checkoutModal");
}

function compressImageFileToDataUrl(file, maxDim = 960, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = ev.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function submitPaymentProofUpload(e, orderId) {
  e.preventDefault();
  const order = storeState.orders.find((o) => o.id === orderId);
  if (!order) return;

  const fd = new FormData(e.target);
  const fileInput = document.getElementById("proofFileInput");
  const file = fileInput?.files?.[0];
  if (!file) {
    showToast("Pilih file foto bukti transfer terlebih dahulu.");
    return;
  }

  const btn = document.getElementById("uploadProofSubmitBtn");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Mengunggah...";
  }

  try {
    const dataUrl = await compressImageFileToDataUrl(file);
    let finalProofUrl = dataUrl;

    // Upload to Node server /uploads if available
    if (window.location.protocol.startsWith("http")) {
      try {
        const res = await fetch("/api/upload-proof", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: order.id, imageDataUrl: dataUrl })
        });
        if (res.ok) {
          const out = await res.json();
          if (out.proofUrl) finalProofUrl = out.proofUrl;
        }
      } catch (_) {}
    }

    order.paymentProofUrl = finalProofUrl;
    order.paymentSenderName = fd.get("senderName").trim();
    order.paymentSenderBank = fd.get("senderBank").trim();
    order.paymentNotes = fd.get("notes").trim();
    order.paymentUploadedAt = new Date().toISOString();
    order.paymentStatus = "Waiting Verification";

    saveStoreState();
    renderAll();
    renderOrderPaymentAndProofView(order.id);
    showToast("Bukti pembayaran berhasil diunggah! Menunggu verifikasi Admin.");
  } catch (err) {
    showToast("Gagal memproses gambar bukti transfer.");
  }
}

// ============================================================================
// ORDER TRACKER MODAL
// ============================================================================
function openOrderTrackerModal(prefillId = "") {
  const body = document.getElementById("orderTrackerBody");
  const sampleIds = storeState.orders.slice(0, 2).map((o) => o.id);

  body.innerHTML = `
    <span class="micro-label">CLIENT CONCIERGE &amp; KONFIRMASI PEMBAYARAN</span>
    <h2 class="serif-heading" style="font-size: 1.9rem; color: var(--text-dark); margin: 6px 0 14px;">
      Track Order &amp; Upload Bukti
    </h2>
    <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 16px;">
      Masukkan Order ID (contoh: <strong>${sampleIds.join("</strong> atau <strong>")}</strong>) atau alamat email Anda.
    </p>
    <form onsubmit="lookupOrderStatus(event)" style="display: flex; gap: 8px; margin-bottom: 20px;">
      <input
        type="text"
        id="trackerQueryInput"
        value="${escapeHtml(prefillId)}"
        placeholder="NW-2026-8402 atau email..."
        required
        style="flex: 1; padding: 11px 13px; border: 1px solid var(--border-subtle); background: #fff;"
      />
      <button type="submit" class="btn-primary" style="padding: 11px 20px;">Search</button>
    </form>
    <div id="trackerResultArea"></div>
  `;

  openModalById("orderTrackerModal");
  if (prefillId) {
    lookupOrderStatus(new Event("submit"));
  }
}

function lookupOrderStatus(e) {
  if (e && e.preventDefault) e.preventDefault();
  const q = (document.getElementById("trackerQueryInput")?.value || "").trim().toLowerCase();
  const resArea = document.getElementById("trackerResultArea");
  if (!q || !resArea) return;

  const matches = storeState.orders.filter(
    (o) => o.id.toLowerCase() === q || (o.customerEmail && o.customerEmail.toLowerCase() === q)
  );

  if (matches.length === 0) {
    resArea.innerHTML = `<p style="font-size: 0.82rem; color: var(--accent-terracotta);">No order found matching "${escapeHtml(q)}".</p>`;
    return;
  }

  resArea.innerHTML = matches
    .map(
      (o) => `
      <div style="background: #fff; border: 1px solid var(--border-subtle); padding: 16px; margin-bottom: 12px; font-size: 0.8rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <strong style="font-size: 0.92rem;">${escapeHtml(o.id)}</strong>
          <div style="display: flex; gap: 6px;">
            <span class="status-pill ${getPaymentStatusBadgeClass(o.paymentStatus)}">
              ${escapeHtml(o.paymentStatus || "Unpaid")}
            </span>
            <span class="status-pill ${escapeHtml(o.status)}">${escapeHtml(o.status)}</span>
          </div>
        </div>
        <div style="color: var(--text-muted); margin-bottom: 8px;">
          Client: ${escapeHtml(o.customerName)} · ${new Date(o.createdAt).toLocaleDateString()}<br/>
          Metode: ${escapeHtml(o.paymentMethod)}
        </div>
        <div style="border-top: 1px solid var(--border-subtle); padding-top: 8px;">
          ${o.items.map((i) => `<div>• ${i.quantity}× ${escapeHtml(i.name)} (${escapeHtml(i.finish)})</div>`).join("")}
        </div>
        <div style="margin-top: 10px; display: flex; justify-content: space-between; align-items: center;">
          <button class="underlined-link" onclick="renderOrderPaymentAndProofView('${escapeJs(o.id)}')">
            ${o.paymentProofUrl ? "Lihat QRIS / Bukti Transfer" : "Scan QRIS / Upload Bukti Transfer →"}
          </button>
          <strong>Total: ${formatPrice(o.total)}</strong>
        </div>
      </div>
    `
    )
    .join("");
}

// ============================================================================
// AUTHENTICATION MODAL (CUSTOMER, TRADE SPECIFIER, ADMIN)
// ============================================================================
function handleAccountButtonClick() {
  if (sessionState.currentUser) {
    openAccountProfileModal();
  } else {
    openAuthModal("login");
  }
}

function openAdminOrLogin() {
  if (sessionState.currentUser && sessionState.currentUser.role === "admin") {
    openAdminDashboard();
  } else {
    openAuthModal("login", true);
  }
}

function openAuthModal(mode = "login", highlightAdmin = false) {
  const body = document.getElementById("authModalBody");

  if (mode === "register" || mode === "register-trade") {
    const isTrade = mode === "register-trade";
    body.innerHTML = `
      <span class="micro-label">${isTrade ? "TRADE & ARCHITECT APPLICATION" : "CLIENT REGISTRATION"}</span>
      <h2 class="serif-heading" style="font-size: 1.9rem; color: var(--text-dark); margin: 6px 0 18px;">
        ${isTrade ? "Apply for a Trade Account" : "Create Your Studio Account"}
      </h2>
      <form onsubmit="handleRegisterSubmit(event)">
        <input type="hidden" name="role" value="${isTrade ? "trade" : "customer"}" />
        <div class="form-group">
          <label>Full Name *</label>
          <input type="text" name="name" required placeholder="Your full name" />
        </div>
        <div class="form-group">
          <label>Email Address *</label>
          <input type="email" name="email" required placeholder="name@studio.com" />
        </div>
        <div class="form-group">
          <label>Architecture / Design Practice ${isTrade ? "*" : "(Optional)"}</label>
          <input type="text" name="company" ${isTrade ? "required" : ""} placeholder="Studio or Practice Name" />
        </div>
        <div class="form-group">
          <label>Password *</label>
          <input type="password" name="password" required placeholder="Create password" />
        </div>
        <button type="submit" class="btn-primary" style="width: 100%; margin-top: 8px;">
          ${isTrade ? "Activate Trade Specifier Account (-20%)" : "Create Account"}
        </button>
      </form>
      <div style="margin-top: 18px; text-align: center; font-size: 0.78rem;">
        Already have an account? <button class="underlined-link" onclick="openAuthModal('login')">Sign In</button>
      </div>
    `;
  } else {
    body.innerHTML = `
      <span class="micro-label">STUDIO ACCESS PORTAL</span>
      <h2 class="serif-heading" style="font-size: 1.95rem; color: var(--text-dark); margin: 6px 0 14px;">
        Sign In to ${escapeHtml(storeState.settings.brandName)}®
      </h2>

      <form onsubmit="handleLoginSubmit(event)">
        <div class="form-group">
          <label>Email or Username *</label>
          <input
            type="text"
            id="loginIdentifier"
            name="identifier"
            required
            value="${highlightAdmin ? "admin@kutakkatik.com" : ""}"
            placeholder="admin@kutakkatik.com or admin"
          />
        </div>
        <div class="form-group">
          <label>Password *</label>
          <input
            type="password"
            id="loginPassword"
            name="password"
            required
            value="${highlightAdmin ? "admin123" : ""}"
            placeholder="••••••••"
          />
        </div>
        <button type="submit" class="btn-primary" style="width: 100%; margin-top: 6px;">
          Sign In
        </button>
      </form>

      <!-- 1-Click Demo Credentials Box for Instant Testing -->
      <div class="demo-credentials-card">
        <div class="micro-label" style="color: var(--text-dark); margin-bottom: 4px;">
          INSTANT DEMO ACCOUNTS (1-CLICK LOGIN)
        </div>
        <div style="font-size: 0.73rem; color: var(--text-muted);">
          • <strong>Admin:</strong> <code>admin@kutakkatik.com</code> / <code>admin123</code><br/>
          • <strong>Trade Architect (-20%):</strong> <code>trade@kutakkatik.com</code> / <code>trade123</code><br/>
          • <strong>Customer:</strong> <code>customer@kutakkatik.com</code> / <code>user123</code>
        </div>
        <div class="demo-quick-btns">
          <button type="button" onclick="quickDemoLogin('admin@kutakkatik.com', 'admin123')">
            ★ Login as Admin
          </button>
          <button type="button" onclick="quickDemoLogin('trade@kutakkatik.com', 'trade123')">
            Login as Trade
          </button>
          <button type="button" onclick="quickDemoLogin('customer@kutakkatik.com', 'user123')">
            Login as Customer
          </button>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; margin-top: 14px; font-size: 0.76rem;">
        <button class="underlined-link" onclick="openAuthModal('register')">Create Client Account</button>
        <button class="underlined-link" onclick="openAuthModal('register-trade')">Apply for Trade Account</button>
      </div>
    `;
  }

  openModalById("authModal");
}

function handleLoginSubmit(e) {
  e.preventDefault();
  const id = e.target.identifier.value.trim().toLowerCase();
  const pw = e.target.password.value;
  performLogin(id, pw);
}

function quickDemoLogin(identifier, password) {
  performLogin(identifier.toLowerCase(), password);
}

function performLogin(identifier, password) {
  const user = storeState.users.find(
    (u) =>
      (u.email.toLowerCase() === identifier || (u.username && u.username.toLowerCase() === identifier)) &&
      u.password === password
  );

  if (!user) {
    showToast("Invalid credentials. Try the 1-Click Demo Admin Login button below.");
    return;
  }

  sessionState.currentUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    company: user.company
  };
  saveSessionState();
  closeAllOverlays();
  renderAll();

  if (user.role === "admin") {
    showToast("Logged in as Studio Administrator. Opening Admin Dashboard...");
    openAdminDashboard();
  } else {
    showToast(`Welcome back, ${user.name}!`);
  }
}

function handleRegisterSubmit(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const email = fd.get("email").trim().toLowerCase();
  if (storeState.users.some((u) => u.email.toLowerCase() === email)) {
    showToast("An account with this email already exists.");
    return;
  }

  const newUser = {
    id: "usr-" + Date.now(),
    name: fd.get("name").trim(),
    email,
    username: email.split("@")[0],
    password: fd.get("password"),
    role: fd.get("role") || "customer",
    company: fd.get("company") || "Private Client",
    joinedAt: new Date().toISOString().slice(0, 10)
  };

  storeState.users.push(newUser);
  sessionState.currentUser = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    company: newUser.company
  };
  saveStoreState();
  saveSessionState();
  closeAllOverlays();
  renderAll();
  showToast(`Account created! Welcome, ${newUser.name}.`);
}

function openAccountProfileModal() {
  const user = sessionState.currentUser;
  if (!user) return openAuthModal("login");

  const myOrders = storeState.orders.filter(
    (o) => o.customerEmail && o.customerEmail.toLowerCase() === user.email.toLowerCase()
  );

  const body = document.getElementById("authModalBody");
  body.innerHTML = `
    <span class="micro-label">ACCOUNT PROFILE · ${escapeHtml(user.role.toUpperCase())}</span>
    <h2 class="serif-heading" style="font-size: 1.9rem; color: var(--text-dark); margin: 4px 0 6px;">
      ${escapeHtml(user.name)}
    </h2>
    <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 18px;">
      ${escapeHtml(user.email)} · ${escapeHtml(user.company || "Studio Client")}
    </p>

    ${
      user.role === "admin"
        ? `<button class="btn-primary" style="width: 100%; margin-bottom: 18px;" onclick="closeAllOverlays(); openAdminDashboard();">
            Open Full Admin Studio Dashboard →
          </button>`
        : ""
    }

    <div class="micro-label" style="margin-bottom: 10px;">MY ORDER HISTORY (${myOrders.length})</div>
    <div style="max-height: 240px; overflow-y: auto; margin-bottom: 18px;">
      ${
        myOrders.length === 0
          ? `<p style="font-size: 0.8rem; color: var(--text-muted);">You haven't placed any orders yet.</p>`
          : myOrders
              .map(
                (o) => `
            <div style="background: #fff; border: 1px solid var(--border-subtle); padding: 12px; margin-bottom: 8px; font-size: 0.78rem;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <strong>${escapeHtml(o.id)}</strong>
                <div style="display: flex; gap: 6px;">
                  <span class="status-pill ${getPaymentStatusBadgeClass(o.paymentStatus)}">${escapeHtml(o.paymentStatus || "Unpaid")}</span>
                  <span class="status-pill ${escapeHtml(o.status)}">${escapeHtml(o.status)}</span>
                </div>
              </div>
              <div style="color: var(--text-muted); margin-top: 6px; display: flex; justify-content: space-between; align-items: center;">
                <span>${new Date(o.createdAt).toLocaleDateString()} · Total: <strong>${formatPrice(o.total)}</strong></span>
                <button class="underlined-link" onclick="renderOrderPaymentAndProofView('${escapeJs(o.id)}')">
                  ${o.paymentProofUrl ? "Lihat Bukti / QRIS" : "Bayar QRIS / Upload Bukti →"}
                </button>
              </div>
            </div>
          `
              )
              .join("")
      }
    </div>

    <button class="btn-outline" style="width: 100%;" onclick="logoutUser()">Sign Out</button>
  `;
  openModalById("authModal");
}

function logoutUser() {
  sessionState.currentUser = null;
  saveSessionState();
  closeAdminDashboard();
  closeAllOverlays();
  renderAll();
  showToast("You have signed out.");
}

// ============================================================================
// FULL ADMIN STUDIO DASHBOARD (OVERVIEW, PRODUCTS CRUD, ORDERS, VOUCHERS, USERS, SETTINGS)
// ============================================================================
function openAdminDashboard() {
  if (!sessionState.currentUser || sessionState.currentUser.role !== "admin") {
    openAuthModal("login", true);
    return;
  }
  document.getElementById("adminDashboardOverlay").classList.add("open");
  document.getElementById("adminCurrentUserName").textContent =
    `${sessionState.currentUser.name} (${sessionState.currentUser.email})`;
  renderAdminDashboard();
}

function closeAdminDashboard() {
  document.getElementById("adminDashboardOverlay").classList.remove("open");
}

function switchAdminTab(tabName) {
  sessionState.activeAdminTab = tabName;
  sessionState.editingProductId = null;
  document.querySelectorAll(".admin-nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tabName);
  });
  renderAdminDashboard();
}

function renderAdminDashboard() {
  const main = document.getElementById("adminMainContent");
  if (!main) return;
  const tab = sessionState.activeAdminTab;

  if (tab === "overview") {
    renderAdminOverview(main);
  } else if (tab === "products") {
    renderAdminProducts(main);
  } else if (tab === "pages") {
    renderAdminPages(main);
  } else if (tab === "orders") {
    renderAdminOrders(main);
  } else if (tab === "vouchers") {
    renderAdminVouchers(main);
  } else if (tab === "users") {
    renderAdminUsers(main);
  } else if (tab === "settings") {
    renderAdminSettings(main);
  }
}

// Helper: Upload image from Admin file input -> compress + optional server save -> set target input & preview
async function handleAdminImageFileUpload(event, targetInputId, previewImgId, prefix = "cms") {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    showToast("Memproses & mengunggah gambar...");
    const dataUrl = await compressImageFileToDataUrl(file, 1100, 0.84);
    let finalUrl = dataUrl;
    if (window.location.protocol.startsWith("http")) {
      try {
        const res = await fetch("/api/upload-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prefix, imageDataUrl: dataUrl })
        });
        if (res.ok) {
          const out = await res.json();
          if (out.imageUrl) finalUrl = out.imageUrl;
        }
      } catch (_) {}
    }
    const inputEl = document.getElementById(targetInputId);
    if (inputEl) inputEl.value = finalUrl;
    const prevEl = document.getElementById(previewImgId);
    if (prevEl) {
      prevEl.src = finalUrl;
      prevEl.style.display = "block";
    }
    showToast("Gambar berhasil dimuat! Klik tombol Simpan untuk menerapkan ke website.");
  } catch (err) {
    showToast("Gagal memproses file gambar.");
  }
}

// 1. ADMIN OVERVIEW & ANALYTICS
function renderAdminOverview(container) {
  const validOrders = storeState.orders.filter((o) => o.status !== "Cancelled");
  const totalRevenue = validOrders.reduce((acc, o) => acc + Number(o.total || 0), 0);
  const lowStockProducts = storeState.products.filter((p) => Number(p.stock) <= 8);
  const tradeUsers = storeState.users.filter((u) => u.role === "trade");

  container.innerHTML = `
    <div class="admin-header-bar">
      <div>
        <span class="micro-label">STUDIO PERFORMANCE &amp; CMS</span>
        <h1 class="serif-heading" style="font-size: 2.2rem; color: var(--text-dark);">Dashboard Utama Admin KutakKatik.id</h1>
      </div>
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <button class="btn-outline" onclick="switchAdminTab('products')">+ Tambah / Edit Produk &amp; Foto</button>
        <button class="btn-outline" onclick="switchAdminTab('pages')">✎ Edit Halaman &amp; Gambar Website</button>
        <button class="btn-primary" onclick="closeAdminDashboard()">Lihat Website Live</button>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card">
        <span class="micro-label">TOTAL PENDAPATAN</span>
        <div class="kpi-value">${formatPrice(totalRevenue)}</div>
        <div style="font-size: 0.74rem; color: var(--text-muted); margin-top: 4px;">Dari ${validOrders.length} pesanan aktif</div>
      </div>
      <div class="kpi-card">
        <span class="micro-label">TOTAL PRODUK &amp; KIT</span>
        <div class="kpi-value">${storeState.products.length}</div>
        <div style="font-size: 0.74rem; color: var(--text-muted); margin-top: 4px;">${lowStockProducts.length} produk stok menipis</div>
      </div>
      <div class="kpi-card">
        <span class="micro-label">MITRA SEKOLAH / PAUD</span>
        <div class="kpi-value">${tradeUsers.length}</div>
        <div style="font-size: 0.74rem; color: var(--text-muted); margin-top: 4px;">Total ${storeState.users.length} akun terdaftar</div>
      </div>
      <div class="kpi-card">
        <span class="micro-label">VOUCHER AKTIF</span>
        <div class="kpi-value">${storeState.vouchers.filter((v) => v.active).length}</div>
        <div style="font-size: 0.74rem; color: var(--text-muted); margin-top: 4px;">KUTAKKATIK10 · MITRA20 · WELCOME10</div>
      </div>
    </div>

    <h3 class="serif-heading" style="font-size: 1.5rem; color: var(--text-dark); margin-bottom: 14px;">
      Pesanan Terbaru Pelanggan &amp; Sekolah
    </h3>
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Tanggal</th>
            <th>Pelanggan</th>
            <th>Jumlah</th>
            <th>Total</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          ${storeState.orders
            .slice(0, 6)
            .map(
              (o) => `
            <tr>
              <td><strong>${escapeHtml(o.id)}</strong></td>
              <td>${new Date(o.createdAt).toLocaleDateString()}</td>
              <td>${escapeHtml(o.customerName)}<br/><small style="color:var(--text-muted);">${escapeHtml(o.customerEmail)}</small></td>
              <td>${o.items.reduce((s, i) => s + i.quantity, 0)} pcs</td>
              <td><strong>${formatPrice(o.total)}</strong></td>
              <td><span class="status-pill ${escapeHtml(o.status)}">${escapeHtml(o.status)}</span></td>
              <td><button class="underlined-link" onclick="switchAdminTab('orders')">Kelola</button></td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

// 2. ADMIN PRODUCTS CRUD + DIRECT IMAGE UPLOAD (FOTO UTAMA & FOTO HOVER)
function renderAdminProducts(container) {
  const editingProd = sessionState.editingProductId
    ? storeState.products.find((p) => p.id === sessionState.editingProductId)
    : null;
  const rate = Number(storeState?.settings?.idrRate || 16000);
  const currentIdrPrice = editingProd ? Math.round(Number(editingProd.price) * rate) : 288000;

  container.innerHTML = `
    <div class="admin-header-bar">
      <div>
        <span class="micro-label">MANAJEMEN KATALOG, GAMBAR, EDUKASI &amp; KEAMANAN PRODUK</span>
        <h1 class="serif-heading" style="font-size: 2.1rem; color: var(--text-dark);">Kelola Produk &amp; Upload Gambar</h1>
      </div>
    </div>

    <!-- Product Create / Edit Form -->
    <div style="background: #fff; border: 1px solid var(--border-subtle); padding: 26px; margin-bottom: 32px;">
      <h3 class="serif-heading" style="font-size: 1.45rem; color: var(--text-dark); margin-bottom: 16px;">
        ${editingProd ? `Edit Produk: ${escapeHtml(editingProd.name)}` : "+ Tambah Produk / Kit Eksplorasi Baru"}
      </h3>
      <form onsubmit="saveAdminProduct(event)">
        <input type="hidden" name="id" value="${editingProd ? escapeHtml(editingProd.id) : ""}" />
        <div class="form-grid">
          <div class="form-group">
            <label>Nama Produk / Kit *</label>
            <input type="text" name="name" required value="${editingProd ? escapeHtml(editingProd.name) : ""}" placeholder="Contoh: Kit Eksplorasi Montessori 3-Part Cards" />
          </div>
          <div class="form-group">
            <label>Kategori *</label>
            <select name="category" required>
              ${["Kit Eksplorasi", "Mainan Edukatif", "Sensory Play", "Kelas & Workshop", "Paket Sekolah"]
                .map(
                  (c) =>
                    `<option value="${c}" ${editingProd && editingProd.category === c ? "selected" : ""}>${c}</option>`
                )
                .join("")}
            </select>
          </div>
          <div class="form-group">
            <label>Harga Produk dalam Rupiah (IDR) *</label>
            <input
              type="number"
              name="priceIdr"
              required
              min="1000"
              step="1000"
              value="${currentIdrPrice}"
              placeholder="288000"
            />
          </div>
          <div class="form-group">
            <label>Jumlah Stok Tersedia *</label>
            <input type="number" name="stock" required min="0" value="${editingProd ? editingProd.stock : "20"}" />
          </div>
          <div class="form-group">
            <label>Label Badge (Pojok Kiri Atas Kartu)</label>
            <input type="text" name="badge" value="${editingProd?.badge ? escapeHtml(editingProd.badge) : ""}" placeholder="Favorit Orang Tua / Best Seller / SNI & Non-Toxic" />
          </div>
          <div class="form-group">
            <label>Posisi 3 Kartu Unggulan Atas (Staggered Showcase)</label>
            <select name="featuredSlot">
              <option value="">Tidak Ditampilkan di 3 Unggulan Atas (Katalog Biasa)</option>
              <option value="1" ${editingProd?.featuredSlot === 1 ? "selected" : ""}>Slot 1 — Kartu Kiri</option>
              <option value="2" ${editingProd?.featuredSlot === 2 ? "selected" : ""}>Slot 2 — Kartu Tengah Tinggi</option>
              <option value="3" ${editingProd?.featuredSlot === 3 ? "selected" : ""}>Slot 3 — Kartu Kanan</option>
            </select>
          </div>

          <!-- UPLOAD GAMBAR UTAMA (FOTO 1) -->
          <div class="form-group" style="background: var(--bg-cream); padding: 14px; border: 1px solid var(--border-subtle);">
            <label>Gambar Utama Produk (Foto 1) *</label>
            <input
              type="text"
              id="adminProdMainImgInput"
              name="image"
              required
              value="${editingProd ? escapeHtml(editingProd.image) : "/uploads/kit-eksplorasi-3-5-tahun-1.jpg"}"
              placeholder="Pilih file di bawah atau tempel URL gambar..."
              oninput="document.getElementById('adminProdMainImgPreview').src = this.value"
            />
            <div style="margin-top: 8px; display: flex; gap: 12px; align-items: center;">
              <img
                id="adminProdMainImgPreview"
                src="${editingProd ? escapeHtml(editingProd.image) : "/uploads/kit-eksplorasi-3-5-tahun-1.jpg"}"
                alt="Preview Foto 1"
                style="width: 72px; height: 72px; object-fit: cover; border: 1px solid var(--border-subtle); background: #fff;"
              />
              <div style="flex: 1;">
                <label style="display: inline-block; cursor: pointer; background: var(--bg-midnight); color: #fff; padding: 7px 12px; font-size: 0.65rem; border-radius: 4px;">
                  📁 Upload Foto 1 dari Komputer / HP
                  <input
                    type="file"
                    accept="image/*"
                    style="display: none;"
                    onchange="handleAdminImageFileUpload(event, 'adminProdMainImgInput', 'adminProdMainImgPreview', 'prod-main')"
                  />
                </label>
                <div style="font-size: 0.68rem; color: var(--text-muted); margin-top: 4px;">
                  Mendukung JPG, PNG, WebP. Otomatis dikompres &amp; disimpan ke database.
                </div>
              </div>
            </div>
          </div>

          <!-- UPLOAD GAMBAR KEDUA / HOVER (FOTO 2) -->
          <div class="form-group" style="background: var(--bg-cream); padding: 14px; border: 1px solid var(--border-subtle);">
            <label>Gambar Kedua / Hover &amp; Galeri (Foto 2)</label>
            <input
              type="text"
              id="adminProdHoverImgInput"
              name="hoverImage"
              value="${editingProd ? escapeHtml(editingProd.hoverImage || editingProd.image) : "/uploads/kit-eksplorasi-3-5-tahun-2.jpg"}"
              placeholder="Pilih file di bawah atau tempel URL gambar kedua..."
              oninput="document.getElementById('adminProdHoverImgPreview').src = this.value"
            />
            <div style="margin-top: 8px; display: flex; gap: 12px; align-items: center;">
              <img
                id="adminProdHoverImgPreview"
                src="${editingProd ? escapeHtml(editingProd.hoverImage || editingProd.image) : "/uploads/kit-eksplorasi-3-5-tahun-2.jpg"}"
                alt="Preview Foto 2"
                style="width: 72px; height: 72px; object-fit: cover; border: 1px solid var(--border-subtle); background: #fff;"
              />
              <div style="flex: 1;">
                <label style="display: inline-block; cursor: pointer; background: var(--bg-midnight); color: #fff; padding: 7px 12px; font-size: 0.65rem; border-radius: 4px;">
                  📁 Upload Foto 2 dari Komputer / HP
                  <input
                    type="file"
                    accept="image/*"
                    style="display: none;"
                    onchange="handleAdminImageFileUpload(event, 'adminProdHoverImgInput', 'adminProdHoverImgPreview', 'prod-hover')"
                  />
                </label>
                <div style="font-size: 0.68rem; color: var(--text-muted); margin-top: 4px;">
                  Tampil saat kursor diarahkan ke kartu produk &amp; di galeri detail produk.
                </div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>Pilihan Varian / Usia (Pisahkan dengan koma) *</label>
            <input type="text" name="finishes" required value="${editingProd?.finishes ? escapeHtml(editingProd.finishes.join(", ")) : "Usia 3–5 Tahun (Pra-Sekolah), Usia 5–8 Tahun (Eksplorasi Mandiri)"}" />
          </div>
          <div class="form-group">
            <label>Kategori Usia yang Disarankan (Safety) *</label>
            <input type="text" name="recommendedAge" required value="${editingProd?.recommendedAge ? escapeHtml(editingProd.recommendedAge) : "Aman untuk usia 3 tahun ke atas (3–5 Tahun / Pra-Sekolah)"}" />
          </div>
          <div class="form-group">
            <label>Bahan Mainan (Safety &amp; Material) *</label>
            <input type="text" name="safetyMaterial" required value="${editingProd?.safetyMaterial ? escapeHtml(editingProd.safetyMaterial) : "Kayu solid lokal dengan finishing beeswax alami & cat water-based non-toxic."}" />
          </div>
          <div class="form-group">
            <label>Peringatan Keamanan (Safety Warning) *</label>
            <input type="text" name="safetyWarning" required value="${editingProd?.safetyWarning ? escapeHtml(editingProd.safetyWarning) : "Gunakan dengan pendampingan orang tua. Perhatikan komponen kecil untuk anak di bawah 3 tahun."}" />
          </div>
          <div class="form-group full">
            <label>Deskripsi Edukasi &amp; Tumbuh Kembang Anak (Motorik, Kognitif &amp; STEM) *</label>
            <textarea name="description" rows="3" required>${editingProd ? escapeHtml(editingProd.description) : ""}</textarea>
          </div>
          <div class="form-group full">
            <label>Poin Manfaat Tumbuh Kembang (1 baris per poin manfaat)</label>
            <textarea name="educationalBenefits" rows="3" placeholder="Motorik Halus: Melatih otot jari...\nKognitif: Mengenal kosakata...\nSTEM: Problem-solving & logika dasar...">${editingProd?.educationalBenefits ? escapeHtml(editingProd.educationalBenefits.join("\n")) : ""}</textarea>
          </div>
          <div class="form-group">
            <label>SEO Meta Title (Google)</label>
            <input type="text" name="seoTitle" value="${editingProd?.seoTitle ? escapeHtml(editingProd.seoTitle) : ""}" placeholder="Otomatis jika dikosongkan" />
          </div>
          <div class="form-group">
            <label>SEO Meta Description (Google)</label>
            <input type="text" name="seoDescription" value="${editingProd?.seoDescription ? escapeHtml(editingProd.seoDescription) : ""}" placeholder="Ringkasan kata kunci Mainan Edukasi Anak & Motorik Balita" />
          </div>
        </div>
        <div style="display: flex; gap: 10px; margin-top: 12px;">
          <button type="submit" class="btn-primary">
            ${editingProd ? "💾 Simpan Perubahan Produk & Gambar" : "+ Tambah Produk Baru"}
          </button>
          ${
            editingProd
              ? `<button type="button" class="btn-outline" onclick="cancelEditProduct()">Batal Edit</button>`
              : ""
          }
        </div>
      </form>
    </div>

    <!-- Products Table -->
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Foto 1 &amp; 2</th>
            <th>Nama Produk</th>
            <th>Kategori &amp; Usia</th>
            <th>Harga</th>
            <th>Stok</th>
            <th>Slot Unggulan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          ${storeState.products
            .map(
              (p) => `
            <tr>
              <td>
                <div style="display: flex; gap: 4px;">
                  <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" style="width: 44px; height: 52px; object-fit: cover; border: 1px solid var(--border-subtle);" />
                  <img src="${escapeHtml(p.hoverImage || p.image)}" alt="${escapeHtml(p.name)} 2" style="width: 44px; height: 52px; object-fit: cover; border: 1px solid var(--border-subtle);" />
                </div>
              </td>
              <td><strong>${escapeHtml(p.name)}</strong><br/><small style="color:var(--text-muted);">${escapeHtml(p.badge || "")}</small></td>
              <td>${escapeHtml(p.category)}<br/><small style="color:var(--text-bronze-dark);">${escapeHtml(p.recommendedAge || "")}</small></td>
              <td>${formatPrice(p.price)}</td>
              <td>${p.stock <= 5 ? `<strong style="color:var(--accent-terracotta);">${p.stock} tersisa</strong>` : p.stock}</td>
              <td>${p.featuredSlot ? `Slot #${p.featuredSlot}` : "—"}</td>
              <td>
                <button class="btn-primary" style="padding: 6px 12px; font-size: 0.64rem; margin-right: 6px;" onclick="startEditProduct('${p.id}')">Edit / Ganti Foto</button>
                <button class="underlined-link" style="color: var(--accent-terracotta); border-color: var(--accent-terracotta);" onclick="deleteAdminProduct('${p.id}')">Hapus</button>
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function startEditProduct(productId) {
  sessionState.editingProductId = productId;
  renderAdminDashboard();
  document.getElementById("adminMainContent").scrollTo({ top: 0, behavior: "smooth" });
}

function cancelEditProduct() {
  sessionState.editingProductId = null;
  renderAdminDashboard();
}

function saveAdminProduct(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const id = fd.get("id") || "prod-" + Date.now();
  const slotVal = fd.get("featuredSlot") ? Number(fd.get("featuredSlot")) : null;
  const rate = Number(storeState?.settings?.idrRate || 16000);
  const priceIdr = Number(fd.get("priceIdr") || 288000);
  const priceUsd = Math.max(1, Math.round((priceIdr / rate) * 100) / 100);

  // If assigning a featuredSlot (1, 2, or 3), clear that slot from other products first
  if (slotVal) {
    storeState.products.forEach((p) => {
      if (p.featuredSlot === slotVal) p.featuredSlot = null;
    });
  }

  const nameClean = fd.get("name").trim();
  const mainImg = fd.get("image").trim();
  const hoverImg = (fd.get("hoverImage") || "").trim() || mainImg;
  const benefitsList = (fd.get("educationalBenefits") || "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  const productData = {
    id,
    name: nameClean,
    slug: nameClean.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    category: fd.get("category"),
    price: priceUsd,
    compareAtPrice: null,
    stock: Number(fd.get("stock")),
    featured: Boolean(slotVal),
    featuredSlot: slotVal,
    badge: fd.get("badge").trim() || null,
    rating: 5.0,
    reviewCount: 12,
    finishes: fd
      .get("finishes")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    recommendedAge: (fd.get("recommendedAge") || "").trim() || "Aman untuk usia 3 tahun ke atas",
    safetyMaterial: (fd.get("safetyMaterial") || "").trim(),
    safetyWarning: (fd.get("safetyWarning") || "").trim(),
    educationalBenefits: benefitsList,
    seoTitle: (fd.get("seoTitle") || "").trim() || `${nameClean} | Mainan Edukasi Anak & Motorik Balita — KutakKatik.id`,
    seoDescription: (fd.get("seoDescription") || "").trim() || (fd.get("description") || "").trim().slice(0, 160),
    dimensions: `Bahan: ${(fd.get("safetyMaterial") || "Kayu Solid Non-Toxic").trim()} | Usia: ${(fd.get("recommendedAge") || "3+ Tahun").trim()}`,
    leadTime: "Ready Stock — Dikirim dalam 1–2 hari kerja · Kemasan Aman Berlapis · Garansi 100% Tukar Baru / Refund Jika Cacat",
    image: mainImg,
    hoverImage: hoverImg,
    description: fd.get("description").trim()
  };

  const existingIdx = storeState.products.findIndex((p) => p.id === id);
  if (existingIdx >= 0) {
    storeState.products[existingIdx] = {
      ...storeState.products[existingIdx],
      ...productData
    };
    showToast(`Produk "${productData.name}" berhasil diperbarui!`);
  } else {
    storeState.products.unshift(productData);
    showToast(`Produk "${productData.name}" berhasil ditambahkan ke katalog!`);
  }

  sessionState.editingProductId = null;
  saveStoreState();
  renderAll();
}

function deleteAdminProduct(productId) {
  const prod = storeState.products.find((p) => p.id === productId);
  if (!prod) return;
  storeState.products = storeState.products.filter((p) => p.id !== productId);
  saveStoreState();
  renderAll();
  showToast(`Produk "${prod.name}" telah dihapus.`);
}

// 2B. ADMIN WEBSITE PAGES, SECTIONS, SPACES & JOURNAL CMS EDITOR (TAB 3)
function renderAdminPages(container) {
  const s = storeState.settings;
  const heroImg = s.heroImage || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=85";
  const bannerImg = s.bannerStripImage || "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=2000&q=85";
  const aboutImg1 = s.aboutMainImage || "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=1000&q=85";
  const aboutImg2 = s.aboutSecondImage || "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=600&q=80";
  const tradeImg = s.tradeMainImage || "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=85";

  container.innerHTML = `
    <div class="admin-header-bar">
      <div>
        <span class="micro-label">WEBSITE VISUAL &amp; CONTENT EDITOR (CMS)</span>
        <h1 class="serif-heading" style="font-size: 2.1rem; color: var(--text-dark);">
          Edit Halaman, Teks, &amp; Gambar Website
        </h1>
      </div>
      <button class="btn-primary" onclick="closeAdminDashboard()">Lihat Hasil di Website</button>
    </div>

    <!-- BAGIAN 1: EDIT HALAMAN UTAMA (HERO, TENTANG KAMI, BANNER, MITRA SEKOLAH) -->
    <div style="background: #fff; border: 1px solid var(--border-subtle); padding: 26px; margin-bottom: 28px;">
      <h3 class="serif-heading" style="font-size: 1.5rem; color: var(--text-dark); margin-bottom: 6px;">
        1. Edit Halaman Depan (Hero Utama, Tentang Kami, Banner &amp; Mitra Sekolah)
      </h3>
      <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 18px;">
        Ubah teks judul, paragraf, maupun unggah gambar baru dari komputer/HP Anda untuk setiap bagian halaman depan website.
      </p>

      <form onsubmit="saveAdminPageContent(event)">
        <div class="form-grid">
          <div class="form-group">
            <label>Judul Besar Hero (Wordmark Tengah) *</label>
            <input type="text" name="heroWordmark" required value="${escapeHtml(s.heroWordmark || "Mind Booster")}" />
          </div>
          <div class="form-group">
            <label>Subjudul Hero *</label>
            <input type="text" name="brandSubtitle" required value="${escapeHtml(s.brandSubtitle || "EKSPLORASI & TUMBUH KEMBANG")}" />
          </div>
          <div class="form-group full">
            <label>Kalimat Utama Hero (Headline Manifesto) *</label>
            <textarea name="heroStatement" rows="2" required>${escapeHtml(s.heroStatement || "")}</textarea>
          </div>
          <div class="form-group">
            <label>Label Keterangan Foto Hero</label>
            <input type="text" name="heroPhotoLabel" value="${escapeHtml(s.heroPhotoLabel || "FOTO UTAMA · RUANG EKSPLORASI KELUARGA & AKTIVITAS TANPA GADGET (USIA 2–8 TAHUN)")}" />
          </div>

          <!-- Upload Gambar Hero Utama -->
          <div class="form-group" style="background: var(--bg-cream); padding: 12px; border: 1px solid var(--border-subtle);">
            <label>Gambar Background Hero Utama</label>
            <input type="text" id="cmsHeroImgInput" name="heroImage" value="${escapeHtml(heroImg)}" oninput="document.getElementById('cmsHeroImgPrev').src = this.value" />
            <div style="margin-top: 8px; display: flex; gap: 10px; align-items: center;">
              <img id="cmsHeroImgPrev" src="${escapeHtml(heroImg)}" alt="Hero" style="width: 84px; height: 56px; object-fit: cover; border: 1px solid var(--border-subtle);" />
              <label style="cursor: pointer; background: var(--bg-midnight); color: #fff; padding: 7px 12px; font-size: 0.64rem; border-radius: 4px;">
                📁 Upload Gambar Hero Baru
                <input type="file" accept="image/*" style="display: none;" onchange="handleAdminImageFileUpload(event, 'cmsHeroImgInput', 'cmsHeroImgPrev', 'hero')" />
              </label>
            </div>
          </div>

          <div class="form-group full" style="margin-top: 8px; padding-top: 12px; border-top: 1px solid var(--border-subtle);">
            <span class="micro-label">BAGIAN TENTANG KAMI (ABOUT US) &amp; BANNER TENGAH</span>
          </div>

          <div class="form-group full">
            <label>Judul Bagian Tentang Kami (About Us)</label>
            <input type="text" name="aboutTitle" value="${escapeHtml(s.aboutTitle || "VISI KAMI: MENGHADIRKAN MASA KECIL YANG KAYA EKSPLORASI NYATA, AMAN, DAN BERMAKNA TANPA KETERGANTUNGAN GADGET.")}" />
          </div>
          <div class="form-group">
            <label>Paragraf 1 Tentang Kami</label>
            <textarea name="aboutPara1" rows="3">${escapeHtml(s.aboutPara1 || "Lahir dari kepedulian pendidik dan orang tua terhadap tingginya paparan layar (screen time) pada anak usia dini, KutakKatik.id® hadir dengan nilai utama bahwa setiap mainan harus memiliki tujuan tumbuh kembang yang jelas—melatih motorik halus, kognitif, kemampuan problem-solving, serta logika dasar (STEM).")}</textarea>
          </div>
          <div class="form-group">
            <label>Paragraf 2 Tentang Kami</label>
            <textarea name="aboutPara2" rows="3">${escapeHtml(s.aboutPara2 || "Kami hanya menggunakan kayu solid lokal pilihan dengan finishing beeswax murni & cat water-based non-toxic, plastik ABS non-toxic, serta material sensorik food-grade yang melewati inspeksi kehalusan sudut secara ketat demi keamanan buah hati Anda.")}</textarea>
          </div>

          <!-- Upload Foto 1 Tentang Kami -->
          <div class="form-group" style="background: var(--bg-cream); padding: 12px; border: 1px solid var(--border-subtle);">
            <label>Foto Utama Tentang Kami (Tim Kurator)</label>
            <input type="text" id="cmsAboutImg1Input" name="aboutMainImage" value="${escapeHtml(aboutImg1)}" oninput="document.getElementById('cmsAboutImg1Prev').src = this.value" />
            <div style="margin-top: 8px; display: flex; gap: 10px; align-items: center;">
              <img id="cmsAboutImg1Prev" src="${escapeHtml(aboutImg1)}" alt="About 1" style="width: 72px; height: 64px; object-fit: cover; border: 1px solid var(--border-subtle);" />
              <label style="cursor: pointer; background: var(--bg-midnight); color: #fff; padding: 7px 12px; font-size: 0.64rem; border-radius: 4px;">
                📁 Upload Foto Tim Kurator
                <input type="file" accept="image/*" style="display: none;" onchange="handleAdminImageFileUpload(event, 'cmsAboutImg1Input', 'cmsAboutImg1Prev', 'about1')" />
              </label>
            </div>
          </div>

          <!-- Upload Foto 2 Tentang Kami -->
          <div class="form-group" style="background: var(--bg-cream); padding: 12px; border: 1px solid var(--border-subtle);">
            <label>Foto Kedua Tentang Kami (Studio Riset)</label>
            <input type="text" id="cmsAboutImg2Input" name="aboutSecondImage" value="${escapeHtml(aboutImg2)}" oninput="document.getElementById('cmsAboutImg2Prev').src = this.value" />
            <div style="margin-top: 8px; display: flex; gap: 10px; align-items: center;">
              <img id="cmsAboutImg2Prev" src="${escapeHtml(aboutImg2)}" alt="About 2" style="width: 72px; height: 64px; object-fit: cover; border: 1px solid var(--border-subtle);" />
              <label style="cursor: pointer; background: var(--bg-midnight); color: #fff; padding: 7px 12px; font-size: 0.64rem; border-radius: 4px;">
                📁 Upload Foto Studio Riset
                <input type="file" accept="image/*" style="display: none;" onchange="handleAdminImageFileUpload(event, 'cmsAboutImg2Input', 'cmsAboutImg2Prev', 'about2')" />
              </label>
            </div>
          </div>

          <!-- Upload Banner Strip -->
          <div class="form-group" style="background: var(--bg-cream); padding: 12px; border: 1px solid var(--border-subtle);">
            <label>Gambar Banner Lebar Tengah (Suasana Studio)</label>
            <input type="text" id="cmsBannerImgInput" name="bannerStripImage" value="${escapeHtml(bannerImg)}" oninput="document.getElementById('cmsBannerImgPrev').src = this.value" />
            <div style="margin-top: 8px; display: flex; gap: 10px; align-items: center;">
              <img id="cmsBannerImgPrev" src="${escapeHtml(bannerImg)}" alt="Banner" style="width: 84px; height: 54px; object-fit: cover; border: 1px solid var(--border-subtle);" />
              <label style="cursor: pointer; background: var(--bg-midnight); color: #fff; padding: 7px 12px; font-size: 0.64rem; border-radius: 4px;">
                📁 Upload Gambar Banner
                <input type="file" accept="image/*" style="display: none;" onchange="handleAdminImageFileUpload(event, 'cmsBannerImgInput', 'cmsBannerImgPrev', 'banner')" />
              </label>
            </div>
          </div>

          <!-- Upload Foto Mitra Sekolah -->
          <div class="form-group" style="background: var(--bg-cream); padding: 12px; border: 1px solid var(--border-subtle);">
            <label>Gambar Bagian Mitra Sekolah / PAUD</label>
            <input type="text" id="cmsTradeImgInput" name="tradeMainImage" value="${escapeHtml(tradeImg)}" oninput="document.getElementById('cmsTradeImgPrev').src = this.value" />
            <div style="margin-top: 8px; display: flex; gap: 10px; align-items: center;">
              <img id="cmsTradeImgPrev" src="${escapeHtml(tradeImg)}" alt="Mitra" style="width: 84px; height: 54px; object-fit: cover; border: 1px solid var(--border-subtle);" />
              <label style="cursor: pointer; background: var(--bg-midnight); color: #fff; padding: 7px 12px; font-size: 0.64rem; border-radius: 4px;">
                📁 Upload Gambar Mitra Sekolah
                <input type="file" accept="image/*" style="display: none;" onchange="handleAdminImageFileUpload(event, 'cmsTradeImgInput', 'cmsTradeImgPrev', 'trade')" />
              </label>
            </div>
          </div>

          <div class="form-group">
            <label>Judul Bagian Mitra Sekolah / PAUD</label>
            <input type="text" name="tradeTitle" value="${escapeHtml(s.tradeTitle || "MITRA SEKOLAH, PAUD & TERAPIS TUMBUH KEMBANG")}" />
          </div>
          <div class="form-group">
            <label>Deskripsi Mitra Sekolah / PAUD</label>
            <textarea name="tradePara1" rows="2">${escapeHtml(s.tradePara1 || "Program kemitraan kami dikhususkan bagi sekolah, TK/PAUD, daycare, komunitas parenting, dan terapis tumbuh kembang anak. Sebagai Mitra KutakKatik.id, Anda mendapatkan potongan harga otomatis 20% serta kurasi kurikulum kit eksplorasi untuk kelas Anda.")}</textarea>
          </div>
        </div>

        <button type="submit" class="btn-primary" style="margin-top: 12px;">
          💾 Simpan Perubahan Halaman Depan &amp; Gambar
        </button>
      </form>
    </div>

    <!-- BAGIAN 2: EDIT RUANG & KELAS EKSPLORASI (SPACES 01-04) -->
    <div style="background: #fff; border: 1px solid var(--border-subtle); padding: 26px; margin-bottom: 28px;">
      <h3 class="serif-heading" style="font-size: 1.5rem; color: var(--text-dark); margin-bottom: 6px;">
        2. Edit Bagian Ruang &amp; Kelas Eksplorasi (Galeri Ruang 01–04)
      </h3>
      <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 18px;">
        Ubah judul, lokasi, cerita ruang, dan ketiga foto untuk setiap slide Ruang &amp; Kelas Eksplorasi.
      </p>

      <div style="display: flex; flex-direction: column; gap: 18px;">
        ${(storeState.spaces || [])
          .map(
            (sp, idx) => `
          <form onsubmit="saveAdminSpaceItem(event, ${idx})" style="background: var(--bg-cream); border: 1px solid var(--border-subtle); padding: 18px;">
            <div style="font-weight: 700; font-size: 0.85rem; margin-bottom: 12px; color: var(--text-bronze-dark);">
              RUANG #${escapeHtml(sp.number)} — ${escapeHtml(sp.title)}
            </div>
            <div class="form-grid">
              <div class="form-group">
                <label>Judul Ruang *</label>
                <input type="text" name="title" required value="${escapeHtml(sp.title)}" />
              </div>
              <div class="form-group">
                <label>Lokasi / Kategori Ruang *</label>
                <input type="text" name="location" required value="${escapeHtml(sp.location)}" />
              </div>
              <div class="form-group full">
                <label>Ringkasan Singkat *</label>
                <input type="text" name="summary" required value="${escapeHtml(sp.summary)}" />
              </div>
              <div class="form-group full">
                <label>Cerita Lengkap Ruang</label>
                <textarea name="story" rows="2">${escapeHtml(sp.story || "")}</textarea>
              </div>
              <div class="form-group">
                <label>Foto Tengah Melengkung (Main Arch Image)</label>
                <input type="text" id="spaceMainImg_${idx}" name="mainArchImage" value="${escapeHtml(sp.mainArchImage)}" />
                <label style="display: inline-block; margin-top: 6px; cursor: pointer; background: var(--bg-midnight); color: #fff; padding: 6px 10px; font-size: 0.62rem; border-radius: 4px;">
                  📁 Upload Foto Tengah
                  <input type="file" accept="image/*" style="display: none;" onchange="handleAdminImageFileUpload(event, 'spaceMainImg_${idx}', 'spaceMainPrev_${idx}', 'space-main')" />
                </label>
                <img id="spaceMainPrev_${idx}" src="${escapeHtml(sp.mainArchImage)}" alt="" style="width: 56px; height: 56px; object-fit: cover; margin-top: 6px; display: block;" />
              </div>
              <div class="form-group">
                <label>Foto Kiri &amp; Kanan (Left &amp; Right Detail)</label>
                <input type="text" id="spaceLeftImg_${idx}" name="leftThumbImage" value="${escapeHtml(sp.leftThumbImage)}" placeholder="Foto Kiri" style="margin-bottom: 6px;" />
                <input type="text" id="spaceRightImg_${idx}" name="rightDetailImage" value="${escapeHtml(sp.rightDetailImage)}" placeholder="Foto Kanan" />
                <div style="display: flex; gap: 8px; margin-top: 6px;">
                  <label style="cursor: pointer; background: var(--bg-midnight); color: #fff; padding: 6px 10px; font-size: 0.62rem; border-radius: 4px;">
                    📁 Upload Foto Kiri
                    <input type="file" accept="image/*" style="display: none;" onchange="handleAdminImageFileUpload(event, 'spaceLeftImg_${idx}', 'spaceMainPrev_${idx}', 'space-left')" />
                  </label>
                  <label style="cursor: pointer; background: var(--bg-midnight); color: #fff; padding: 6px 10px; font-size: 0.62rem; border-radius: 4px;">
                    📁 Upload Foto Kanan
                    <input type="file" accept="image/*" style="display: none;" onchange="handleAdminImageFileUpload(event, 'spaceRightImg_${idx}', 'spaceMainPrev_${idx}', 'space-right')" />
                  </label>
                </div>
              </div>
            </div>
            <button type="submit" class="btn-primary" style="margin-top: 8px; padding: 8px 16px; font-size: 0.66rem;">
              💾 Simpan Ruang #${escapeHtml(sp.number)}
            </button>
          </form>
        `
          )
          .join("")}
      </div>
    </div>

    <!-- BAGIAN 3: EDIT JURNAL PARENTING & EDUKASI -->
    <div style="background: #fff; border: 1px solid var(--border-subtle); padding: 26px;">
      <h3 class="serif-heading" style="font-size: 1.5rem; color: var(--text-dark); margin-bottom: 6px;">
        3. Edit Artikel Jurnal Parenting &amp; Edukasi
      </h3>
      <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 18px;">
        Ubah judul, ringkasan, isi artikel, serta foto sampul untuk setiap kartu Jurnal Tumbuh Kembang.
      </p>

      <div style="display: flex; flex-direction: column; gap: 18px;">
        ${(storeState.journalPosts || [])
          .map(
            (post, idx) => `
          <form onsubmit="saveAdminJournalItem(event, ${idx})" style="background: var(--bg-cream); border: 1px solid var(--border-subtle); padding: 18px;">
            <div class="form-grid">
              <div class="form-group">
                <label>Judul Artikel Jurnal *</label>
                <input type="text" name="title" required value="${escapeHtml(post.title)}" />
              </div>
              <div class="form-group">
                <label>Kategori &amp; Tanggal *</label>
                <div style="display: flex; gap: 8px;">
                  <input type="text" name="category" required value="${escapeHtml(post.category)}" style="flex: 1;" />
                  <input type="text" name="date" required value="${escapeHtml(post.date)}" style="width: 140px;" />
                </div>
              </div>
              <div class="form-group full">
                <label>Ringkasan Kartu (Excerpt) *</label>
                <input type="text" name="excerpt" required value="${escapeHtml(post.excerpt)}" />
              </div>
              <div class="form-group">
                <label>Isi Lengkap Artikel (Saat Dibuka)</label>
                <textarea name="content" rows="3">${escapeHtml(post.content || post.excerpt)}</textarea>
              </div>
              <div class="form-group">
                <label>Gambar Sampul Jurnal</label>
                <input type="text" id="journalImg_${idx}" name="image" value="${escapeHtml(post.image)}" oninput="document.getElementById('journalPrev_${idx}').src = this.value" />
                <div style="display: flex; gap: 10px; align-items: center; margin-top: 6px;">
                  <img id="journalPrev_${idx}" src="${escapeHtml(post.image)}" alt="" style="width: 64px; height: 48px; object-fit: cover; border: 1px solid var(--border-subtle);" />
                  <label style="cursor: pointer; background: var(--bg-midnight); color: #fff; padding: 6px 10px; font-size: 0.62rem; border-radius: 4px;">
                    📁 Upload Gambar Jurnal
                    <input type="file" accept="image/*" style="display: none;" onchange="handleAdminImageFileUpload(event, 'journalImg_${idx}', 'journalPrev_${idx}', 'journal')" />
                  </label>
                </div>
              </div>
            </div>
            <button type="submit" class="btn-primary" style="margin-top: 8px; padding: 8px 16px; font-size: 0.66rem;">
              💾 Simpan Artikel Jurnal #${idx + 1}
            </button>
          </form>
        `
          )
          .join("")}
      </div>
    </div>
  `;
}

function saveAdminPageContent(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const s = storeState.settings;
  s.heroWordmark = fd.get("heroWordmark").trim();
  s.brandSubtitle = fd.get("brandSubtitle").trim();
  s.heroStatement = fd.get("heroStatement").trim();
  s.heroPhotoLabel = fd.get("heroPhotoLabel").trim();
  s.heroImage = fd.get("heroImage").trim();
  s.aboutTitle = fd.get("aboutTitle").trim();
  s.aboutPara1 = fd.get("aboutPara1").trim();
  s.aboutPara2 = fd.get("aboutPara2").trim();
  s.aboutMainImage = fd.get("aboutMainImage").trim();
  s.aboutSecondImage = fd.get("aboutSecondImage").trim();
  s.bannerStripImage = fd.get("bannerStripImage").trim();
  s.tradeMainImage = fd.get("tradeMainImage").trim();
  s.tradeTitle = fd.get("tradeTitle").trim();
  s.tradePara1 = fd.get("tradePara1").trim();

  saveStoreState();
  renderAll();
  showToast("Halaman depan & gambar website berhasil diperbarui dan disinkronkan ke database!");
}

function saveAdminSpaceItem(e, idx) {
  e.preventDefault();
  const sp = storeState.spaces?.[idx];
  if (!sp) return;
  const fd = new FormData(e.target);
  sp.title = fd.get("title").trim();
  sp.location = fd.get("location").trim();
  sp.summary = fd.get("summary").trim();
  sp.story = fd.get("story").trim();
  sp.mainArchImage = fd.get("mainArchImage").trim();
  sp.leftThumbImage = fd.get("leftThumbImage").trim();
  sp.rightDetailImage = fd.get("rightDetailImage").trim();

  saveStoreState();
  renderAll();
  showToast(`Ruang #${sp.number} (${sp.title}) berhasil diperbarui!`);
}

function saveAdminJournalItem(e, idx) {
  e.preventDefault();
  const post = storeState.journalPosts?.[idx];
  if (!post) return;
  const fd = new FormData(e.target);
  post.title = fd.get("title").trim();
  post.category = fd.get("category").trim();
  post.date = fd.get("date").trim();
  post.excerpt = fd.get("excerpt").trim();
  post.content = fd.get("content").trim();
  post.image = fd.get("image").trim();

  saveStoreState();
  renderAll();
  showToast(`Artikel Jurnal "${post.title}" berhasil diperbarui!`);
}

// 3. ADMIN ORDERS & FULFILLMENT + PAYMENT PROOF VERIFICATION
function renderAdminOrders(container) {
  const waitingCount = storeState.orders.filter(
    (o) => o.paymentStatus === "Waiting Verification"
  ).length;

  container.innerHTML = `
    <div class="admin-header-bar">
      <div>
        <span class="micro-label">CLIENT DISPATCH, QRIS &amp; BUKTI TRANSFER VERIFICATION</span>
        <h1 class="serif-heading" style="font-size: 2.1rem; color: var(--text-dark);">
          Orders &amp; Payment Verification
        </h1>
      </div>
      ${
        waitingCount > 0
          ? `<span class="status-pill Waiting" style="padding: 8px 14px; font-size: 0.74rem;">
              ⚠ ${waitingCount} Bukti Transfer Menunggu Verifikasi Admin
            </span>`
          : ""
      }
    </div>

    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Client &amp; Contact</th>
            <th>Ordered Items</th>
            <th>Total &amp; Method</th>
            <th>Bukti Transfer &amp; Verifikasi</th>
            <th>Fulfillment Status</th>
          </tr>
        </thead>
        <tbody>
          ${storeState.orders
            .map((o) => {
              const pStatus = o.paymentStatus || "Unpaid";
              return `
            <tr>
              <td>
                <strong>${escapeHtml(o.id)}</strong><br/>
                <small style="color:var(--text-muted);">${new Date(o.createdAt).toLocaleString()}</small>
              </td>
              <td>
                <strong>${escapeHtml(o.customerName)}</strong><br/>
                <small>${escapeHtml(o.customerEmail)}</small><br/>
                <small>${escapeHtml(o.customerPhone || "")}</small>
              </td>
              <td style="font-size: 0.76rem;">
                ${o.items
                  .map((i) => `<div>• ${i.quantity}× <strong>${escapeHtml(i.name)}</strong> (${escapeHtml(i.finish)})</div>`)
                  .join("")}
                <div style="margin-top:4px; color:var(--text-muted);">Alamat: ${escapeHtml(o.shippingAddress)}</div>
              </td>
              <td>
                <strong>${formatPrice(o.total)}</strong><br/>
                <small style="color:var(--text-muted);">${escapeHtml(o.paymentMethod)}</small>
              </td>
              <td style="font-size: 0.76rem;">
                <div style="margin-bottom: 6px;">
                  <span class="status-pill ${getPaymentStatusBadgeClass(pStatus)}">${escapeHtml(pStatus)}</span>
                </div>
                ${
                  o.paymentSenderName
                    ? `<div style="color:var(--text-muted); margin-bottom: 6px;">
                        Pengirim: <strong>${escapeHtml(o.paymentSenderName)}</strong> (${escapeHtml(o.paymentSenderBank || "-")})
                      </div>`
                    : ""
                }
                <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
                  ${
                    o.paymentProofUrl
                      ? `<button class="underlined-link" onclick="previewAdminPaymentProof('${escapeJs(o.id)}')">Lihat Foto Bukti</button>`
                      : `<span style="color:var(--text-muted); font-size:0.7rem;">Belum upload foto</span>`
                  }
                  ${
                    pStatus !== "Verified"
                      ? `<button
                          class="btn-primary"
                          style="padding: 5px 10px; font-size: 0.62rem; background: #155724; border-color: #155724;"
                          onclick="verifyAdminOrderPayment('${escapeJs(o.id)}', 'Verified')"
                        >
                          ✓ Verifikasi Lunas
                        </button>`
                      : ""
                  }
                  ${
                    pStatus === "Waiting Verification"
                      ? `<button
                          class="btn-outline"
                          style="padding: 4px 9px; font-size: 0.62rem; color: #721c24; border-color: #721c24;"
                          onclick="verifyAdminOrderPayment('${escapeJs(o.id)}', 'Rejected')"
                        >
                          ✕ Tolak
                        </button>`
                      : ""
                  }
                </div>
              </td>
              <td>
                <select
                  class="shop-select"
                  onchange="updateAdminOrderStatus('${escapeJs(o.id)}', this.value)"
                >
                  ${["Pending", "Processing", "Shipped", "Completed", "Cancelled"]
                    .map(
                      (st) => `<option value="${st}" ${o.status === st ? "selected" : ""}>${st}</option>`
                    )
                    .join("")}
                </select>
              </td>
            </tr>
          `;
            })
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function verifyAdminOrderPayment(orderId, decision) {
  const order = storeState.orders.find((o) => o.id === orderId);
  if (!order) return;
  order.paymentStatus = decision;
  order.paymentVerifiedAt = new Date().toISOString();
  order.paymentVerifiedBy = sessionState.currentUser?.email || "admin@kutakkatik.com";
  if (decision === "Verified" && order.status === "Pending") {
    order.status = "Processing";
  }
  saveStoreState();
  renderAll();
  showToast(
    decision === "Verified"
      ? `Pembayaran Order ${orderId} telah diverifikasi LUNAS!`
      : `Bukti pembayaran Order ${orderId} ditolak.`
  );
}

function previewAdminPaymentProof(orderId) {
  const order = storeState.orders.find((o) => o.id === orderId);
  if (!order) return;

  const modalBody = document.getElementById("editorialModalBody");
  modalBody.innerHTML = `
    <span class="micro-label">BUKTI TRANSFER PELANGGAN · ORDER #${escapeHtml(order.id)}</span>
    <h2 class="serif-heading" style="font-size: 2rem; color: var(--text-dark); margin: 6px 0 14px;">
      Verifikasi Pembayaran ${formatPrice(order.total)}
    </h2>
    <div style="font-size: 0.84rem; color: var(--text-muted); margin-bottom: 16px;">
      <strong>Pengirim:</strong> ${escapeHtml(order.paymentSenderName || order.customerName)} ·
      <strong>Bank / Aplikasi:</strong> ${escapeHtml(order.paymentSenderBank || "-")} ·
      <strong>Catatan:</strong> ${escapeHtml(order.paymentNotes || "-")}
    </div>
    <div style="background: var(--bg-stone); padding: 16px; text-align: center; margin-bottom: 20px;">
      ${
        order.paymentProofUrl
          ? `<img src="${escapeHtml(order.paymentProofUrl)}" alt="Bukti Pembayaran" style="max-height: 460px; margin: 0 auto; object-fit: contain;" />`
          : `<p>Tidak ada lampiran gambar.</p>`
      }
    </div>
    <div style="display: flex; justify-content: flex-end; gap: 12px;">
      <button class="btn-outline" style="color: #721c24; border-color: #721c24;" onclick="verifyAdminOrderPayment('${escapeJs(order.id)}', 'Rejected'); closeAllOverlays();">
        ✕ Tolak Bukti
      </button>
      <button class="btn-primary" style="background: #155724; border-color: #155724;" onclick="verifyAdminOrderPayment('${escapeJs(order.id)}', 'Verified'); closeAllOverlays();">
        ✓ Terima &amp; Tandai Lunas
      </button>
    </div>
  `;
  openModalById("editorialModal");
}

function updateAdminOrderStatus(orderId, newStatus) {
  const order = storeState.orders.find((o) => o.id === orderId);
  if (!order) return;
  order.status = newStatus;
  saveStoreState();
  renderAll();
  showToast(`Order ${orderId} status updated to ${newStatus}.`);
}

// 4. ADMIN VOUCHERS & PROMOS
function renderAdminVouchers(container) {
  container.innerHTML = `
    <div class="admin-header-bar">
      <div>
        <span class="micro-label">PRIVILEGE CODES</span>
        <h1 class="serif-heading" style="font-size: 2.1rem; color: var(--text-dark);">Vouchers &amp; Promotions</h1>
      </div>
    </div>

    <div style="background: #fff; border: 1px solid var(--border-subtle); padding: 24px; margin-bottom: 28px;">
      <h3 class="serif-heading" style="font-size: 1.4rem; margin-bottom: 14px;">Create Promo Code</h3>
      <form onsubmit="createAdminVoucher(event)" style="display: grid; grid-template-columns: 1fr 1fr 2fr auto; gap: 12px; align-items: end;">
        <div class="form-group" style="margin:0;">
          <label>Code *</label>
          <input type="text" name="code" required placeholder="STUDIO25" style="text-transform: uppercase;" />
        </div>
        <div class="form-group" style="margin:0;">
          <label>Discount (%) *</label>
          <input type="number" name="discountPercent" required min="1" max="90" value="15" />
        </div>
        <div class="form-group" style="margin:0;">
          <label>Description *</label>
          <input type="text" name="description" required placeholder="Seasonal specification privilege" />
        </div>
        <button type="submit" class="btn-primary" style="height: 42px;">+ Add Code</button>
      </form>
    </div>

    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Discount</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${storeState.vouchers
            .map(
              (v, idx) => `
            <tr>
              <td><strong>${escapeHtml(v.code)}</strong></td>
              <td>${v.discountPercent}% OFF</td>
              <td>${escapeHtml(v.description)}</td>
              <td><span class="status-pill ${v.active ? "Completed" : "Cancelled"}">${v.active ? "Active" : "Disabled"}</span></td>
              <td>
                <button class="underlined-link" style="margin-right: 12px;" onclick="toggleAdminVoucher(${idx})">
                  ${v.active ? "Disable" : "Enable"}
                </button>
                <button class="underlined-link" style="color:var(--accent-terracotta);" onclick="deleteAdminVoucher(${idx})">Delete</button>
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function createAdminVoucher(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const code = fd.get("code").trim().toUpperCase();
  storeState.vouchers.push({
    code,
    discountPercent: Number(fd.get("discountPercent")),
    description: fd.get("description").trim(),
    active: true
  });
  saveStoreState();
  renderAdminDashboard();
  showToast(`Voucher code ${code} created.`);
}

function toggleAdminVoucher(idx) {
  const v = storeState.vouchers[idx];
  if (!v) return;
  v.active = !v.active;
  saveStoreState();
  renderAdminDashboard();
}

function deleteAdminVoucher(idx) {
  storeState.vouchers.splice(idx, 1);
  saveStoreState();
  renderAdminDashboard();
}

// 5. ADMIN ACCOUNTS & TRADE SPECIFIERS
function renderAdminUsers(container) {
  container.innerHTML = `
    <div class="admin-header-bar">
      <div>
        <span class="micro-label">USER &amp; TRADE DIRECTORY</span>
        <h1 class="serif-heading" style="font-size: 2.1rem; color: var(--text-dark);">Accounts &amp; Trade Specifiers</h1>
      </div>
    </div>

    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email / Username</th>
            <th>Practice / Company</th>
            <th>Joined</th>
            <th>Account Role</th>
          </tr>
        </thead>
        <tbody>
          ${storeState.users
            .map(
              (u) => `
            <tr>
              <td><strong>${escapeHtml(u.name)}</strong></td>
              <td>${escapeHtml(u.email)}</td>
              <td>${escapeHtml(u.company || "—")}</td>
              <td>${escapeHtml(u.joinedAt || "2026")}</td>
              <td>
                <select class="shop-select" onchange="changeUserRole('${u.id}', this.value)">
                  <option value="customer" ${u.role === "customer" ? "selected" : ""}>Customer</option>
                  <option value="trade" ${u.role === "trade" ? "selected" : ""}>Trade Specifier (-20%)</option>
                  <option value="admin" ${u.role === "admin" ? "selected" : ""}>Administrator</option>
                </select>
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function changeUserRole(userId, newRole) {
  const u = storeState.users.find((x) => x.id === userId);
  if (!u) return;
  u.role = newRole;
  if (sessionState.currentUser && sessionState.currentUser.id === userId) {
    sessionState.currentUser.role = newRole;
    saveSessionState();
  }
  saveStoreState();
  renderAll();
  showToast(`Updated ${u.name}'s role to ${newRole.toUpperCase()}.`);
}

// 6. ADMIN BRAND, QRIS PAYMENT & POSTGRESQL (DATABASE_URL) SETTINGS
async function renderAdminSettings(container) {
  const s = storeState.settings;
  let dbStatus = {
    connected: false,
    mode: "local_json",
    databaseUrlMasked: null,
    lastError: null,
    pgVersion: null
  };

  if (window.location.protocol.startsWith("http")) {
    try {
      const res = await fetch("/api/db-status");
      if (res.ok) dbStatus = await res.json();
    } catch (_) {}
  }

  container.innerHTML = `
    <div class="admin-header-bar">
      <div>
        <span class="micro-label">IDENTITY, QRIS GATEWAY &amp; POSTGRESQL DATABASE</span>
        <h1 class="serif-heading" style="font-size: 2.1rem; color: var(--text-dark);">
          Brand, Payment &amp; PostgreSQL Settings
        </h1>
      </div>
      <button class="btn-outline" style="color: var(--accent-terracotta); border-color: var(--accent-terracotta);" onclick="resetAllDemoData()">
        Reset Store to Factory Seed Data
      </button>
    </div>

    <div style="display: grid; grid-template-columns: 1.15fr 1fr; gap: 24px; align-items: start;">
      <!-- Left Column: Brand & QRIS / Bank Payment Settings -->
      <div style="background: #fff; border: 1px solid var(--border-subtle); padding: 26px;">
        <div style="margin-bottom: 18px; display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
          <span class="micro-label">QUICK BRAND PRESET:</span>
          <button type="button" class="btn-outline" style="padding: 6px 12px;" onclick="applyBrandPreset('Nightworks')">
            Set "Nightworks®"
          </button>
          <button type="button" class="btn-outline" style="padding: 6px 12px;" onclick="applyBrandPreset('Kutak Katik')">
            Set "Kutak Katik®"
          </button>
        </div>

        <form onsubmit="saveAdminSettings(event)">
          <div class="form-grid">
            <div class="form-group">
              <label>Hero Wordmark Brand Name *</label>
              <input type="text" name="brandName" required value="${escapeHtml(s.brandName)}" />
            </div>
            <div class="form-group">
              <label>Default Store Currency</label>
              <select name="currency">
                <option value="USD" ${s.currency === "USD" ? "selected" : ""}>USD ($)</option>
                <option value="IDR" ${s.currency === "IDR" ? "selected" : ""}>IDR (Rp)</option>
              </select>
            </div>
            <div class="form-group">
              <label>Trade Specifier Discount (%)</label>
              <input type="number" name="tradeDiscountPercent" min="0" max="60" value="${s.tradeDiscountPercent}" />
            </div>
            <div class="form-group">
              <label>Instagram Handle</label>
              <input type="text" name="instagramHandle" value="${escapeHtml(s.instagramHandle)}" />
            </div>

            <div class="form-group full" style="margin-top: 8px; padding-top: 12px; border-top: 1px solid var(--border-subtle);">
              <span class="micro-label">PENGATURAN QRIS STATIS / DINAMIS &amp; REKENING BANK</span>
            </div>

            <div class="form-group">
              <label>Mode QRIS Checkout</label>
              <select name="qrisMode">
                <option value="dynamic" ${(s.qrisMode || "dynamic") === "dynamic" ? "selected" : ""}>QRIS Dinamis (Nominal Otomatis + CRC16)</option>
                <option value="static" ${s.qrisMode === "static" ? "selected" : ""}>QRIS Statis (Gambar QRIS Toko)</option>
              </select>
            </div>
            <div class="form-group">
              <label>Nama Merchant QRIS *</label>
              <input type="text" name="qrisMerchantName" required value="${escapeHtml(s.qrisMerchantName || "KUTAK KATIK STUDIO")}" />
            </div>
            <div class="form-group">
              <label>NMID (National Merchant ID)</label>
              <input type="text" name="qrisNmid" value="${escapeHtml(s.qrisNmid || "ID1026000889901")}" />
            </div>
            <div class="form-group">
              <label>Upload Gambar QRIS Statis (Opsional)</label>
              <input type="file" accept="image/*" onchange="handleAdminStaticQrisUpload(event)" />
            </div>
            <div class="form-group full">
              <label>Daftar Rekening Bank Transfer *</label>
              <input
                type="text"
                name="bankAccounts"
                required
                value="${escapeHtml(s.bankAccounts || "BCA 8820-9910-22 a/n Kutak Katik Studio")}"
              />
            </div>
            <div class="form-group full">
              <label>Hero Editorial Manifesto Statement *</label>
              <textarea name="heroStatement" rows="2" required>${escapeHtml(s.heroStatement)}</textarea>
            </div>
          </div>
          <button type="submit" class="btn-primary" style="margin-top: 10px;">
            Save Brand &amp; QRIS Settings
          </button>
        </form>
      </div>

      <!-- Right Column: PostgreSQL Direct Connection (DATABASE_URL) -->
      <div style="background: #fff; border: 1px solid var(--border-subtle); padding: 26px;">
        <span class="micro-label">POSTGRESQL CLOUD / LOCAL DATABASE</span>
        <h3 class="serif-heading" style="font-size: 1.55rem; color: var(--text-dark); margin: 4px 0 14px;">
          PostgreSQL Connection (<code>DATABASE_URL</code>)
        </h3>

        <div style="background: ${dbStatus.connected ? "#f2f9f4" : "var(--bg-cream)"}; border: 1px solid ${dbStatus.connected ? "#c3e6cb" : "var(--border-subtle)"}; padding: 14px 16px; margin-bottom: 18px; font-size: 0.78rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <strong>Status Koneksi:</strong>
            <span class="status-pill ${dbStatus.connected ? "Verified" : "Waiting"}">
              ${dbStatus.connected ? "TERHUBUNG KE POSTGRESQL" : "LOCAL JSON FALLBACK"}
            </span>
          </div>
          ${
            dbStatus.connected
              ? `<div><strong>Server:</strong> ${escapeHtml(dbStatus.pgVersion || "PostgreSQL")}</div>
                 <div><strong>URL:</strong> <code>${escapeHtml(dbStatus.databaseUrlMasked || "")}</code></div>
                 <div><strong>Tabel Aktif:</strong> <code>products</code>, <code>orders</code>, <code>users</code>, <code>vouchers</code>, <code>store_kv</code></div>`
              : `<div style="color: var(--text-muted);">
                  ${escapeHtml(dbStatus.lastError || "Masukkan connection string PostgreSQL di bawah untuk menyinkronkan seluruh tabel secara langsung.")}
                </div>`
          }
        </div>

        <form onsubmit="saveAndTestPostgresUrl(event)">
          <div class="form-group">
            <label>PostgreSQL Connection String (<code>DATABASE_URL</code>)</label>
            <input
              type="text"
              id="pgDatabaseUrlInput"
              name="databaseUrl"
              placeholder="postgresql://postgres:password@localhost:5432/kutakkatik"
              value=""
            />
            <small style="font-size: 0.7rem; color: var(--text-muted);">
              Mendukung PostgreSQL lokal, Supabase, Neon.tech, Railway, Render, atau Aiven. Otomatis menyimpan ke <code>.env</code> dan menjalankan migrasi <code>schema.sql</code>.
            </small>
          </div>
          <button type="submit" class="btn-primary" id="pgConnectBtn" style="width: 100%;">
            ⚡ Hubungkan, Migrasi Schema &amp; Sinkronkan Data ke PostgreSQL
          </button>
        </form>
      </div>
    </div>
  `;
}

async function handleAdminStaticQrisUpload(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    const dataUrl = await compressImageFileToDataUrl(file, 700, 0.85);
    storeState.settings.qrisCustomImage = dataUrl;
    storeState.settings.qrisMode = "static";
    saveStoreState();
    showToast("Gambar QRIS Statis berhasil disimpan!");
  } catch (_) {
    showToast("Gagal memuat gambar QRIS.");
  }
}

async function saveAndTestPostgresUrl(e) {
  e.preventDefault();
  const urlInput = document.getElementById("pgDatabaseUrlInput");
  const databaseUrl = (urlInput?.value || "").trim();
  const btn = document.getElementById("pgConnectBtn");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Menghubungkan & Migrasi Tabel PostgreSQL...";
  }

  try {
    const res = await fetch("/api/db-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ databaseUrl, storeState })
    });
    const status = await res.json();
    if (status.connected) {
      showToast("Berhasil terhubung ke PostgreSQL & menyinkronkan semua tabel!");
    } else {
      showToast("PostgreSQL belum terjangkau: " + (status.lastError || "Menggunakan fallback lokal."));
    }
  } catch (err) {
    showToast("Gagal menghubungi server Node.js.");
  } finally {
    renderAdminDashboard();
  }
}

function applyBrandPreset(name) {
  if (name === "Kutak Katik") {
    storeState.settings.brandName = "KutakKatik.id";
    storeState.settings.brandSubtitle = "EKSPLORASI & TUMBUH KEMBANG";
    storeState.settings.heroStatement =
      "Solusi Kreatif & Edukatif Tanpa Gadget: Temukan Ratusan Ide Mainan, Kelas, & Kit Eksplorasi untuk Tumbuh Kembang Anak.";
    storeState.settings.instagramHandle = "@KUTAKKATIK.ID";
    storeState.settings.currency = "IDR";
  } else {
    storeState.settings.brandName = name;
    storeState.settings.instagramHandle = "@NIGHTWORKSSTUDIO";
  }
  saveStoreState();
  renderAll();
  showToast(`Brand wordmark updated to "${storeState.settings.brandName}®"`);
}

function saveAdminSettings(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  storeState.settings.brandName = fd.get("brandName").trim();
  storeState.settings.currency = fd.get("currency");
  storeState.settings.tradeDiscountPercent = Number(fd.get("tradeDiscountPercent"));
  storeState.settings.instagramHandle = fd.get("instagramHandle").trim();
  storeState.settings.qrisMode = fd.get("qrisMode");
  storeState.settings.qrisMerchantName = fd.get("qrisMerchantName").trim();
  storeState.settings.qrisNmid = fd.get("qrisNmid").trim();
  storeState.settings.bankAccounts = fd.get("bankAccounts").trim();
  storeState.settings.heroStatement = fd.get("heroStatement").trim();
  saveStoreState();
  renderAll();
  showToast("Pengaturan Brand & QRIS berhasil disimpan!");
}

function resetAllDemoData() {
  storeState = JSON.parse(JSON.stringify(window.INITIAL_STORE_DATA));
  sessionState.cart = [];
  sessionState.wishlist = [];
  sessionState.appliedVoucher = null;
  saveStoreState();
  saveSessionState();
  renderAll();
  showToast("Store reset to initial luxury catalog seed data.");
}

// ============================================================================
// OVERLAY, DRAWER & TOAST HELPERS
// ============================================================================
function toggleCartDrawer(open) {
  closeAllModalsOnly();
  document.getElementById("wishlistDrawer").classList.remove("open");
  document.getElementById("cartDrawer").classList.toggle("open", open);
  document.getElementById("backdropOverlay").classList.toggle("open", open);
}

function toggleWishlistDrawer(open) {
  closeAllModalsOnly();
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("wishlistDrawer").classList.toggle("open", open);
  document.getElementById("backdropOverlay").classList.toggle("open", open);
}

function openModalById(modalId) {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("wishlistDrawer").classList.remove("open");
  closeAllModalsOnly();
  document.getElementById(modalId).classList.add("open");
  document.getElementById("backdropOverlay").classList.add("open");
}

function closeAllModalsOnly() {
  ["productDetailModal", "checkoutModal", "authModal", "orderTrackerModal", "editorialModal"].forEach(
    (id) => {
      const el = document.getElementById(id);
      if (el) el.classList.remove("open");
    }
  );
}

function closeAllOverlays() {
  closeAllModalsOnly();
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("wishlistDrawer").classList.remove("open");
  document.getElementById("backdropOverlay").classList.remove("open");
}

function handleNewsletterSubmit(e) {
  e.preventDefault();
  e.target.reset();
  showToast("Subscribed to Nightworks® · Kutak Katik Studio dispatches.");
}

function showToast(message) {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const el = document.createElement("div");
  el.className = "toast-msg";
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transition = "opacity 0.3s ease";
    setTimeout(() => el.remove(), 300);
  }, 3400);
}

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeJs(str) {
  if (!str) return "";
  return String(str).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

// Launch on DOMContentLoaded
window.addEventListener("DOMContentLoaded", initApp);
