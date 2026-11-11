# SIMRS Baru — UI/UX V25–V27: Core Care Workspaces
**Tanggal:** 11 November 2026  
**Acuan normatif:** `PRD_SIMRS_Baru_Final_User_Stories_Acceptance_Technical_7PIC_2026-11-06`  
**Cakupan:** empat workspace prioritas S02–S05. **Tidak** mengubah izin akses, alur backend, maupun data pasien nyata.

## 1. Masalah yang ditangani
V22–V24 sudah menyatukan navigasi seluruh akun demo menjadi `login → beranda profesi → worklist → form → kembali`, tetapi pada beranda empat profesi utama, kartu akses ke subarea tampil **sebelum** pekerjaan yang harus dilakukan, dan panduan alur berada setelah daftar. Ini membebani perhatian dan membuat tugas prioritas terlambat terlihat. Desain juga kurang membedakan konteks pendaftaran, dokter, perawat, dan IGD.

## 2. Implementasi V25–V27

| Versi | Hasil nyata di Pages | Batasan |
|---|---|---|
| **V25 — Hierarki tugas** | Render empat role utama sebagai *task-first workspace*: judul dan pekerjaan terpilih, panel panduan existing V18 di atas daftar, konteks pasien V12, ringkasan kerja, antrean, lalu kartu subarea. Tombol «Lihat antrean kerja» memfokuskan pencarian, «Tinjau langkah kerja» membuka urutan kerja. | Memindahkan node DOM yang sudah ada, bukan membuat fitur klinis baru. |
| **V26 — Kejelasan visual & konteks** | Warna semantik yang membedakan Front Office, Dokter RJ, Perawat, dan IGD; selected job jelas; ukuran dan spacing diperbaiki; label umur dan penjamin hanya jika `selectionContext` memang menyediakan data pasien sintetis. Peringatan khusus IGD bahwa triase contoh **bukan** keputusan kegawatan. Form mendapat focus ring yang jelas; mobile 390px. | Tidak mengubah pemilihan pasien/encounter, tidak menebak status klinis, tidak melakukan sign atau transaksi. |
| **V27 — Uji regresi & bukti visual** | Tes kontrak role-scoping dan *no unsafe action*; Playwright memverifikasi urutan layout, search focus, aria-live, 4 screen, viewport mobile, reviewer separation, dan menghasilkan screenshot desktop/mobile. | Screenshot otomatis membantu review; bukan bukti UAT manusia atau kesetaraan piksel dengan 13 mockup. |

## 3. Scope role
| Role demo | Screen | Fokus visual | Kewenangan/guardrail |
|---|---|---|---|
| `akun.pendaftaran` | S02 | Worklist identitas, registrasi dan antrean | Hindari pasien duplikat; check-in/Encounter asli tidak diaktifkan |
| `akun.dokter-rj` | S03 | Konsultasi, konteks pasien dan SOAP | Tinjau alergi, obat aktif dan episode; sign/ordering asli tidak diaktifkan |
| `akun.perawat` | S04 | Daftar shift, observasi dan handover | Catatan tetap draft demo, tidak otomatis disahkan |
| `akun.dokter-igd` | S05 | Triase, observasi, disposisi | Label triase hanyalah simulasi; tidak memicu alarm/keputusan klinis |

44 role demo dan 68 modul tetap dipertahankan. Selain empat role di atas, tampilan lama V17/V18/V24 tetap berfungsi. Akun `reviewer.demo` tetap memiliki layar khusus QA, tanpa perubahan.

## 4. Kriteria penerimaan

- Panel V18 dipindah ke atas worklist untuk empat role, tanpa duplikasi dan tanpa menggeser aksi form karena posisi aksi utama worklist tidak diubah.
- Panel worklist muncul **sebelum** pilihan area layanan tambahan.
- Nomor tugas, label status, data pasien/encounter, umur dan penjamin hanya berasal dari `jobRows`/`selectionContext` yang sama dengan fitur eksisting; output teks aman melalui `textContent`.
- Tombol quick jump hanya melakukan scroll/focus ke pencarian. Tombol panduan hanya membuka `details` yang sudah ada.
- Filter status, tampilan kartu/tabel, pilihan item, dan form role-specific tetap mengikuti perilaku V12–V24.
- Tidak ada outbound API, sign, release hasil, dispensing, mutasi stok, bed assignment, pembayaran, klaim, FHIR/BPJS atau perubahan authorization.

## 5. Bukti dan langkah review
Sumber: `public/ui-preview/core-care-workspaces-v25.js` dan `.css`. Uji Node: `tests/core-care-workspaces-v25.test.mjs`. Pengujian browser: `tests/mockup-smoke.spec.mjs`; screenshot artefak workflow mencakup `v25-registration-desktop.png`, `v25-doctor-workspace.png`, `v26-nursing-mobile.png` dan `v26-emergency-workspace.png`.

**Masih terbuka:** audit kesetaraan visual dengan 13 gambar referensi secara manual, evaluasi kontras WCAG 2.2 AA dengan alat otomatis/assistive technology, pengujian kegunaan bersama petugas rumah sakit, error/empty/loading states end-to-end dan pengujian RBAC backend yang sesungguhnya.
