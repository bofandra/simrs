# Panduan Pengembangan Mockup SIMRS Baru Berdasarkan PRD v1.1

**Sumber resmi kerja:** [PRD SIMRS Baru v1.1 lengkap](PRD_SIMRS_Baru_v1.1_Ekstensi_Form_Klinis_2026-11-10.md) (Bab 1–13, 10 November 2026), berbasis PRD final 6 November 2026. Gunakan [diagram arsitektur](assets/diagram-arsitektur-simrs-baru-v1.1.png) untuk konteks end-to-end, bukan sebagai layout layar tunggal.

## 1. Tujuan dan batas mockup

Mockup harus memperlihatkan **apa yang sesungguhnya dilihat setiap profesi saat bekerja**, bukan menampilkan seluruh katalog formulir pada satu layar. Setiap layar mempunyai tujuan, langkah berikutnya, status, dan respons error yang jelas. Konten berasal dari PRD, tidak mengarang kebijakan medis atau keputusan klinis otomatis.

**Alur utama:** `login role demo → dashboard profesi → worklist → detail pasien/encounter → form aktivitas → draft/review → kembali ke worklist`. Katalog 68 modul tetap dapat dibuka oleh reviewer/QA; staf operasional melihat hanya tugasnya.

**Sumber data:** seluruhnya sintetis. Jangan gunakan data pasien asli. Browser bukan penyimpanan medis dan semua aksi kritis tetap simulasi.

## 2. Hirarki traceability

Setiap desain screen harus memuat (di dokumen desain, story, atau PR):
- **PIC dan modul:** dari Bab 2–3 PRD, misalnya PIC 3 / `RME-02` untuk IGD.
- **FR dan US/UST:** dari Bab 3–5. Cantumkan `US-...`, `UST-FR-...` dan acceptance criteria yang tepat.
- **Workflow:** dari Bab 6, pertahankan 12 WF induk dan state contract.
- **Entitas dan sumber kebenaran:** dari Bab 8–9, jangan mengubah model Patient → Registration → Encounter → Unit Visit tanpa keputusan lintas PIC.
- **API/events:** dari Bab 10, hanya **kontrak rancangan**, bukan klaim API telah tersedia.
- **NFR, gate, UAT:** dari Bab 11–12, utamanya privasi, role, audit, concurrency, error, idempotensi.
- **Subform klinis:** Bab 13 untuk `CF-01..CF-14`, tanpa mengubah jumlah 68 modul.

## 3. Prinsip layar dan komponen

| Tipe layar | Yang harus muncul | Yang tidak boleh dilakukan |
|---|---|---|
| Login | Kredensial demo dan status sesi | Role/profesi dipilih bebas untuk eskalasi hak akses |
| Workspace profesi | Pekerjaan prioritas, ringkasan, alert sesuai role, jalur ke worklist | Seluruh modul rumah sakit dibuka sekaligus |
| Worklist | Pasien/kunjungan terkait, tugas, SLA, status, filter, pemilihan pasien | Aksi klinis tanpa encounter |
| Detail pasien | Banner pasien, identitas kunjungan, alergi/risiko, progress, tabs konteks | Menginput ulang semua data identitas |
| Form aktivitas | Satu aktivitas, tab/wizard seperlunya, field wajib dan validasi | Puluhan formulir ditumpuk dalam satu scroll |
| Riwayat klinis | Timeline read-only, kategori, source, author, waktu, versi, encounter | Mengubah signed history langsung |
| Reviewer QA | Katalog luas, uji role, cakupan form, FR/AC/test IDs | Menggantikan alur kerja petugas operasional |

Gunakan tab untuk kelompok data dalam aktivitas yang sama; wizard untuk langkah bersyarat/berurutan; modal hanya untuk operasi sederhana atau konfirmasi; drawer untuk konteks samping yang tidak memutus pekerjaan.

## 4. Ekstensi klinis (Bab 13)

| CF | Cakupan | Modul induk | Status mockup V16 |
|---|---|---|---|
| CF-01 | Triase ABCDE, TTV, keputusan triase | RME-02 | Subform kontekstual |
| CF-02 | Asesmen keperawatan cepat/awal/lanjutan/ulang | RME-07 | Subform kontekstual |
| CF-03 | NCP, diagnosis, tujuan, intervensi, evaluasi | RME-07 | Subform kontekstual |
| CF-04 | Alergi dan pengkajian risiko | RME-05 / RME-06 | Subform kontekstual |
| CF-05 | Restrain: indikasi, alternatif, monitoring, stop | RME-02 / RME-03 | Dokumentasi demo, bukan tindakan |
| CF-06 | PRMRJ dan penilaian risikonya | RME-05 | **Gated**: instrumen/SOP belum final |
| CF-07 | Transfer dan keluar-masuk ICU | RME-03 | Dokumentasi demo |
| CF-08 | Edukasi / pemberian informasi / teach-back | RME-01 / RME-07 | Subform kontekstual |
| CF-09 | Hasil penunjang dari fasilitas luar | RME-10 | Subform kontekstual |
| CF-10 | Rencana pemberian obat dan jadwal | MED-04 / RME-03 | Subform kontekstual, tidak mengadministrasikan obat |
| CF-11 | Care plan dan instruksi antarprofesi | RME-09 | Subform kontekstual |
| CF-12 | Histori pemakaian BMHP terikat tindakan | RME-06 | Dokumentasi demo, tanpa stok/charge |
| CF-13 | Partograf persalinan | RME-03 / FR-047 | **Gated**: SOP, profesi, plotting dan clinical alerts belum final |
| CF-14 | Riwayat klinis longitudinal | Lintas RME | **Baca-saja**, bukan form input baru |

**Catatan:** pemetaan subform dan field final harus mengikuti Bab 13.3, sedangkan realisasi mockup saat ini hanya bukti alur UI, **bukan bukti implementasi seluruh acceptance criteria**. Rincian open decisions D-01–D-05 ada pada Bab 13.9.

## 5. Peta folder kode dan review

- **Situs aktif GitHub Pages:** `public/ui-preview/index.html` beserta JS dan CSS pada folder itu.
- **Pengaturan role/akun:** `role-demo-login.js`, `role-workspace-v4.js`, `role-worklist-detail-v5.js`.
- **Form utama per modul:** `p0-form-catalog.js`, `p1-form-definitions.js`, `p2-p3-form-definitions.js`, `p0-forms.js`.
- **Form bertahap:** `role-form-blueprints-v13.js`, `progressive-forms-v15.js`.
- **Subform klinis v16:** `benchmark-clinical-v16.js`, `benchmark-clinical-v16.css`.
- **Dokumen desain dan coverage:** `design/`; **tests:** `tests/`.

Untuk setiap PR mockup, sertakan tangkapan hasil layar (jika relevan), **role dan pekerjaan**, modul + US + AC, kondisi positif/negatif, validasi pasien/encounter, dan hasil tes. Jalankan contract tests serta browser responsive smoke sebelum merge.

## 6. Hal yang tidak boleh disimpulkan dari mockup

- Tidak ada server FHIR internal yang menjadi prasyarat: integrasi nasional menggunakan mapper/validator dan adapter dengan outbox/ACK sesuai Bab 7 dan 10.
- `localStorage` adalah simulasi dan bukan mekanisme audit, signing, atau otorisasi produksi.
- Nomor CF, kandidat FHIR, tabel tambahan, dan endpoint Bab 13 membutuhkan persetujuan PIC/SOP; tidak boleh dianggap DDL ataupun API produksi final.
- Jangan aktifkan posting stok, BCMA, dispensing, release klinis, transfer bed, pembayaran, klaim, pelaporan RL resmi, atau akses data nyata tanpa pengujian dan tata kelola yang dipersyaratkan PRD.

## 7. Pemeriksaan selesai pekerjaan (Definition of Done khusus mockup)

1. Layar terhubung ke workspace role yang relevan dan berfungsi tanpa menampilkan menu semua role.
2. Patient/encounter/work item konsisten; tidak ada kebocoran data dummy silang pasien/tenant.
3. Field, label, opsi, dan validation mengikuti Bab 3 dan Bab 13 bila terkait.
4. Satu aktivitas/kelompok data aktif; keyboard, responsif mobile, dan state kosong/error ditangani.
5. Tidak ada operasi klinis/keuangan/integrasi nyata melalui komponen demo.
6. Dokumentasi dan tes kontrak/browser diperbarui; GitHub Actions lulus.

**Rujukan lain:** [Kontrak workflow](WORKFLOW_CONTRACTS_V1.md), [kontrak state](DATA_STATE_CONTRACTS.md), [rancangan database/API](DATABASE_API_HANDOFF_V2.md).
