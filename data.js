// ============================================================================
// KUTAKKATIK.ID® — INITIAL STORE, PROGRAM, KELAS & KIT EKSPLORASI ANAK DATA
// ============================================================================

window.INITIAL_STORE_DATA = {
  settings: {
    brandName: "KutakKatik.id",
    heroWordmark: "Mind Booster",
    brandSubtitle: "EKSPLORASI & TUMBUH KEMBANG",
    heroStatement:
      "Solusi Kreatif & Edukatif Tanpa Gadget: Temukan Ratusan Ide Mainan, Kelas, & Kit Eksplorasi untuk Tumbuh Kembang Anak.",
    instagramHandle: "@KUTAKKATIK.ID",
    currency: "IDR", // Can be switched between "IDR" and "USD" in navbar or Admin
    idrRate: 16000,
    tradeDiscountPercent: 20,
    freeShippingThreshold: 25,
    qrisMerchantName: "KUTAKKATIK.ID EDUKASI",
    qrisMerchantCity: "JAKARTA",
    qrisNmid: "ID1026000889901",
    qrisMode: "dynamic", // "dynamic" (auto-encodes nominal) or "static"
    qrisCustomImage: "", // Optional custom Static QRIS image uploaded by Admin
    bankAccounts: "BCA 8820-9910-22 a/n KutakKatik.id | Mandiri 124-00-9988776-5 a/n KutakKatik.id"
  },

  products: [
    {
      id: "prod-kit-sains-alam",
      name: "Kit Eksplorasi Sains & Alam Montessori",
      slug: "kit-eksplorasi-sains-alam-montessori",
      category: "Kit Eksplorasi",
      price: 18, // Rp 288.000
      compareAtPrice: 22,
      stock: 25,
      featured: true,
      featuredSlot: 1, // Left card in 3-column staggered showcase
      badge: "Favorit Orang Tua",
      rating: 4.9,
      reviewCount: 42,
      finishes: ["Usia 3–5 Tahun (Pra-Sekolah)", "Usia 5–8 Tahun (Eksplorasi Mandiri)", "Paket Kakak-Adik (2 Set)"],
      dimensions: "Box Kayu & Karton Edukasi 28×22×8 cm | 12 Proyek Eksperimen + Buku Panduan Orang Tua",
      leadTime: "Ready Stock — Dikirim dalam 1–2 hari kerja",
      image:
        "/uploads/kit-eksplorasi-3-5-tahun-1.jpg",
      hoverImage:
        "/uploads/kit-eksplorasi-3-5-tahun-2.jpg",
      description:
        "Dirancang oleh kurator tumbuh kembang anak untuk mengalihkan perhatian anak dari layar gadget melalui 12 eksperimen sains dan eksplorasi alam yang aman di rumah. Lengkap dengan kaca pembesar kayu, spesimen botani, kartu tantangan harian, dan panduan pendampingan orang tua."
    },
    {
      id: "prod-sensory-play-lengkap",
      name: "Kotak Kutak-Katik Sensory Play & Motorik Lengkap",
      slug: "kotak-kutak-katik-sensory-play-motorik",
      category: "Kit Eksplorasi",
      price: 28, // Rp 448.000
      compareAtPrice: 34,
      stock: 16,
      featured: true,
      featuredSlot: 2, // Center tall card in 3-column staggered showcase
      badge: "Best Seller",
      rating: 5.0,
      reviewCount: 64,
      finishes: ["Tema Eksplorasi Hutan & Bumi", "Tema Samudra & Pasir Kinetik", "Tema Konstruksi & Arsitek Cilik"],
      dimensions: "Baki Kayu Pinus Solid 42×30×7 cm | 30+ Komponen Taktil Alami Non-Toxic (Food Grade)",
      leadTime: "Ready Stock — Dikirim dalam 1–2 hari kerja",
      image:
        "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=85",
      hoverImage:
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85",
      description:
        "Program kit eksplorasi andalan KutakKatik.id yang menggabungkan stimulasi 7 indra, koordinasi mata-tangan, dan daya imajinasi terbuka (open-ended play). Setiap kotak berisi baki kayu pinus halus, sendok takar kayu, bahan sensorik food-grade, figur kayu, dan 30 ide permainan tanpa gadget."
    },
    {
      id: "prod-balok-kayu-konstruksi",
      name: "Balok Kayu Konstruksi & Geometri Natural",
      slug: "balok-kayu-konstruksi-geometri-natural",
      category: "Mainan Edukatif",
      price: 15, // Rp 240.000
      compareAtPrice: null,
      stock: 30,
      featured: true,
      featuredSlot: 3, // Right card in 3-column staggered showcase
      badge: "SNI & Non-Toxic",
      rating: 4.9,
      reviewCount: 29,
      finishes: ["Natural Kayu Sungkai (48 Pcs)", "Earthy Terracotta & Sage (48 Pcs)", "Master Builder Set (80 Pcs)"],
      dimensions: "Kotak Penyimpanan Kayu 32×26×10 cm | Finishing Beeswax Alami Aman untuk Anak",
      leadTime: "Ready Stock — Dikirim dalam 1–2 hari kerja",
      image:
        "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=1200&q=85",
      hoverImage:
        "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=85",
      description:
        "Set balok arsitektur dan geometri presisi dari kayu solid Indonesia dengan polesan beeswax murni tanpa cat sintetis. Melatih kecerdasan spasial, logika keseimbangan, pemecahan masalah, dan kesabaran anak sejak usia dini."
    },
    {
      id: "prod-paket-sekolah-paud",
      name: "Paket Pojok Eksplorasi & Pojok Baca PAUD / Sekolah",
      slug: "paket-pojok-eksplorasi-paud-sekolah",
      category: "Paket Sekolah",
      price: 120, // Rp 1.920.000
      compareAtPrice: 145,
      stock: 8,
      featured: false,
      featuredSlot: null,
      badge: "Kurikulum Merdeka",
      rating: 5.0,
      reviewCount: 15,
      finishes: ["Paket Kelas Kecil (10–15 Anak)", "Paket Sekolah Lengkap (25–30 Anak)"],
      dimensions: "12 Kit Eksplorasi + Rak Display Kayu Montessori + Modul Kurikulum Guru",
      leadTime: "Pre-Order Kurasi Sekolah — 5–7 hari kerja",
      image:
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85",
      hoverImage:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
      description:
        "Solusi terpadu untuk TK, PAUD, Daycare, dan ruang bermain ramah anak. Mencakup koleksi lengkap alat peraga Montessori, kit eksperimen grup, modul kurikulum mingguan untuk pengajar, serta sesi pelatihan fasilitator."
    },
    {
      id: "prod-kelas-kreatif-akhir-pekan",
      name: "Kelas Eksperimen Sains & Kriya Anak (Sesi Offline / Online)",
      slug: "kelas-eksperimen-sains-kriya-anak",
      category: "Kelas & Workshop",
      price: 12, // Rp 192.000
      compareAtPrice: 15,
      stock: 20,
      featured: false,
      featuredSlot: null,
      badge: "Termasuk Alat & Bahan",
      rating: 4.9,
      reviewCount: 37,
      finishes: ["Sesi Studio Akhir Pekan (90 Menit)", "Kelas Interaktif Live + Kirim Kit ke Rumah", "Paket Langganan 4 Sesi Bulanan"],
      dimensions: "Usia 3–9 Tahun | Termasuk Kit Bahan Eksplorasi Lengkap & Sertifikat Anak",
      leadTime: "Jadwal Setiap Sabtu & Minggu — Konfirmasi Instan",
      image:
        "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=1200&q=85",
      hoverImage:
        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=85",
      description:
        "Kelas eksplorasi interaktif yang dipandu fasilitator edukasi KutakKatik.id. Anak diajak merakit proyek mekanika sederhana, eksperimen warna alami, dan prakarya tangan yang menumbuhkan rasa percaya diri serta keingintahuan ilmiah."
    },
    {
      id: "prod-kit-meronce-motorik",
      name: "Kit Meronce, Tenun & Koordinasi Motorik Halus",
      slug: "kit-meronce-tenun-motorik-halus",
      category: "Sensory Play",
      price: 11, // Rp 176.000
      compareAtPrice: null,
      stock: 28,
      featured: false,
      featuredSlot: null,
      badge: "Persiapan Menulis",
      rating: 4.9,
      reviewCount: 22,
      finishes: ["Manik Kayu Bumi & Tali Katun", "Bingkai Tenun Mini & Benang Wol Alami", "Bundling Meronce + Tenun"],
      dimensions: "Pouch Linen 24×18 cm | 60 Manik Geometri Kayu + 4 Jarum Kayu Tumpul Aman",
      leadTime: "Ready Stock — Dikirim dalam 1–2 hari kerja",
      image:
        "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=1200&q=85",
      hoverImage:
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85",
      description:
        "Menguatkan otot jari tangan (pincer grasp) sebagai fondasi utama sebelum anak belajar memegang pensil dan menulis. Melatih konsentrasi, pengenalan pola warna, dan ketekunan dengan material kayu dan katun organik."
    },
    {
      id: "prod-busy-board-montessori",
      name: "Papan Aktivitas Busy Board Eksplorasi Mekanik",
      slug: "papan-aktivitas-busy-board-montessori",
      category: "Mainan Edukatif",
      price: 24, // Rp 384.000
      compareAtPrice: 28,
      stock: 11,
      featured: false,
      featuredSlot: null,
      badge: "Rekomendasi Terapis",
      rating: 5.0,
      reviewCount: 33,
      finishes: ["Edisi Kemandirian Harian (14 Aktivitas)", "Edisi Roda Gigi & Kunci Logika (18 Aktivitas)"],
      dimensions: "Papan Birch Solid 45×35 cm | Sudut Membulat Halus & Komponen Kuningan Kokoh",
      leadTime: "Ready Stock — Dikirim dalam 1–3 hari kerja",
      image:
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=85",
      hoverImage:
        "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=85",
      description:
        "Dirancang untuk memfasilitasi rasa ingin tahu anak terhadap benda-benda di sekitarnya secara aman. Dilengkapi gerendel kuningan, roda gigi kayu, sakelar taktil, tali sepatu, dan labirin logika untuk melatih kemandirian (practical life skills)."
    },
    {
      id: "prod-kit-kriya-tanah-liat",
      name: "Kit Kriya Tanah Liat Alami & Botani Anak",
      slug: "kit-kriya-tanah-liat-botani-anak",
      category: "Sensory Play",
      price: 14, // Rp 224.000
      compareAtPrice: null,
      stock: 19,
      featured: false,
      featuredSlot: null,
      badge: "Tanpa Oven / Air-Dry",
      rating: 4.8,
      reviewCount: 19,
      finishes: ["Terracotta Air-Dry Clay Set", "Stoneware Chalk & Botanical Press", "Paket Keluarga (1.5 Kg Clay)"],
      dimensions: "Box 25×20×9 cm | 1 Kg Air-Dry Clay Alami, Alat Ukir Kayu, & Pigmen Mineral",
      leadTime: "Ready Stock — Dikirim dalam 1–2 hari kerja",
      image:
        "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=85",
      hoverImage:
        "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=85",
      description:
        "Mengajak anak merasakan tekstur tanah liat alami yang mengering sendiri tanpa perlu dibakar oven. Anak dapat mencetak jejak daun, membuat mangkuk kecil, dan melukisnya dengan pigmen warna bumi yang aman di kulit."
    }
  ],

  spaces: [
    {
      id: "space-03",
      number: "01",
      total: "04",
      location: "RUANG EKSPLORASI · JAKARTA SELATAN",
      title: "STUDIO BERMAIN TANPA GADGET",
      summary:
        "Pojok eksplorasi rumah dan studio belajar ramah anak yang dirancang untuk menumbuhkan fokus, imajinasi, dan kemandirian melalui material alami.",
      architect: "Tim Kurator Edukasi KutakKatik.id",
      year: "2026",
      featuredProductIds: ["prod-sensory-play-lengkap", "prod-kit-sains-alam"],
      mainArchImage:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
      leftThumbImage:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      rightDetailImage:
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
      story:
        "Dirancang dengan prinsip Montessori dan estetika hangat yang menenangkan sensorik anak (tidak berlebihan warna mencolok yang memicu overstimulasi). Setiap rak rendah memudahkan anak memilih sendiri Kit Eksplorasi Sains, Sensory Play, dan Balok Kayu mereka, lalu merapikannya kembali secara mandiri."
    },
    {
      id: "space-01",
      number: "02",
      total: "04",
      location: "RUANG KELUARGA · BSD & BINTARO",
      title: "POJOK KUTAK-KATIK DI RUMAH",
      summary:
        "Transformasi sudut ruang keluarga menjadi area eksplorasi kreatif yang membuat anak betah beraktivitas berjam-jam tanpa meminta layar gadget.",
      architect: "Konsultasi Ruang Main KutakKatik.id",
      year: "2026",
      featuredProductIds: ["prod-sensory-play-lengkap", "prod-balok-kayu-konstruksi", "prod-kit-kriya-tanah-liat"],
      mainArchImage:
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85",
      leftThumbImage:
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
      rightDetailImage:
        "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=600&q=80",
      story:
        "Dengan rotasi mainan mingguan menggunakan Kotak Kutak-Katik Sensory Play dan Balok Konstruksi Natural, ruang keluarga tetap rapi dan estetis sekaligus menjadi laboratorium tumbuh kembang yang hangat bagi orang tua dan anak."
    },
    {
      id: "space-02",
      number: "03",
      total: "04",
      location: "KELAS AKHIR PEKAN · BANDUNG",
      title: "KELAS KRIYA & SAINS CILIK",
      summary:
        "Sesi bermain terarah bersama fasilitator tumbuh kembang untuk melatih keberanian mencoba, kerja sama tim, dan motorik halus.",
      architect: "Program Kelas KutakKatik.id",
      year: "2026",
      featuredProductIds: ["prod-kelas-kreatif-akhir-pekan", "prod-kit-meronce-motorik"],
      mainArchImage:
        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=85",
      leftThumbImage:
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
      rightDetailImage:
        "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=600&q=80",
      story:
        "Setiap akhir pekan, anak-anak berkumpul untuk bereksperimen dengan bahan alam, merakit karya kayu, dan bercerita di depan teman sebaya—membangun kemampuan komunikasi dan kepercayaan diri sejak usia dini."
    },
    {
      id: "space-04",
      number: "04",
      total: "04",
      location: "MITRA SEKOLAH · SURABAYA & BALI",
      title: "LABORATORIUM EKSPLORASI PAUD",
      summary:
        "Pengadaan kit edukasi terkurasi dan sudut sensorik untuk sekolah, TK/PAUD, serta pusat terapi tumbuh kembang anak.",
      architect: "Divisi Kemitraan Sekolah KutakKatik.id",
      year: "2026",
      featuredProductIds: ["prod-paket-sekolah-paud", "prod-busy-board-montessori"],
      mainArchImage:
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85",
      leftThumbImage:
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
      rightDetailImage:
        "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80",
      story:
        "Mendukung sekolah dan pendidik menghadirkan pembelajaran berbasis eksplorasi nyata (hands-on learning) yang selaras dengan tahap perkembangan sensorik dan motorik anak."
    }
  ],

  journalPosts: [
    {
      id: "journal-1",
      category: "TUMBUH KEMBANG",
      date: "OKTOBER 2026",
      title: "Mengapa Permainan Sensorik Tanpa Gadget Meningkatkan Fokus & Regulasi Emosi Anak",
      excerpt:
        "Bagaimana aktivitas meraba tekstur tanah liat, meronce kayu, dan menuang biji-bijian membantu perkembangan saraf sensorik serta ketenangan anak.",
      image:
        "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80",
      readTime: "4 MENIT BACA"
    },
    {
      id: "journal-2",
      category: "PANDUAN ORANG TUA",
      date: "SEPTEMBER 2026",
      title: "Cara Menata Pojok Eksplorasi Montessori di Rumah agar Anak Mandiri",
      excerpt:
        "Tips praktis memilih 4–5 kit eksplorasi di rak terbuka agar anak mudah memilih aktivitas sendiri tanpa cepat bosan.",
      image:
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80",
      readTime: "5 MENIT BACA"
    },
    {
      id: "journal-3",
      category: "IDE BERMAIN HARIAN",
      date: "AGUSTUS 2026",
      title: "5 Eksperimen Sains & Alam Sederhana untuk Akhir Pekan Bersama Si Kecil",
      excerpt:
        "Kumpulan ide aktivitas 20 menit yang seru untuk memantik rasa ingin tahu ilmiah dan mempererat ikatan orang tua dan anak.",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
      readTime: "5 MENIT BACA"
    }
  ],

  vouchers: [
    {
      code: "KUTAKKATIK10",
      discountPercent: 10,
      description: "Diskon 10% untuk pembelian pertama Kit Eksplorasi & Mainan Edukatif",
      active: true
    },
    {
      code: "MITRA20",
      discountPercent: 20,
      description: "Diskon 20% khusus Mitra Sekolah, PAUD, Daycare & Terapis Tumbuh Kembang",
      active: true
    },
    {
      code: "WELCOME10",
      discountPercent: 10,
      description: "Diskon 10% Sambutan Keluarga Baru KutakKatik.id",
      active: true
    }
  ],

  users: [
    {
      id: "usr-admin",
      name: "Admin KutakKatik.id",
      email: "admin@kutakkatik.com",
      username: "admin",
      password: "admin123",
      role: "admin",
      company: "KutakKatik.id HQ",
      joinedAt: "2026-01-10"
    },
    {
      id: "usr-trade",
      name: "Ibu Nadia Putri (Kepala Sekolah PAUD)",
      email: "trade@kutakkatik.com",
      username: "trade",
      password: "trade123",
      role: "trade",
      company: "Taman Eksplorasi Anak Ceria",
      joinedAt: "2026-03-18"
    },
    {
      id: "usr-customer",
      name: "Bunda Rania & Adrian",
      email: "customer@kutakkatik.com",
      username: "customer",
      password: "user123",
      role: "customer",
      company: "Keluarga KutakKatik",
      joinedAt: "2026-06-04"
    }
  ],

  orders: [
    {
      id: "KK-2026-8401",
      createdAt: "2026-10-24T09:30:00Z",
      customerName: "Ibu Nadia Putri",
      customerEmail: "trade@kutakkatik.com",
      customerPhone: "+62 812 9400 1122",
      shippingAddress: "Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan 12190",
      shippingMethod: "Pengiriman Kurir Reguler Terasuransi",
      paymentMethod: "Bank Transfer / Virtual Account",
      status: "Shipped",
      paymentStatus: "Verified",
      paymentSenderName: "Nadia Putri",
      paymentSenderBank: "BCA",
      paymentNotes: "Lunas Pengadaan Kit Eksplorasi PAUD KK-2026-8401",
      paymentUploadedAt: "2026-10-24T10:05:00Z",
      paymentVerifiedAt: "2026-10-24T10:30:00Z",
      paymentVerifiedBy: "admin@kutakkatik.com",
      voucherCode: "MITRA20",
      subtotal: 46,
      discount: 9,
      shippingCost: 0,
      total: 37,
      items: [
        {
          productId: "prod-sensory-play-lengkap",
          name: "Kotak Kutak-Katik Sensory Play & Motorik Lengkap",
          finish: "Tema Eksplorasi Hutan & Bumi",
          price: 28,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=400&q=80"
        },
        {
          productId: "prod-kit-sains-alam",
          name: "Kit Eksplorasi Sains & Alam Montessori",
          finish: "Usia 3–5 Tahun (Pra-Sekolah)",
          price: 18,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=400&q=80"
        }
      ]
    },
    {
      id: "KK-2026-8402",
      createdAt: "2026-10-25T15:45:00Z",
      customerName: "Bunda Rania & Adrian",
      customerEmail: "customer@kutakkatik.com",
      customerPhone: "+62 811 3200 8899",
      shippingAddress: "Jl. Bintaro Utama Sektor 9 No. 14, Tangerang Selatan 15229",
      shippingMethod: "Kurir Instan / Same Day",
      paymentMethod: "QRIS (Statis / Dinamis)",
      status: "Pending",
      paymentStatus: "Waiting Verification",
      paymentSenderName: "Rania Pratama",
      paymentSenderBank: "QRIS GoPay / BCA Mobile",
      paymentNotes: "Pembayaran QRIS untuk Busy Board & Balok Kayu",
      paymentUploadedAt: "2026-10-25T16:00:00Z",
      voucherCode: null,
      subtotal: 39,
      discount: 0,
      shippingCost: 0,
      total: 39,
      items: [
        {
          productId: "prod-busy-board-montessori",
          name: "Papan Aktivitas Busy Board Eksplorasi Mekanik",
          finish: "Edisi Kemandirian Harian (14 Aktivitas)",
          price: 24,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80"
        },
        {
          productId: "prod-balok-kayu-konstruksi",
          name: "Balok Kayu Konstruksi & Geometri Natural",
          finish: "Natural Kayu Sungkai (48 Pcs)",
          price: 15,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=400&q=80"
        }
      ]
    }
  ],

  reviews: [
    {
      id: "rev-1",
      productId: "prod-sensory-play-lengkap",
      author: "Bunda Dinda — Ibu 2 Anak (Usia 3 & 6 Tahun)",
      rating: 5,
      date: "2026-10-12",
      comment:
        "Sejak ada Kotak Kutak-Katik Sensory Play ini di rumah, anak-anak pulang sekolah langsung sibuk bereksplorasi tanpa minta HP lagi. Panduan aktivitasnya sangat membantu orang tua!"
    },
    {
      id: "rev-2",
      productId: "prod-kit-sains-alam",
      author: "Pak Hendra W. — Ayah & Pendidik",
      rating: 5,
      date: "2026-10-19",
      comment:
        "Kualitas material kayunya sangat halus dan eksperimen sainsnya mudah dipraktikkan bersama anak di akhir pekan."
    }
  ]
};
