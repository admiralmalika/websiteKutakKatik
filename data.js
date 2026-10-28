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
      name: "Kit Eksplorasi Montessori 3-Part Cards & Baki Kayu (Usia 3–5 Tahun)",
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
      recommendedAge: "Aman untuk usia 3 tahun ke atas (3–5 Tahun / Pra-Sekolah)",
      safetyMaterial:
        "Kayu pinus & sungkai solid lokal dengan finishing beeswax alami dan cat water-based non-toxic (bebas BPA, timbal & ftalat), dilengkapi kartu edukasi 3-Part Cards berlaminasi food-grade dengan sudut tumpul (rounded corners).",
      safetyWarning:
        "Aman untuk usia 3 tahun ke atas. Gunakan dengan pendampingan orang tua; pastikan komponen kartu dan objek eksplorasi kecil tidak dimasukkan ke dalam mulut (risiko tersedak/tertelan untuk anak di bawah 3 tahun).",
      educationalBenefits: [
        "Motorik Halus & Koordinasi Mata-Tangan: Menata kartu pada baki 3 kompartemen kayu melatih otot jari (pincer grasp) sebagai fondasi awal menulis.",
        "Kognitif & Pra-Membaca (Montessori 3-Part Cards): Mencocokkan gambar utuh, gambar objek, dan label kata (seperti seri fauna 'zebra') membangun kosakata, daya ingat visual, dan kesiapan literasi.",
        "Problem-Solving & Logika Dasar (STEM): Melatih anak mengelompokkan, mengamati pola, dan melakukan koreksi mandiri (control of error) tanpa ketergantungan layar gadget."
      ],
      dimensions:
        "Bahan: Kayu Solid Finishing Water-Based Non-Toxic & Kartu Rounded-Corner | Usia: Aman 3+ Tahun (Pra-Sekolah) | Keamanan: Sudut halus bebas serpihan, gunakan dengan pendampingan orang tua",
      leadTime: "Ready Stock — Dikirim dalam 1–2 hari kerja (Termasuk Panduan Pendampingan Orang Tua)",
      image:
        "/uploads/kit-eksplorasi-3-5-tahun-1.jpg",
      hoverImage:
        "/uploads/kit-eksplorasi-3-5-tahun-2.jpg",
      description:
        "Dirancang khusus untuk tahap tumbuh kembang usia pra-sekolah (3–5 tahun), kit eksplorasi Montessori ini melatih motorik halus, fokus kognitif, dan kesiapan pra-membaca melalui metode 3-Part Cards pada baki kayu kompartemen. Anak belajar mencocokkan visual dan kosakata, mengenali pola klasifikasi ilmiah, serta mengasah kemampuan problem-solving dan logika dasar (STEM) secara mandiri melalui koreksi diri (control of error)—memberikan alternatif bermain edukatif yang bermakna tanpa layar gadget.\n\n• Bahan Mainan (Safety & Material): Kayu solid natural dengan cat/pelapis water-based non-toxic & beeswax alami, serta kartu tebal berlaminasi dengan sudut membulat (rounded corners) yang aman bagi tangan anak.\n• Kategori Usia: Aman untuk usia 3 tahun ke atas (3–5 Tahun / Pra-Sekolah).\n• Peringatan Keamanan: Gunakan di bawah pengawasan orang tua. Hindari penggunaan tanpa pendampingan pada anak di bawah 3 tahun apabila terdapat aksesori eksperimen berukuran kecil yang berisiko tertelan."
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
      recommendedAge: "Aman untuk usia 3 tahun ke atas (3–6 Tahun)",
      safetyMaterial:
        "Baki kayu pinus solid berpolesan water-based non-toxic, sendok takar kayu halus, serta komponen sensorik berbahan alami food-grade dan plastik ABS non-toxic bebas BPA.",
      safetyWarning:
        "Perhatian: Memuat komponen kecil (manik kayu, batu sensorik, dan figur mini) yang berisiko tertelan (choking hazard). Wajib didampingi orang tua dan tidak disarankan untuk anak di bawah 3 tahun yang masih berada pada fase oral.",
      educationalBenefits: [
        "Stimulasi Sensorik & Regulasi Emosi: Meraba berbagai tekstur alami membantu kematangan integrasi sensorik dan menenangkan sistem saraf anak.",
        "Motorik Halus & Pra-Menulis: Aktivitas menyendok, menuang, dan menjepit melatih kekuatan otot tangan serta koordinasi bilateral.",
        "Kognitif, Sains & Problem-Solving (STEM): Eksplorasi volume, takaran, dan imajinasi terbuka (open-ended play) memantik daya pikir kritis sejak dini."
      ],
      dimensions:
        "Bahan: Kayu Pinus Water-Based Non-Toxic & Bahan Sensorik Food-Grade | Usia: Aman 3+ Tahun | Peringatan: Memuat komponen kecil, wajib pendampingan orang tua",
      leadTime: "Ready Stock — Dikirim dalam 1–2 hari kerja",
      image:
        "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=85",
      hoverImage:
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85",
      description:
        "Program eksplorasi sensorik terpadu yang dirancang untuk menstimulasi 7 indra anak, memperkuat otot motorik halus (koordinasi mata-tangan saat menuang dan menjepit), serta menjadi pijakan awal pengenalan konsep volume, sebab-akibat, dan problem-solving (STEM). Membantu anak membangun rentang fokus yang panjang dan regulasi emosi yang tenang tanpa ketergantungan gadget.\n\n• Bahan Mainan (Safety & Material): Baki kayu pinus halus dengan finishing water-based non-toxic, alat takar kayu, serta tekstur sensorik food-grade yang aman di kulit.\n• Kategori Usia: Aman untuk usia 3 tahun ke atas.\n• Peringatan Keamanan: Terdapat komponen kecil (figur mini & butiran taktil) yang berisiko tertelan—gunakan selalu dengan pengawasan orang tua."
    },
    {
      id: "prod-balok-kayu-konstruksi",
      name: "Balok Kayu Konstruksi & Geometri Natural (STEM Builder)",
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
      recommendedAge: "Aman untuk usia 3 tahun ke atas (3–8 Tahun)",
      safetyMaterial:
        "100% Kayu Sungkai solid Indonesia bersertifikat SNI dengan polesan beeswax murni & cat water-based non-toxic (bebas bahan kimia berbahaya), seluruh sudut diamplas tumpul (chamfered edges).",
      safetyWarning:
        "Aman untuk usia 3 tahun ke atas. Seluruh balok dirancang dengan ukuran ergonomis anti-telan, namun tetap disarankan bermain di atas alas datar dengan pengawasan orang tua.",
      educationalBenefits: [
        "Logika Dasar, Teknik & Arsitektur (STEM): Mengenalkan konsep gravitasi, keseimbangan, simetri, dan struktur bangunan melalui praktik langsung.",
        "Kognitif & Kecerdasan Spasial: Melatih kemampuan berpikir 3 dimensi, pengenalan bentuk geometri, dan perencanaan bertahap.",
        "Motorik Halus & Ketekunan Emosional: Menyusun menara presisi mengasah kontrol gerak tangan, kesabaran, dan daya juang (problem-solving) saat merancang ulang bangunan."
      ],
      dimensions:
        "Bahan: Kayu Sungkai Solid + Cat Water-Based & Beeswax Non-Toxic (SNI) | Usia: Aman 3+ Tahun | Keamanan: Sudut tumpul bebas serpihan & ukuran aman anti-telan",
      leadTime: "Ready Stock — Dikirim dalam 1–2 hari kerja",
      image:
        "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=1200&q=85",
      hoverImage:
        "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=85",
      description:
        "Menjadi pijakan awal terbaik untuk mengenalkan konsep rekayasa, arsitektur, dan logika dasar (STEM) pada anak usia dini. Saat menyusun dan menyeimbangkan balok geometri, anak secara aktif melatih kecerdasan spasial, koordinasi motorik halus, kemampuan problem-solving, serta ketangguhan mental ketika bereksperimen membangun struktur baru.\n\n• Bahan Mainan (Safety & Material): Kayu sungkai solid pilihan dengan polesan beeswax murni dan cat water-based non-toxic berstandar SNI.\n• Kategori Usia: Aman untuk usia 3 tahun ke atas.\n• Peringatan Keamanan: Ukuran balok dirancang aman (tidak berisiko tertelan), dengan tepian halus bebas serpihan kayu."
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
      recommendedAge: "Aman untuk usia 3–6 tahun (Kelompok Bermain, PAUD & TK)",
      safetyMaterial:
        "Rak & alat peraga kayu solid berpelapis water-based non-toxic, komponen plastik ABS non-toxic tebal, serta kartu belajar laminasi tahan air bersudut tumpul.",
      safetyWarning:
        "Dirancang untuk penggunaan ruang kelas dengan supervisi pendidik/guru. Pisahkan modul eksperimen berkomponen kecil untuk kelompok usia di bawah 3 tahun.",
      educationalBenefits: [
        "Kemandirian & Keterampilan Sosial: Mendorong anak memilih, berbagi, dan merapikan kembali alat eksplorasi secara kolaboratif.",
        "Pengembangan Kognitif, Literasi & Numerasi Awal: Menunjang Kurikulum Merdeka melalui pembelajaran konkret berbasis proyek (hands-on STEM).",
        "Stimulasi Motorik Halus & Kasar Terintegrasi: Mencakup 12 kit rotasi mingguan untuk melatih kesiapan sekolah secara menyeluruh."
      ],
      dimensions:
        "Bahan: Kayu Solid Water-Based Non-Toxic & ABS Non-Toxic (Standar SNI) | Usia: Aman 3–6 Tahun (PAUD/TK) | Keamanan: Sudut furnitur membulat & ramah anak",
      leadTime: "Pre-Order Kurasi Sekolah — 5–7 hari kerja",
      image:
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85",
      hoverImage:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
      description:
        "Solusi edukasi terpadu untuk memfasilitasi tumbuh kembang holistik anak di PAUD, TK, dan Daycare. Mengintegrasikan alat peraga motorik halus, modul literasi-numerasi konkret, dan eksperimen STEM kolaboratif yang melatih kemandirian, empati sosial, serta kemampuan problem-solving anak dalam kelompok.\n\n• Bahan Mainan (Safety & Material): Kayu solid dengan cat water-based non-toxic dan material ABS non-toxic berkualitas tinggi yang tahan pemakaian intensif di kelas.\n• Kategori Usia: Aman untuk usia 3 tahun ke atas (3–6 Tahun / PAUD & TK).\n• Peringatan Keamanan: Gunakan di bawah pendampingan guru/fasilitator, terutama pada modul sains yang memiliki komponen kecil."
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
      recommendedAge: "Aman untuk usia 3 tahun ke atas (Kelompok 3–5 Tahun & 6–9 Tahun)",
      safetyMaterial:
        "Seluruh bahan eksperimen menggunakan material food-grade, pewarna tumbuhan alami, kayu halus water-based, dan peralatan laboratorium anak berbahan plastik ABS non-toxic anti-pecah.",
      safetyWarning:
        "Seluruh sesi dipandu fasilitator edukasi dan wajib didampingi orang tua untuk kelompok usia 3–5 tahun. Bahan eksperimen tidak untuk dikonsumsi.",
      educationalBenefits: [
        "Rasa Ingin Tahu Ilmiah & Logika STEM: Mengenalkan hipotesis sederhana, reaksi warna, dan mekanika dasar secara menyenangkan.",
        "Kepercayaan Diri & Komunikasi: Anak berlatih mempresentasikan hasil karya dan temuannya di depan teman sebaya.",
        "Motorik Halus & Kreativitas Kriya: Merakit, menggunting aman, dan membentuk karya tangan yang menguatkan koordinasi jari."
      ],
      dimensions:
        "Bahan: Kit Eksperimen Food-Grade & Alat Lab Anak ABS Non-Toxic | Usia: Aman 3–9 Tahun | Keamanan: Bebas bahan kimia keras, didampingi fasilitator",
      leadTime: "Jadwal Setiap Sabtu & Minggu — Konfirmasi Instan",
      image:
        "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=1200&q=85",
      hoverImage:
        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=85",
      description:
        "Kelas interaktif yang dirancang untuk menumbuhkan pola pikir kritis (scientific mindset), kemampuan problem-solving, dan koordinasi motorik halus melalui eksperimen sains dan kriya tangan. Anak tidak hanya merakit karya, tetapi belajar memahami logika sebab-akibat (STEM) serta melatih keberanian berkomunikasi.\n\n• Bahan Mainan (Safety & Material): Peralatan tabung/pipet plastik ABS non-toxic anti-pecah, komponen kayu halus, dan bahan reaksi berbasis food-grade yang aman di kulit.\n• Kategori Usia: Aman untuk usia 3 tahun ke atas (terbagi dalam kelas Pra-Sekolah 3–5 tahun & Eksplorasi 6–9 tahun).\n• Peringatan Keamanan: Terdapat komponen rakitan kecil; untuk peserta usia 3–5 tahun wajib didampingi orang tua selama sesi berlangsung."
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
      recommendedAge: "Aman untuk usia 3 tahun ke atas (3+ Tahun)",
      safetyMaterial:
        "Manik geometri kayu solid dengan cat water-based non-toxic, jarum kayu berujung tumpul aman, serta tali katun dan benang wol organik bebas serat sintetis tajam.",
      safetyWarning:
        "Peringatan Keamanan: Mengandung manik-manik kayu dan tali yang berisiko tertelan (choking hazard) atau terlilit jika digunakan tanpa pengawasan pada anak di bawah 3 tahun. Wajib didampingi orang tua.",
      educationalBenefits: [
        "Kekuatan Otot Jari (Pincer Grasp) & Persiapan Menulis: Melatih kelenturan jari dan koordinasi dua tangan sebelum anak memegang pensil.",
        "Kognitif, Pengenalan Pola & Matematika Dasar (STEM): Mengurutkan warna, bentuk geometri, dan ritme pola berulang (AB-AB, ABC-ABC).",
        "Rentang Fokus & Regulasi Diri: Aktivitas memasukkan benang ke lubang manik melatih ketenangan, ketelitian, dan kesabaran tingkat tinggi."
      ],
      dimensions:
        "Bahan: Manik Kayu Cat Water-Based Non-Toxic & Tali Katun Organik | Usia: Aman 3+ Tahun | Peringatan: Memuat manik kecil, tidak untuk anak di bawah 3 tahun tanpa pengawasan",
      leadTime: "Ready Stock — Dikirim dalam 1–2 hari kerja",
      image:
        "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=1200&q=85",
      hoverImage:
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85",
      description:
        "Dirancang secara khusus oleh praktisi tumbuh kembang untuk menguatkan otot motorik halus (pincer grasp) sebagai fondasi utama sebelum anak belajar menulis. Selain melatih koordinasi mata dan tangan, aktivitas meronce berdasarkan kartu pola juga mengasah logika sekuensial, pengenalan algoritma dasar (STEM), serta ketekunan fokus anak.\n\n• Bahan Mainan (Safety & Material): Kayu solid dengan cat water-based non-toxic bertekstur lembut, jarum kayu tumpul, dan tali katun organik.\n• Kategori Usia: Aman untuk usia 3 tahun ke atas.\n• Peringatan Keamanan: Terdapat komponen manik berukuran kecil yang berisiko tertelan (choking hazard) bagi anak di bawah 3 tahun—gunakan selalu dengan pengawasan orang tua."
    },
    {
      id: "prod-busy-board-montessori",
      name: "Papan Aktivitas Busy Board Eksplorasi Mekanik & Logika",
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
      recommendedAge: "Aman untuk usia 3 tahun ke atas (atau 2+ Tahun dengan pendampingan langsung)",
      safetyMaterial:
        "Papan kayu birch lapis solid dengan cat water-based non-toxic, sudut papan membulat penuh (rounded edges), serta komponen mekanik logam bebas karat yang dipasang dengan sekrup pengunci ganda.",
      safetyWarning:
        "Pastikan papan diletakkan pada permukaan datar atau terpasang kokoh. Periksa kekencangan komponen secara berkala dan dampingi anak saat bereksplorasi dengan gerendel mekanik.",
      educationalBenefits: [
        "Problem-Solving & Logika Mekanika (STEM): Memahami cara kerja roda gigi, engsel, sakelar, dan kunci labirin melalui eksplorasi sebab-akibat.",
        "Kemandirian Harian (Practical Life Skills): Melatih keterampilan mengancing baju, mengikat tali sepatu, dan membuka kunci secara mandiri.",
        "Motorik Halus & Kekuatan Pergelangan Tangan: Memutar, menggeser, dan menekan komponen melatih ketangkasan jari dan koordinasi sensorik-motorik."
      ],
      dimensions:
        "Bahan: Papan Birch Solid Cat Water-Based Non-Toxic & Komponen Terkunci Kokoh | Usia: Aman 3+ Tahun | Keamanan: Sudut membulat halus, bebas cat beracun",
      leadTime: "Ready Stock — Dikirim dalam 1–3 hari kerja",
      image:
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=85",
      hoverImage:
        "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=85",
      description:
        "Memfasilitasi rasa ingin tahu alami anak terhadap cara kerja benda mekanik di sekitarnya secara aman dan terstruktur. Melalui 14–18 tantangan roda gigi, kunci logika, dan simulasi aktivitas harian (practical life skills), papan ini melatih kemampuan problem-solving (STEM), kemandirian, serta ketangkasan motorik halus jari dan pergelangan tangan.\n\n• Bahan Mainan (Safety & Material): Kayu birch solid dengan finishing water-based non-toxic, tepian membulat halus, dan komponen mekanik yang terpasang permanen.\n• Kategori Usia: Aman untuk usia 3 tahun ke atas.\n• Peringatan Keamanan: Seluruh komponen kecil telah dibaut permanen pada papan; tetap gunakan di bawah pengawasan orang tua agar jari anak tidak terjepit saat belajar mengoperasikan gerendel."
    },
    {
      id: "prod-kit-kriya-tanah-liat",
      name: "Kit Kriya Tanah Liat Alami & Eksplorasi Botani Anak",
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
      recommendedAge: "Aman untuk usia 3 tahun ke atas (3+ Tahun)",
      safetyMaterial:
        "Tanah liat mineral alami (air-dry clay non-toxic) bebas gluten & bahan kimia keras, alat ukir kayu berujung tumpul, serta cat pigmen mineral berbasis air (water-based non-toxic) yang mudah dibersihkan.",
      safetyWarning:
        "Tanah liat dan pigmen warna tidak untuk dimakan. Gunakan dengan pendampingan orang tua dan cuci tangan anak setelah selesai berkarya.",
      educationalBenefits: [
        "Kekuatan Otot Tangan & Sensorik Taktil: Meremas, memilin, dan membentuk tanah liat menguatkan otot telapak dan jari tangan secara intensif.",
        "Pengenalan Sains Botani & Tekstur Alam (STEM): Mengamati struktur tulang daun dan mencetak fosil botani melatih kepekaan observasi ilmiah.",
        "Imajinasi Spasial 3D & Ekspresi Diri: Mengubah bentuk datar menjadi objek tiga dimensi menumbuhkan kreativitas dan rasa bangga atas karya sendiri."
      ],
      dimensions:
        "Bahan: Air-Dry Clay Mineral Non-Toxic, Alat Kayu Tumpul & Cat Water-Based | Usia: Aman 3+ Tahun | Peringatan: Tidak untuk dikonsumsi, gunakan dengan pendampingan orang tua",
      leadTime: "Ready Stock — Dikirim dalam 1–2 hari kerja",
      image:
        "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=85",
      hoverImage:
        "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=85",
      description:
        "Menggabungkan stimulasi motorik halus tiga dimensi dengan eksplorasi sains botani. Saat meremas tanah liat, mencetak struktur tulang daun, dan merancang bentuk objek, anak menguatkan otot tangan secara menyeluruh sekaligus belajar mengamati detail alam, struktur bentuk, dan proses perubahan wujud benda (STEM).\n\n• Bahan Mainan (Safety & Material): Tanah liat alami tanpa bakar (air-dry clay non-toxic), alat pembentuk kayu tumpul, dan cat water-based yang aman bagi kulit sensitif.\n• Kategori Usia: Aman untuk usia 3 tahun ke atas.\n• Peringatan Keamanan: Bahan tidak untuk ditelan/dimakan. Dampingi anak usia dini selama bermain dan bilas tangan dengan air bersih seusai aktivitas."
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
      category: "TUMBUH KEMBANG & STEM",
      date: "OKTOBER 2026",
      title: "Mengapa Permainan Sensorik & Montessori 3-Part Cards Meningkatkan Fokus, Motorik Halus & Logika Anak",
      excerpt:
        "Bagaimana aktivitas menata kartu 3-Part Cards pada baki kayu, meraba tekstur tanah liat, dan meronce membantu perkembangan saraf sensorik, kesiapan menulis, serta logika problem-solving (STEM).",
      content:
        "Pada usia emas (golden age 2–6 tahun), otak anak menyerap informasi paling efektif melalui pengalaman konkret tangan dan indra (hands-on learning). Aktivitas seperti mencocokkan kartu Montessori 3-Part Cards pada baki kayu 3 kompartemen, memindahkan biji-bijian dengan sendok kayu, hingga menyusun balok geometri secara langsung melatih otot motorik halus (pincer grasp) yang menjadi fondasi menulis, sekaligus menumbuhkan logika klasifikasi dan problem-solving (STEM) tanpa ketergantungan layar gadget.",
      image:
        "/uploads/kit-eksplorasi-3-5-tahun-2.jpg",
      readTime: "4 MENIT BACA"
    },
    {
      id: "journal-2",
      category: "KEAMANAN & GARANSI BELANJA",
      date: "OKTOBER 2026",
      title: "Standar Material Non-Toxic, Pengemasan Tahan Benturan, & Garansi 100% Pengembalian (Return/Refund Policy)",
      excerpt:
        "Panduan lengkap FAQ orang tua seputar keamanan kayu water-based non-toxic, standar pengemasan berlapis, serta jaminan 100% tukar baru / refund jika barang diterima cacat.",
      content:
        "Kepercayaan orang tua adalah prioritas utama KutakKatik.id. Seluruh mainan kami menggunakan kayu solid lokal berpelapis beeswax alami & cat water-based non-toxic (bebas BPA, timbal & ftalat), plastik ABS non-toxic, serta kartu bersudut tumpul (rounded corners). Setiap paket dikemas berlapis tahan benturan dan dilindungi Kebijakan Pengembalian (Return/Refund Policy) 7 Hari: apabila produk diterima dalam keadaan cacat atau kurang komponen, kami mengganti dengan unit baru 100% Gratis Ongkir atau pengembalian dana penuh dalam 1×24 jam.",
      image:
        "/uploads/kit-eksplorasi-3-5-tahun-1.jpg",
      readTime: "FAQ & GARANSI"
    },
    {
      id: "journal-3",
      category: "TENTANG KAMI & VISI EDUKASI",
      date: "SEPTEMBER 2026",
      title: "Visi KutakKatik.id: Menghadirkan Pojok Eksplorasi Berkualitas di Rumah & Sekolah Tanpa Ketergantungan Gadget",
      excerpt:
        "Cerita di balik kurasi mainan edukatif kami bersama pendidik dan praktisi tumbuh kembang untuk melatih kemandirian, imajinasi, dan keingintahuan ilmiah si kecil.",
      content:
        "KutakKatik.id lahir dari visi sederhana namun kuat: setiap anak berhak menikmati masa kecil yang kaya eksplorasi nyata bersama orang tua, bukan sekadar menatap layar pasif. Karena itu, setiap kit kami dirancang tidak hanya indah secara estetika di ruang keluarga, tetapi memiliki tujuan tumbuh kembang yang terukur—mulai dari stimulasi sensorik, motorik halus, kosakata dwibahasa, hingga pengenalan sains dan rekayasa dasar.",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
      readTime: "TENTANG KAMI"
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
