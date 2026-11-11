# SIMRS Baru — UI/UX V37–V39: Role Coverage 44/44 dan State Operasional

Tanggal: **11 November 2026**. F4 gelombang kedua, sesudah V34–V36. **Acuan normatif tetap** \`PRD_SIMRS_Baru_Final_User_Stories_Acceptance_Technical_7PIC_2026-11-06\` (Bab 1–12 dalam PRD v1.1). Form ekstensi Bab 13 tidak otomatis mendapat privilege/izin baru.

## Pencapaian

- Sebanyak **16 role** yang sebelumnya baru memiliki worklist dasar mendapat tampilan fokus aktivitas dan panduan khusus profesi, tanpa menggandakan route atau mengaktifkan modul P2/P3.
- Bersama cakupan sebelumnya (F1: 4, F2: 5, F3: 10, F4 gelombang 1: 9), seluruh **44 akun demo** kini memiliki task-first presentation layer. Ini adalah **cakupan UI landing role**, bukan bukti seluruh 68 modul sudah memiliki form high-fidelity atau implementasi produksi.
- UI menampilkan status sintetis yang dihitung dari worklist existing: perlu ditinjau, menunggu, dalam proses. Setiap layar menampilkan objek terpilih dan alasan, scope, modul/FR/WF, serta checklist yang berasal dari V5/V11.
- Batas proses: **draft saja** jika form memang diizinkan; **denied** jika katalog role tidak mengizinkan form; **missing-context** jika pekerjaan berkonteks pasien tidak bisa ditautkan ke encounter; **empty** bila filter/pencarian menghilangkan semua item. Tombol reset memperbaiki empty state tanpa mengubah data.

## Traceability ke PRD final

Kolom US merupakan *identitas user story* yang sudah ada di Bab 3, bukan requirement baru. AC merujuk AC1–AC3 dan negative/safety constraints pada US yang sama. Pemetaan modul–FR–WF mengikuti \`design/ROLE_SCREEN_FR_WORKFLOW_MATRIX_V4_2026-11-08.md\` dan \`public/ui-preview/role-workspace-v4.js\`; label **lintas domain** dipertahankan sebagai gap FR spesifik.

| Role | PIC domain | Modul existing | User story existing | FR / WF existing |
|---|---|---|---|---|
| DPJP Rawat Inap | PIC3 | RME-03, RME-04, RME-06 dst. sesuai profile | US-RME-03/04/06 | Sesuai profile V4; WF-04 |
| Petugas Bank Darah | PIC4 | MED-12 | US-MED-12 | FR-019 / WF-05 |
| Gudang | PIC5 | OPS-01 | US-OPS-01 | FR-022/036 / WF-07 |
| Pengadaan | PIC5 | OPS-02 | US-OPS-02 | FR-022/045 / WF-07 |
| Petugas Aset | PIC7 | OPS-06 | US-OPS-06 | FR-044 / WF-10 (pekerjaan pendukung) |
| Teknisi | PIC7 | OPS-07 | US-OPS-07 | FR-044 / WF-10 (pekerjaan pendukung) |
| Petugas Fasilitas | PIC7 | OPS-08 | US-OPS-08 | FR lintas domain / WF-04 (pekerjaan pendukung) |
| Koordinator Transport | PIC7 | OPS-09 | US-OPS-09 | FR lintas domain / WF-03 (pekerjaan pendukung) |
| Petugas BPJS | PIC6 | FIN-05, FIN-04 | US-FIN-05/04 | FR-027 / WF-08 |
| Coder | PIC6 | FIN-06 | US-FIN-06 | FR-027 / WF-08 |
| Akuntan | PIC6 | FIN-08/09 | US-FIN-08/09 | FR-028 / WF-08 |
| Budget Owner | PIC6 | FIN-10 | US-FIN-10 | FR-028 / WF-08 |
| Analis Biaya | PIC6 | FIN-11 | US-FIN-11 | FR-033/044 / WF-08 |
| Payroll Admin | PIC7 | ENT-02 | US-ENT-02 | FR-029 / WF-01 (pekerjaan pendukung) |
| Rekruter | PIC7 | ENT-03 | US-ENT-03 | FR-029/046 / WF-01 (pekerjaan pendukung) |
| Tim PPI | PIC7 | ENT-05/08 | US-ENT-05/08 | FR-030 / WF-12 (pekerjaan pendukung) |

## Pemisahan konteks pasien dan objek

Semua tautan diambil dari \`SIMRSRoleUXV5.selectionContext\` dan pekerjaan yang telah dipilih:

- **Patient-scoped** (tidak boleh membuka form jika pasien/encounter tidak tersedia): DPJP, Bank Darah, BPJS dan Coder.
- **Object-scoped** (tidak boleh menampilkan identitas pasien): Gudang, Pengadaan, Aset, Teknisi, Fasilitas, Akuntan, Budget Owner, Analis Biaya, Payroll Admin, Rekruter.
- **Mixed by section**: Koordinator Transport (\`m0/m2\` = pasien, \`m1\` = armada/objek); Tim PPI (\`m0\` = konteks surveilans pasien, \`m1/m2\` = audit/indikator objek). UI membaca \`job.kind\` aktual, bukan mengaitkan pasien berdasarkan label role.

UI ini bukan RBAC backend; izin tetap berasal dari katalog form mockup yang sudah ada. **Tidak ada izin tambahan** atau API eksternal. Tidak ada mutasi stok, distribusi produk, dispensing, approval, release, pembayaran, jurnal posting, payroll riil, rekam medis resmi, klaim atau submit BPJS/SATUSEHAT.

## State dan perbaikan UX

| Kondisi | Yang dilihat pengguna | Aman karena |
|---|---|---|
| Worklist terisi | 3 status, pekerjaan terpilih, detail, checklist, form berizin | Seluruh angka dan tindakan adalah sintetis |
| Pencarian/filter kosong | Pesan spesifik, tombol \`Hapus pencarian dan filter\` | Mengubah tampilan saja, tidak membuat data baru |
| Form belum tersedia untuk role | Status \`Akses form belum tersedia\` | Tidak menambahkan CTA atau privilege |
| Patient context tidak ada | Peringatan, CTA modul dinonaktifkan | Tidak mengizinkan form tanpa pasien/encounter |
| Form berizin | Penjelasan hanya draft demo | Tidak menyiratkan release/approval nyata |
| View mobile | Layout card satu kolom, tabel bergulir, target sentuh minimal 44px | Menu kerja tetap bisa difokuskan tanpa hak baru |

## Pengujian

- \`tests/longtail-workspaces-v37.test.mjs\`: 16 role tambahan, total 44 unik, relasi profile–FR–WF, negatif patient-vs-object, denied/context gate, responsive/style dan larangan network.
- \`tests/longtail-workspaces-v37.spec.mjs\`: login 16 akun, ringkasan dan action, izin form, context mixed PPI/transport, empty/reset state, mobile 390px, reviewer isolation dan screenshot.
- Tetap jalankan tes yang sudah ada untuk 44 akun, form P0–P3 dan clinical draft. Merge **hanya** saat \`form-contract\` dan \`browser-smoke\` lulus. Verifikasi deploy GitHub Pages pada \`main\`.

## Gap lanjutan (F4 usability dan readiness)

1. Audit visual berdampingan terhadap seluruh 13 screenshot; belum ada pixel parity yang disepakati pengguna/PIC.
2. State loading/error dari backend, concurrency, izin lintas tenant, refresh token dan audit log harus ditentukan pada kontrak FE–BE; tidak boleh disimpulkan dari mockup offline.
3. Tidak semua 68 modul memiliki form berizin dan spesifikasi field fidelity; state \`denied\` tidak boleh diam-diam diganti tombol aktif.
4. UAT dan safety review bersama profesi klinis, logistik, keuangan serta PIC keamanan perlu dilakukan sebelum adopsi dalam sistem riil.
5. FR khusus pada peran pendukung yang masih tertulis *lintas domain* membutuhkan persetujuan PIC/koordinator, bukan penetapan sepihak di mockup.
