# SIMRS Baru — Mockup Interaktif

## Acuan resmi pengembangan mockup — PRD lengkap (10 November 2026)

**[Baca PRD SIMRS Baru v1.1 (Markdown lengkap, Bab 1–13)](docs/simrs-baru/PRD_SIMRS_Baru_v1.1_Ekstensi_Form_Klinis_2026-11-10.md)** — mencakup 68 modul, 7 PIC, 66 FR, user stories, acceptance criteria, 12 workflow, 23 schema PostgreSQL, 211 tabel target, kontrak integrasi, keamanan, UAT, dan penajaman 14 komponen form/riwayat klinis pada Bab 13.

- **[Panduan implementasi mockup menurut PRD](docs/simrs-baru/PANDUAN_PENGEMBANGAN_MOCKUP_BERDASARKAN_PRD.md)** — pola role-first, worklist → detail → form, traceability FR/US/AC, prioritas pengerjaan dan batas tindakan demo.
- **[Instruksi untuk coding agent/pengembang](AGENTS.md)** — aturan sumber spesifikasi, keselamatan, dan review per perubahan.
- **[Diagram arsitektur PRD](docs/simrs-baru/assets/diagram-arsitektur-simrs-baru-v1.1.png)** — aset asli yang digunakan pada PRD.

PRD v1.1 adalah **edisi turunan** dari baseline final 6 November 2026, bukan penggantian sepihak baseline. Semua tindakan klinis, stok, finansial dan integrasi pada situs tetap simulasi sampai SOP/UAT/otorisasi produksi disetujui.


## Implementasi UI/UX V34–V36 — 11 November 2026

**[Dokumentasi F4 Advanced Services & Portal Pasien](design/UIUX_IMPLEMENTATION_V34_V36_2026-11-11.md)** — gelombang pertama F4 memoles tampilan 9 akun: Koordinator OK, Dokter Anestesi, Perawat HD, Terapis Rehabilitasi, Ahli Gizi, Petugas Dapur, Petugas CSSD, Petugas Laundry, dan Pasien Demo. Worklist berdasarkan tugas; konteks pasien/episode atau objek sesuai role; panduan tiga cek dan kontrol fokus; portal pasien khusus satu identitas demo dengan navigasi janji temu dan dokumen. Akses dan transaksi riil tetap nonaktif. Node contract serta Chromium UI regression menguji role, patient/object isolation, reviewer, dan mobile.

## Implementasi UI/UX V31–V33 — 11 November 2026

**[Dokumentasi Finance & Enterprise F3](design/UIUX_IMPLEMENTATION_V31_V33_2026-11-11.md)** — sepuluh akun profesi pada layar **S09 Finance, S10 Management & Integrasi, S11 Admin, dan S13 MCU** memiliki beranda berbasis tugas, konteks objek terpilih, panduan pemeriksaan sebelum tindakan, dan akses cepat ke worklist. Responsif, fokus keyboard, reviewer terisolasi, serta tes Node dan Chromium. Semua hanya mockup sintetis, tanpa pembayaran, klaim, approval hak akses, penerbitan MCU, atau pengiriman API nyata.

## Implementasi UI/UX V28–V30 — 11 November 2026

**[Lihat dokumentasi V28–V30](design/UIUX_IMPLEMENTATION_V28_V30_2026-11-11.md)** — lima role penunjang: Bed Manager (S06), ATLM (S07), Farmasis (S08), Radiografer dan Radiolog (S12). Beranda diubah menjadi task-first, dengan konteks objek/pasien yang aman, panduan read-only, tombol fokus, dan gaya desktop/mobile. Tanpa mengubah izin, encounter, transaksi, atau pengiriman API.

## Implementasi UI/UX V25–V27 — 11 November 2026

**[Lihat dokumentasi V25–V27](design/UIUX_IMPLEMENTATION_V25_V27_2026-11-11.md)** — fokus pembaruan tampilan empat role **Pendaftaran (S02), Dokter RJ (S03), Perawat (S04), dan Dokter IGD (S05)**. Urutan halaman task-first, panduan kerja dan konteks sintetis lebih jelas, tombol akses langsung ke antrean/panduan, warna semantic berbeda per profesi, responsive 390 px, serta tes regresi dan screenshot pada CI. Kode ini hanya UI mockup; 44 akun, 68 modul, draft dan authorization demo tidak berubah.

## Implementasi UI/UX V22–V24 — 11 November 2026

**[Dokumentasi implementasi V22–V24](design/UIUX_IMPLEMENTATION_V22_V24_2026-11-11.md)** — semua 44 staf demo masuk ke beranda pekerjaan per role; form memiliki tombol **Kembali ke daftar kerja** yang mempertahankan pekerjaan sebelumnya dan tombol **Ke isian form**; pengujian regresi desktop/mobile dan isolasi reviewer. Tetap prototipe statis, tidak mengaktifkan layanan atau transaksi nyata.

## Implementasi UI/UX V18–V21 — 11 November 2026

**[Catatan implementasi V18–V21](design/UIUX_IMPLEMENTATION_V18_V21_2026-11-11.md)** — V18 layer visual konsisten dan responsif, V19 panel keselamatan/pekerjaan klinis, V20 tahapan operasional, V21 tes regresi Node/Playwright. Seluruh panel read-only, memakai data sintetis, tidak mengubah izin akses atau membuat transaksi sungguhan. Urutan proses hanya ilustrasi dan status UAT pengguna **belum selesai**. Baseline spesifikasi tetap PRD final 6 November 2026.

## Masterplan UI/UX SIMRS Baru — 11 November 2026

**[Baca Masterplan UI/UX berbasis 13 mockup](design/UIUX_MASTERPLAN_SIMRS_BARU_2026-11-11.md)** — spesifikasi layar berdasarkan role dan pekerjaan, peta 68 modul/12 workflow, keselamatan pasien, design system, aksesibilitas, tahapan F0–F4, backlog UX-001–UX-015, dan kriteria UAT. **[Baca komparasi kompetitor](design/UIUX_BENCHMARK_KOMPETITOR_2026-11-11.md)** — Epic, Oracle Health, TrakCare, MEDITECH, Dedalus ORBIS U, SIMGOS, Khanza, SIMRS.ID dan Dribbble, dengan rujukan standar W3C/ONC/SATUSEHAT.

Keduanya adalah **rencana dan referensi pengembangan**, bukan perubahan kode operasional, bukan klaim UAT selesai, dan bukan penggantian baseline PRD final 6 November 2026. Gambar-gambarnya tersedia di [folder referensi UI/UX](design/references/simrs-uiux-mockups-2026-11/README.md).

**Situs resmi mockup saat ini:** https://bofandra.github.io/simrs/

**LOGIN DEMO (44 ROLE):** Pengguna pertama kali masuk melalui layar login, memilih akun demo per role (contoh `akun.pendaftaran`, `akun.dokter-rj`, `akun.farmasis`) dengan password demo `demo123`. Setelah login, layar awal dan menu hanya menampilkan pekerjaan sesuai role. `reviewer.demo` adalah akun khusus QA/peninjau untuk menjelajahi seluruh workspace dan katalog, bukan akun pengguna RS. Semua akun ini hanya simulasi front-end dan **bukan autentikasi keamanan**.

Repositori ini menyimpan prototype UI SIMRS Baru dengan **7 workspace, 68 modul/form demo** dan tiga alur terpandu:

**Workspace v2 (8 November 2026):** Front Office serta Dokter RJ kini memakai daftar kerja, form, banner pasien/encounter, validasi, dan navigasi tugas berbasis peran. Kode: `public/ui-preview/workspaces-v2.js` dan `.css`; dokumentasi: `design/WORKSPACE_V2_FRONT_CLINICAL_2026-11-08.md`. Semua tindakan tetap demonstrasi.

- Rawat Jalan — 10 tahapan.
- IGD — 7 tahapan.
- Rawat Inap — 9 tahapan.

Kode HTML/CSS/JavaScript yang **diterbitkan GitHub Pages** ada di [`public/ui-preview/`](public/ui-preview/). Semua data pasien, jadwal, layanan, obat, tarif, catatan klinis, dan transaksi **sintetis**, disimpan hanya dalam `localStorage` browser. Tidak ada backend, autentikasi rumah sakit, FHIR/SATUSEHAT, pembayaran, dispensing, mutasi stok atau proses klinis sungguhan.

## Visual Blueprint V8 — 13 Halaman (9 November 2026)

- **Galeri desain:** https://bofandra.github.io/simrs/design-gallery.html — 13 tampilan referensi: login, pendaftaran, dokter, perawat, IGD, bed board, laboratorium, farmasi, kasir/klaim, manajemen, administrasi, radiologi, dan MCU.
- **Situs operasional mockup:** https://bofandra.github.io/simrs/ — tetap mempertahankan 44 akun demo, 68 modul/form, menu per role, worklist → form serta alur RJ/IGD/RI.
- Visual navy + teal V8 di `public/ui-preview/visual-blueprint-v8.css`. Galeri hanya referensi UI; bukan sistem aplikasi kedua atau autentikasi riil.
- Matriks desain dan batasan: `design/VISUAL_BLUEPRINT_13_SCREEN_V8_2026-11-09.md`.

## Status situs

GitHub Pages menerbitkan **hanya mockup terbaru sebagai halaman utama**. Halaman prototipe lama telah dihapus dari site dan source HTML/CSS/JS legacy. Folder `docs/simrs-baru/` sekarang menyimpan **dokumen referensi teknis saja**, bukan situs lain.

Pengujian dan deployment:
- `.github/workflows/mockup-forms-p0.yml`: pengujian Node dan Chromium pada perubahan mockup.
- `.github/workflows/publish-mindmap-pages.yml`: tes ulang dan deploy isi `public/ui-preview/` ke root Pages ketika perubahan masuk `main`.

Untuk menjalankan preview secara lokal:

```bash
python3 -m http.server 8000 --directory public/ui-preview
```

Lalu buka http://localhost:8000/ . Untuk tes Node: `node --test tests/*.test.mjs`. Untuk tes browser, instal `@playwright/test` dan Chromium sesuai workflow.

## Struktur tambahan

- `design/`: desain, pemetaan form, dan rancangan UI.
- `docs/simrs-baru/`: arsip kontrak dan dokumen teknis (tanpa halaman web lama).
- `app/`, `components/`, `lib/`: kode Next.js eksperimen terdahulu yang **tidak termasuk** paket GitHub Pages; tidak digunakan oleh situs di atas.

> **Penting:** Ini hanya prototipe statis untuk menguji alur dan UI, bukan SIMRS yang siap dipakai di rumah sakit.

**Role worklists v5 (9 November 2026):** tujuh peran prioritas (Pendaftaran, Dokter RJ, Perawat, Dokter IGD, Farmasis, Kasir, Bed Manager) mempunyai daftar kerja kontekstual, detail item, checklist, dan pencarian. Semua konteks kerja tetap sintetis; memilih item belum memprefill form klinis/keuangan. Berkas `public/ui-preview/role-worklist-detail-v5.js` dan `.css`, serta pengujian `tests/role-worklist-detail-v5.test.mjs`.

## V9 — Kontinuitas daftar kerja dan draft (9 November 2026)

- Pada 7 role prioritas, daftar kerja menampilkan indikator **Draft tersimpan** atau **Ditinjau (demo)** berdasarkan catatan `localStorage` untuk pekerjaan yang persis sama. Ini adalah status dokumentasi lokal, bukan perubahan status pelayanan atau penerbitan hasil.
- Tombol tindakan mengikuti status: **Buka form**, **Lanjutkan draft**, atau **Lihat catatan**. Pembukaan kembali draft mensyaratkan kecocokan `work_item_id`, dan untuk modul berkonteks pasien juga `patient_id + encounter_id`.
- Dari beranda role, tombol form pertama kini membawa konteks pekerjaan yang dipilih, sama seperti ketika masuk dari submenu. Jika konteks pekerjaan tidak valid, pembukaan form melalui worklist ditolak.
- **Form baru** tetap dapat dipilih dari riwayat untuk memulai catatan berbeda; prefill terbatas pada data administrasi sintetis, tidak mengisi keputusan klinis.
- Batas: belum ada API/backend, antrian realtime, persetujuan klinis, posting, dispensing, pembayaran, atau uji pengguna RS. Bed Manager / OPS-10 tetap dibatasi mengikuti matriks izin saat ini.

Lihat: `design/ROLE_DRAFT_CONTINUITY_V9_2026-11-09.md`.

## V10 — 12 role specialist & operasional (9 November 2026)

Sebanyak **19 dari 44 role** memiliki worklist rinci: 7 role V5/V9 ditambah DPJP Rawat Inap, ATLM, Petugas MCU, Radiografer, Radiolog, Casemix, Koordinator OK, Dokter Anestesi, Tim Mutu, Admin Sistem, Integrasi, dan Gudang. Setiap area berisi empat tugas sintetis, pencarian, detail pekerjaan, checklist, dan traceability PRD.

- ATLM dan MCU kini membuka beranda kerja role-native langsung setelah login.
- Izin form dihitung dari katalog efektif P0+P1+P2/P3. Radiolog, Radiografer, MCU, dan Casemix dapat membuka form draft yang sudah diizinkan; aksi klinis/keuangan resmi tetap tidak aktif.
- DPJP Rawat Inap dan OK/Anestesi menggunakan encounter RI sintetis; pemeriksaan radiologi/MCU dan berkas klaim menggunakan konteks pasien saat form mensyaratkannya. Pekerjaan administratif dan logistik nonpasien tidak membuat tautan pasien.
- Consent pasien pada Admin Sistem secara khusus menggunakan konteks pasien, berbeda dari manajemen akun dan unit.
- Seluruh tindakan bersifat simulasi lokal tanpa backend, release hasil, dispensing, klaim, mutasi stok, DICOM atau integrasi eksternal.

Dokumentasi: `design/ROLE_WORKLIST_COVERAGE_V10_2026-11-09.md`. Sisa 25 role masih menggunakan worklist V4 generik.


## V11 — Role-native worklists untuk seluruh 44 role (9 November 2026)

V11 melengkapi 25 role yang belum memiliki worklist spesifik, sehingga **44/44 role demo** memiliki antrean pekerjaan per area, empat kasus/objek sintetis per area, alasan tindakan, checklist, panel detail, pencarian dan konteks tugas. Semua navigasi tetap mengikuti modul/FR/WF dari PRD final 6 November 2026; form tetap dibuka hanya jika izin katalog role mengizinkan.

Lima kelompok pekerjaan tersisa yang dilengkapi: pelayanan penunjang (gizi, HD, rehab, bank darah, koordinator MCU), operasional/logistik (CSSD, dapur, laundry, pengadaan, aset, maintenance, fasilitas, transport), administrasi/keuangan (BPJS, coder, billing, akuntansi, budget, costing), organisasi (manajemen, HR, payroll, rekrutmen, PPI), dan portal Pasien Demo.

**Batasan:** penambahan worklist bukan berarti 68 modul sudah memiliki UI high-fidelity atau backend. Semua data tetap contoh; hak akses produksi, identitas pasien sesungguhnya, transaksi, integrasi, distribusi, release, klaim, dan posting tidak aktif. Untuk demo, akun Pasien Demo terbatas pada satu pasien sintetis, bukan login pasien sebenarnya.

Dokumentasi: [V11 mapping worklist ke PRD](design/ROLE_WORKLIST_COVERAGE_V11_2026-11-09.md). Tes: tests/role-worklists-v11.test.mjs dan browser smoke di tests/mockup-smoke.spec.mjs.


## V12 — Keselarasan desain dengan 13 layar acuan (9 November 2026)

Situs utama kini memuat `operational-parity-v12.css` dan `operational-parity-v12.js`: lapisan tampilan role-native untuk 14 persona representatif dari 13 layar galeri, dengan panel konteks pasien/episode atau objek, jumlah pekerjaan, filter status gabungan pencarian, layout worklist → detail → form yang lebih konsisten, dan peningkatan tampilan desktop/mobile. Galeri tetap berfungsi sebagai referensi desain, bukan situs operasional kedua. Tidak menambah izin role atau transaksi riil.

Lihat `design/OPERATIONAL_VISUAL_PARITY_V12_2026-11-09.md`. Unit tests dan browser smoke ditambahkan. Implementasi tidak berarti seluruh 68 form sudah high-fidelity atau telah menjalani UAT RS.


## V13 — Form kerja spesifik per profesi (9 November 2026)

V13 melengkapi mockup operasional dengan **22 desain form terkelompok** untuk pendaftaran, rawat jalan, IGD, rawat inap, SOAP, TTV, keperawatan, CPOE, laboratorium, radiologi, resep, farmasi, MCU, dan keuangan. Sesi staf menampilkan bagian isian berdasarkan pekerjaan; status kelengkapan field wajib terisi diperbarui langsung. Katalog reviewer 68 form tetap tersedia tanpa perubahan layout.

Implementasi: `public/ui-preview/role-form-blueprints-v13.js`, `.css`; pengujian: `tests/role-form-blueprints-v13.test.mjs` dan `tests/mockup-smoke.spec.mjs`. Penjelasan lengkap: [V13 form per profesi](design/ROLE_NATIVE_FORMS_V13_2026-11-09.md).

**Batasan:** tidak mengubah kontrak field, role, draft per pasien/encounter, validasi, dan tidak mengaktifkan backend, signing, dispensing, stock mutation, billing, klaim, serta sistem klinis sungguhan. Sisa 46 form belum mendapat layout V13 unik.

## V17 — Adopsi referensi UI klinis (10 November 2026)

Gaya dashboard dan worklist diadaptasi dari tiga gambar rujukan yang disediakan pengguna: sidebar terang, KPI card yang rapi, worklist tabel, serta alternatif kartu. Seluruh 44 role demo dapat berpindah antara **Tabel / Kartu** dengan pekerjaan dan izin yang sama; akun **HR Admin** menampilkan enam kartu direktori personel **sintetis dan read-only** pada Beranda. Seluruh layar klinis, finansial, dan operasional tetap mengikuti role → pekerjaan → pasien/encounter → form.

Berkas: `public/ui-preview/reference-clinical-v17.css`, `reference-clinical-v17.js`. Rincian traceability dan keselamatan: [Adopsi Referensi UI Klinis V17](design/REFERENCE_CLINICAL_UI_V17_2026-11-10.md). Angka dan status pada mockup bukan metrik rumah sakit, dan belum ada backend atau autentikasi produksi.
