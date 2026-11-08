# SIMRS Baru — Status Mockup Form 68 Modul

**Tanggal:** 8 November 2026
**Sumber PRD:** PRD_SIMRS_Baru_Final_NodeJS_FR_US_UI_API_ERD_2026-11-08.docx
**PRD:** https://docs.google.com/document/d/1VTWUqjGeK-VA5otZB4WiGFj6KkqJdo2x/edit
**Status:** Draft PR UI/UX pada `design/ui-system-7-workspaces-20261108` — belum merge atau deploy GitHub Pages.

## Ringkasan hasil

| Kategori | Jumlah modul | Jumlah field rancangan | Bentuk implementasi |
| --- | ---: | ---: | --- |
| P0 | 30 | 185 | Form demo interaktif |
| P1 | 17 | 125 | Form demo interaktif |
| P2 | 14 | termasuk dalam 158 P2+P3 | Form demo eksplorasi |
| P3 | 7 | termasuk dalam 158 P2+P3 | Form demo eksplorasi |
| **Total** | **68** | **468** | **Seluruh modul memiliki prototype form (bukan fitur produksi)** |

**Penting:** Perancangan field merupakan turunan kebutuhan pengguna, entitas domain, serta prioritas dalam PRD. Belum terbukti mapping 1:1 ke semua DTO OpenAPI dan kolom DB; dilakukan validasi bersama 7 PIC sebelum dinyatakan final. ID AC-01 hingga AC-06 ditampilkan untuk traceability, bukan klaim lulus AC atau UAT.

## Cara mencoba

1. Akses `public/ui-preview/index.html` via server web statis dari branch desain.
2. Klik menu `Katalog 68 Form`; pilih prioritas P0/P1/P2/P3 atau tampilkan semuanya.
3. Pilih modul; metadata FR, US, AC, PIC, workflow, tabel utama, serta role yang diizinkan tersedia di panel informasi.
4. Pilih role demo yang sesuai pada dropdown topbar. Pergantian role ketika halaman form sedang dibuka tetap berada pada halaman form.
5. Isi data SINTETIS. Simpan draft; klik review untuk melihat validasi wajib, jenis field, angka, rentang tanggal dan beberapa gate sesuai domain.
6. Setelah sukses, status menjadi `Reviewed (Demo)` dan catatan read-only.
7. Jika modul memiliki relasi berikutnya, klik `Buat draft terkait` dari catatan `Reviewed (Demo)`. Field demo tertentu, termasuk referensi order, nomor resep dan subtotal rencana, dapat disalin ke draft modul lain. Catatan menyimpan sumber lineage.
8. Seluruh data tersimpan hanya di localStorage browser dan dapat dihapus lewat tombol Reset.

## Alur demonstrasi yang bisa diuji

### WF-01 — Identitas dan registrasi
`CORE-08 → CORE-10 → CORE-09` (identitas pasien demo, appointment, check-in).

### WF-02 — Pelayanan dokter
`CORE-09 → RME-01 → RME-05 / RME-04 → RME-06 → RME-08`. Field spesifik tetap harus diisi oleh role yang sesuai. Tidak ada diagnosis/resep pasien nyata.

### WF-03/04 — IGD dan admission
`CORE-09 → RME-02 → RME-03` dan `CORE-05 → OPS-10 → RME-03`. Status bed hanya simulasi.

### WF-05/06 — Order dan layanan penunjang
`RME-08 (order_type Laboratorium) → MED-01`; `RME-08 (order_type Radiologi) → MED-02 → MED-03`. Cabang RIS/LIS menggunakan order_type dari catatan demo. Tidak ada analyzer/HL7/DICOM atau release hasil riil.

### WF-07 — Resep dan farmasi
`RME-04 → MED-04 → MED-05`. ID resep dapat direferensikan di draft, tetapi tindakan dispensing / release obat tidak diproses.

### WF-08 — Revenue cycle
`RME-08 / MED-01 → FIN-01 → FIN-02 → FIN-03`; cabang tambahan `FIN-05`, `FIN-06`, `FIN-07`. Nilai subtotal draft dihitung dari quantity dan unit price pada contoh. Tidak ada posting jurnal, transaksi pembayaran atau pengajuan klaim.

### WF-10/11/12 — Modul pendukung
Contoh navigasi ke `MED-06 → MED-07`, `MED-11 → OPS-05`, serta area mutu `ENT-06 → ENT-08 → ENT-09`. Ini demonstrasi jalur UX, bukan pengeksekusian workflow server.

## Pengamanan dan batasan

- **Dilarang memasukkan data pasien/karyawan asli, NIK/nomor kepesertaan asli, hasil lab asli atau transaksi nyata.** Simulasi hanya sesuai data dummy/sintetis.
- Role gating di UI hanya demo; belum ada otorisasi backend, audit tidak dapat diubah, session, atau SOP operasional.
- Simpan/review demo bukan tanda tangan klinis, approval, release, submit, distribusi, dispensing, BCMA, posting stok, pengajuan klaim atau pelaporan RL resmi.
- Transaksi kritis tetap disabled. Tidak ada HTTP API/FHIR ke SATUSEHAT/BPJS/RS, tidak ada transaksi billing/stock nyata, tidak ada pengiriman data eksternal.
- Catatan demo hanya ditampilkan pada patient_id dan encounter_id yang sama untuk form ber-konteks pasien; form nonpasien tidak otomatis dibatasi ke satu RS atau tenant oleh backend (belum tersedia).
- `Reviewed (Demo)` bukan dokumen klinis signed atau hasil verified; jangan digunakan sebagai sumber keputusan klinis/keuangan nyata.
- Tema visual menggunakan layer SATUSEHAT-inspired provisional, **belum diverifikasi terhadap token dari URL staging**.

## Artefak kode

- `public/ui-preview/p0-form-catalog.js`: metadata PRD seluruh 68 modul + 30 spesifikasi form P0.
- `public/ui-preview/p1-form-definitions.js`: spesifikasi 17 form P1.
- `public/ui-preview/p2-p3-form-definitions.js`: spesifikasi 21 form P2/P3.
- `public/ui-preview/demo-workflow-links.js`: relasi dan nilai prefill demo secara eksplisit.
- `public/ui-preview/p0-forms.js`: form editor, validasi, role gating, read-only review, list record, lineage, navigasi.
- `public/ui-preview/p0-forms.css`: tata letak responsif sesuai tokens yang aktif.
- `tests/p0-forms.test.mjs`, `tests/p1-forms-workflows.test.mjs`, `tests/p2-p3-forms.test.mjs`: tes kontrak dan kondisi negatif.
- `.github/workflows/mockup-forms-p0.yml`: pemeriksaan sintaks dan Node tests.

## Validasi berikutnya sebelum merge

1. Browser smoke test desktop, tablet dan mobile; periksa klik, input, list, role, validasi, focus, aksesibilitas.
2. Review setiap form bersama 7 PIC dan pengguna RS dengan matriks field-to-DTO-to-DB, role-permission, AC, serta UX domain.
3. Implementasikan simulasi data dependency yang lebih kaya (master referensial, order/result, routing state), workflow aktual 15 alur, dan status error lengkap.
4. Pisahkan prototipe UI dari aplikasi produksi; audit/perlindungan data, kontrak API dan transaksi nyata hanya setelah pengembangan backend, SOP dan UAT.
5. Jangan merge atau deploy otomatis: butuh review PR, persetujuan desain dan keputusan rilis GitHub Pages.


## Tambahan implementasi — kontrak API dan browser smoke test

### Audit kontrak 12 modul inti

UI telah memperoleh panel **Kontrak API & database**, menggunakan artefak berikut:

- OpenAPI 3.1: https://drive.google.com/file/d/1RMo7tZ9rdoLjEVYRf-tycxTLzrDgzd08/view
- Model database: https://drive.google.com/file/d/16UTtaKH-wDhXWMtVaf5Z68Osom2ZWfx1/view
- Data mapping yang ditinjau: `public/ui-preview/contract-audit.js`

Modul yang diaudit: **CORE-08, CORE-09, CORE-10, RME-01, RME-04, RME-08, MED-01, MED-04, MED-05, FIN-01, FIN-02, FIN-03**.

Kontrak asli mempunyai perbedaan dari form demo, di antaranya: ID pasien/unit/slot UUID referensial, SOAP `content_ref`, CPOE `items[]`, resep `items[]`, dispensing `prescription_item_id` dan `lot_id`, billing `charge_ids[]` serta payment `allocations[]`. Panel memperlihatkan mana yang masih belum dipenuhi; **ini bukan payload API yang sudah valid**. Modul lain (56 dari 68) **belum diaudit satu-per-satu** terhadap request schema.

### Skenario sintetis satu klik

Tombol **Muat 10 draft rawat jalan** membuat contoh data lokal untuk appointment, registrasi, rawat jalan, SOAP, order, lab, resep, charge, invoice dan rencana pembayaran. Kesepuluhnya **berstatus Draft**, tidak melakukan persetujuan, sign, release, posting, dispensing, settlement atau integrasi. Draft diberi referensi source dan patient/encounter sintetis yang sama. Pemanggilan ulang tidak menggandakan data untuk encounter yang sama.

File: `public/ui-preview/synthetic-journey.js`. Pemeriksaan: `tests/synthetic-journey.test.mjs`.

### Smoke test Chromium

`tests/mockup-smoke.spec.mjs` memeriksa 7 workspace, 68 katalog form, validasi registrasi dan kaitan antarform, panel kontrak, viewport mobile, dan skenario 10 draft. Job GitHub Actions menyimpan screenshot dan trace untuk review. Periksa hasil Actions terbaru pada PR sebelum persetujuan merge; hasil lulus dalam CI **tidak** sama dengan UAT RS atau kelayakan rilis.

### Gap prioritas setelah tahap ini

1. **Kecocokan field-to-API-to-DB:** tinjau per field, bukan hanya nama modul. Bentuk ID dan tipe data mesti mengikuti kontrak; `content_ref`, CPOE items, charge IDs, payment allocations masih perlu rancangan form kompleks.
2. **Master referensial dan dependensi:** lookup unit/slot/practitioner/terminologi/obat/lot, serta relasi identitas pasien dan encounter yang tegas.
3. **Desain UX khusus klinis:** repeatable order item, medication prescription item, spesimen, daftar charge, dan allocation pembayaran; jangan memaksakan satu form generik.
4. **Pengujian:** UAT negatif lintas role/org/pasien, mobile accessibility, validasi draft vs signed, audit immutability, konflik 409, idempotency.
5. **Rilis:** PR tetap draft sampai reviewer 7 PIC dan pemilik RS menyetujui; jangan merge atau menggantikan GitHub Pages main tanpa persetujuan.

## Penambahan: komposer item CPOE dan e-Resep (8 November 2026)

Form `RME-08` dan `MED-04` sekarang menyediakan item berulang (maksimal 12 baris) agar alur input lebih mendekati kebutuhan order dan resep item-level. Pengguna demo dapat menambah/menghapus baris sebelum penyimpanan, menyimpan draft, lalu meninjau kelengkapan. Untuk CPOE, validasi menyelaraskan kategori (laboratorium, radiologi, tindakan) dengan katalog sintetis, memeriksa kuantitas dan mencegah item duplikat. E-Resep memvalidasi pilihan obat, dosis, rute, frekuensi, jumlah, duplikasi, serta tetap mewajibkan review alergi.

Item disimpan sebagai `values.items[]` **hanya di localStorage**. Nilai item pertama dicerminkan ke kolom form lama untuk menjaga kompatibilitas alur draft dan tautan antarform. Perpindahan form terkait dari CPOE masih memakai item pertama, belum mengonversi semua baris menjadi ServiceRequest/MedicationRequest individual. Komposer ini **bukan implementasi DTO OpenAPI**: identitas item, catalog UUID, provenance, penandatanganan, otorisasi, outbox, dan versioning masih harus diselesaikan bersama PIC 4/5.

Pengujian baru mencakup field item wajib, duplikasi, ketidakcocokan jenis order, jumlah tidak valid, escaper konten, dan browser smoke dua item CPOE. Semua tindakan klinis nyata tetap nonaktif. Perubahan ada pada PR #7 dan tidak boleh merge/deploy sebelum review.

## Penambahan: FIN-02 charge_ids[] dan FIN-03 allocations[] (8 November 2026)

- **FIN-02 Billing & Invoice** kini menampilkan daftar referensi `FIN-01` yang **Reviewed (Demo)** dan terkait pasien serta encounter yang sama. Pengguna dapat menambah beberapa baris, memilih charge, melihat nilai charge read-only, dan memperoleh subtotal otomatis dari kuantitas × harga satuan pada charge sumber. Diskon tetap field terpisah dan diuji terhadap subtotal.
- **FIN-03 Kasir & Pembayaran** kini menyediakan beberapa alokasi ke invoice `FIN-02` yang **Reviewed (Demo)** dalam encounter sama. Setiap baris memiliki invoice dan rencana nominal, dengan pemeriksaan referensi ganda, bilangan bulat positif, serta nominal alokasi tidak lebih besar dari nilai invoice sintetis.
- Data draft menyimpan `charge_lines[]` beserta `charge_ids[]` untuk invoice dan `allocations[]` untuk pembayaran. Semua referensi adalah ID lokal sintetis, bukan UUID invoice/charge OpenAPI. Jumlah total juga dipetakan ke `subtotal`/`amount` legacy agar form tetap interoperabel pada mockup.
- Tautan dari Reviewed FIN-01 → FIN-02 dan FIN-02 → FIN-03 sudah memprefill baris awal; tidak memicu transaksi.
- Workflow tetap menolak referensi yang belum Reviewed (Demo), beda pasien, atau beda encounter. Data lama tanpa `charge_lines[]`/`allocations[]` tetap ditampilkan sebagai draft legacy, tetapi format lama tidak boleh diperlakukan sebagai payload FIN API.
- Kinerja: lookup dari localStorage saja; belum ada debit/kredit, invoice ledger, settlement atau pengiriman API. Penghitungan tidak memperhitungkan diskon per item, pajak, multi-payer, posting charge riil, atau outstanding lintas settlement. Semua tindakan keuangan tetap **nonaktif** hingga SOP, kontrak, UAT, dan security sign-off.
