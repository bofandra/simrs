# SIMRS Baru — UI/UX V31–V33 Finance & Enterprise (F3)

Tanggal: 11 November 2026  
Baseline normatif: \`PRD_SIMRS_Baru_Final_User_Stories_Acceptance_Technical_7PIC_2026-11-06\`. PRD v1.1 Bab 13 adalah penajaman, bukan penggantian baseline.

## Implementasi di mockup

| Layar / domain | Akun demo yang dilayani | Modul / FR / WF dari masterplan | Panduan yang terlihat |
| --- | --- | --- | --- |
| S09 Finance | Kasir, Petugas Billing, Casemix | FIN-01/02/03/04/07; FR-025/026/027; WF-08; PIC6 | Charge harus punya sumber unik, invoice terpisah dari pembayaran; jangan melebihi outstanding; grouping/klaim belum submission/penerimaan |
| S10 Management | Manajemen RS, Tim Mutu, Integrasi | ENT-08/09/10/11; FR-030/031/032; WF-12; PIC7 | Definisi indikator, pembilang/penyebut, periode, freshness, status ACK vs status antrean internal |
| S11 Admin | Admin Sistem, HR Admin | CORE-01/02/03/04; FR-001/002; WF-01; PIC1 | Scoped assignment, organisasi/unit, approval terpisah, audit; tidak ada privilege escalation |
| S13 MCU | Petugas MCU, Koordinator MCU | MED-10; FR-019; jalur MCU dalam PRD; PIC4 | Paket, peserta, hasil tertunda dan release hanya setelah review dan kebijakan disclosure |

**User stories / acceptance:** UX-011 (Finance), UX-012 (Management & integrasi), UX-013 (Admin & MCU), serta user story dan AC fungsional yang dirujuk pada bab modul dan workflow di PRD baseline. Implementasi ini membatasi diri pada **presentasi informasi dan navigasi**; bukan implementasi seluruh acceptance operasional.

### V31 — Hierarki pekerjaan

- Di **beranda** sepuluh akun di atas, worklist role-authorized tetap menjadi jalur utama; menu-area yang ada diposisikan setelah worklist.
- Hero menjelaskan tujuan profesi, pekerjaan terpilih dari data sintetis saat ini, dan dua kontrol nyata: fokus ke pencarian pekerjaan serta buka panduan alur.
- Kartu pekerjaan terpilih menampilkan ID, judul dan status **yang sudah diberikan oleh worklist**, bukan rekonstruksi invoice, angka indikator atau hasil MCU.
- Konteks pasien hanya muncul jika \`selectionContext\` menyatakan relasi pasien/encounter. Manajemen, Integrasi dan Admin tidak meminjam identitas pasien dari fixture generik.

### V32 — Visual, responsif, aksesibilitas

- Warna semantik berbeda antara Finance, Management, Admin, MCU, tanpa mengubah token dasar aplikasi.
- Kontras tombol, \`:focus-visible\`, ukuran kontrol setidaknya 44 px, area tabel horizontal-scroll di ponsel, layout 390 px, reduced motion.
- Satu panel baca-saja berisi **tiga hal yang harus diperiksa** sesuai profesi; bukan checkbox yang menyiratkan approval.
- Tampilan reviewer tetap memakai area QA, bukan dashboard staf.

### V33 — Regresi

- \`tests/enterprise-workspaces-v31.test.mjs\`: kontrak assets, sepuluh role, keamanan.
- \`tests/enterprise-workspaces-v31.spec.mjs\`: browser login 10 akun, urutan panel, worklist focus, workflow guide, 390px, isolasi reviewer, dan tangkapan layar 4 persona.
- Konfigurasi Playwright mengumpulkan seluruh berkas \`*.spec.mjs\`, termasuk smoke terdahulu.
- Merge baru boleh dilakukan jika **form-contract** dan **browser-smoke** lulus pada pull request.

## Batas implementasi dan acceptance lanjutan

Mockup memakai data sintetis di browser. Tidak ada perubahan role authorization, grant, form schema, draft V16, backend, penyimpanan pasien riil, transaksi keuangan, jurnal, pengajuan klaim, perubahan penugasan, pengiriman SATUSEHAT/BPJS, atau penerbitan laporan MCU.

Belum ada perhitungan indikator dengan pembilang/penyebut riil, alokasi pembayaran yang benar-benar diproses, error server-side, integrasi ACK riil, dan uji pengguna RS. Hal-hal tersebut tetap **backlog** sampai kontrak bisnis, keamanan, SOP, data ownership, dan UAT disepakati. Penyelesaian tahap visual tidak berarti 13 mockup sudah pixel-perfect.

### Lanjutan sesudah F3

1. Audit visual per layar terhadap 13 PNG di \`design/references/simrs-uiux-mockups-2026-11/role-screens\` dan catat gap nyata.
2. Kembangkan desain state kosong, validasi, error, denied per tugas F3 tanpa transaksi riil.
3. Lanjut F4: portal pasien, OK/anestesi, gizi, CSSD, laundry, enterprise long-tail, dan usability pilot; tetap mengikuti modul dan hak role di PRD.
