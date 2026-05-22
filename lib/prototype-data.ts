export type Metric = {
  label: string;
  value: string;
  detail: string;
};

export type Journey = {
  slug: string;
  title: string;
  owner: string;
  summary: string;
  steps: { step: string; note: string }[];
};

export type ModuleCard = {
  name: string;
  category: string;
  description: string;
  screens: string[];
};

export type QueueLane = {
  title: string;
  description: string;
  items: string[];
};

export type DataEntity = {
  name: string;
  purpose: string;
  fields: string[];
};

export type ComplianceTrack = {
  title: string;
  description: string;
  impacts: string[];
};

export const dashboardMetrics: Metric[] = [
  {
    label: "Modul inti MVP",
    value: "9",
    detail: "Front office, clinical core, support, finance, reports.",
  },
  {
    label: "Skenario prioritas",
    value: "3",
    detail: "Rawat jalan, UGD ke rawat inap, support sampai billing.",
  },
  {
    label: "Peran operasional",
    value: "9",
    detail: "Pendaftaran sampai manajemen laporan.",
  },
  {
    label: "Gelombang lanjutan",
    value: "11",
    detail: "IBS, gizi, aset, pengadaan, laundry, CSSD, dan lainnya.",
  },
];

export const journeys: Journey[] = [
  {
    slug: "rajal",
    title: "Rawat Jalan",
    owner: "Front office, perawat poli, dokter poli, farmasi, kasir",
    summary:
      "Skenario dasar untuk pasien umum dan BPJS dari registrasi sampai pembayaran serta penutupan kunjungan.",
    steps: [
      {
        step: "Registrasi dan verifikasi pasien",
        note: "Cari pasien lama atau buat pasien baru, lalu tentukan penjamin dan poli tujuan.",
      },
      {
        step: "Asesmen awal perawat",
        note: "Tanda vital, keluhan utama, dan kesiapan pasien sebelum pemeriksaan dokter.",
      },
      {
        step: "Pemeriksaan dan order",
        note: "Dokter isi diagnosa, tindakan, resep, atau order penunjang jika diperlukan.",
      },
      {
        step: "Hasil layanan dan checkout",
        note: "Hasil lab/radiologi ditinjau, billing terbentuk, lalu kasir menutup transaksi.",
      },
    ],
  },
  {
    slug: "ugd-ranap",
    title: "UGD ke Rawat Inap",
    owner: "UGD, dokter jaga, admission, perawat ruangan, DPJP",
    summary:
      "Skenario kritis yang menyatukan triase, tindakan emergensi, admission, bed management, dan discharge.",
    steps: [
      {
        step: "Penerimaan pasien UGD",
        note: "Registrasi cepat, triase, dan klasifikasi pasien sesuai urgensi klinis.",
      },
      {
        step: "Tindakan emergensi dan order",
        note: "Dokter mengisi tindakan awal, obat, dan order penunjang untuk stabilisasi.",
      },
      {
        step: "Keputusan rawat inap",
        note: "Pasien dipindahkan ke rawat inap, ICU, HDU, atau perinatologi sesuai kondisi.",
      },
      {
        step: "Perawatan hingga discharge",
        note: "Tim klinis menjalankan catatan perawatan harian, mutasi bed, dan ringkasan pulang.",
      },
    ],
  },
  {
    slug: "support-billing",
    title: "Support, Farmasi, Billing",
    owner: "Lab, radiologi, farmasi, kasir, rekam medik",
    summary:
      "Skenario horizontal untuk memastikan semua order, hasil, biaya, dan kelengkapan berkas melekat ke encounter yang sama.",
    steps: [
      {
        step: "Order diterima per unit",
        note: "Work queue per unit menampilkan antrean berdasarkan prioritas, waktu order, dan lokasi pasien.",
      },
      {
        step: "Hasil dan dispensing",
        note: "Petugas mengisi hasil lab/radiologi atau menyiapkan obat lalu menandai status selesai.",
      },
      {
        step: "Biaya otomatis terbentuk",
        note: "Setiap order dan tindakan menghasilkan billing item yang bisa diaudit.",
      },
      {
        step: "Kelengkapan rekam medis",
        note: "Encounter ditutup bersama checklist kelengkapan dan bahan laporan harian.",
      },
    ],
  },
];

export const mvpModules: ModuleCard[] = [
  {
    name: "Registrasi Pasien",
    category: "Front Office",
    description:
      "Master pasien, registrasi umum/BPJS, antrean, dan pembukaan encounter.",
    screens: ["Pencarian pasien", "Pasien baru", "Registrasi kunjungan", "Antrean poli"],
  },
  {
    name: "Rawat Jalan",
    category: "Clinical",
    description:
      "Pemeriksaan dokter, diagnosa, tindakan, order penunjang, dan resume kunjungan.",
    screens: ["Detail kunjungan", "Asesmen awal", "Pemeriksaan dokter", "Resume kunjungan"],
  },
  {
    name: "UGD",
    category: "Clinical",
    description:
      "Triase, tindakan emergensi, keputusan rawat lanjut, dan handover admission.",
    screens: ["Registrasi cepat", "Triase", "Tindakan UGD", "Keputusan akhir"],
  },
  {
    name: "Rawat Inap",
    category: "Clinical",
    description:
      "Admission, room placement, catatan harian, mutasi ruang, dan discharge.",
    screens: ["Admission", "Detail rawat inap", "Catatan perawatan", "Discharge"],
  },
  {
    name: "Rekam Medik",
    category: "Records",
    description:
      "Resume medis, status kelengkapan, diagnosis, dan kontrol dokumentasi episode.",
    screens: ["Resume medis", "Checklist berkas", "Riwayat encounter"],
  },
  {
    name: "Penunjang Medis",
    category: "Support",
    description:
      "Order laboratorium dan radiologi, hasil, verifikasi, serta queue per unit.",
    screens: ["Daftar order", "Detail order", "Hasil pemeriksaan"],
  },
  {
    name: "Farmasi",
    category: "Support",
    description:
      "Verifikasi resep, dispensing, penyerahan obat, dan status order farmasi.",
    screens: ["Daftar resep", "Verifikasi", "Penyerahan obat"],
  },
  {
    name: "Billing & Admin",
    category: "Finance",
    description:
      "Billing item, pembayaran pasien umum, dan penandaan penjamin/BPJS.",
    screens: ["Rekap biaya", "Pembayaran", "Bukti bayar"],
  },
  {
    name: "Laporan Dasar",
    category: "Reports",
    description:
      "Kunjungan harian, admission, pasien pulang, order penunjang, dan pendapatan per unit.",
    screens: ["Dashboard harian", "Laporan unit", "Ringkasan pendapatan"],
  },
];

export const waveTwoModules: ModuleCard[] = [
  {
    name: "IBS & Kamar Bedah",
    category: "Wave 2",
    description: "Jadwal operasi, alur pasien kamar bedah, dan operasi elektif.",
    screens: ["Booking operasi", "Check kesiapan", "Catatan tindakan"],
  },
  {
    name: "Gizi",
    category: "Wave 2",
    description: "Asesmen gizi, diet pasien, distribusi makanan, dan evaluasi.",
    screens: ["Order diet", "Distribusi makanan", "Monitoring diet"],
  },
  {
    name: "Aset & Pengadaan",
    category: "Wave 2",
    description: "Asset register, maintenance, inventory, dan procurement request.",
    screens: ["Daftar aset", "Work order", "Permintaan pengadaan"],
  },
  {
    name: "K3, CSSD, Sanitasi, Laundry",
    category: "Wave 2",
    description:
      "Modul penunjang lanjutan untuk keselamatan, steril, kebersihan, dan operasional linen.",
    screens: ["Incident log", "Cycle steril", "Task sanitasi", "Worklist laundry"],
  },
];

export const frontOfficeQueues: QueueLane[] = [
  {
    title: "Registrasi Pagi",
    description: "Arus pasien yang datang langsung ke front office.",
    items: [
      "Pasien baru BPJS dengan poli penyakit dalam",
      "Pasien lama umum untuk MCU",
      "Kontrol fisioterapi terjadwal",
    ],
  },
  {
    title: "Admission dari UGD",
    description: "Kasus yang perlu room placement cepat.",
    items: [
      "Suspek stroke menunggu bed ICU",
      "Pasien PONEK menunggu ruang bersalin",
      "Anak demam observasi ke ruang ranap",
    ],
  },
  {
    title: "Verifikasi Penjamin",
    description: "Langkah admin sebelum encounter bisa berjalan mulus.",
    items: [
      "Nomor SEP belum lengkap",
      "Rujukan kadaluarsa butuh override",
      "Pasien umum minta pindah penjamin perusahaan",
    ],
  },
];

export const supportQueues: QueueLane[] = [
  {
    title: "Laboratorium",
    description: "Queue order berdasarkan prioritas dan unit peminta.",
    items: [
      "CBC + Kimia darah dari UGD prioritas tinggi",
      "PA dari rawat inap menunggu validasi spesimen",
      "Paket MCU rawat jalan batch pagi",
    ],
  },
  {
    title: "Radiologi",
    description: "Order imaging yang butuh koordinasi pasien dan hasil.",
    items: [
      "Thorax UGD menunggu hasil cepat",
      "USG kontrol ranap perlu slot sore",
      "Radiologi poli dengan permintaan cetak hasil",
    ],
  },
  {
    title: "Farmasi",
    description: "Resep dipilah antara racikan, non-racikan, dan rawat inap.",
    items: [
      "Resep pulang pasien rajal umum",
      "Obat UGD stat untuk tindakan cepat",
      "Distribusi obat rutin ke ruang rawat inap",
    ],
  },
];

export const complianceTracks: ComplianceTrack[] = [
  {
    title: "Akreditasi KARS",
    description:
      "Menuntut jejak bukti pelayanan, dokumen pendukung, dan konsistensi alur operasional.",
    impacts: [
      "Checklist kelengkapan rekam medis per encounter",
      "Status proses layanan dan bukti siapa melakukan apa",
      "Ringkasan laporan unit yang mudah diaudit",
    ],
  },
  {
    title: "Rekam Medis & Satu Data",
    description:
      "Menekankan struktur identitas pasien, episode layanan, kelengkapan diagnosis, dan standardisasi data.",
    impacts: [
      "MRN tunggal per pasien",
      "Encounter sebagai inti transaksi",
      "Timestamp dan user pada semua aksi penting",
    ],
  },
  {
    title: "Pelayanan, Farmasi, Keselamatan",
    description:
      "Membutuhkan kontrol order, hasil, farmasi, dan jejak klinis yang bisa ditelusuri ulang.",
    impacts: [
      "Status order dari dibuat sampai selesai",
      "Verifikasi hasil dan dispensing oleh petugas",
      "Data laporan untuk mutu dan keselamatan pasien",
    ],
  },
  {
    title: "Billing & Penjamin",
    description:
      "Memaksa transaksi tetap konsisten antara layanan klinis dan komponen biaya.",
    impacts: [
      "Billing item otomatis dari tindakan dan order",
      "Pemisahan pasien umum, BPJS, dan penjamin lain",
      "Riwayat pembayaran dan bukti transaksi",
    ],
  },
];

export const coreEntities: DataEntity[] = [
  {
    name: "Patient",
    purpose: "Menyimpan identitas tunggal pasien lintas semua episode layanan.",
    fields: ["patient_id", "medical_record_number", "full_name", "insurance_type"],
  },
  {
    name: "Encounter",
    purpose:
      "Pusat semua transaksi layanan, dari registrasi sampai discharge atau pembayaran.",
    fields: ["encounter_id", "patient_id", "visit_type", "care_unit", "status"],
  },
  {
    name: "ClinicalNote",
    purpose: "Menampung asesmen, SOAP, catatan dokter, dan catatan perawat.",
    fields: ["note_id", "encounter_id", "note_type", "author_user_id"],
  },
  {
    name: "Order & OrderItem",
    purpose:
      "Keranjang order penunjang dan farmasi yang bisa diproses tiap unit secara terpisah.",
    fields: ["order_id", "order_type", "priority", "item_name"],
  },
  {
    name: "Admission & BedMovement",
    purpose:
      "Mengontrol perjalanan pasien rawat inap, room placement, dan perpindahan bed.",
    fields: ["admission_id", "room_id", "bed_id", "movement_id"],
  },
  {
    name: "BillingHeader & BillingItem",
    purpose:
      "Menjaga hubungan antara aktivitas klinis dan perhitungan biaya layanan.",
    fields: ["billing_id", "source_type", "subtotal", "billing_status"],
  },
];

export const financeSnapshots = [
  {
    title: "Komponen billing otomatis",
    text:
      "Tindakan dokter, order lab, resep farmasi, dan kamar rawat inap harus bisa membentuk billing item tanpa input ulang panjang.",
  },
  {
    title: "Pemisahan penjamin",
    text:
      "Pasien umum, BPJS, dan penjamin perusahaan tetap memakai encounter yang sama, tetapi aturan pembayaran berbeda.",
  },
  {
    title: "Laporan operasional",
    text:
      "Dashboard harian sebaiknya menyatukan volume layanan, status order, pasien pulang, dan pendapatan dasar per unit.",
  },
];

export const designPrinciples = [
  "Encounter menjadi benang merah antar modul.",
  "Satu layar, satu keputusan operasional utama.",
  "Status proses selalu terlihat dan bisa ditelusuri.",
  "UI mengikuti ritme kerja unit, bukan sekadar daftar menu.",
  "Data dummy sudah meniru struktur SIMRS sungguhan agar transisi ke database nanti mulus.",
];
