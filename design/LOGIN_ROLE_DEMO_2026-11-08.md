# Login Demo dan Landing Page Berbasis Role — SIMRS Baru

**Tanggal:** 8 November 2026 (diperbarui 9 November 2026)  
**Cakupan:** Mockup static GitHub Pages pada `public/ui-preview/`

## Alur pengguna
1. Buka situs SIMRS Baru: yang terlihat pertama kali adalah halaman **Login Demo**. Aplikasi utama disembunyikan sebelum login.
2. Pilih akun role dari katalog 44 role atau ketik username. Kata sandi setiap akun: **`demo123`**.
3. Setelah login, role disetel dari akun (bukan pilihan role bebas). Menu navigasi global/teknis disembunyikan.
4. Peran dengan workspace operasional yang sudah tersedia diarahkan langsung ke workspace itu. Peran lain diarahkan ke halaman **Beranda Saya**, yang berisi hanya menu dan tugas yang sesuai dengan hak akses modul role itu.
5. Form hanya menampilkan modul yang mencantumkan role terkait. Interaksi tetap lokal dan data sintetis.
6. Klik **Keluar** untuk mengakhiri sesi demo dan kembali ke halaman login.

## Akun reviewer khusus QA
`reviewer.demo` / `demo123` digunakan untuk pengujian dan review lintas role. Akun ini **bukan role pengguna operasional**. Hanya pada mode reviewer, sidebar tujuh workspace, katalog 68 form, dan pemilih role UI tetap tersedia.

## Katalog akun role

| No. | Role pengguna | Username demo | Halaman setelah login |
|---:|---|---|---|
| 1 | Pendaftaran | `akun.pendaftaran` | Registrasi & Front Office |
| 2 | Dokter RJ | `akun.dokter-rj` | Dokter Rawat Jalan |
| 3 | Dokter IGD | `akun.dokter-igd` | IGD & Triase |
| 4 | DPJP Rawat Inap | `akun.dpjp-rawat-inap` | Beranda tugas khusus role |
| 5 | Perawat | `akun.perawat` | Workspace Keperawatan |
| 6 | ATLM | `akun.atlm` | Laboratorium LIS |
| 7 | Petugas MCU | `akun.petugas-mcu` | MCU Perusahaan |
| 8 | Farmasis | `akun.farmasis` | Farmasi |
| 9 | Gudang | `akun.gudang` | Beranda tugas khusus role |
| 10 | Kasir | `akun.kasir` | Kasir & Tagihan |
| 11 | Casemix | `akun.casemix` | Beranda tugas khusus role |
| 12 | Manajemen RS | `akun.manajemen-rs` | Dashboard Manajemen |
| 13 | Tim Mutu | `akun.tim-mutu` | Beranda tugas khusus role |
| 14 | Integrasi | `akun.integrasi` | Beranda tugas khusus role |
| 15 | Admin Sistem | `akun.admin-sistem` | Beranda tugas khusus role |
| 16 | Koordinator OK | `akun.koordinator-ok` | Beranda tugas khusus role |
| 17 | Dokter Anestesi | `akun.dokter-anestesi` | Beranda tugas khusus role |
| 18 | Radiografer | `akun.radiografer` | Beranda tugas khusus role |
| 19 | Radiolog | `akun.radiolog` | Beranda tugas khusus role |
| 20 | Ahli Gizi | `akun.ahli-gizi` | Beranda tugas khusus role |
| 21 | Petugas CSSD | `akun.petugas-cssd` | Beranda tugas khusus role |
| 22 | Petugas Dapur | `akun.petugas-dapur` | Beranda tugas khusus role |
| 23 | Petugas BPJS | `akun.petugas-bpjs` | Beranda tugas khusus role |
| 24 | Coder | `akun.coder` | Beranda tugas khusus role |
| 25 | Pasien Demo | `akun.pasien-demo` | Beranda tugas khusus role |
| 26 | Perawat HD | `akun.perawat-hd` | Beranda tugas khusus role |
| 27 | Terapis Rehabilitasi | `akun.terapis-rehabilitasi` | Beranda tugas khusus role |
| 28 | Koordinator MCU | `akun.koordinator-mcu` | Beranda tugas khusus role |
| 29 | Petugas Bank Darah | `akun.petugas-bank-darah` | Beranda tugas khusus role |
| 30 | Pengadaan | `akun.pengadaan` | Beranda tugas khusus role |
| 31 | Petugas Laundry | `akun.petugas-laundry` | Beranda tugas khusus role |
| 32 | Akuntan | `akun.akuntan` | Beranda tugas khusus role |
| 33 | Budget Owner | `akun.budget-owner` | Beranda tugas khusus role |
| 34 | Analis Biaya | `akun.analis-biaya` | Beranda tugas khusus role |
| 35 | Petugas Aset | `akun.petugas-aset` | Beranda tugas khusus role |
| 36 | Teknisi | `akun.teknisi` | Beranda tugas khusus role |
| 37 | Petugas Fasilitas | `akun.petugas-fasilitas` | Beranda tugas khusus role |
| 38 | Koordinator Transport | `akun.koordinator-transport` | Beranda tugas khusus role |
| 39 | HR Admin | `akun.hr-admin` | Beranda tugas khusus role |
| 40 | Payroll Admin | `akun.payroll-admin` | Beranda tugas khusus role |
| 41 | Rekruter | `akun.rekruter` | Beranda tugas khusus role |
| 42 | Tim PPI | `akun.tim-ppi` | Beranda tugas khusus role |
| 43 | Petugas Billing | `akun.petugas-billing` | Beranda Billing dan Charge Capture |
| 44 | Bed Manager | `akun.bed-manager` | Beranda Pengelolaan Tempat Tidur |

## Batasan keamanan dan pemisahan data
- Login dan password diproses sepenuhnya di browser. **Bukan autentikasi sebenarnya**; semua kredensial demo sengaja bersifat publik dan terdapat di source code.
- Sesi demo disimpan di `sessionStorage`. Data pasien dan draft mockup tetap sintetis di `localStorage`. Ini bukan isolasi multi-tenant atau otorisasi backend.
- Pembatasan menu dan role tidak melindungi data dari developer tools. Jangan gunakan contoh ini untuk pasien nyata.
- Tindakan klinis signed, posting stok, pembayaran, klaim, integrasi BPJS/SATUSEHAT, dan pelaporan resmi tetap tidak diaktifkan.

## Kesiapan berikutnya
- Uji navigasi tiap role dengan staf rumah sakit untuk memastikan label tugas, detail worklist, formulir, dan urutan kerja cocok dengan SOP.
- Pecah workspace operasional yang masih generik menjadi layar per persona, terutama IGD, RI, Farmasi, Gizi, dan Kasir.
- Untuk produksi: backend autentikasi, otorisasi per aksi, peran per unit, cakupan organisasi, MFA/SSO bila diperlukan, audit akses, session management, dan pemisahan data RS.

## Pemeriksaan
- `tests/role-demo-login.test.mjs` menguji 44 akun, login gagal/berhasil, navigasi, logout, reviewer.
- `tests/mockup-smoke.spec.mjs` memeriksa login-first serta role Pendaftaran, Perawat, Laundry, reviewer dengan browser Chromium.
- Deployment GitHub Pages dipicu pada update branch `main` setelah seluruh pemeriksaan CI lulus.
**Pembaruan V5:** Pendaftaran, Dokter RJ, Perawat, Dokter IGD, Farmasis, Kasir, dan Bed Manager mempunyai worklist detail dan checklist per tahapan. Pada tiga role pertama, halaman operasional v2 tetap landing page dan worklist V5 diakses melalui menu peran. Reviewer QA tetap terpisah.
