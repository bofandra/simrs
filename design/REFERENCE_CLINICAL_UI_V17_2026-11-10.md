# SIMRS Baru — V17 Adopsi Referensi UI Klinis (10 November 2026)

## Tujuan dan sumber

Tiga gambar referensi dari pengguna: (1) pola Meditech bergaya minimal untuk manajemen dokter/staf dan dashboard, (2) gabungan dashboard Billing, OPD, IPD/Bed, laboratorium dan radiologi, (3) pola kartu direktori Doctors & Staff dari Amanah Clinical OS. Desain diadopsi sebagai **bahasa visual**, bukan menyalin merek, isi, angka, kredensial atau praktik klinis produk referensi.

Acuan fungsi tetap **PRD_SIMRS_Baru_Final_User_Stories_Acceptance_Technical_7PIC_2026-11-06** dengan penajaman form klinis Bab 13 v1.1. Situs utama yang di-deploy adalah `public/ui-preview/index.html`; berkas Next.js `app/` bukan target Pages.

## Pola yang diimplementasikan

| Pola visual | Implementasi V17 | Perilaku |
|---|---|---|
| Sidebar klinis terang dan compact | `reference-clinical-v17.css` | Menu tetap hasil `navHtml(role)`; tidak menampilkan katalog global untuk akun staf |
| Header putih, judul halaman dan deskripsi ringkas | Gaya `.topbar`, `.uxv4-head` | Tidak mengubah login atau otorisasi |
| Kartu KPI sederhana | Gaya `.uxv5-summary` | Angka berasal dari antrean/draft **lokal dan sintetis**, bukan indikator RS sungguhan |
| Worklist plus detail | Tabel yang sudah ada diberi tampilan lebih rapi | Konteks pasien/encounter, filter dan tombol form tetap mengikuti V5/V12 |
| Kartu personel/work item | Tombol tampilan **Tabel / Kartu** di seluruh worklist role | Kartu pekerjaan menggunakan `jobRows(role, section)` yang sama, tidak menambah workflow atau hak akses |
| Direktori dokter/staf | 6 kartu contoh read-only **hanya HR Admin / Beranda** | Contoh komponen SDM, bukan master personel atau daftar dokter RS |
| Responsive/mobile | Grid menjadi 2/1 kolom, drawer navigasi tetap berjalan | Minimal target 390px tanpa menampilkan seluruh form sekaligus |
| Bahasa visual klinis | putih, slate, aqua/teal dan aksen biru | Tetap khas SIMRS; tidak memakai logo produk rujukan |

## Penelusuran spesifikasi dan role

- **HR Admin** — `ENT-01`, `FR-029` / `FR-046`, daftar penugasan `WF-01`. Direktori staf di atas hanya *preview kartu read-only*; aksi kelola staf tetap berada pada form dengan izin role yang sesuai.
- **Manajemen RS** — `ENT-10`, `FR-031`, `WF-12`. Dashboard tetap mengikuti antrean manajemen; tidak menggunakan angka statistik tiruan sebagai data rumah sakit aktual.
- **Dokter RJ** — `RME-01/RME-04`, `FR-009`, `WF-02`. Tombol kartu membuka pekerjaan yang sama; form tetap memerlukan pasien/encounter dan akses sah.
- **Pendaftaran** — `CORE-09`, `FR-006`, `WF-01`. Tidak ada perluasan alur registrasi atau pemilihan role ketika login.
- **Kasir** — `FIN-01/FIN-02`, `FR-025/FR-026`, `WF-08`. Hanya presentasi antrean/peninjauan tagihan, tanpa pembayaran aktual.
- Seluruh **44 role** tetap mengikuti menu profesional masing-masing. Mockup **68 modul**, 7 PIC, form V16 `CF-01..CF-14` dan 12 workflow tidak berubah.

## Penggunaan & uji penerimaan

1. Login `akun.hr-admin` dengan kata sandi publik demo dan lihat panel direktori staf (6 contoh), **tanpa aksi kelola karyawan**.
2. Di worklist klik **Kartu**, pilih pekerjaan; panel detail menampilkan pekerjaan yang sama dan tetap menggunakan `data-demo-action="job:<index>"` untuk menjaga konteks.
3. Cari pekerjaan dan gunakan filter status apabila tersedia; tampilan tabel maupun kartu harus konsisten.
4. Ganti area kerja atau akun role: mode tampilan dapat berbeda per role/section. Reviewer UI/QA tetap melihat katalog/kontrol QA.
5. Lebar 390px: drawer sidebar, area kerja dan cards tidak membuat form kompleks memadat menjadi satu halaman.
6. Jalankan `node --test tests/*.test.mjs` dan `npx playwright test --config=tests/playwright.config.mjs`.

## Guardrails

Tidak mengubah validasi, role permission, local draft storage, sesi pasien/encounter, modul, kontrak FHIR, atau integrasi. Semua profil staf contoh dan pekerjaan adalah **sintetis**. Tidak ada API backend, SATUSEHAT/BPJS, order klinis, dispensing, mutasi stok, bed transfer nyata, pembayaran, klaim, atau pengiriman laporan yang diaktifkan.

**Catatan tahap berikutnya:** chart Revenue vs Expenses dan KPI klinis _live_ pada gambar referensi hanya pola visual, bukan data yang siap disajikan. Pembuatan widget riil mensyaratkan definisi indikator, sumber data, unit/periode, freshness, permission, dan pengujian UAT.
