# SIMRS Baru V13 — Form Kontekstual per Profesi

Tanggal: 9 November 2026  
Baseline: `PRD_SIMRS_Baru_Final_User_Stories_Acceptance_Technical_7PIC_2026-11-06` (tidak diubah).

## Tujuan
Menaikkan kesesuaian UX operasional dengan 13 rancangan halaman di `design-gallery.html`, terutama **struktur tiap form**, tanpa mengubah kontrak field yang ada dan tanpa mengaktifkan tindakan nyata. Form dibuka dari worklist role sehingga konteks pasien/encounter tetap tepat.

## Implementasi
- Sumber baru: `role-form-blueprints-v13.js` dan `role-form-blueprints-v13.css`.
- Integrasi konservatif: `p0-forms.js` memanggil `SIMRSFormBlueprintsV13.render(...)` **hanya pada sesi pengguna operasional**, dengan daftar field hasil filter `SIMRSLineItems` dan `SIMRSFinanceLines`.
- Setiap form V13 memakai heading, alur kerja, panel berkelompok dengan deskripsi, kontrol asli dari `renderField` (termasuk master lookup), dan indikator jumlah field wajib terisi. Tidak ada field yang dihapus/diubah namanya. Field baru yang belum terpetakan tetap muncul pada panel `Informasi tambahan`.
- Input/seleksi mengubah **indikator isian terisi**, bukan status valid secara klinis. Validasi tetap dilakukan oleh `p0-forms.js` dan aturan per-modul yang sudah ada.
- Review/penyimpanan `Draft` tetap lokal di browser; `Reviewed (Demo)` tidak berarti signed/approved/released. Izin role tetap ditentukan mekanisme sebelumnya. Reviewer UI/QA mempertahankan katalog 68 form dalam layout lama.

## 22 form yang telah memiliki kelompok kerja khusus

| Domain | Modul | Pengelompokan UI utama |
|---|---|---|
| Pendaftaran | CORE-08 | Identitas dasar, kontak, pemeriksaan duplikasi |
| Pendaftaran | CORE-09 | Kunjungan, penjamin, check-in |
| Pendaftaran | CORE-10 | Unit/dokter, waktu, booking |
| Pendaftaran | CORE-11 | Antrean, lokasi/waktu, status |
| Administrasi penjamin | FIN-04 | Data peserta, masa berlaku, eligibility |
| Klinik rawat jalan | RME-01 | Konteks, keluhan, tindak lanjut |
| IGD | RME-02 | Triase, tanda vital awal, tindakan |
| Rawat inap | RME-03 | Admisi, penempatan, pulang |
| Klinik SOAP/CPPT | RME-04 | Metadata, S, O, A, P |
| Pemeriksaan TTV | RME-05 | Waktu, tekanan darah, nadi/suhu, antropometri |
| Diagnosis | RME-06 | Kode, kepastian/tindakan, justifikasi |
| Keperawatan | RME-07 | Shift, intervensi, evaluasi |
| CPOE | RME-08 | Jenis/urgensi, permintaan, indikasi |
| Laboratorium | MED-01 | Accession/spesimen, pemeriksaan, hasil |
| Radiologi RIS | MED-02 | Order, pelaksanaan, laporan |
| Radiologi PACS | MED-03 | Studi, metadata, akses |
| Resep dokter | MED-04 | Obat/dosis, aturan, review alergi |
| Farmasis | MED-05 | Resep, lot/FEFO, konfirmasi identitas |
| MCU | MED-10 | Paket, pemeriksaan, kelengkapan |
| Charge capture | FIN-01 | Sumber tindakan, biaya |
| Billing | FIN-02 | Invoice, rincian, status |
| Kasir | FIN-03 | Invoice, nominal/metode, review |

## Cakupan role
Pemakaian dipandu izin existing, khususnya Pendaftaran, Dokter RJ, Perawat, Dokter IGD, ATLM, Farmasis, Kasir, DPJP Rawat Inap, Radiografer, Radiolog, Petugas MCU, Koordinator MCU. Katalog 44 role dan 68 form dari V11 tetap dipertahankan. **22 blueprint tidak berarti seluruh 68 form high-fidelity**.

## Validasi
- `tests/role-form-blueprints-v13.test.mjs`: seluruh 22 kode ada di katalog aktif, semua field terpetakan tepat sekali, nama dan jumlah field tetap sama, field baru masuk panel fallback.
- `tests/mockup-smoke.spec.mjs`: smoke alur login per role hingga form, SOAP S/O/A/P, indikator isian, persistensi draft, form klinis/operasional representatif, viewer QA, dan viewport 390px.
- CI Node + Chromium serta workflow Pages harus lulus sebelum main dianggap terintegrasi.

## Batasan dan backlog
1. Prioritas berikutnya: detail UX 46 form lainnya, validasi terminologi/rujukan master per modul dan interaksi kompleks (multi-row order, MAR/BCMA, PACS viewer) yang saat ini tetap mockup.
2. Pembatasan produksi tetap: tanpa API/backend, database RS, real auth/RBAC, FHIR/BPJS/SATUSEHAT, diagnosis otomatis, sign, dispense, stok, release, kasir, klaim, atau UAT RS.
3. Sebelum implementasi nyata perlu konfirmasi field & AC PRD, desain API/database, akses per unit, audit, pengujian klinis, dan SOP.
