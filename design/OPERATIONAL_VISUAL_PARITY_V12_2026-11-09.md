# SIMRS Baru V12 — Keselarasan Visual dan Konteks Operasional

Tanggal: 9 November 2026  
Repositori: `bofandra/simrs`  
PRD resmi: `PRD_SIMRS_Baru_Final_User_Stories_Acceptance_Technical_7PIC_2026-11-06`.

## Tujuan
Mendekatkan mockup operasional aktif ke 13 layar `design-gallery.html` tanpa menduplikasi aplikasi, memindahkan bisnis proses ke galeri, atau melemahkan isolasi pengguna.

## Cakupan terimplementasi
- CSS `operational-parity-v12.css` dipasang **setelah** blueprint V8 dan CSS V10 supaya komponen worklist, detail pekerjaan, form dan mobile memakai layout yang lebih konsisten dengan galeri.
- JS `operational-parity-v12.js` dimuat setelah V11 dan sebelum proses login demo. Menghiasi render V5 tanpa mengganti `jobRows`, seleksi pasien/encounter, kontrak form, atau otorisasi role.
- Empat belas persona representatif bagi **13 layar galeri**: Pendaftaran, Dokter RJ, Perawat, Dokter IGD, Bed Manager, ATLM, Farmasis, Kasir, Manajemen RS, Admin Sistem, Radiografer, Radiolog, Petugas MCU, Koordinator MCU. Dua persona radiologi menunjuk satu layar desain.
- Beranda kerja menampilkan konteks yang sedang dipilih (pasien/episode atau objek unit) dan identifier sintetis, beserta jumlah pekerjaan nyata di antrian demo saat ini, bukan label nama antrean sebagai angka.
- Filter status `Semua`, `Perlu ditinjau`, `Menunggu`, `Dalam proses`, dikombinasikan dengan pencarian bebas. Filter tetap tersimpan dalam sesi JS per role dan area, tetapi **bukan** data transaksi dan tidak disimpan ke server/localStorage.
- Worklist, panel detail, form dan status diberikan penekanan visual yang sama: navigasi navy, aksi teal, kanvas terang, penanda status teks, layout adaptif 1440px/980px/390px, tanpa mengubah navigasi role.
- Form tetap diakses dari pekerjaan yang dipilih dan mengikuti izin P0-P3. Katalog 68 form tidak muncul untuk petugas operasional.

## Traceability acuan
| Tampilan galeri | Persona / alur | Modul dan FR terkait |
|---|---|---|
| Pendaftaran | Pendaftaran, WF-01 | CORE-08/09/10/11, FR-004/005/006/007 |
| Dokter RJ | Dokter RJ, WF-02 | RME-01/04/06/08, MED-04, FR-009/016/020 |
| Perawat | Perawat | RME-05/07, FR-034 |
| IGD | Dokter IGD, WF-03 | RME-02, FR-010 |
| Bed | Bed Manager, WF-04 | CORE-05, OPS-10, FR-011 |
| LIS | ATLM, WF-05 | MED-01, FR-019 |
| Farmasi | Farmasis, WF-07 | MED-04/05, OPS-01, FR-020/021 |
| Kasir/klaim | Kasir, WF-08 | FIN-01/02/03/04/07, FR-025/026/027 |
| Manajemen | Manajemen RS, WF-12 | ENT-08/09/10/11, FR-030/031 |
| Administrasi | Admin Sistem | CORE-01/02/03/04 |
| Radiologi | Radiografer dan Radiolog, WF-06 | MED-02/03, FR-019 |
| MCU | Petugas dan Koordinator MCU | MED-10, FR-019 |
| Login | Semua akun | CORE-02 |

## Verifikasi
- Unit Node `tests/operational-parity-v12.test.mjs`: pemuatan stylesheet/script berurutan, injeksi konteks pasien dan ringkasan numerik, kontrol status, isolasi role lain, keamanan read-only.
- Browser Chromium `tests/mockup-smoke.spec.mjs`: konteks pasien dan encounter pada Pendaftaran, status + pencarian gabungan, isolasi Dokter/Lab/Kasir, serta responsif 390px sampai form kontekstual.
- CI: `Mockup Forms P0-P3 Checks` dan `Publish Pages` wajib lulus sebelum menyatakan deployment aktif. Screenshot browser merupakan artefak verifikasi, bukan bukti UX/UAT petugas RS.

## Batasan eksplisit
- Ini masih **mockup statis**. Fitur pemrosesan data, API, database, transaksi, verifikasi medis, FHIR, BPJS dan SATUSEHAT belum aktif.
- Pekerjaan V12 mengutamakan **keseragaman design system, panel, metadata, dan interaksi daftar kerja** untuk 13 layar acuan. Belum semua dari 68 form memiliki komponen high-fidelity unik atau validasi lengkap seluruh acceptance criteria.
- **Sisa backlog**: perbaiki field dan pola interaksi tiap form klinis secara bertahap; workflow lintas unit dengan handoff nyata; uji 44 akun pada desktop/tablet/mobile dan UAT staf RS; implementasi API/database, auth/RBAC produksi dan SOP.
- Jangan menafsirkan `Reviewed (Demo)` sebagai catatan signed, `data-v12-filter` sebagai perubahan status klinis, atau perubahan tampilan sebagai kesiapan produksi.
