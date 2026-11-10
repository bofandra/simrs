# SIMRS Baru — V16 Form Klinis Kontekstual (10 November 2026)

Acuan baseline: `PRD_SIMRS_Baru_Final_User_Stories_Acceptance_Technical_7PIC_2026-11-06`. Versi turunan: [PRD SIMRS Baru v1.1, ekstensi form klinis](https://docs.google.com/document/d/18U00Viq_K4BtUaVgrmD13SRngF_m5wwM/edit). Sumber penajaman: `Matriks_Field_Form_SIMRS_SATUSEHAT_FHIR_R4.xlsx.PDF` halaman 1–5 (diunggah pengguna).

## Keputusan

- Tetap **68 modul**, **7 PIC**, dan alur **role → daftar pekerjaan → pasien/encounter → form kontekstual**.
- Form klinis tambahan tidak menjadi menu utama baru. Di halaman form modul, satu panel `Form klinis khusus dan histori pasien` berisi pilihan subform. **Hanya satu subform dan satu kelompok isian yang tampak aktif**.
- Buka panel melalui form pekerjaan yang sah; tidak ditampilkan untuk akun reviewer katalog atau tanpa pekerjaan/pasien/encounter sintetis yang terkait.
- `CF-06` PRMRJ dan `CF-13` partograf adalah preview read-only/nonaktif sampai instrumen, profesi, SOP, dan terminologi divalidasi.
- Simpan draft lokal adalah simulasi, tidak ada tanda tangan, order, release, pemberian obat, restrain aktual, transfer bed, dispensing, mutasi stok, billing, klaim, atau komunikasi SATUSEHAT.
- Kandidat resource FHIR dari matriks **belum** berarti profil nasional yang telah divalidasi. Adapter FHIR dan outbox tetap terpisah dari data operasional.

## Matriks subform V16

| ID | Nama | Modul induk | Peran pada mockup | Candidate FHIR |
|---|---|---|---|---|
| CF-01 | Triase ABCDE | RME-02 | Dokter IGD | Encounter / Observation / QuestionnaireResponse |
| CF-02 | Keperawatan cepat/awal/lanjutan/ulang | RME-07 | Perawat | Observation / QuestionnaireResponse / Condition |
| CF-03 | NCP / implementasi keperawatan | RME-07 | Perawat | CarePlan / Goal / Procedure |
| CF-04 | Alergi dan risiko terstruktur | RME-05, RME-06 | Perawat / Dokter RJ / DPJP RI | AllergyIntolerance / Condition / RiskAssessment |
| CF-05 | Restrain / penghentian | RME-02, RME-03 | Dokter IGD / DPJP RI | Procedure / Observation / Consent |
| CF-06 | PRMRJ (TBD) | RME-05 | Perawat / Dokter RJ | QuestionnaireResponse / RiskAssessment |
| CF-07 | Keluar-masuk ICU | RME-03 | DPJP RI / Dokter IGD | Encounter / Observation |
| CF-08 | Edukasi dan pemberian informasi | RME-01, RME-07 | Dokter RJ / Perawat | Procedure / QuestionnaireResponse / Consent |
| CF-09 | Penunjang luar | RME-10 | Dokter RJ / DPJP RI | ServiceRequest / DiagnosticReport / DocumentReference |
| CF-10 | Rencana pemberian obat | MED-04, RME-03 | Dokter RJ/IGD / DPJP RI | MedicationRequest / MedicationStatement |
| CF-11 | Care plan terintegrasi | RME-09 | Dokter RJ / DPJP RI | CarePlan / Goal / ServiceRequest |
| CF-12 | Pemakaian BMHP per tindakan | RME-06 | Dokter RJ / DPJP RI | Procedure / SupplyRequest (kandidat) |
| CF-13 | Partograf (TBD) | RME-03 | DPJP RI preview; role Bidan/Sp.OG perlu ditetapkan | Observation / QuestionnaireResponse / Procedure |

## Riwayat longitudinal

Panel `Riwayat klinis (read-only)` menggabungkan draft modul yang sudah ada dan draft CF pada **pasien sintetis terpilih**, diurutkan waktu dan dikelompokkan menjadi Klinis, Keperawatan, Obat/BMHP, Penunjang dan Prosedur. Riwayat **tidak** menciptakan form input atau duplikasi catatan baru. Produk nyata memerlukan server-side per-tenant authorization, care-relationship, signed provenance dan audit akses.

## Uji penerimaan

1. Form IGD menampilkan CF-01; pilih subform dan satu kelompok isian aktif, navigasi langkah tidak menghilangkan nilai.
2. Form Perawat `RME-07` memuat CF-02/03; bentuk asesmen dapat dipilih dan disimpan sebagai draft sintetis.
3. CF-06 dan CF-13 tidak menyediakan tombol simpan atau menghitung skor/partograf sebelum SOP dan instrumen disahkan.
4. Dokter tidak mendapat form dari peran lain karena menu dan form mengikuti role aktif dan kode modul.
5. Kunci draft memuat `role, patient_id, encounter_id, work_item_id, module_code, form_id`. Riwayat tidak menampilkan data pasien sintetis lain.
6. Tes Playwright, kontrak modul 68, dan smoke responsif lulus; tidak ada pemanggilan API transaksi dari panel benchmark.

## Batasan sebelum produksi

Prototipe menggunakan `localStorage` untuk **data dummy saja**, bukan penyimpanan klinis. Seluruh field tambahan dan hubungan database pada PRD v1.1 adalah rancangan untuk refinement PIC. Terutama definisi PRMRJ, tata cara restrain, hak akses Bidan/Sp.OG, form maternal, istilah klinis, grafik/alert partograf, konsistensi MAR, serta integrasi FHIR membutuhkan persetujuan SOP dan verifikasi profil SATUSEHAT sebelum pengembangan produk.
