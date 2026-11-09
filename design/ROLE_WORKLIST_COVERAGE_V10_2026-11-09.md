# SIMRS Baru V10 — Worklist 12 Role Tambahan

Tanggal: 9 November 2026
Acuan: `PRD_SIMRS_Baru_Final_User_Stories_Acceptance_Technical_7PIC_2026-11-06`.

## Lingkup
Worklist detail V5 awalnya tersedia untuk 7 role. V10 menambah 12 role: DPJP Rawat Inap (7 area), ATLM (4), Petugas MCU (3), Radiografer (3), Radiolog (3), Casemix (3), Koordinator OK (3), Dokter Anestesi (3), Tim Mutu (4), Admin Sistem (8), Integrasi (3), Gudang (4). Total 19 dari 44 role memiliki antrean, panel detail, checklist spesifik, pencarian, dan traceability modul/FR/WF.

## Aturan interaksi
- Worklist menampilkan empat contoh tugas sintetis per area beserta sebab pekerjaan dan pemeriksaan yang perlu dilakukan.
- Form tetap dibatasi sesuai izin role dalam katalog. Jika belum dipetakan, UI menampilkan keterangan "Belum diotorisasi bagi role ini" dan tidak membuka form.
- DPJP Rawat Inap memakai contoh encounter `ENC-RI-DEMO-xx`, bukan encounter RJ.
- ATLM memakai contoh konteks pasien dan spesimen untuk modul MED-01.
- Radiolog, Radiografer, MCU, Casemix, OK, Anestesi, Tim Mutu, Gudang, Integrasi, dan Admin Sistem memiliki pekerjaan berjenis objek nonpasien, kecuali CORE-12 pada Admin Sistem yang memang terkait consent pasien.
- Konteks objek tidak pernah otomatis ditautkan ke pasien/encounter dan tidak dapat dipakai untuk modul berkonteks pasien.
- ATLM dan MCU diarahkan ke role-native beranda setelah login, bukan shell laboratorium generik.

## Validasi
Unit tests meliputi kesesuaian jumlah fitur, role-permission denial, tenant-neutral task object, episode RI, serta konteks consent Admin. Browser smoke untuk ATLM, Radiolog, dan Admin Sistem melengkapi regresi 7 role sebelumnya.

## Batasan dan backlog
Belum ada backend RBAC, API/DB produksi, transaksi klinis, release hasil, PACS/DICOM, klaim atau mutasi stok. Perlu rekonsiliasi izin terhadap PRD final sebelum membuka form yang kini terkunci. Sisa 25 role masih memakai workspace V4 generik. Seluruh data selalu sintetis.
