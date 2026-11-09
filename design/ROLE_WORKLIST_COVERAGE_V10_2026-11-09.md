# SIMRS Baru V10 — Worklist 12 Role Tambahan

Tanggal: 9 November 2026
Acuan: `PRD_SIMRS_Baru_Final_User_Stories_Acceptance_Technical_7PIC_2026-11-06`.

## Lingkup
Worklist detail V5 awalnya tersedia untuk 7 role. V10 menambah 12 role: DPJP Rawat Inap (7 area), ATLM (4), Petugas MCU (3), Radiografer (3), Radiolog (3), Casemix (3), Koordinator OK (3), Dokter Anestesi (3), Tim Mutu (4), Admin Sistem (8), Integrasi (3), Gudang (4). Total 19 dari 44 role memiliki antrean, panel detail, checklist spesifik, pencarian, dan traceability modul/FR/WF.

## Aturan interaksi
- Worklist menampilkan empat contoh tugas sintetis per area beserta sebab pekerjaan dan pemeriksaan yang perlu dilakukan.
- Kewenangan form mengikuti gabungan katalog P0, P1 dan P2/P3. UI menolak modul yang tidak diizinkan; pengecekan tambahan mencegah konteks objek nonpasien dipakai untuk form pasien.
- DPJP Rawat Inap memakai contoh encounter `ENC-RI-DEMO-xx`, bukan encounter RJ.
- ATLM memakai contoh konteks pasien dan spesimen untuk modul MED-01.
- DPJP, ATLM, Radiolog, Radiografer, MCU, Casemix, OK, dan Anestesi menggunakan konteks pasien sintetis untuk form berkonteks pasien. Tim Mutu menggunakan konteks pasien hanya pada modul insiden ENT-06. Gudang, Integrasi, dan Admin Sistem bersifat objek nonpasien kecuali CORE-12 pada Admin Sistem.
- Konteks objek tidak pernah otomatis ditautkan ke pasien/encounter dan tidak dapat dipakai untuk modul berkonteks pasien.
- ATLM dan MCU diarahkan ke role-native beranda setelah login, bukan shell laboratorium generik.

## Validasi
Unit tests memuat katalog P0+P1+P2/P3 lalu memeriksa seluruh area, izin efektif, keamanan konteks objek/pasien, episode RI, serta consent Admin. Browser smoke mencakup ATLM, Radiolog, Admin Sistem, dan MCU.

## Batasan dan backlog
Belum ada backend RBAC, API/DB produksi, transaksi klinis, release hasil, PACS/DICOM, klaim atau mutasi stok. Perlu rekonsiliasi setiap izin role–modul terhadap PRD final dan UAT petugas sebelum mengaktifkan aksi nyata. Sisa 25 role masih memakai workspace V4 generik. Seluruh data selalu sintetis.
