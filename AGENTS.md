# Panduan kontribusi otomatis — Mockup SIMRS Baru

Dokumen ini berlaku untuk seluruh perubahan dalam repository `bofandra/simrs`. Repo ini adalah **mockup interaktif berbasis data sintetis**, bukan implementasi SIMRS produksi.

## Sumber spesifikasi berurutan

1. **Spesifikasi utama lengkap saat ini:** [PRD SIMRS Baru v1.1 — Ekstensi Form Klinis (10 November 2026)](docs/simrs-baru/PRD_SIMRS_Baru_v1.1_Ekstensi_Form_Klinis_2026-11-10.md). Bacalah bagian modul, FR, User Story, Acceptance Criteria, workflow, field, risiko, dan UAT yang relevan **sebelum** mengubah layar.
2. **Baseline yang tetap berlaku:** `PRD_SIMRS_Baru_Final_User_Stories_Acceptance_Technical_7PIC_2026-11-06`, tercakup **utuh pada Bab 1–12 PRD v1.1**. Bab 13 memperluas detail kebutuhan klinis tanpa otomatis menambah modul.
3. **Panduan mockup operasional:** [Panduan implementasi berdasarkan PRD](docs/simrs-baru/PANDUAN_PENGEMBANGAN_MOCKUP_BERDASARKAN_PRD.md), [pemetaan 68 modul](design/FORM_COVERAGE_68_MODULES_2026-11-08.md), [V16 form benchmark](design/CLINICAL_BENCHMARK_FORMS_V16_2026-11-10.md), dan desain role-first.
4. **Kode hidup:** `public/ui-preview/`; pengujian `tests/`. Jangan menghidupkan kembali halaman prototipe lama sebagai situs kedua.

Apabila ada konflik antara dokumen, jangan diam-diam mengganti kebutuhan. Pertahankan baseline sampai ada keputusan eksplisit; catat gap beserta modul/FR/US/AC dan PIC untuk refinement.

## Prinsip UX wajib

- Mulai dari **login akun demo → workspace profesi → daftar pekerjaan → pasien/encounter → aktivitas/form yang dibutuhkan**. Navigasi utama berdasarkan tugas dan izin role, bukan inventaris semua form.
- **Satu aktivitas inti dan satu kelompok input yang terlihat** setiap saat. Form panjang menggunakan tahapan, tab, modal atau drawer. Histori adalah read-only dan tidak mengulangi input.
- Gunakan identitas dan konteks pasien/encounter yang jelas dan konsisten; larang form silang pasien, episode dan pekerjaan. Peran tidak dipilih bebas sebagai eskalasi izin.
- Seluruh `68 modul`, `7 PIC`, `12 workflow`, `FR-001..FR-066` perlu ditelusuri di PRD; jangan otomatis membuat 217 menu terpisah hanya karena terdapat 217 form dalam inventaris.
- Ekstensi Bab 13 memuat `CF-01..CF-13` sebagai subform klinis dan `CF-14` sebagai **riwayat longitudinal read-only**. PRMRJ dan partograf **tetap terkunci** sampai instrumen, profesi, SOP, terminologi, dan pemetaan final disepakati.
- Form demo harus menampilkan kondisi kosong, terisi, validasi, error, draft, read-only, denied serta konfirmasi yang relevan; utamakan bahasa dan alur kerja staf RS yang natural.

## Keselamatan dan pengujian

- Semua dataset **sintetis**. `localStorage` hanya untuk demonstrasi, bukan penyimpanan PHI. Tidak ada autentikasi keamanan, layanan backend, server FHIR atau transaksi RS sungguhan dalam mockup.
- Jangan mengaktifkan clinical signing, tindakan restrain, pemberian obat, dispensing, mutasi stok, transfer bed, billing, pembayaran, klaim, submit RL, atau kirim FHIR/BPJS tanpa backend yang terotorisasi, SOP dan UAT.
- Resource FHIR pada Bab 13 adalah **kandidat**, bukan konfirmasi profil SATUSEHAT nasional.
- Setiap perubahan perlu rujukan **modul / FR / US / AC / WF** pada deskripsi PR; tunjukkan keadaan positif/negatif, scope role, context pasien, serta tidak ada pengiriman ke API produksi.
- Jalankan unit/contract tests yang relevan dan smoke Playwright sebelum merge. Deploy GitHub Pages hanya setelah CI sukses.

**Penting:** PRD adalah spesifikasi target; keberadaan form dan diagram bukan bukti API, database, atau alur klinis sudah diimplementasikan.
