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

## Koreksi konteks, versi dan validasi V16 (10 November 2026)

Rujukan perubahan: PRD v1.1 Bab 13.1, 13.4 dan 13.8; PIC 3; `RME-02 / FR-010 / WF-03`, `RME-07 / FR-012 / WF-04`, `RME-05 / FR-034 / WF-02 dan WF-04`. Acceptance criteria utama: `USX-CLN-01 AC1–AC3`, `USX-CLN-02 AC3`, `USX-CLN-06 AC1`; `UAT-CF-01/02/06/07/08`. Pengujian otomatis mendukung review PIC, bukan bukti UAT bersama staf RS telah dilakukan.

- **Konteks tunggal:** subform mengambil salinan konteks aktif dari `SIMRSFormEngine.getWorkItemContext()`, sama dengan banner form utama. Role, kode modul dan ID pekerjaan harus cocok. Tanpa konteks pasien/encounter pekerjaan yang sah, panel tidak ditampilkan. Encounter bawaan pada master pasien tidak dipakai sebagai fallback.
- **Versi tersimpan:** setiap perubahan yang berhasil disimpan menambah snapshot berisi nilai, nomor versi, waktu dan author. Asesmen awal tetap bisa dibaca setelah asesmen ulang. Simpan ulang tanpa perubahan tidak menggandakan versi. Browser yang mendukung Web Locks mengantrekan penyimpanan dari beberapa tab. Berpindah langkah/subform, meninjau kelengkapan atau membuka histori tidak menambah versi dan tidak mengubah snapshot tersimpan.
- **Riwayat baca-saja:** daftar menampilkan jenis asesmen, versi, encounter, waktu, sumber dan profesi. Tombol `Lihat versi` membuka isi snapshot tanpa kontrol edit. Riwayat tetap dibatasi pada pasien sintetis terpilih.
- **Kompatibilitas data lama:** catatan tanpa daftar revisi dipertahankan sebagai versi lama; penyimpanan revisi baru mempertahankan snapshot aslinya. Encounter catatan lama tidak dipindahkan otomatis karena keterkaitannya belum dapat dibuktikan. Riwayat menandai sumber lama sebagai konteks belum diverifikasi. Versi yang sudah tertimpa sebelum perbaikan tidak bisa direkonstruksi dari penyimpanan lama.
- **Validasi:** draft boleh belum lengkap, tetapi nilai angka/tanggal/pilihan yang tidak valid ditolak. Review juga mewajibkan seluruh field wajib. Error ditampilkan per field dengan `aria-invalid`, dan bagian pertama yang bermasalah dibuka otomatis. Urutan waktu mulai/akhir restrain, masuk/keluar ICU dan rencana obat diperiksa.
- **Kegagalan penyimpanan:** browser yang menolak penyimpanan menampilkan pesan gagal, mempertahankan isian kerja untuk dicoba ulang, dan tidak menambahkan versi atau menampilkan keberhasilan palsu.

Batas input demo: nadi 20–250, RR 1–100, suhu 25–45 dengan langkah 0,1 mengikuti katalog `RME-02/RME-05`; skala nyeri 0–10, GCS 3–15, SpO₂ 0–100, jumlah obat bilangan bulat minimal 1, dan jumlah BMHP lebih dari 0. Ini pemeriksaan format/rentang input, **bukan rentang normal, skor klinis, alarm atau keputusan terapi**, dan tetap memerlukan validasi domain/SOP untuk produk.

Tes regresi mencakup kesamaan encounter RJ/IGD/RI, isolasi pasien/pekerjaan, snapshot asesmen awal/ulang setelah reload, isi versi baca-saja, migrasi data lama tanpa pemindahan encounter, angka di luar batas, error pada langkah tersembunyi di mobile, kegagalan penyimpanan, serta gate PRMRJ **dan** partograf. Semua aktivitas tetap lokal dan sintetis; tidak ada pengiriman API produksi atau pengaktifan tindakan klinis/finansial.

Smoke test Chromium mencakup penyimpanan bersamaan dari dua tab serta visibilitas form utama saat panel subform dibuka dan ditutup. Tes menyimpan tangkapan layar versi historis di desktop dan error angka pada viewport 390 px.
