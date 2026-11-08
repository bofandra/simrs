# SIMRS Baru — Implementasi Mockup Form P0

**Tanggal:** 8 November 2026
**Baseline:** PRD_SIMRS_Baru_Final_NodeJS_FR_US_UI_API_ERD_2026-11-08.docx
**Sumber:** https://docs.google.com/document/d/1VTWUqjGeK-VA5otZB4WiGFj6KkqJdo2x/edit
**Status:** Draft PR, belum merge atau deploy GitHub Pages.

## Cakupan

| Komponen | Jumlah |
|---|---:|
| Modul tercatat di katalog | 68 |
| Modul P0 dengan konfigurasi form | 30 |
| Field P0 (wajib dan opsional) | 185 |
| Field P0 wajib | 168 |
| Modul P1/P2/P3 tercatat namun belum mempunyai form spesifik | 38 |
| Contoh rangkaian workflow lintas modul | 9 |

Ini adalah desain UI berbasis kebutuhan domain dan entitas PRD. Belum semua field dipastikan sesuai DTO OpenAPI atau kolom database secara satu-ke-satu. ID AC dicantumkan untuk traceability, bukan klaim telah lulus AC/UAT.

## Pembagian 30 form P0

- PIC 1: CORE-01, CORE-02, CORE-03, CORE-04, CORE-05, CORE-06, CORE-07, CORE-08, CORE-12.
- PIC 2: CORE-09, CORE-10.
- PIC 3: RME-01, RME-02, RME-03, RME-04, RME-05, RME-06, RME-07, RME-11, OPS-10.
- PIC 4: RME-08, MED-01.
- PIC 5: MED-04, MED-05, OPS-01.
- PIC 6: FIN-01, FIN-02, FIN-03, FIN-04.
- PIC 7: ENT-11.

## Cara memeriksa

1. Buka public/ui-preview/index.html dengan server HTTP statis.
2. Klik menu **Form Modul P0** lalu cari berdasarkan kode/nama atau ubah filter prioritas.
3. Lihat metadata modul: PIC, FR, User Story, enam AC, workflow, role, entitas utama.
4. Ubah role demo via topbar ke role yang sesuai; kembali ke menu Form Modul P0.
5. Isi **Form baru** dengan data sintetis; klik **Simpan draft (demo)**.
6. Klik **Tinjau kelengkapan**. Input kosong/tidak valid diberi error inline; form baru bisa menjadi Reviewed (Demo) jika valid.
7. Catatan Reviewed menjadi read-only; sign/approve/release tetap disabled.
8. Navigasi alur contoh lintas modul melalui workflow stepper. Konteks pasien demo dipertahankan, tetapi transaksi lintas modul belum otomatis dibuat.
9. Reset semua data demo untuk menghapus draft di localStorage browser.

## Skenario negatif dan batasan

| ID | Test | Hasil yang diharapkan |
|---|---|---|
| NEG-01 | Role tidak memiliki izin | Read-only; simpan/review disabled |
| NEG-02 | SOAP belum lengkap | Review gagal, field error |
| NEG-03 | NIK sintetis tidak 16 digit | Format ditolak |
| NEG-04 | Consent/booking tanggal akhir mendahului awal | Validasi periode gagal |
| NEG-05 | Resep tanpa review alergi | Review ditolak |
| NEG-06 | Dispensing tanpa cek identitas | Review ditolak |
| NEG-07 | Diastolik lebih tinggi/sama dengan sistolik | Ditolak |
| NEG-08 | Diskon lebih besar dari subtotal | Ditolak |
| NEG-09 | Menekan sign/release/dispensing/stock/payment resmi | Seluruh aksi kritis nonaktif |

**PENTING:** Jangan input identitas atau data pasien asli. Browser localStorage digunakan hanya untuk data sintetis. Tidak tersedia backend, otorisasi server, transaksi klinis, tanda tangan, billing resmi, FHIR, audit immutable, If-Match, atau Idempotency-Key. Semua masih perlu SOP, security review, UAT dan sign-off rumah sakit.

## File dan pengujian

- public/ui-preview/p0-form-catalog.js — metadata 68 modul, 30 schema UI P0.
- public/ui-preview/p0-forms.js — editor, validasi, review demo, worklist, role gating dan workflow navigasi.
- public/ui-preview/p0-forms.css — tema responsif konsisten dengan tema SIMRS aktif.
- public/ui-preview/index.html — integrasi menu dan aset.
- tests/p0-forms.test.mjs — pengujian katalog, validasi, dan escaping.
- .github/workflows/mockup-forms-p0.yml — syntax + Node test pada PR/push.

Perintah pengujian: node --test tests/p0-forms.test.mjs

## Belum selesai

1. Browser smoke test desktop/mobile dan accessibility.
2. Cross-check seluruh field dengan PRD, DTO API, database, 7 PIC, dan skenario UAT spesifik.
3. Lookup master dan dependency lintas modul yang benar-benar mengalirkan data demo.
4. Pembuatan form lengkap untuk 38 modul P1/P2/P3.
5. Review/merge PR, deployment GitHub Pages, dan uji halaman ter-deploy.