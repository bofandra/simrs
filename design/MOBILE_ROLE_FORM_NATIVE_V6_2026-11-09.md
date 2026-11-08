# SIMRS Baru — perbaikan layar operasional dan mobile (V6)

Tanggal 9 November 2026  
Baseline: PRD_SIMRS_Baru_Final_User_Stories_Acceptance_Technical_7PIC_2026-11-06

## Masalah yang dilaporkan
Screenshot pada HP menunjukkan setelah login sebagai Pendaftaran dan memilih Registrasi kunjungan, yang muncul masih halaman "Form Pelayanan": panel katalog pilihan modul di kiri, daftar catatan di tengah, dan form di kanan. Di layar sempit tampilannya menjadi sangat kecil dan pengguna melihat istilah teknis yang bukan kebutuhan sehari-hari.

## Keputusan desain
- Pengguna rumah sakit tidak bekerja melalui katalog 68 modul. Katalog hanya muncul untuk akun reviewer.demo (QA/desain).
- Submenu pekerjaan membuka worklist sesuai peran. Dari worklist, pengguna memilih pekerjaan dan kemudian masuk ke satu form operasional.
- Form menampilkan judul tugas seperti "Registrasi kunjungan", bukan "Form Pelayanan".
- Nomor modul, FR, matriks dan dokumen audit tidak ditampilkan sebagai navigasi utama untuk pengguna akhir.
- Riwayat draft menjadi panel yang dapat dibuka bila dibutuhkan; form utama langsung terlihat.
- Petugas melihat satu tombol Menu di HP/tablet. Sidebar pekerjaan dibuka sebagai drawer dan ditutup sesudah memilih menu.
- Reviewer tetap menggunakan workspace teknis dan katalog P0-P3 sebelumnya.
- Tidak ada perubahan izin hak akses, backend, maupun state klinis atau keuangan nyata.

## Perubahan source
- p0-forms.js: route openForRole(code,role) menolak form yang bukan hak role, render form single-screen dan riwayat detail.
- role-demo-login.js: rute module: membuka form langsung, tidak memilih dari katalog, serta mengelola tombol menu HP.
- workspaces-v2.js: shortcut registrasi, CPPT dan modul terkait juga membuka form role langsung, bukan katalog lama.
- index.html: mobile job menu, backdrop, stylesheet V6.
- role-operational-mobile-v6.css: panel samping responsif dan layout form satu kolom pada HP.

## QA yang diwajibkan
- Tes browser 390 x 844: login Pendaftaran -> menu -> Registrasi kunjungan -> pekerjaan -> form; katalog tidak ada; form tampil; tidak terjadi horizontal page overflow.
- Tes browser 980 x 800: menu operasional collapsible, farmasi membuka satu form; reviewer masih memiliki katalog 68 form.
- Regression: 44 akun dan 68 modul tetap tercakup. Hak akses tetap dibatasi. Tidak ada pengiriman API, sign klinis, dispensing, pembayaran, atau bed mutation.
- Desain ini masih prototipe sintetis dan belum terverifikasi melalui UAT RS.

## Gap berikutnya
- Bentuk relasi item worklist dengan encounter/form yang benar; sementara pilihan item worklist tidak memprefill data pasien otomatis.
- Konsistenkan desain dan states seluruh role lain, master-data lookup serta audit data.
- Validasi field API dan database terhadap PRD final bersama PIC.
