# UI Workspace v2 — Registrasi dan Dokter RJ

Tanggal: 2026-11-08. PRD baseline: 68 modul / 66 FR / 15 workflow. Versi ini khusus mockup GitHub Pages. Seluruh data sintetis dan hanya disimpan pada localStorage browser. Tidak ada backend, sign klinis, pengiriman SATUSEHAT/BPJS, transaksi kas, dispensing, atau mutasi stok.

## Navigasi
- Tujuh workspace tetap tersedia untuk eksplorasi lintas modul.
- Menu akses cepat di sidebar mengikuti pilihan peran pada topbar.
- Deep link untuk Registrasi dan Dokter RJ: #/front/registration, #/clinical/soap, #/clinical/vitals, #/clinical/diagnosis, #/clinical/order, #/clinical/medication, #/clinical/history.
- Katalog 68 form tetap tersedia bagi reviewer dan 7 PIC, tetapi tidak dijadikan menu utama operator.

## Registrasi & perjalanan pasien
- Worklist pasien dengan pencarian, status Terjadwal / Draft / Check-in (Demo), dan konteks patient_id + encounter_id.
- Pencocokan MPI ditinjau terlebih dahulu, draft disimpan, baru check-in. Check-in berulang tidak mencatat perubahan tambahan.
- Form tipe kunjungan, unit tujuan, penjamin, dokter, alasan kunjungan. NIK dan identifier asli tidak digunakan.
- Shortcut ke appointment, antrean, dan workspace dokter. Tidak membuat encounter/antrean nyata.
- Mapping: CORE-08, CORE-09, CORE-10, CORE-11; FR-004..FR-007; WF-01.

## Dokter Rawat Jalan
- Worklist kiri, patient banner dan SOAP di tengah, ringkasan alergi, obat aktif, dan timeline di kanan.
- Enam tab: SOAP/CPPT, Asesmen & TTV, Diagnosis, CPOE, E-Resep, Riwayat.
- Draft SOAP terikat pada pasien/encounter. Review menolak S/O/A/P atau tinjauan alergi yang belum lengkap. Setelah review, catatan dikunci; addendum membuat revisi lokal baru dan menyimpan riwayat review.
- Tindakan sign, release, maupun order/MedicationRequest nyata tidak tersedia.
- Mapping: RME-01/04/05/06/08, MED-04, RME-11; FR-009, FR-016, FR-034, FR-042; WF-02.

## Batasan dan pekerjaan berikutnya
- Mapping field-ke-DTO/database, validasi klinis, otorisasi RBAC backend, isolasi tenant, consent, sign/addendum immutable di server, audit, konflik 409, dan integrasi nyata masih belum diimplementasikan.
- Uji eksplorasi desktop/tablet/mobile dengan pengguna RS, termasuk petugas Pendaftaran, Dokter RJ dan Perawat.
- Perlu memperluas pola worklist/detail/form ke IGD, RI dan workspace lain sambil mempertahankan katalog 68 modul.

## Pemeriksaan
- Node: node --test tests/*.test.mjs
- Browser: npx playwright test --config=tests/playwright.config.mjs (setelah runner diinstal).
- GitHub Pages workflow memeriksa JavaScript, Node tests, serta Chromium smoke test sebelum deploy.
