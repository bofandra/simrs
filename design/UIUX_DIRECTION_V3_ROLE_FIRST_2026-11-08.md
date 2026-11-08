# SIMRS Baru — UI/UX Direction v3: Role-first Hospital Workspace
**Tanggal:** 8 November 2026
**Status:** Prototipe desain interaktif (data sintetis), bukan sistem produksi
**Baseline produk yang disepakati:** `PRD_SIMRS_Baru_Final_User_Stories_Acceptance_Technical_7PIC_2026-11-06.docx`
**Target tampilan:** `public/ui-preview/index.html`, diterbitkan di GitHub Pages setelah CI lulus.

## Konsep
Satu aplikasi rumah sakit dengan identitas visual konsisten, tetapi **halaman awal, menu, daftar kerja, form, dan prioritas aksi mengikuti role pengguna**. Struktur UI berpusat pada tugas, bukan struktur database atau nama modul teknis.

**Alur:** Login demo → pilih role/kredensial → dashboard kerja role → antrean/daftar pasien/item → detail/form → review lokal atau draft. Tindakan klinis/finansial kritis tetap nonaktif sebagai simulasi.

## Desain yang dibuat

| Lapisan | Desain | Perilaku |
| --- | --- | --- |
| Login | Layar dua sisi: pengenalan + area masuk; 6 pilihan profesi cepat; pencarian seluruh 42 akun | Akun `akun.<role>` / `demo123`, tidak ada autentikasi backend |
| Sidebar | Navigasi putih kontras rendah, penanda halaman hijau teal; hanya tugas yang diperbolehkan | Reviewer QA terpisah dari pengguna operasional |
| Topbar | Breadcrumb, role aktif, tanda data demo, logout | Role ditetapkan dari akun, bukan switch bebas |
| Workspace klinis | Worklist kiri, formulir pasien di tengah, informasi medis penting di sisi kanan | Pasien/encounter tetap terlihat, draft dan review terpisah |
| Workspace administratif | Pencarian/filter, tabel tindakan, form/drawer, validasi | Tidak membuat transaksi pasien/keuangan nyata |
| Beranda 42 role | Banner konteks, jumlah tugas tersedia, contoh 3 antrean prioritas, akses cepat sesuai role | Antrean dan prioritas merupakan **data ilustrasi**, tombol menuju halaman/form role yang ada |
| Pembatasan keamanan | Status semantik dengan teks, konfirmasi, error, permission denial | Semua data lokal sintetis, bukan role-based security nyata |

## Visual language
- Kanvas abu-putih sejuk, panel putih, aksen turquoise/teal, heading navy kehijauan.
- Tipografi ringkas dan kontras; layout padat yang tetap terbaca untuk pemakaian seharian di poli, IGD, bangsal, dan loket.
- Status tidak hanya lewat warna: selalu memakai label tertulis.
- Desktop: sidebar + workspace; klinis 3 panel. Tablet: 2/1 panel. Mobile: worklist dan komponen menjadi stack vertikal.
- Tombol tindakan primer tunggal sesuai konteks, aksi sekunder minim gangguan.
- CSS dalam `uiux-v3.css` adalah **lapisan visual** agar fungsionalitas 68 form dan role login terdahulu tetap tersedia.

## Role dan konten halaman
- Pendaftaran: identitas → MPI → janji temu → registrasi dan antrean.
- Dokter RJ: daftar pasien poli → SOAP, diagnosis, CPOE, resep, riwayat.
- Dokter IGD: daftar pasien → triase → disposisi.
- DPJP RI: daftar visite → rencana terapi → discharge.
- Perawat: daftar tanggung jawab shift → TTV dan catatan asuhan.
- ATLM/Radiolog/Radiografer: worklist pemeriksaan → hasil → verifikasi.
- Farmasis/Gudang/Laundry/CSSD/Dapur: antrean pekerjaan berdasarkan siklus unit; tetap tunduk SOP dan UAT sebelum aktivasi transaksi.
- Kasir/Casemix/Coder/BPJS: tagihan, dossier, rekonsiliasi, dan status partner.
- Manajemen/Mutu/Integrasi/Admin/SDM: KPI, pengecualian, audit, konfig dan tugas yang relevan.
- Role lain: beranda dengan tugas spesifik per profesi + akses modul yang telah dipetakan; bukan menu global.

## Pertimbangan klinis dan operasional
1. Identitas, penjamin, unit, dan Encounter jangan terlepas dari konteks form.
2. Peringatan alergi, obat, hasil abnormal/critical memerlukan prioritas visual yang berbeda dari notifikasi biasa.
3. **Simpan draft, Review, Sign/Verify, Release** adalah aksi yang berbeda. Mockup tidak melakukan sign/verify klinis riil.
4. Kesalahan input dan benturan data harus tampil sebagai pesan kontekstual dengan pilihan memperbaiki, bukan toast samar saja.
5. Login demo bukan mekanisme autentikasi. Data nyata memerlukan backend otorisasi, audit, consent, dan isolasi tenant.
6. Gunakan gaya SATUSEHAT hanya sebagai referensi. Token yang dipakai saat ini **belum terverifikasi** sebagai token resmi dari staging SATUSEHAT.

## Scope selesai dalam iterasi ini
- CSS visual v3; login 6 peran cepat di atas katalog 42 role.
- Beranda role yang belum memiliki dedicated workspace: tiga antrean konteks per profesi, akses form, indikator lingkungan demo.
- Mempertahankan workspace detail yang sudah ada dan perlindungan role pada mockup.
- Pengujian kontrak Node serta smoke browser dijalankan oleh GitHub Actions.

## Lanjutan desain per persona
- Perlu detail worklist, form, empty/loading/error state, dan alur operasional nyata untuk setiap unit, dengan review staf RS.
- Verifikasi resmi token, komponen, dan aksesibilitas terhadap design system SATUSEHAT jika staging dapat diakses.
- Sinkronkan nomor US/FR/workflow dengan baseline PRD sebelum menyatakan sebuah halaman siap implementasi.
