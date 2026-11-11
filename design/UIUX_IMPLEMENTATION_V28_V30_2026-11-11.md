# SIMRS Baru — Implementasi UI/UX V28–V30 (Penunjang dan Bed Board)

Tanggal: 11 November 2026. Baseline normatif: PRD_SIMRS_Baru_Final_User_Stories_Acceptance_Technical_7PIC_2026-11-06. Ini hanya mockup statis dengan data sintetis.

## Cakupan yang benar-benar diimplementasikan

| Screen | Akun demo | Perubahan UI | Batas keselamatan |
|---|---|---|---|
| S06 Bed Board | akun.bed-manager | Header permintaan/bed, panduan, konteks objek, status pekerjaan, worklist pertama, tombol navigasi fokus | Tidak mengaitkan pasien otomatis, tidak menahan/assign/transfer bed |
| S07 LIS | akun.atlm | Ringkasan spesimen/order, checklist dan worklist, panduan label/order/QC | Tidak memverifikasi hasil, menerbitkan hasil atau memicu eskalasi nyata |
| S08 Farmasi | akun.farmasis | Resep/objek kerja terpilih, tugas prioritas, panduan alergi-dosis-lot | Tidak dispensing, posting atau mengubah stok |
| S12 Radiologi | akun.radiografer dan akun.radiolog | Worklist studi terpilih, panduan pemeriksaan/interpretasi sesuai role | Tidak mengakuisisi DICOM, membuat viewer diagnostik atau release laporan |

Urutan UI untuk Bed Manager, ATLM dan Farmasis: judul profesi + pekerjaan terpilih → panduan ringkas/read-only → banner konteks dari worklist → metrik lokal → daftar kerja dan detail (aksi existing saja) → area pekerjaan lainnya. Pada Radiografer/Radiolog, daftar kerja dan tombol buka form harus tetap lebih dahulu daripada panduan detail untuk menjaga aksi utama terlihat di viewport desktop (regresi V14). Panduan bukan indikator proses selesai.

UI menggunakan DOM dan konteks yang sudah dihasilkan oleh V5/V12/V18/V24. Hanya beranda role aktif yang mendapat dekorasi. Akun reviewer, empat core care workspace V25, hak role, alur form, draft, dan konteks encounter tidak diubah. Konteks bed tetap objek nonpasien.

## Uji

- Contract Node: tests/support-workspaces-v28.test.mjs
- Browser Chromium: tes baru V28 di tests/mockup-smoke.spec.mjs untuk 5 akun, pemilihan baris, focus pencarian/panduan, reviewer isolation, dan ukuran mobile.
- Screenshots: test-results/snapshots/v28-*.png yang tersimpan dalam artifact CI (bukan aset visual resmi).
- GitHub Pages hanya boleh diterbitkan sesudah CI pada pull request lulus dan merge diterima.

## Tetap perlu dikerjakan

Visual parity pixel-by-pixel terhadap 13 gambar belum dibuktikan; F2 clinical handoff order→result→ack juga belum nyata. Berikutnya S09–S11 dan S13, audit empty/error/forbidden states, accessibility WCAG dengan alat bantu, user research dan UAT tenaga RS. Tidak boleh menganggap lulus tes mockup berarti SOP, UAT klinis atau kesiapan produksi terpenuhi.
