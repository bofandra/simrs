# SIMRS Baru — V9 Kontinuitas Worklist → Draft

Tanggal: 9 November 2026
PRD baseline: `PRD_SIMRS_Baru_Final_User_Stories_Acceptance_Technical_7PIC_2026-11-06`

## Masalah dan perbaikan
- Sebelumnya worklist menampilkan status statis walaupun catatan demo sudah disimpan atau ditinjau. Sekarang indikator *dokumentasi lokal* berasal dari record untuk pekerjaan yang sama.
- Sebelumnya pembukaan kembali form dari worklist selalu memulai editor baru. Sekarang rekaman terakhir yang cocok `work_item_id` dan, untuk form pasien, `patient_id + encounter_id`, dibuka. Pengguna masih bisa memilih **Form baru**.
- Tombol form dari beranda tujuh peran kini menurunkan konteks dari fitur awal pada worklist, alih-alih membuka form dengan konteks pasien generik.
- Navigasi dari worklist menolak konteks yang hilang untuk tujuh peran prioritas. Tidak ada perluasan izin modul.

## Kriteria uji
1. Draft REG-D002 CORE-09 tampil sebagai "Draft tersimpan" dan dapat dilanjutkan dari Pendaftaran.
2. REG-D001 tidak menampilkan atau membuka draft REG-D002.
3. ID pekerjaan sama dengan encounter berbeda tidak dianggap catatan yang sama.
4. Catatan Reviewed (Demo) hanya memunculkan status dokumentasi, bukan selesai pelayanan.
5. Modul tanpa konteks pasien hanya mencocokkan `work_item_id`, bukan identitas pasien secara salah.
6. Bed Manager tetap menggunakan objek bed, tidak membuat hubungan pasien dan tidak membuka OPS-10 tanpa izin.
7. Responsif dan seluruh tes existing wajib lulus sebelum merge.

## Batasan
Semua data sintetis, disimpan di `localStorage`; perubahan tidak memicu HTTP API, posting klinis, mutasi stok, pembayaran, dispensing atau tanda tangan. Referensi 44 role dan 68 modul masih memerlukan validasi per-form/role. V9 adalah UX incremental, bukan bukti kelulusan seluruh AC PRD.
