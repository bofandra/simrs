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
