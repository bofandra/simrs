/* SIMRS Baru • Role → Worklist → Module → FR → Workflow (PRD final 2026-11-06).
 * This is a visual-only role-oriented prototype: no clinical signing, dispense,
 * posting, payer submission, real patient data or real authorization server.
 * Real authorization remains the responsibility of the production backend.
 */
(function(){
"use strict";
var profiles={
 "Pendaftaran": {
  "unit": "Loket pendaftaran",
  "focus": "Pasien, kunjungan, antrean dan janji temu",
  "workflow": "WF-01",
  "features": [
   {
    "key": "m0",
    "label": "Identitas pasien",
    "code": "CORE-08",
    "fr": "FR-004",
    "wf": "WF-01",
    "task": "Tinjau kandidat pasien sebelum membuat identitas"
   },
   {
    "key": "m1",
    "label": "Registrasi kunjungan",
    "code": "CORE-09",
    "fr": "FR-006",
    "wf": "WF-01",
    "task": "Verifikasi kunjungan dan check-in tanpa duplikasi"
   },
   {
    "key": "m2",
    "label": "Janji temu",
    "code": "CORE-10",
    "fr": "FR-005",
    "wf": "WF-01",
    "task": "Kelola booking sesuai kuota dokter"
   },
   {
    "key": "m3",
    "label": "Antrean layanan",
    "code": "CORE-11",
    "fr": "FR-007",
    "wf": "WF-01",
    "task": "Panggil atau tunda nomor antrean"
   }
  ]
 },
 "Dokter RJ": {
  "unit": "Poliklinik / dokter",
  "focus": "Pelayanan rawat jalan menurut encounter pasien",
  "workflow": "WF-02",
  "features": [
   {
    "key": "m0",
    "label": "Daftar pasien poli",
    "code": "RME-01",
    "fr": "FR lintas domain",
    "wf": "WF-02",
    "task": "Tinjau pasien yang hadir dan encounter aktif"
   },
   {
    "key": "m1",
    "label": "Asesmen dan SOAP",
    "code": "RME-04",
    "fr": "FR-009",
    "wf": "WF-02",
    "task": "Simpan atau tinjau CPPT sesuai encounter"
   },
   {
    "key": "m2",
    "label": "Diagnosis dan tindakan",
    "code": "RME-06",
    "fr": "FR lintas domain",
    "wf": "WF-02",
    "task": "Tetapkan diagnosis berdasarkan penilaian klinis"
   },
   {
    "key": "m3",
    "label": "Order pemeriksaan",
    "code": "RME-08",
    "fr": "FR-016",
    "wf": "WF-05",
    "task": "Buat order terhubung ke encounter"
   },
   {
    "key": "m4",
    "label": "Resep elektronik",
    "code": "MED-04",
    "fr": "FR-020",
    "wf": "WF-07",
    "task": "Tinjau alergi dan resep pasien"
   },
   {
    "key": "m5",
    "label": "Surat dan resume",
    "code": "RME-11",
    "fr": "FR-013",
    "wf": "WF-02",
    "task": "Siapkan dokumen bersumber catatan signed"
   }
  ]
 },
 "Dokter IGD": {
  "unit": "Instalasi Gawat Darurat",
  "focus": "Triage, tindakan, observasi dan keputusan disposisi",
  "workflow": "WF-03",
  "features": [
   {
    "key": "m0",
    "label": "Pasien dan triase",
    "code": "RME-02",
    "fr": "FR-010",
    "wf": "WF-03",
    "task": "Tinjau pasien dan tingkat kegawatan"
   },
   {
    "key": "m1",
    "label": "Observasi klinis",
    "code": "RME-05",
    "fr": "FR-034",
    "wf": "WF-03",
    "task": "Pantau tanda vital dan perkembangan"
   },
   {
    "key": "m2",
    "label": "Order pemeriksaan",
    "code": "RME-08",
    "fr": "FR-016",
    "wf": "WF-05",
    "task": "Periksa dan buat order klinis"
   },
   {
    "key": "m3",
    "label": "Keputusan disposisi",
    "code": "RME-02",
    "fr": "FR-010",
    "wf": "WF-03",
    "task": "Tentukan rawat inap rujuk atau pulang"
   },
   {
    "key": "m4",
    "label": "Rujukan pasien",
    "code": "RME-10",
    "fr": "FR-014",
    "wf": "WF-09",
    "task": "Pantau status rujukan dan respons penerima"
   }
  ]
 },
 "DPJP Rawat Inap": {
  "unit": "Bangsal rawat inap",
  "focus": "Visite, care plan, terapi dan discharge per episode",
  "workflow": "WF-04",
  "features": [
   {
    "key": "m0",
    "label": "Daftar pasien dirawat",
    "code": "RME-03",
    "fr": "FR-011",
    "wf": "WF-04",
    "task": "Tinjau pasien ruang dan tempat tidur"
   },
   {
    "key": "m1",
    "label": "Visite dan CPPT",
    "code": "RME-04",
    "fr": "FR-009",
    "wf": "WF-04",
    "task": "Tulis catatan klinis harian"
   },
   {
    "key": "m2",
    "label": "Care plan dan tim",
    "code": "RME-09",
    "fr": "FR-012",
    "wf": "WF-04",
    "task": "Tinjau intervensi dan tim perawat"
   },
   {
    "key": "m3",
    "label": "Order dan tindakan",
    "code": "RME-08",
    "fr": "FR-016",
    "wf": "WF-05",
    "task": "Kelola instruksi sesuai encounter"
   },
   {
    "key": "m4",
    "label": "Persiapan pulang",
    "code": "RME-03",
    "fr": "FR-011",
    "wf": "WF-04",
    "task": "Periksa medication reconciliation dan checklist"
   },
   {
    "key": "m5",
    "label": "Resume medis",
    "code": "RME-11",
    "fr": "FR-013",
    "wf": "WF-04",
    "task": "Tinjau dokumen pulang dan tanda tangan"
   },
   {
    "key": "m6",
    "label": "Clinical pathway",
    "code": "ENT-04",
    "fr": "FR-015",
    "wf": "WF-12",
    "task": "Tinjau pathway dan deviasi sesuai pasien dirawat"
   }
  ]
 },
 "Perawat": {
  "unit": "Keperawatan / ruang perawatan",
  "focus": "Penugasan shift, observasi, intervensi, handover",
  "workflow": "WF-04",
  "features": [
   {
    "key": "m0",
    "label": "Pasien shift ini",
    "code": "RME-07",
    "fr": "FR-012",
    "wf": "WF-04",
    "task": "Tinjau daftar pasien sesuai penugasan"
   },
   {
    "key": "m1",
    "label": "TTV dan asesmen",
    "code": "RME-05",
    "fr": "FR-034",
    "wf": "WF-04",
    "task": "Input dan review observasi pasien"
   },
   {
    "key": "m2",
    "label": "Asuhan keperawatan",
    "code": "RME-07",
    "fr": "FR-012",
    "wf": "WF-04",
    "task": "Catat intervensi serta evaluasi"
   },
   {
    "key": "m3",
    "label": "CPPT dan serah terima",
    "code": "RME-04",
    "fr": "FR-009",
    "wf": "WF-04",
    "task": "Tulis catatan atau handover sesuai kewenangan"
   }
  ]
 },
 "Perawat HD": {
  "unit": "Hemodialisis",
  "focus": "Sesi hemodialisis, pemeriksaan dan pemantauan",
  "workflow": "WF-04",
  "features": [
   {
    "key": "m0",
    "label": "Daftar sesi HD",
    "code": "MED-08",
    "fr": "FR-019",
    "wf": "WF-04",
    "task": "Periksa jadwal dan pasien terdaftar"
   },
   {
    "key": "m1",
    "label": "Observasi pra dan intra HD",
    "code": "MED-08",
    "fr": "FR-019",
    "wf": "WF-04",
    "task": "Catat tanda vital selama terapi"
   },
   {
    "key": "m2",
    "label": "Asuhan dan serah terima",
    "code": "RME-07",
    "fr": "FR-012",
    "wf": "WF-04",
    "task": "Tinjau intervensi keperawatan"
   }
  ]
 },
 "Terapis Rehabilitasi": {
  "unit": "Rehabilitasi medik",
  "focus": "Rencana sesi, pelaksanaan terapi dan outcome",
  "workflow": "WF-02",
  "features": [
   {
    "key": "m0",
    "label": "Jadwal terapi",
    "code": "MED-09",
    "fr": "FR-019",
    "wf": "WF-02",
    "task": "Tinjau rencana terapi dan pasien"
   },
   {
    "key": "m1",
    "label": "Catatan sesi",
    "code": "MED-09",
    "fr": "FR-019",
    "wf": "WF-02",
    "task": "Catat tindakan dan kehadiran"
   },
   {
    "key": "m2",
    "label": "Evaluasi outcome",
    "code": "MED-09",
    "fr": "FR-019",
    "wf": "WF-02",
    "task": "Nilai perkembangan dan capaian fungsi"
   }
  ]
 },
 "ATLM": {
  "unit": "Laboratorium",
  "focus": "Spesimen, analyzer, hasil dan verifikasi",
  "workflow": "WF-05",
  "features": [
   {
    "key": "m0",
    "label": "Worklist pemeriksaan",
    "code": "MED-01",
    "fr": "FR-017",
    "wf": "WF-05",
    "task": "Tinjau order pemeriksaan masuk"
   },
   {
    "key": "m1",
    "label": "Penerimaan spesimen",
    "code": "MED-01",
    "fr": "FR-017",
    "wf": "WF-05",
    "task": "Cek barcode dan identitas spesimen"
   },
   {
    "key": "m2",
    "label": "Hasil pemeriksaan",
    "code": "MED-01",
    "fr": "FR-034",
    "wf": "WF-05",
    "task": "Tinjau hasil dan pengecualian analyzer"
   },
   {
    "key": "m3",
    "label": "Verifikasi dan nilai kritis",
    "code": "MED-01",
    "fr": "FR-017",
    "wf": "WF-05",
    "task": "Kelola hasil kritis sesuai SOP"
   }
  ]
 },
 "Petugas MCU": {
  "unit": "Pelayanan MCU",
  "focus": "Registrasi peserta, komponen paket dan hasil pemeriksaan",
  "workflow": "WF-05",
  "features": [
   {
    "key": "m0",
    "label": "Daftar peserta MCU",
    "code": "MED-10",
    "fr": "FR-019",
    "wf": "WF-05",
    "task": "Tinjau peserta dan jadwal paket"
   },
   {
    "key": "m1",
    "label": "Progress pemeriksaan",
    "code": "MED-10",
    "fr": "FR-019",
    "wf": "WF-05",
    "task": "Pantau kelengkapan komponen pemeriksaan"
   },
   {
    "key": "m2",
    "label": "Kelengkapan hasil",
    "code": "MED-10",
    "fr": "FR-019",
    "wf": "WF-05",
    "task": "Tindak lanjuti pemeriksaan tertunda"
   }
  ]
 },
 "Radiografer": {
  "unit": "Instalasi radiologi",
  "focus": "Worklist RIS, pelaksanaan pemeriksaan dan citra",
  "workflow": "WF-06",
  "features": [
   {
    "key": "m0",
    "label": "Worklist radiologi",
    "code": "MED-02",
    "fr": "FR-018",
    "wf": "WF-06",
    "task": "Tinjau order pemeriksaan masuk"
   },
   {
    "key": "m1",
    "label": "Pelaksanaan pemeriksaan",
    "code": "MED-02",
    "fr": "FR-018",
    "wf": "WF-06",
    "task": "Konfirmasi prosedur sesuai order"
   },
   {
    "key": "m2",
    "label": "Status citra dan studi",
    "code": "MED-02",
    "fr": "FR-018",
    "wf": "WF-06",
    "task": "Tinjau kelengkapan studi sebelum ekspertise"
   }
  ]
 },
 "Radiolog": {
  "unit": "Instalasi radiologi / ekspertise",
  "focus": "Interpretasi studi dan laporan radiologi",
  "workflow": "WF-06",
  "features": [
   {
    "key": "m0",
    "label": "Daftar studi dilaporkan",
    "code": "MED-02",
    "fr": "FR-018",
    "wf": "WF-06",
    "task": "Pilih pemeriksaan yang menunggu ekspertise"
   },
   {
    "key": "m1",
    "label": "Viewer PACS",
    "code": "MED-03",
    "fr": "FR-018",
    "wf": "WF-06",
    "task": "Buka citra terhubung pada order dan pasien"
   },
   {
    "key": "m2",
    "label": "Laporan ekspertise",
    "code": "MED-02",
    "fr": "FR-018",
    "wf": "WF-06",
    "task": "Tinjau draft dan verifikasi temuan"
   }
  ]
 },
 "Farmasis": {
  "unit": "Instalasi farmasi",
  "focus": "Telaah resep, penyiapan dan dispensing",
  "workflow": "WF-07",
  "features": [
   {
    "key": "m0",
    "label": "Antrean resep",
    "code": "MED-04",
    "fr": "FR-020",
    "wf": "WF-07",
    "task": "Tinjau resep yang menunggu telaah"
   },
   {
    "key": "m1",
    "label": "Verifikasi resep",
    "code": "MED-04",
    "fr": "FR-037",
    "wf": "WF-07",
    "task": "Periksa alergi interaksi dan restriksi"
   },
   {
    "key": "m2",
    "label": "Penyiapan obat",
    "code": "MED-05",
    "fr": "FR-021",
    "wf": "WF-07",
    "task": "Cek batch lot FEFO sebelum penyerahan"
   },
   {
    "key": "m3",
    "label": "Penyerahan dan riwayat",
    "code": "MED-05",
    "fr": "FR-036",
    "wf": "WF-07",
    "task": "Tinjau bukti dispense sesuai SOP"
   }
  ]
 },
 "Koordinator MCU": {
  "unit": "Koordinasi MCU",
  "focus": "Paket dan kelengkapan layanan MCU",
  "workflow": "WF-05",
  "features": [
   {
    "key": "m0",
    "label": "Paket dan peserta",
    "code": "MED-10",
    "fr": "FR-019",
    "wf": "WF-05",
    "task": "Pantau pendaftaran paket pemeriksaan"
   },
   {
    "key": "m1",
    "label": "Progress dan laporan",
    "code": "MED-10",
    "fr": "FR-019",
    "wf": "WF-05",
    "task": "Review hasil yang belum lengkap"
   }
  ]
 },
 "Petugas Bank Darah": {
  "unit": "Bank darah",
  "focus": "Permintaan komponen, pencocokan dan penyerahan",
  "workflow": "WF-05",
  "features": [
   {
    "key": "m0",
    "label": "Permintaan darah",
    "code": "MED-12",
    "fr": "FR-019",
    "wf": "WF-05",
    "task": "Tinjau permintaan komponen darah"
   },
   {
    "key": "m1",
    "label": "Kecocokan dan stok",
    "code": "MED-12",
    "fr": "FR-019",
    "wf": "WF-05",
    "task": "Tinjau identitas produk serta kecocokan"
   },
   {
    "key": "m2",
    "label": "Serah terima produk",
    "code": "MED-12",
    "fr": "FR-019",
    "wf": "WF-05",
    "task": "Catat bukti penyerahan"
   }
  ]
 },
 "Dokter Anestesi": {
  "unit": "Anestesi / perioperatif",
  "focus": "Pra-anestesi, tindakan dan pemulihan",
  "workflow": "WF-10",
  "features": [
   {
    "key": "m0",
    "label": "Asesmen pra-anestesi",
    "code": "MED-07",
    "fr": "FR lintas domain",
    "wf": "WF-10",
    "task": "Tinjau kesiapan pasien pra tindakan"
   },
   {
    "key": "m1",
    "label": "Intra-operatif",
    "code": "MED-07",
    "fr": "FR lintas domain",
    "wf": "WF-10",
    "task": "Catat monitoring anestesi"
   },
   {
    "key": "m2",
    "label": "Pemulihan PACU",
    "code": "MED-07",
    "fr": "FR lintas domain",
    "wf": "WF-10",
    "task": "Review kondisi dan serah terima"
   }
  ]
 },
 "Koordinator OK": {
  "unit": "Kamar operasi",
  "focus": "Jadwal operasi, kesiapan dan safety checklist",
  "workflow": "WF-10",
  "features": [
   {
    "key": "m0",
    "label": "Jadwal operasi",
    "code": "MED-06",
    "fr": "FR lintas domain",
    "wf": "WF-10",
    "task": "Tinjau daftar kasus hari ini"
   },
   {
    "key": "m1",
    "label": "Checklist keselamatan",
    "code": "MED-06",
    "fr": "FR lintas domain",
    "wf": "WF-10",
    "task": "Cek verifikasi pasien lokasi dan instrumen"
   },
   {
    "key": "m2",
    "label": "Status operasi",
    "code": "MED-06",
    "fr": "FR lintas domain",
    "wf": "WF-10",
    "task": "Pantau kesiapan ruang dan pemulihan"
   }
  ]
 },
 "Ahli Gizi": {
  "unit": "Gizi klinis",
  "focus": "Asesmen, terapi diet dan monitoring",
  "workflow": "WF-11",
  "features": [
   {
    "key": "m0",
    "label": "Daftar konsultasi gizi",
    "code": "MED-11",
    "fr": "FR-024",
    "wf": "WF-11",
    "task": "Tinjau pasien yang butuh asesmen"
   },
   {
    "key": "m1",
    "label": "Order diet pasien",
    "code": "MED-11",
    "fr": "FR-024",
    "wf": "WF-11",
    "task": "Susun dan review diet terkait kondisi"
   },
   {
    "key": "m2",
    "label": "Monitoring intervensi",
    "code": "MED-11",
    "fr": "FR-024",
    "wf": "WF-11",
    "task": "Evaluasi intake dan perubahan diet"
   }
  ]
 },
 "Gudang": {
  "unit": "Gudang logistik",
  "focus": "Lokasi, lot, saldo dan permintaan persediaan",
  "workflow": "WF-07",
  "features": [
   {
    "key": "m0",
    "label": "Saldo dan lot stok",
    "code": "OPS-01",
    "fr": "FR-022",
    "wf": "WF-07",
    "task": "Pantau saldo per lokasi dan batch"
   },
   {
    "key": "m1",
    "label": "Permintaan barang",
    "code": "OPS-01",
    "fr": "FR-036",
    "wf": "WF-07",
    "task": "Tinjau permintaan unit yang masuk"
   },
   {
    "key": "m2",
    "label": "Penerimaan barang",
    "code": "OPS-01",
    "fr": "FR-022",
    "wf": "WF-07",
    "task": "Periksa lot dan dokumen sumber"
   },
   {
    "key": "m3",
    "label": "Selisih dan koreksi",
    "code": "OPS-01",
    "fr": "FR-036",
    "wf": "WF-07",
    "task": "Tinjau hasil stocktake sebelum persetujuan"
   }
  ]
 },
 "Petugas CSSD": {
  "unit": "Central Sterile Supply Department",
  "focus": "Instrumen masuk, siklus sterilisasi dan distribusi",
  "workflow": "WF-10",
  "features": [
   {
    "key": "m0",
    "label": "Penerimaan instrumen",
    "code": "OPS-03",
    "fr": "FR-023",
    "wf": "WF-10",
    "task": "Tinjau set masuk dan kelengkapan"
   },
   {
    "key": "m1",
    "label": "Siklus sterilisasi",
    "code": "OPS-03",
    "fr": "FR-023",
    "wf": "WF-10",
    "task": "Pantau status pencucian hingga sterilisasi"
   },
   {
    "key": "m2",
    "label": "Set steril siap serah",
    "code": "OPS-03",
    "fr": "FR-023",
    "wf": "WF-10",
    "task": "Review validasi siklus dan bukti serah"
   }
  ]
 },
 "Petugas Dapur": {
  "unit": "Produksi makanan pasien",
  "focus": "Batch dapur, tray diet dan distribusi",
  "workflow": "WF-11",
  "features": [
   {
    "key": "m0",
    "label": "Permintaan tray",
    "code": "OPS-05",
    "fr": "FR-024",
    "wf": "WF-11",
    "task": "Tinjau diet yang telah disetujui"
   },
   {
    "key": "m1",
    "label": "Produksi batch",
    "code": "OPS-05",
    "fr": "FR-024",
    "wf": "WF-11",
    "task": "Pantau jumlah produksi sesuai menu"
   },
   {
    "key": "m2",
    "label": "Pengiriman makanan",
    "code": "OPS-05",
    "fr": "FR-024",
    "wf": "WF-11",
    "task": "Periksa tray dan status penyerahan"
   }
  ]
 },
 "Petugas Laundry": {
  "unit": "Laundry / Linen",
  "focus": "Penerimaan, pencucian, linen bersih dan selisih",
  "workflow": "WF-10",
  "features": [
   {
    "key": "m0",
    "label": "Penerimaan linen",
    "code": "OPS-04",
    "fr": "FR-023",
    "wf": "WF-10",
    "task": "Cek jumlah dan asal linen kotor"
   },
   {
    "key": "m1",
    "label": "Proses pencucian",
    "code": "OPS-04",
    "fr": "FR-023",
    "wf": "WF-10",
    "task": "Pantau tahapan dan kondisi linen"
   },
   {
    "key": "m2",
    "label": "Selisih dan serah terima",
    "code": "OPS-04",
    "fr": "FR-023",
    "wf": "WF-10",
    "task": "Tinjau selisih serta bukti distribusi"
   }
  ]
 },
 "Pengadaan": {
  "unit": "Pengadaan dan pembelian",
  "focus": "Permintaan pembelian hingga penerimaan",
  "workflow": "WF-07",
  "features": [
   {
    "key": "m0",
    "label": "Permintaan pembelian",
    "code": "OPS-02",
    "fr": "FR-022",
    "wf": "WF-07",
    "task": "Tinjau purchase requisition"
   },
   {
    "key": "m1",
    "label": "Penawaran dan vendor",
    "code": "OPS-02",
    "fr": "FR-045",
    "wf": "WF-07",
    "task": "Review kelengkapan dan pembanding"
   },
   {
    "key": "m2",
    "label": "Purchase order",
    "code": "OPS-02",
    "fr": "FR-045",
    "wf": "WF-07",
    "task": "Pantau otorisasi PO"
   },
   {
    "key": "m3",
    "label": "Penerimaan barang",
    "code": "OPS-02",
    "fr": "FR-022",
    "wf": "WF-07",
    "task": "Cocokkan penerimaan dengan pesanan"
   }
  ]
 },
 "Petugas Aset": {
  "unit": "Manajemen aset",
  "focus": "Inventaris, penggunaan dan kondisi aset",
  "workflow": "WF-10",
  "features": [
   {
    "key": "m0",
    "label": "Inventaris aset",
    "code": "OPS-06",
    "fr": "FR-044",
    "wf": "WF-10",
    "task": "Tinjau daftar aset dan lokasi"
   },
   {
    "key": "m1",
    "label": "Mutasi aset",
    "code": "OPS-06",
    "fr": "FR-044",
    "wf": "WF-10",
    "task": "Periksa permintaan perpindahan aset"
   },
   {
    "key": "m2",
    "label": "Riwayat pemakaian",
    "code": "OPS-06",
    "fr": "FR-044",
    "wf": "WF-10",
    "task": "Review utilisasi dan kondisi"
   }
  ]
 },
 "Teknisi": {
  "unit": "Pemeliharaan alat",
  "focus": "Tiket, jadwal maintenance dan kalibrasi",
  "workflow": "WF-10",
  "features": [
   {
    "key": "m0",
    "label": "Tiket maintenance",
    "code": "OPS-07",
    "fr": "FR-044",
    "wf": "WF-10",
    "task": "Tinjau tiket gangguan alat"
   },
   {
    "key": "m1",
    "label": "Jadwal kalibrasi",
    "code": "OPS-07",
    "fr": "FR-044",
    "wf": "WF-10",
    "task": "Periksa kalibrasi yang jatuh tempo"
   },
   {
    "key": "m2",
    "label": "Hasil pekerjaan",
    "code": "OPS-07",
    "fr": "FR-044",
    "wf": "WF-10",
    "task": "Catat hasil pemeriksaan alat"
   }
  ]
 },
 "Petugas Fasilitas": {
  "unit": "Fasilitas / housekeeping",
  "focus": "Kesiapan ruang dan pekerjaan fasilitas",
  "workflow": "WF-04",
  "features": [
   {
    "key": "m0",
    "label": "Tugas kebersihan",
    "code": "OPS-08",
    "fr": "FR lintas domain",
    "wf": "WF-04",
    "task": "Tinjau penugasan ruang"
   },
   {
    "key": "m1",
    "label": "Perbaikan sarana",
    "code": "OPS-08",
    "fr": "FR lintas domain",
    "wf": "WF-04",
    "task": "Pantau kendala fasilitas"
   },
   {
    "key": "m2",
    "label": "Kesiapan ruang",
    "code": "OPS-08",
    "fr": "FR lintas domain",
    "wf": "WF-04",
    "task": "Konfirmasi pekerjaan telah dicek"
   }
  ]
 },
 "Koordinator Transport": {
  "unit": "Transport pasien / ambulans",
  "focus": "Penugasan armada dan perjalanan pasien",
  "workflow": "WF-03",
  "features": [
   {
    "key": "m0",
    "label": "Permintaan transport",
    "code": "OPS-09",
    "fr": "FR lintas domain",
    "wf": "WF-03",
    "task": "Tinjau kebutuhan transport pasien"
   },
   {
    "key": "m1",
    "label": "Alokasi armada",
    "code": "OPS-09",
    "fr": "FR lintas domain",
    "wf": "WF-03",
    "task": "Periksa kesiapan unit dan armada"
   },
   {
    "key": "m2",
    "label": "Status perjalanan",
    "code": "OPS-09",
    "fr": "FR lintas domain",
    "wf": "WF-03",
    "task": "Pantau pengantaran sesuai jadwal"
   }
  ]
 },
 "Kasir": {
  "unit": "Loket kasir",
  "focus": "Tagihan, pembayaran dan kuitansi pasien",
  "workflow": "WF-08",
  "features": [
   {
    "key": "m0",
    "label": "Daftar tagihan",
    "code": "FIN-02",
    "fr": "FR-026",
    "wf": "WF-08",
    "task": "Tinjau invoice yang belum selesai"
   },
   {
    "key": "m1",
    "label": "Terima pembayaran",
    "code": "FIN-03",
    "fr": "FR-026",
    "wf": "WF-08",
    "task": "Cek saldo dan metode pembayaran"
   },
   {
    "key": "m2",
    "label": "Kuitansi dan riwayat",
    "code": "FIN-03",
    "fr": "FR-026",
    "wf": "WF-08",
    "task": "Tinjau bukti settlement serta kuitansi"
   }
  ]
 },
 "Casemix": {
  "unit": "Casemix dan klaim",
  "focus": "Kelengkapan berkas dan pengelompokan klaim",
  "workflow": "WF-08",
  "features": [
   {
    "key": "m0",
    "label": "Berkas casemix",
    "code": "FIN-06",
    "fr": "FR-027",
    "wf": "WF-08",
    "task": "Tinjau episode siap grouping"
   },
   {
    "key": "m1",
    "label": "Grouping INA-CBG",
    "code": "FIN-06",
    "fr": "FR-027",
    "wf": "WF-08",
    "task": "Review kode dan versi hasil grouping"
   },
   {
    "key": "m2",
    "label": "Kelengkapan klaim",
    "code": "FIN-07",
    "fr": "FR-027",
    "wf": "WF-08",
    "task": "Pantau dossier yang perlu dilengkapi"
   }
  ]
 },
 "Petugas BPJS": {
  "unit": "Administrasi BPJS",
  "focus": "SEP, kontrol dan rekonsiliasi status penjamin",
  "workflow": "WF-08",
  "features": [
   {
    "key": "m0",
    "label": "Eligibilitas dan SEP",
    "code": "FIN-05",
    "fr": "FR-027",
    "wf": "WF-08",
    "task": "Tinjau administrasi kepesertaan"
   },
   {
    "key": "m1",
    "label": "Kontrol dan bridging",
    "code": "FIN-05",
    "fr": "FR-027",
    "wf": "WF-08",
    "task": "Pantau status permintaan BPJS"
   },
   {
    "key": "m2",
    "label": "Status dan pengecualian",
    "code": "FIN-05",
    "fr": "FR-027",
    "wf": "WF-08",
    "task": "Tinjau kegagalan integrasi dan rekonsiliasi"
   },
   {
    "key": "m3",
    "label": "Coverage dan eligibility",
    "code": "FIN-04",
    "fr": "FR-027",
    "wf": "WF-08",
    "task": "Cek coverage dan status eligibility eksternal secara terpisah"
   }
  ]
 },
 "Coder": {
  "unit": "Coding klinis",
  "focus": "Review kode diagnosis dan tindakan untuk berkas klaim",
  "workflow": "WF-08",
  "features": [
   {
    "key": "m0",
    "label": "Daftar berkas coding",
    "code": "FIN-06",
    "fr": "FR-027",
    "wf": "WF-08",
    "task": "Tinjau episode yang siap coding"
   },
   {
    "key": "m1",
    "label": "Diagnosis dan prosedur",
    "code": "FIN-06",
    "fr": "FR-027",
    "wf": "WF-08",
    "task": "Verifikasi kode tanpa mengubah catatan klinis"
   },
   {
    "key": "m2",
    "label": "Review dan grouping",
    "code": "FIN-06",
    "fr": "FR-027",
    "wf": "WF-08",
    "task": "Tandai kebutuhan klarifikasi berkas"
   }
  ]
 },
 "Akuntan": {
  "unit": "Keuangan / akuntansi",
  "focus": "Buku besar, jurnal dan rekonsiliasi",
  "workflow": "WF-08",
  "features": [
   {
    "key": "m0",
    "label": "Jurnal akuntansi",
    "code": "FIN-08",
    "fr": "FR-028",
    "wf": "WF-08",
    "task": "Tinjau jurnal dan bukti transaksi"
   },
   {
    "key": "m1",
    "label": "Rekonsiliasi akun",
    "code": "FIN-08",
    "fr": "FR-028",
    "wf": "WF-08",
    "task": "Cek keseimbangan akun"
   },
   {
    "key": "m2",
    "label": "Piutang dan utang",
    "code": "FIN-09",
    "fr": "FR-028",
    "wf": "WF-08",
    "task": "Pantau jatuh tempo AP AR"
   }
  ]
 },
 "Budget Owner": {
  "unit": "Pengelola anggaran",
  "focus": "Perencanaan biaya, persetujuan dan realisasi",
  "workflow": "WF-08",
  "features": [
   {
    "key": "m0",
    "label": "Anggaran unit",
    "code": "FIN-10",
    "fr": "FR-028",
    "wf": "WF-08",
    "task": "Tinjau plafon dan pusat biaya"
   },
   {
    "key": "m1",
    "label": "Permintaan persetujuan",
    "code": "FIN-10",
    "fr": "FR-028",
    "wf": "WF-08",
    "task": "Review deviasi dan approval"
   },
   {
    "key": "m2",
    "label": "Realisasi anggaran",
    "code": "FIN-10",
    "fr": "FR-028",
    "wf": "WF-08",
    "task": "Pantau anggaran terhadap realisasi"
   }
  ]
 },
 "Analis Biaya": {
  "unit": "Unit costing",
  "focus": "Komponen biaya dan efisiensi layanan",
  "workflow": "WF-08",
  "features": [
   {
    "key": "m0",
    "label": "Profil biaya layanan",
    "code": "FIN-11",
    "fr": "FR-033",
    "wf": "WF-08",
    "task": "Tinjau komponen pembentuk tarif"
   },
   {
    "key": "m1",
    "label": "Analisis unit cost",
    "code": "FIN-11",
    "fr": "FR-044",
    "wf": "WF-08",
    "task": "Bandingkan biaya aktivitas"
   },
   {
    "key": "m2",
    "label": "Review anomali biaya",
    "code": "FIN-11",
    "fr": "FR-044",
    "wf": "WF-08",
    "task": "Tandai perubahan komponen biaya"
   }
  ]
 },
 "Manajemen RS": {
  "unit": "Direksi / manajemen RS",
  "focus": "Indikator pelayanan, mutu, anggaran dan kinerja",
  "workflow": "WF-12",
  "features": [
   {
    "key": "m0",
    "label": "Ringkasan operasional",
    "code": "ENT-10",
    "fr": "FR-031",
    "wf": "WF-12",
    "task": "Pantau KPI dengan definisi dan freshness"
   },
   {
    "key": "m1",
    "label": "Mutu dan keselamatan",
    "code": "ENT-08",
    "fr": "FR-030",
    "wf": "WF-12",
    "task": "Review indikator mutu"
   },
   {
    "key": "m2",
    "label": "Laporan manajemen",
    "code": "ENT-09",
    "fr": "FR-031",
    "wf": "WF-12",
    "task": "Tinjau snapshot laporan unit"
   },
   {
    "key": "m3",
    "label": "Kinerja antar unit",
    "code": "ENT-10",
    "fr": "FR-031",
    "wf": "WF-12",
    "task": "Bandingkan indikator sesuai hak akses"
   }
  ]
 },
 "Tim Mutu": {
  "unit": "Unit mutu",
  "focus": "Indikator, insiden dan tindak lanjut mutu",
  "workflow": "WF-12",
  "features": [
   {
    "key": "m0",
    "label": "Indikator mutu",
    "code": "ENT-08",
    "fr": "FR-030",
    "wf": "WF-12",
    "task": "Pantau numerator denominator dan sumber data"
   },
   {
    "key": "m1",
    "label": "Insiden keselamatan",
    "code": "ENT-06",
    "fr": "FR-030",
    "wf": "WF-12",
    "task": "Review laporan insiden secara terbatas"
   },
   {
    "key": "m2",
    "label": "Manajemen risiko",
    "code": "ENT-07",
    "fr": "FR-030",
    "wf": "WF-12",
    "task": "Tinjau mitigasi yang belum selesai"
   },
   {
    "key": "m3",
    "label": "Pelaporan mutu",
    "code": "ENT-09",
    "fr": "FR-031",
    "wf": "WF-12",
    "task": "Tinjau laporan indikator sebelum rilis"
   }
  ]
 },
 "Integrasi": {
  "unit": "Tim interoperabilitas",
  "focus": "Outbox, delivery ledger, ACK dan kegagalan sinkronisasi",
  "workflow": "WF-09",
  "features": [
   {
    "key": "m0",
    "label": "Antrean pengiriman",
    "code": "ENT-11",
    "fr": "FR-032",
    "wf": "WF-09",
    "task": "Pantau job pengiriman data"
   },
   {
    "key": "m1",
    "label": "ACK dan kegagalan",
    "code": "ENT-11",
    "fr": "FR-032",
    "wf": "WF-09",
    "task": "Periksa error status partner"
   },
   {
    "key": "m2",
    "label": "Rekonsiliasi status",
    "code": "ENT-11",
    "fr": "FR-032",
    "wf": "WF-09",
    "task": "Telusuri retry dan delivery ledger"
   }
  ]
 },
 "Admin Sistem": {
  "unit": "Administrasi SIMRS",
  "focus": "Akun, organisasi, master, kebijakan dan audit",
  "workflow": "WF-01",
  "features": [
   {
    "key": "m0",
    "label": "Pengguna dan akses",
    "code": "CORE-02",
    "fr": "FR-002",
    "wf": "WF-01",
    "task": "Kelola role dan scope unit"
   },
   {
    "key": "m1",
    "label": "Organisasi dan unit",
    "code": "CORE-03",
    "fr": "FR-001",
    "wf": "WF-01",
    "task": "Tinjau struktur RS"
   },
   {
    "key": "m2",
    "label": "Praktisi dan kewenangan",
    "code": "CORE-04",
    "fr": "FR lintas domain",
    "wf": "WF-01",
    "task": "Periksa masa berlaku penugasan klinis"
   },
   {
    "key": "m3",
    "label": "Layanan dan tarif",
    "code": "CORE-06",
    "fr": "FR-003",
    "wf": "WF-08",
    "task": "Kelola master tarif versi berlaku"
   },
   {
    "key": "m4",
    "label": "Terminologi",
    "code": "CORE-07",
    "fr": "FR-003",
    "wf": "WF-02",
    "task": "Tinjau pemetaan kode"
   },
   {
    "key": "m5",
    "label": "Consent dan audit",
    "code": "CORE-12",
    "fr": "FR-008",
    "wf": "WF-01",
    "task": "Review scope consent dan akses"
   },
   {
    "key": "m6",
    "label": "Tenant dan organisasi",
    "code": "CORE-01",
    "fr": "FR-001",
    "wf": "WF-01",
    "task": "Tinjau pengaturan cakupan multi-RS"
   },
   {
    "key": "m7",
    "label": "Master lokasi dan bed",
    "code": "CORE-05",
    "fr": "FR lintas domain",
    "wf": "WF-04",
    "task": "Kelola master lokasi tanpa melakukan alokasi operasional"
   }
  ]
 },
 "HR Admin": {
  "unit": "Administrasi SDM",
  "focus": "Pegawai, penugasan dan kompetensi",
  "workflow": "WF-01",
  "features": [
   {
    "key": "m0",
    "label": "Data pegawai",
    "code": "ENT-01",
    "fr": "FR-029",
    "wf": "WF-01",
    "task": "Tinjau data dan status kepegawaian"
   },
   {
    "key": "m1",
    "label": "Penugasan staf",
    "code": "ENT-01",
    "fr": "FR-046",
    "wf": "WF-01",
    "task": "Review penempatan dan masa berlaku"
   },
   {
    "key": "m2",
    "label": "Kompetensi dan dokumen",
    "code": "ENT-01",
    "fr": "FR-029",
    "wf": "WF-01",
    "task": "Pantau kelengkapan persyaratan"
   }
  ]
 },
 "Payroll Admin": {
  "unit": "Penggajian",
  "focus": "Kehadiran, payroll dan pengecualian",
  "workflow": "WF-01",
  "features": [
   {
    "key": "m0",
    "label": "Rekap kehadiran",
    "code": "ENT-02",
    "fr": "FR-029",
    "wf": "WF-01",
    "task": "Review data absensi periode"
   },
   {
    "key": "m1",
    "label": "Komponen payroll",
    "code": "ENT-02",
    "fr": "FR-029",
    "wf": "WF-01",
    "task": "Periksa komponen sebelum proses"
   },
   {
    "key": "m2",
    "label": "Validasi dan selisih",
    "code": "ENT-02",
    "fr": "FR-029",
    "wf": "WF-01",
    "task": "Tinjau daftar hasil perlu koreksi"
   }
  ]
 },
 "Rekruter": {
  "unit": "Rekrutmen",
  "focus": "Pelamar, seleksi dan pengisian formasi",
  "workflow": "WF-01",
  "features": [
   {
    "key": "m0",
    "label": "Lamaran masuk",
    "code": "ENT-03",
    "fr": "FR-029",
    "wf": "WF-01",
    "task": "Tinjau kandidat baru"
   },
   {
    "key": "m1",
    "label": "Tahapan seleksi",
    "code": "ENT-03",
    "fr": "FR-046",
    "wf": "WF-01",
    "task": "Pantau jadwal wawancara"
   },
   {
    "key": "m2",
    "label": "Evaluasi kandidat",
    "code": "ENT-03",
    "fr": "FR-046",
    "wf": "WF-01",
    "task": "Review hasil tahapan"
   }
  ]
 },
 "Tim PPI": {
  "unit": "Pencegahan dan pengendalian infeksi",
  "focus": "Surveilans HAIs, indikator dan tindakan PPI",
  "workflow": "WF-12",
  "features": [
   {
    "key": "m0",
    "label": "Surveilans HAIs",
    "code": "ENT-05",
    "fr": "FR-030",
    "wf": "WF-12",
    "task": "Tinjau episode infeksi terkait layanan"
   },
   {
    "key": "m1",
    "label": "Tindak lanjut PPI",
    "code": "ENT-05",
    "fr": "FR-030",
    "wf": "WF-12",
    "task": "Pantau tindakan korektif"
   },
   {
    "key": "m2",
    "label": "Indikator pencegahan",
    "code": "ENT-08",
    "fr": "FR-030",
    "wf": "WF-12",
    "task": "Review indikator pencegahan infeksi"
   }
  ]
 },
 "Pasien Demo": {
  "unit": "Portal pasien",
  "focus": "Janji temu dan dokumen yang boleh dilepas",
  "workflow": "WF-01",
  "features": [
   {
    "key": "m0",
    "label": "Janji temu saya",
    "code": "CORE-10",
    "fr": "FR-005",
    "wf": "WF-01",
    "task": "Tinjau booking contoh"
   },
   {
    "key": "m1",
    "label": "Dokumen saya",
    "code": "RME-12",
    "fr": "FR-039",
    "wf": "WF-01",
    "task": "Tinjau hanya dokumen yang sudah dilepas"
   }
  ]
 },
 "Petugas Billing": {
  "unit": "Unit billing / charge capture",
  "focus": "Tagihan tindakan sah sebelum penerbitan invoice",
  "workflow": "WF-08",
  "features": [
   {
    "key": "m0",
    "label": "Tindakan siap ditagihkan",
    "code": "FIN-01",
    "fr": "FR-025",
    "wf": "WF-08",
    "task": "Tinjau evidence tindakan dengan sumber unik"
   },
   {
    "key": "m1",
    "label": "Charge capture",
    "code": "FIN-01",
    "fr": "FR-025",
    "wf": "WF-08",
    "task": "Review charge yang belum tersusun"
   },
   {
    "key": "m2",
    "label": "Invoice draft",
    "code": "FIN-02",
    "fr": "FR-026",
    "wf": "WF-08",
    "task": "Tinjau hasil penggabungan charge ke invoice"
   }
  ]
 },
 "Bed Manager": {
  "unit": "Manajemen tempat tidur",
  "focus": "Kapasitas, alokasi bed, transfer dan pelepasan",
  "workflow": "WF-04",
  "features": [
   {
    "key": "m0",
    "label": "Ketersediaan bed",
    "code": "OPS-10",
    "fr": "FR-011",
    "wf": "WF-04",
    "task": "Pantau bed tersedia dan okupansi per ruang"
   },
   {
    "key": "m1",
    "label": "Permintaan alokasi",
    "code": "OPS-10",
    "fr": "FR-011",
    "wf": "WF-04",
    "task": "Tinjau admission pending dan konflik okupansi"
   },
   {
    "key": "m2",
    "label": "Transfer dan pelepasan",
    "code": "OPS-10",
    "fr": "FR-011",
    "wf": "WF-04",
    "task": "Review mutasi bed dan kesiapan ruang"
   }
  ]
 }
};
var statuses=["Perlu ditinjau","Dalam proses","Menunggu tindak lanjut"];
var wfNames={
 "WF-01":"Registrasi dan encounter",
 "WF-02":"Pelayanan rawat jalan",
 "WF-03":"IGD dan disposisi",
 "WF-04":"Rawat inap dan discharge",
 "WF-05":"CPOE dan laboratorium",
 "WF-06":"Radiologi dan ekspertise",
 "WF-07":"Resep dan dispensing",
 "WF-08":"Tagihan dan pembayaran",
 "WF-09":"Rujukan dan integrasi",
 "WF-10":"Operasi dan perioperatif",
 "WF-11":"Diet dan distribusi makanan",
 "WF-12":"Clinical pathway dan outcome"
};
function esc(x){return String(x==null?"":x).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
function getProfile(role){return profiles[role]||null;}
function getFeature(role,key){var p=getProfile(role);return p&&p.features.find(function(f){return f.key===key;})||null;}
function navHtml(role,section){
 var p=getProfile(role);
 if(!p)return '<button type="button" class="ux-nav-link" data-demo-action="home">Beranda saya</button>';
 var out='<div class="ux-role-unit">'+esc(p.unit)+'</div>'+
  '<button type="button" class="ux-nav-link ux-role-menu'+(section==="home"?' active':'')+'" data-demo-action="home"><span class="ux-menu-index">⌂</span>Beranda</button>'+
  '<div class="ux-nav-section">AREA PEKERJAAN</div>';
 p.features.forEach(function(f,i){
  out+='<button type="button" class="ux-nav-link ux-role-menu'+(section===f.key?' active':'')+'"'+
   ' data-demo-action="section:'+esc(f.key)+'" aria-current="'+(section===f.key?'page':'false')+'">'+
   '<span class="ux-menu-index">'+String(i+1).padStart(2,"0")+'</span><span>'+esc(f.label)+'</span></button>';
 });
 return out+'<div class="ux-nav-section ux-nav-section-foot">AKSES SESUAI UNIT & ROLE</div>';
}
/* All rows in these previews are intentionally synthetic; names/IDs do not
 * describe real patients, actual queue sizes, signed clinical results or money. */
var fixtureKinds={
 patient:["Pendaftaran","Dokter RJ","Dokter IGD","Terapis Rehabilitasi"],
 ward:["DPJP Rawat Inap","Perawat","Perawat HD"],
 beds:["Bed Manager"],
 diagnostic:["ATLM","Radiografer","Radiolog","Petugas MCU","Koordinator MCU","Petugas Bank Darah"],
 pharmacy:["Farmasis"],
 inventory:["Gudang","Pengadaan","Petugas CSSD","Petugas Laundry","Petugas Dapur","Ahli Gizi"],
 operations:["Koordinator OK","Dokter Anestesi","Petugas Aset","Teknisi","Petugas Fasilitas","Koordinator Transport"],
 billing:["Kasir","Petugas Billing"],
 claims:["Casemix","Coder","Petugas BPJS"],
 finance:["Akuntan","Budget Owner","Analis Biaya"],
 executive:["Manajemen RS","Tim Mutu","Tim PPI"],
 integration:["Integrasi"],
 admin:["Admin Sistem","HR Admin","Payroll Admin","Rekruter"],
 portal:["Pasien Demo"]
};
var fixtures={
 patient:[
  ["RJ-028","Budi Santoso · Poli Penyakit Dalam","RM 00045872 · 08.17","Menunggu"],
  ["RJ-029","Siti Rahmawati · Poli Anak","RM 00067109 · 08.22","Dalam proses"],
  ["RJ-030","Ahmad Fauzi · Poli Jantung","RM 00033218 · 08.30","Perlu ditinjau"],
  ["RJ-031","Rina Wulandari · Poli Kandungan","RM 00077921 · 08.38","Menunggu"]
 ],
 ward:[
  ["RI-A05","Budi Santoso · Melati A / A-05","Shift pagi · tanda vital diperiksa","Perlu ditinjau"],
  ["RI-A01","Siti Rahmawati · Melati A / A-01","Shift pagi · intervensi berjalan","Dalam proses"],
  ["RI-A02","Ahmad Fauzi · Melati A / A-02","Shift pagi · dokumen pending","Menunggu"],
  ["RI-A03","Rina Wulandari · Melati A / A-03","Shift pagi · pemeriksaan terjadwal","Dalam proses"]
 ],
 diagnostic:[
  ["ACC-0083","Darah lengkap · Budi Santoso","Order LAB-00083 · 08.09","Menunggu"],
  ["ACC-0084","Glukosa · Siti Rahmawati","Order LAB-00084 · 08.16","Dalam proses"],
  ["ACC-0085","Pemeriksaan terjadwal · Ahmad Fauzi","Order DEMO-00085 · 08.21","Perlu ditinjau"],
  ["ACC-0086","Pemeriksaan terjadwal · Rina Wulandari","Order DEMO-00086 · 08.35","Menunggu"]
 ],
 beds:[
  ["BED-A05","Melati A · A-05","Bed tersedia · perlu konfirmasi","Menunggu"],
  ["BED-A07","Melati A · A-07","Permintaan dari IGD · admission pending","Perlu ditinjau"],
  ["BED-B01","Melati B · B-01","Transfer pasien direncanakan","Dalam proses"],
  ["BED-C03","Mawar C · C-03","Pembersihan selesai · cek kesiapan","Menunggu"]
 ],
 pharmacy:[
  ["RX-0027","Resep Budi Santoso · Poli Dalam","4 item · perlu telaah alergi","Perlu ditinjau"],
  ["RX-0028","Resep Siti Rahmawati · Poli Anak","2 item · penyiapan","Dalam proses"],
  ["RX-0029","Resep Ahmad Fauzi · IGD","3 item · cek restriksi","Menunggu"],
  ["RX-0030","Resep Rina Wulandari · Poli Kandungan","5 item · validasi terakhir","Dalam proses"]
 ],
 inventory:[
  ["REQ-011","Permintaan Unit Melati A","Bukti permintaan dan lokasi stok","Perlu ditinjau"],
  ["REQ-012","Permintaan Instalasi IGD","Ketersediaan lot dan jadwal","Menunggu"],
  ["REQ-013","Permintaan Kamar Operasi","Jumlah, batch dan dokumen","Dalam proses"],
  ["REQ-014","Permintaan Unit Perawatan","Perlu rekonsiliasi jumlah","Perlu ditinjau"]
 ],
 operations:[
  ["OP-015","Jadwal unit hari ini","Penugasan dan kesiapan layanan","Dalam proses"],
  ["OP-016","Permintaan kerja prioritas","Perlu pemeriksaan dokumen","Perlu ditinjau"],
  ["OP-017","Tugas yang dijadwalkan","Konfirmasi petugas dan sumber daya","Menunggu"],
  ["OP-018","Serah terima unit","Review hasil dan bukti pekerjaan","Dalam proses"]
 ],
 billing:[
  ["INV-0081","Tagihan Budi Santoso · Rawat Jalan","Rp 628.500 · Umum (simulasi)","Menunggu"],
  ["INV-0082","Tagihan Siti Rahmawati · Rawat Inap","Rp 4.750.000 · perlu review","Perlu ditinjau"],
  ["INV-0083","Tagihan Ahmad Fauzi · Rawat Jalan","Rp 1.320.000 · sebagian","Dalam proses"],
  ["INV-0084","Tagihan Rina Wulandari · Rawat Jalan","Rp 345.000 · belum dialokasi","Menunggu"]
 ],
 claims:[
  ["CLM-010","Episode RI · Berkas A","Discharge dan dokumen signed","Perlu ditinjau"],
  ["CLM-011","Episode RJ · Berkas B","Kelengkapan kode prosedur","Menunggu"],
  ["CLM-012","Episode RI · Berkas C","Hasil grouping perlu review","Dalam proses"],
  ["CLM-013","Episode RJ · Berkas D","Klarifikasi dokumen penjamin","Menunggu"]
 ],
 finance:[
  ["FIN-015","Rekonsiliasi periode berjalan","Posting dan review saldo","Perlu ditinjau"],
  ["FIN-016","Pusat biaya layanan","Analisis biaya unit","Dalam proses"],
  ["FIN-017","Dokumen transaksi terjadwal","Pengecualian perlu review","Menunggu"],
  ["FIN-018","Laporan keuangan periode","Menunggu approval pemilik","Perlu ditinjau"]
 ],
 executive:[
  ["KPI-001","Kunjungan dan utilisasi tempat tidur","Snapshot data operasional","Dalam proses"],
  ["KPI-002","Indikator mutu layanan","Definisi dan sumber angka","Perlu ditinjau"],
  ["KPI-003","Performa layanan per unit","Watermark dan periode data","Menunggu"],
  ["KPI-004","Status tindak lanjut manajemen","Laporan dari pemilik unit","Dalam proses"]
 ],
 integration:[
  ["INT-020","FHIR delivery ledger","Status eksternal perlu dicek","Perlu ditinjau"],
  ["INT-021","Outbox pengiriman","Antrean diproses","Dalam proses"],
  ["INT-022","ACK dari partner","Belum ada konfirmasi eksternal","Menunggu"],
  ["INT-023","Job gagal kirim","Tinjau retry / DLQ","Perlu ditinjau"]
 ],
 admin:[
  ["ADM-020","Permintaan administrasi baru","Scope unit dan pemohon","Perlu ditinjau"],
  ["ADM-021","Revisi data pegawai/unit","Menunggu validasi","Menunggu"],
  ["ADM-022","Konfigurasi periode aktif","Perlu pencocokan versi","Dalam proses"],
  ["ADM-023","Permintaan perubahan role","Butuh otorisasi pemilik","Perlu ditinjau"]
 ],
 portal:[
  ["SELF-01","Janji temu contoh","Jadwal kunjungan personal","Menunggu"],
  ["SELF-02","Dokumen telah dilepas","Akses sesuai consent dan wali","Dalam proses"],
  ["SELF-03","Pengingat kunjungan","Data latihan saja","Menunggu"],
  ["SELF-04","Riwayat layanan contoh","Tidak ada akses staf RS","Dalam proses"]
 ]
};
function fixtureKind(role){
 return Object.keys(fixtureKinds).find(function(k){return fixtureKinds[k].includes(role);})||"operations";
}
function roleJobs(p,feature,role){
 var features=feature?[feature]:p.features;
 var rows=fixtures[fixtureKind(role)]||fixtures.operations;
 return rows.map(function(row,i){
  var f=features[i%features.length];
  return {id:row[0],title:row[1],detail:row[2]+" · "+f.task,
   status:row[3],feature:f};
 });
}
function featureCard(f){
 return '<button type="button" class="uxv4-feature" data-demo-action="section:'+esc(f.key)+'">'+
   '<span class="uxv4-feature-code">'+esc(f.code)+'</span><strong>'+esc(f.label)+'</strong>'+
   '<small>'+esc(f.task)+'</small><span class="uxv4-feature-arrow">Buka daftar kerja →</span></button>';
}
function renderPage(ctx){
 var p=getProfile(ctx.role);
 if(!p)return '<section class="role-home-safety">Belum ada konfigurasi desain untuk role ini.</section>';
 var feature=getFeature(ctx.role,ctx.section);
 var isHome=!feature;
 var jobs=roleJobs(p,feature,ctx.role);
 var title=isHome?"Beranda "+ctx.role:feature.label;
 var subtitle=isHome?p.focus:feature.task;
 var cta=function(f){
  if(!f)return "";
  var allowed=ctx.canOpen(f.code);
  return allowed?'<button type="button" class="btn btn-primary" data-demo-action="module:'+esc(f.code)+'">Buka form terkait</button>':
   '<span class="uxv4-disabled" title="Form belum tersedia untuk akun demo ini">Form belum tersedia</span>';
 };
 var rows=jobs.map(function(x,i){
  return '<tr><td class="uxv4-job-id">'+esc(x.id)+'</td><td><strong>'+esc(x.title)+
   '</strong><small>'+esc(x.detail)+' · data sintetis</small></td>'+
   '<td><span class="uxv4-status '+(i===0?'uxv4-pending':'')+'">'+esc(x.status)+'</span></td>'+
   '<td><code>'+esc(x.feature.code)+'</code></td><td>'+cta(x.feature)+'</td></tr>';
 }).join("");
 var key=feature||p.features[0];
 var trace=feature?'<div class="uxv4-trace">Rujukan: <strong>'+esc(feature.code)+
  '</strong> · '+esc(feature.fr)+' · '+esc(feature.wf)+' ('+esc(wfNames[feature.wf]||"Alur terkait")+
  ')</div>':'<div class="uxv4-trace">Dokumen desain: PRD final 6 Nov 2026 · '+esc(p.workflow)+
   ' · Layar dan form terpisah menurut kewenangan pengguna</div>';
 return '<div class="uxv4" data-uxv4-role="'+esc(ctx.role)+'" data-uxv4-section="'+esc(ctx.section||"home")+'">'+
  '<header class="uxv4-head"><div><span class="eyebrow">'+esc(p.unit)+' · AREA KERJA</span>'+
  '<h1>'+esc(title)+'</h1><p>'+esc(subtitle)+'</p></div><div class="uxv4-identity">'+
  '<span>AKUN DEMO</span><strong>'+esc(ctx.username)+'</strong><small>Scope visual: '+esc(p.unit)+'</small></div></header>'+
  '<section class="uxv4-hero"><div><span>WORKSPACE OPERASIONAL</span><h2>'+esc(isHome?"Apa yang perlu saya kerjakan?":feature.label)+'</h2>'+
  '<p>'+esc(isHome?"Pilih pekerjaan dari menu kiri. Daftar kerja menunjukkan contoh tugas yang sesuai dengan pengguna ini.":feature.task+
   ". Pilih item pekerjaan untuk melihat modul dan form yang terhubung.")+'</p></div>'+
  '<div class="uxv4-flow"><span>Alur terkait</span><strong>'+esc(isHome?p.workflow:feature.wf)+'</strong>'+
  '<small>'+esc(wfNames[isHome?p.workflow:feature.wf]||"Proses pendukung")+'</small></div></section>'+
  '<div class="uxv4-metrics"><div><span>Lingkup</span><strong>'+esc(p.unit)+'</strong><small>Ditentukan menurut role</small></div>'+
  '<div><span>Contoh pekerjaan</span><strong>'+String(jobs.length).padStart(2,"0")+'</strong><small>Dataset demonstrasi</small></div>'+
  '<div><span>Mode akses</span><strong>Simulasi</strong><small>Tidak terhubung ke sistem RS</small></div></div>'+
  (isHome?'<section class="uxv4-panel"><div class="uxv4-panel-head"><div><h2>Area kerja yang tersedia</h2>'+
  '<p>Pilih area pekerjaan. Form baru dibuka setelah pengguna memilih tindakan yang sesuai.</p></div></div>'+
  '<div class="uxv4-features">'+p.features.map(featureCard).join("")+'</div></section>':"")+
  '<section class="uxv4-panel"><div class="uxv4-panel-head"><div><h2>'+esc(isHome?"Pekerjaan yang perlu perhatian":"Daftar pekerjaan · "+feature.label)+'</h2>'+
  '<p>Contoh pekerjaan untuk demonstrasi alur dan navigasi; bukan data operasional.</p></div>'+
  (isHome?'<span class="uxv4-subtle">Peran: '+esc(ctx.role)+'</span>':cta(feature))+'</div>'+
  '<div class="uxv4-table-scroller"><table class="uxv4-table"><thead><tr>'+
  '<th>Kode</th><th>Pekerjaan</th><th>Status contoh</th><th>Modul PRD</th><th>Tindakan</th>'+
  '</tr></thead><tbody>'+rows+'</tbody></table></div>'+trace+'</section>'+
  '<div class="uxv4-safety"><strong>Mode desain:</strong> antrean, status dan angka adalah contoh. Tombol form hanya membuka modul yang diizinkan pada mockup; tidak menjalankan sign klinis, dispense, mutasi stok, pembayaran, submit klaim, atau pengiriman ke pihak eksternal.</div></div>';
}
function matrix(){
 return Object.keys(profiles).map(function(role){
  return {role:role,unit:profiles[role].unit,
   menus:profiles[role].features.map(function(f){return {screen:f.label,modul:f.code,fr:f.fr,wf:f.wf,description:f.task};})};
 });
}
window.SIMRSRoleUXV4={profiles:profiles,getProfile:getProfile,getFeature:getFeature,renderPage:renderPage,navHtml:navHtml,matrix:matrix,workflowNames:wfNames};
})();
