# Nightworks® · Kutak Katik Studio — Architectural Lighting & Design Online Shop

Website Online Shop bergaya luxury architectural lighting & design (terinspirasi dari referensi desain editorial **Nightworks® Studio**), lengkap dengan seluruh fungsionalitas e-commerce modern serta **Portal Akun Admin (Full Studio Backoffice)**.

---

## ✨ Fitur Utama

### 1. Desain & Tema Sesuai 5 Foto Referensi
- **Hero & Giant Serif Wordmark (Foto 1):** Navbar minimalis (`SHOP`, `ABOUT`, `SPACES`, `JOURNAL`, `TRADE`), logo emblem moth di tengah, foto interior ruang makan dengan lampu gantung kurva catenary ganda, wordmark serif raksasa `Nightworks®` (dapat diubah ke `Kutak Katik®` lewat Admin), serta manifesto `LIGHTING & DESIGN`.
- **Featured Products — Staggered 3-Column Grid (Foto 2):** Tiga kartu produk vertikal dengan kartu tengah lebih tinggi (*Offcut Wall Sconce*, *Tasman Double Pendant*, *Offcut Candle Holder*) dan tautan `VIEW ALL PRODUCTS`.
- **Featured Spaces — Midnight Navy Archway Section (Foto 3):** Seksi berlatar biru malam pekat (`#101C24`) dengan penomoran interaktif `03 / 04`, foto tengah berbingkai lengkung (*archway*), detail *Code Cascade*, tombol `VIEW SPACE`, dan banner interior plafon lengkung di bawahnya.
- **Founders Editorial Section (Foto 4):** Tata letak asimetris 3 kolom dengan narasi `FOUNDERS`, potret studio dengan tirai tipis, foto lampu gantung kuningan, dan ilustrasi garis tangan + moth di kanan bawah.
- **Trade Specifiers & Floating Instagram Collage (Foto 5):** Seksi khusus arsitek/desainer interior (`SIGN UP` / `LOGIN` dengan diskon otomatis 20%) serta kolase foto melayang di sekeliling ajakan `@NIGHTWORKSSTUDIO`.

### 2. Fungsionalitas Lengkap Online Shop
- **Katalog Interaktif:** Filter berdasarkan kategori (*Pendants*, *Wall Sconces*, *Table & Floor*, *Objects & Candles*, *Bespoke*), pencarian real-time, pengurutan harga & rating, serta pilihan mata uang (`USD ($)` / `IDR (Rp)`).
- **Detail Produk & Varian Material:** Pilihan finish material (*Raw Travertine*, *Terracotta Leather & Brass*, *Verde Guatemala Marble*, dll.), spesifikasi teknis, indikator stok real-time, dan ulasan pelanggan (*Customer Reviews*).
- **Keranjang Belanja (*Shopping Bag*) & Wishlist Drawer:** Tambah/kurangi kuantitas, simpan produk ke daftar spesifikasi (*Wishlist*), kalkulasi ongkir otomatis, dan **Kode Voucher Diskon** (`WELCOME10`, `TRADE20`, `KUTAKKATIK`).
- **Checkout Multi-Metode & Cetak Invoice:** Formulir pengiriman, metode kurir (*Standard Insured Courier*, *White-Glove Architectural Delivery*, *Studio Pickup*), metode pembayaran (*Bank Transfer / VA*, *QRIS*, *Credit Card*, *Trade Net-30 Invoice*), pengurangan stok otomatis, dan bukti pesanan yang dapat dicetak (*Print Invoice*).
- **Pelacakan Pesanan (*Order Tracker*):** Lacak status pesanan berdasarkan Nomor Order (misal `NW-2026-8401`) atau email pelanggan.

### 3. Akun Admin & Dashboard Backoffice Lengkap
Akses melalui tombol **Admin Panel** di pojok kanan atas:
1. **Overview & Analytics:** Ringkasan total pendapatan, jumlah pesanan aktif, peringatan stok menipis, jumlah anggota Trade, dan tabel pesanan terbaru.
2. **Products Catalog (Full CRUD):** Tambah produk baru, edit produk (nama, harga, stok, finish, foto, dimensi, hingga mengatur **Slot 1/2/3** pada Hero Staggered Showcase), dan hapus produk.
3. **Orders & Fulfillment:** Lihat detail pesanan masuk dan ubah status pengiriman secara real-time (`Pending` → `Processing` → `Shipped` → `Completed` / `Cancelled`).
4. **Vouchers & Discounts:** Buat kode promo baru, aktifkan/nonaktifkan voucher, atau hapus voucher.
5. **Accounts & Trade Specifiers:** Kelola daftar pengguna dan ubah level akun (`Customer`, `Trade Specifier -20%`, `Administrator`).
6. **Brand & Store Settings:** Ubah nama brand (tersedia tombol 1-klik untuk mengganti antara **Nightworks®** dan **Kutak Katik®**), mata uang default, persentase diskon Trade, atau reset data demo.

---

## 🔐 Kredensial Akun (Admin, Trade & Customer)

Tersedia juga tombol **1-Click Instant Login** langsung di dalam modal Sign In:

| Role | Email / Username | Password | Hak Akses |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@kutakkatik.com` (atau `admin`) | `admin123` | Akses penuh ke **Admin Studio Dashboard** + seluruh fitur toko |
| **Trade Specifier** | `trade@kutakkatik.com` (atau `trade`) | `trade123` | Diskon otomatis **20% Trade Privilege** untuk seluruh katalog |
| **Customer** | `customer@kutakkatik.com` | `user123` | Akun pelanggan standar & riwayat pesanan |

---

## 🚀 Cara Menjalankan Proyek

1. **Menggunakan Node.js Server (Direkomendasikan — menyimpan perubahan ke `data/store.json`):**
   ```bash
   node server.js
   ```
   Lalu buka **`http://localhost:3000`** di browser Anda.

2. **Membuka Langsung (`index.html`):**
   Anda juga dapat membuka file `index.html` secara langsung di browser; seluruh transaksi, perubahan produk Admin, dan keranjang belanja akan tersimpan otomatis di `localStorage`.
