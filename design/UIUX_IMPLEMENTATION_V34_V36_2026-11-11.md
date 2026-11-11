# SIMRS Baru — UI/UX V34–V36: Advanced Services & Portal Pasien (F4 gelombang 1)

Tanggal: 11 November 2026. **Acuan normatif:** PRD final \`PRD_SIMRS_Baru_Final_User_Stories_Acceptance_Technical_7PIC_2026-11-06\`; Bab 1–12 tetap baseline dan Bab 13 v1.1 hanya ekstensi. Ini mockup GitHub Pages sintetis, **bukan SIMRS operasional**.

## Cakupan yang benar-benar diimplementasikan

| Role / layar | Modul existing | FR / WF existing | F4 experience |
| --- | --- | --- | --- |
| Koordinator OK | MED-06 | FR lintas domain / WF-10 | Jadwal dan kesiapan ruang, tim, instrumen, serta handoff; tidak melakukan booking |
| Dokter Anestesi | MED-07 | FR lintas domain / WF-10 | Konteks pasien, asesmen/pemantauan/pemulihan; tidak ada monitor atau approval klinis nyata |
| Perawat HD | MED-08, RME-07 | FR-019 / FR-012; WF-04 | Daftar sesi HD, konteks pasien dan cek pra-tindakan; tanpa dialisis nyata |
| Terapis Rehabilitasi | MED-09 | FR-019 / WF-02 | Jadwal sesi, evaluasi dan rencana; tanpa memutuskan outcome otomatis |
| Ahli Gizi | MED-11 | FR-024 / WF-11 | Asesmen, instruksi diet dan monitoring; tidak mengirim order produksi |
| Petugas Dapur | OPS-05 | FR-024 / WF-11 | Tray dan batch sebagai **objek**, bukan encounter; tanpa distribusi |
| Petugas CSSD | OPS-03 | FR-023 / WF-10 | Set instrumen, batch dan status sterilisasi sebagai objek; tanpa release |
| Petugas Laundry | OPS-04 | FR-023 / WF-10 | Linen, batch, selisih dan serah terima sebagai objek; tanpa mutasi stok |
| Pasien Demo | CORE-10, RME-12 | FR-005 / FR-039; WF-01 | Beranda pasien tersendiri, tombol menuju “Janji temu saya” / “Dokumen saya” dalam scope satu akun demo |

**Traceability:** user stories/acceptance untuk modul terkait tetap mengikuti Bab 3–6 PRD final, \`design/ROLE_WORKLIST_COVERAGE_V11_2026-11-09.md\` dan \`design/ROLE_SCREEN_FR_WORKFLOW_MATRIX_V4_2026-11-08.md\`. Alur ini menindaklanjuti **UX-015** serta pengujian negatif dari **UX-014**, bukan membuat FR, workflow atau hak akses baru. Nomor FR spesifik untuk MED-06/07 masih dinyatakan **lintas domain** di role profile existing; perlu sign-off PIC klinis sebelum menjadikannya kontrak.

## V34 — Informasi dan navigasi berbasis pekerjaan

- Sembilan akun memulai dari **beranda sesuai role → pekerjaan terpilih → worklist → detail → form yang sudah berizin**. Katalog reviewer tetap terpisah.
- Ringkasan tugas, identifier, status, penjelasan, dan tiga pemeriksaan diambil dari \`SIMRSRoleUXV5.jobRows\`; tidak membuat rekam klinis, hasil alat, atau transaksi baru.
- Identitas/encounter hanya tampil bila \`selectionContext\` yang sudah ada mengembalikan pasien. Dokter, HD, rehabilitasi dan gizi menampilkan konteks sintetis; CSSD, Dapur dan Laundry selalu menyatakan objek nonpasien.
- **Pasien Demo** hanya mengambil pasien sintetik pertama, sesuai \`selfOnly\` pada V11. Menu portal menavigasi section CORE-10 dan RME-12 menggunakan izin role yang sudah ada, bukan membuat API baru atau memberi akses pasien lain.
- Dua aksi aman yang benar-benar berfungsi: **fokus pencarian worklist** dan **buka panduan**. Semua tombol lain tetap diproses oleh otorisasi/routing demo existing.
- Satu panel pengecekan di bawah daftar kerja disembunyikan hingga dibuka; tidak menyiratkan pemeriksaan sudah diselesaikan.

## V35 — Visual & responsive

- Token warna terpisah untuk clinical, operations, portal; tetap konsisten dengan canonical layer V18.
- Desktop/tablet dan mobile 390 px, \`focus-visible\`, sentuhan ≥44px, reduced motion, tabel yang dapat digulir.
- Portal memakai istilah yang sesuai pasien dan tidak menampilkan claim status atau tindakan klinis nyata.

## V36 — Regression gate

- Node: \`tests/advanced-workspaces-v34.test.mjs\` menjaga sembilan role, urutan asset, kontrak safe-mode, dan tidak ada network/permission escalation.
- Chromium: \`tests/advanced-workspaces-v34.spec.mjs\`, 9 akun peran, konteks pasien vs objek, dua aksi kontrol, navigasi portal, mobile 390 px dan QA reviewer.
- Screenshot smoke pada artefak CI: OK, gizi, CSSD, portal, dan mobile laundry.
- Merge hanya jika **form-contract** dan **browser-smoke** success; deploy Pages harus success setelah merge.

## Yang belum dan keputusan terbuka

1. Pixel parity ke 13 gambar per-layar belum diverifikasi; gambar referensi bukan bukti komponen atau angka klinis benar.
2. Empty, loading, error dan permission-denied states per tugas masih perlu refinement eksplisit; data-state eksternal belum tersedia.
3. Autentikasi portal pasien, consent dan akses riil membutuhkan backend, keamanan, privasi serta SOP yang disetujui; desain ini **bukan bukti RBAC produksi**.
4. F4 gelombang berikut: bank darah, procurement, gudang, aset, fasilitas, transport, payroll/rekrutmen, PPI, long-tail 44 role dan usability testing.
5. Persetujuan PIC klinis, operasional, keamanan dan user RS tetap diperlukan untuk UAT dan tindakan nyata. Jangan mengaktifkan consent override, signing, approval, release, dispensing, mutasi, billing, pembayaran, klaim atau SATUSEHAT/BPJS hanya karena mockup sudah ada.
