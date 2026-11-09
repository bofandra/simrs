# SIMRS Baru V11 — 25 Role Operasional Tambahan

Tanggal: 9 November 2026

Baseline final: `PRD_SIMRS_Baru_Final_User_Stories_Acceptance_Technical_7PIC_2026-11-06`.

## Implementasi

- Dari **19/44 role** dengan worklist rinci pada V10 menjadi **44/44 role** pada V11; tiap area role menggunakan empat contoh pekerjaan dengan identitas kasus/objek, status, alasan pekerjaan, checklist, pencarian, panel detail, serta tautan ke form hanya bila role mempunyai izin dari katalog P0/P1/P2/P3.
- Alur aktif: login akun demo → beranda role → daftar kerja → detail → form berizin → draft lokal sesuai work item dan, bila patient-scoped, pasien + encounter sintetis.
- Data bukan data RS; `localStorage` hanya menyimpan contoh. Tidak ada backend, transaksi, rekam medis riil, akses penjamin, mutasi stok, klaim, posting jurnal, dispensing, release, atau integrasi SATUSEHAT.
- Pasien Demo sengaja dikunci ke satu identitas pasien **sintetis** (indeks contoh 0), bukan seluruh kumpulan pasien demo. Ini bukan otorisasi portal pasien sungguhan.
- Koordinator Transport menggunakan konteks pasien pada permintaan/perjalanan, namun alokasi armada bersifat objek nonpasien. Tim PPI menggunakan konteks pasien hanya untuk surveilans contoh; audit dan indikator bersifat objek. Jika pasien sintetis tidak tersedia, form berkonteks pasien tidak boleh dibuka.

## Jejak role, modul, FR, dan workflow

| Role | Area kerja | Modul | FR | WF |
|---|---|---|---|---|
| Perawat HD | Daftar sesi HD; Observasi pra dan intra HD; Asuhan dan serah terima | MED-08, RME-07 | FR-019, FR-012 | WF-04 |
| Terapis Rehabilitasi | Jadwal terapi; Catatan sesi; Evaluasi outcome | MED-09 | FR-019 | WF-02 |
| Koordinator MCU | Paket dan peserta; Progress dan laporan | MED-10 | FR-019 | WF-05 |
| Petugas Bank Darah | Permintaan darah; Kecocokan dan stok; Serah terima produk | MED-12 | FR-019 | WF-05 |
| Ahli Gizi | Daftar konsultasi gizi; Order diet pasien; Monitoring intervensi | MED-11 | FR-024 | WF-11 |
| Petugas CSSD | Penerimaan instrumen; Siklus sterilisasi; Set steril siap serah | OPS-03 | FR-023 | WF-10 |
| Petugas Dapur | Permintaan tray; Produksi batch; Pengiriman makanan | OPS-05 | FR-024 | WF-11 |
| Petugas Laundry | Penerimaan linen; Proses pencucian; Selisih dan serah terima | OPS-04 | FR-023 | WF-10 |
| Pengadaan | Permintaan pembelian; Penawaran dan vendor; Purchase order; Penerimaan barang | OPS-02 | FR-022, FR-045 | WF-07 |
| Petugas Aset | Inventaris aset; Mutasi aset; Riwayat pemakaian | OPS-06 | FR-044 | WF-10 |
| Teknisi | Tiket maintenance; Jadwal kalibrasi; Hasil pekerjaan | OPS-07 | FR-044 | WF-10 |
| Petugas Fasilitas | Tugas kebersihan; Perbaikan sarana; Kesiapan ruang | OPS-08 | FR lintas domain | WF-04 |
| Koordinator Transport | Permintaan transport; Alokasi armada; Status perjalanan | OPS-09 | FR lintas domain | WF-03 |
| Petugas BPJS | Eligibilitas dan SEP; Kontrol dan bridging; Status dan pengecualian; Coverage dan eligibility | FIN-05, FIN-04 | FR-027 | WF-08 |
| Coder | Daftar berkas coding; Diagnosis dan prosedur; Review dan grouping | FIN-06 | FR-027 | WF-08 |
| Akuntan | Jurnal akuntansi; Rekonsiliasi akun; Piutang dan utang | FIN-08, FIN-09 | FR-028 | WF-08 |
| Budget Owner | Anggaran unit; Permintaan persetujuan; Realisasi anggaran | FIN-10 | FR-028 | WF-08 |
| Analis Biaya | Profil biaya layanan; Analisis unit cost; Review anomali biaya | FIN-11 | FR-033, FR-044 | WF-08 |
| Manajemen RS | Ringkasan operasional; Mutu dan keselamatan; Laporan manajemen; Kinerja antar unit | ENT-10, ENT-08, ENT-09 | FR-031, FR-030 | WF-12 |
| HR Admin | Data pegawai; Penugasan staf; Kompetensi dan dokumen | ENT-01 | FR-029, FR-046 | WF-01 |
| Payroll Admin | Rekap kehadiran; Komponen payroll; Validasi dan selisih | ENT-02 | FR-029 | WF-01 |
| Rekruter | Lamaran masuk; Tahapan seleksi; Evaluasi kandidat | ENT-03 | FR-029, FR-046 | WF-01 |
| Tim PPI | Surveilans HAIs; Tindak lanjut PPI; Indikator pencegahan | ENT-05, ENT-08 | FR-030 | WF-12 |
| Pasien Demo | Janji temu saya; Dokumen saya | CORE-10, RME-12 | FR-005, FR-039 | WF-01 |
| Petugas Billing | Tindakan siap ditagihkan; Charge capture; Invoice draft | FIN-01, FIN-02 | FR-025, FR-026 | WF-08 |

## Validasi dan pekerjaan selanjutnya

1. `tests/role-worklists-v11.test.mjs`: pastikan jumlah 44, seluruh area memiliki contoh pekerjaan khusus, keunikan ID, hubungan modul/FR/WF, pengecekan izin deny-by-default, konteks pasien vs objek, serta isolasi akun demo pasien.
2. GitHub Actions menjalankan tes Node dan Playwright pada PR dan deployment Pages. Klaim berhasil hanya jika laporan Actions lulus.
3. V11 menyelesaikan **cakupan worklist kontekstual di mockup**, bukan implementasi penuh 68 modul. Tahap berikutnya: QA visual dan UAT 44 role bersama staf RS; desain form high-fidelity per modul; kontrak data, backend auth/RBAC, API/database, dan implementasi workflow yang tervalidasi SOP.
