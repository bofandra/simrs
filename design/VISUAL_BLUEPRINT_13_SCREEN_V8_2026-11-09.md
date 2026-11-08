# SIMRS Baru — Implementasi Visual Blueprint V8 dan Galeri 13 Halaman
Tanggal: 9 November 2026  
Repository: `bofandra/simrs`  
Baseline produk: `PRD_SIMRS_Baru_Final_User_Stories_Acceptance_Technical_7PIC_2026-11-06`

## Cakupan perubahan
1. `public/ui-preview/visual-blueprint-v8.css`: lapisan visual untuk **situs utama** (login, sidebar role, worklist, tabel, detail, form dan mobile), tanpa mengganti alur interaktif yang sudah ada.
2. `public/ui-preview/design-gallery.html`: 13 layar acuan berisi UI HTML/CSS responsif yang dapat dipilih, difilter, dan mensimulasikan draft/review secara lokal. **Galeri adalah referensi tampilan, bukan aplikasi operasional kedua**.
3. `public/ui-preview/index.html`: memuat lapisan V8 dan tautan galeri **hanya saat halaman login terlihat**. Sesudah login, pengguna operasional hanya melihat menu kerja sesuai akun.
4. `tests/visual-blueprint-v8.test.mjs`: pemeriksaan regresi jumlah halaman, stylesheet, demo guardrail dan struktur login.

## Pemetaan rancangan ke baseline PRD
| Layar | Persona | Modul / workflow representatif |
|---|---|---|
| 01 Login | Semua pengguna | CORE-02, identitas dan izin berbasis akun |
| 02 Front Office | Pendaftaran | CORE-08/09/10/11, WF-01 |
| 03 Dokter RJ | Dokter poli | RME-01/04/06/08, WF-02 |
| 04 Perawat | Perawat | RME-05/07, FR-034 |
| 05 IGD | Dokter/perawat IGD | RME-02, WF-03 |
| 06 Bed Board | Bed Manager | CORE-05/OPS-10, WF-04 |
| 07 LIS | ATLM/verifikator | MED-01, WF-05 |
| 08 Farmasi | Farmasis | MED-04/05/OPS-01, WF-07 |
| 09 Billing & Klaim | Kasir, Casemix | FIN-01/02/03/04/07, WF-08 |
| 10 Manajemen | Direksi/tim mutu | ENT-08/09/10/11 |
| 11 Administrasi | Admin Sistem | CORE-01/02/03/04 |
| 12 Radiologi | Radiografer/Radiolog | MED-02/03, WF-06 |
| 13 MCU | Petugas MCU | MED-10, workflow MCU |

## Keputusan UI
- Login: username dan password; **tidak perlu input peran dan profesi terpisah**. Pemilihan akun demo adalah kemudahan pengujian, bukan bagian dari autentikasi riil.
- Role-first: menu berdasarkan tugas nyata dan izin akses, bukan nama database, kode FR, atau pembagian PIC.
- Worklist → detail → form menggunakan konteks pasien + encounter. Jangan autofill keputusan klinis.
- Status klinis/keuangan memakai **teks + warna**; sign/verify/release, dispense, posting, dan pembayaran tetap berada di balik SOP/UAT nyata.
- Gaya: navy untuk navigasi, teal untuk aksi, kanvas pucat, panel putih, hierarki informasi yang lebih padat untuk operasional RS.
- Mobile: pertahankan drawer menu V6 dan satu kolom untuk form serta detail; hindari katalog global bagi pengguna biasa.

## Cara menguji
- Situs utama: `https://bofandra.github.io/simrs/`
- Galeri: `https://bofandra.github.io/simrs/design-gallery.html`
- Pilih akun `akun.pendaftaran`, `akun.dokter-rj`, `akun.perawat`, `akun.dokter-igd`, `akun.farmasis`, `akun.kasir`, atau `akun.bed-manager`; kata sandi demo `demo123`.
- Login → halaman awal role → daftar kerja → pilih pekerjaan → buka form → simpan draft simulasi. Untuk melihat semua bentuk desain, gunakan galeri dari halaman login.
- Jalankan: `node --check public/ui-preview/*.js`, `node --test tests/*.test.mjs`, lalu browser smoke sesuai workflow Pages.
- Uji tambahan: desktop 1440 × 900, tablet 980 × 800, mobile 390 × 844, halaman login dan role prioritas.

## Batasan
- Galeri adalah ilustrasi DOM interaktif dengan data fiktif, **tidak menggantikan** 68 form mockup utama.
- Belum ada backend RBAC, transaksi klinis/finansial, FHIR nasional, pembentukan tagihan riil, dispensing, atau mutasi stok.
- Tidak semua 68 modul memiliki desain high-fidelity individual dan belum ada UAT bersama pengguna RS.
- Token gaya adalah interpretasi visual, tidak diklaim sebagai token resmi SATUSEHAT.
- Perubahan ini hanya menyentuh sumber situs statis aktif, tidak mengaktifkan eksperimen Next.js di `app/`.
