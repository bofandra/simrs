# SIMRS Baru — Worklist → Form Context V7

Tanggal: 9 November 2026  
Baseline resmi: `PRD_SIMRS_Baru_Final_User_Stories_Acceptance_Technical_7PIC_2026-11-06`  
Lingkup: mockup GitHub Pages, bukan sistem produksi.

## Hasil implementasi

1. Tujuh role prioritas tetap memakai worklist berdasarkan pekerjaan: Pendaftaran, Dokter RJ, Perawat, Dokter IGD, Farmasis, Kasir, Bed Manager.
2. Setiap pilihan kerja memuat ID pekerjaan, jenis objek (pasien atau bed), dan metadata sintetis. Identitas pasien hanya diambil dari empat pasien demo bawaan, bukan input bebas dan bukan layanan MPI.
3. Saat form dibuka melalui worklist, pilihan pasien dan encounter diteruskan ke `SIMRSFormEngine.openForRole`. Form menampilkan banner yang mudah dikenali dengan pasien, nomor RM, encounter, dan ID pekerjaan asal. Pilihan aktif tidak disimpan sebagai data klinis persisten.
4. Registrasi dan identitas pasien: field administrasi yang aman dapat diprefill (nama pasien demo untuk MPI; jenis kunjungan, unit, dan penjamin demo untuk registrasi). Dokter RJ: unit demo dapat diprefill. Kasir: nomor invoice kerja demo dapat diprefill. **Tidak mengisi otomatis temuan, diagnosis, tanda vital, dosis, atau keputusan klinis**.
5. Draft baru menyimpan `work_item_id` untuk audit sumber simulasi. Catatan pasien tetap difilter menurut kombinasi `patient_id + encounter_id`; pilihan pasien/kunjungan lain tidak menampilkan draft sebelumnya.
6. Pendaftaran menggunakan contoh encounter RJ atau IGD/RI sesuai baris kerja; Dokter IGD memakai `ENC-IGD-DEMO-xx` dan Perawat `ENC-RI-DEMO-xx`. Ini hanya identitas demonstrasi untuk membedakan episode — bukan encounter aktual.
7. Bed Manager tetap diperlakukan sebagai objek bed, **bukan pasien**. Menu OPS-10 belum otomatis dapat membuka form karena izin katalog saat ini hanya DPJP Rawat Inap dan Admin Sistem, bukan Bed Manager. Perlu kesepakatan peran/otorisasi dengan PIC; tidak dilakukan perluasan diam-diam.

## Alur yang diuji

- Pendaftaran → Registrasi kunjungan → pilih REG-D002 → form CORE-09 → banner pasien Bima Rahman/ENC-DEMO-248 → unit Jantung dan penjamin Umum muncul → draft tersimpan sebagai sumber REG-D002 → pindah REG-D001 → pasien/encounter Sari Amelia; draft Bima tidak tampil sebagai draft Sari.
- Dokter IGD → pilih pasien pada worklist → RME-02 → banner dengan encounter IGD sintetis yang berbeda dari encounter RJ.
- Bed Manager → permintaan penempatan → objek bed → tanpa tautan pasien otomatis; form OPS-10 tertahan oleh katalog izin.

## Bukti dan keterbatasan

- Unit test dalam `tests/role-worklist-detail-v5.test.mjs`: validasi identitas, encounter RJ/IGD/RI, invalid selection dan bed isolation.
- Browser tests dalam `tests/mockup-smoke.spec.mjs`: smoke alur registrasi dan IGD + regression akses Bed Manager.
- Pengecekan sintaks JS dan evaluasi programatis render form telah dilakukan; status GitHub Actions harus diperiksa saat PR dibuat.
- Hanya empat pasien/objek kerja contoh yang digunakan; **belum** ada lookup pasien nyata, context service, backend RBAC, isolasi tenant server, signing, ledger, billing, dispensing atau integrasi SATUSEHAT.
- Dalam versi awal, 44 role dan 68 modul **sudah ditelusuri dalam desain navigasi**, tetapi tidak berarti seluruh form, states, field, dan alur per role sudah melalui UAT.

## Backlog berikutnya

1. **Prioritas P0**: sistemkan sumber job/episode/role dari 7 area kerja ke seluruh role sesuai PRD dan mapping akses final; hapus asumsi empat pasien statis.
2. **P0**: tetapkan izin `OPS-10` untuk Bed Manager secara eksplisit setelah review FR/US dan PIC; telaah fungsi Farmasis vs dokter pengirim resep, Kasir vs Billing.
3. **P0**: mapping `work_item → patient → encounter → form record` menjadi kontrak DTO/API/database, dengan pemeriksaan tenant, unit, assignment, dan RBAC server.
4. **P1**: desain detail 37 role lain berdasarkan urutan kerja, empty/loading/error/forbidden state, mobile-first, UAT bersama petugas.
5. **P1**: rekonsiliasi field/kode modul/FR/AC/WF pada seluruh 68 form dengan PRD final dan tambahkan golden-flow tests RJ, IGD, RI. Jangan menganggap coverage menu sebagai coverage fungsional.

## Safety

Semua data sintetis. Tidak ada transaksi klinis/finansial, mutasi stok, pasien nyata, integrasi atau otorisasi backend. Jangan gunakan mockup ini untuk pelayanan rumah sakit.
