# MASTERPLAN UI/UX SIMRS BARU
**Versi:** 1.0 — 11 November 2026  
**Status:** Target desain + rencana implementasi; bukan bukti fitur siap produksi  
**Repository:** [bofandra/simrs](https://github.com/bofandra/simrs)  
**Sumber desain:** [13 mockup PNG dan 12 eksplorasi visual](./references/simrs-uiux-mockups-2026-11/README.md) · [Galeri GitHub Pages](https://bofandra.github.io/simrs/design-gallery.html) · [Benchmark lokal/global/Dribbble](./UIUX_BENCHMARK_KOMPETITOR_2026-11-11.md)

> **Aturan sumber kebenaran:** baseline final yang disepakati pengguna ialah `PRD_SIMRS_Baru_Final_User_Stories_Acceptance_Technical_7PIC_2026-11-06`. Edisi [PRD v1.1 10 Nov](../docs/simrs-baru/PRD_SIMRS_Baru_v1.1_Ekstensi_Form_Klinis_2026-11-10.md) mengandung Bab 1–12 dari baseline tersebut dan Bab 13 untuk penajaman subform, *bukan* penggantian sepihak. Jika ada perbedaan antar dokumen, catat sebagai keputusan terbuka dan minta sign-off PIC/koordinator terkait, jangan merevisi baseline diam-diam.
>
> **Produk saat ini = mockup.** Galeri gambar, form demo, dan prototipe JS tidak menyiratkan sudah ada backend, audit nyata, autentikasi keamanan, layanan SATUSEHAT/BPJS, billing, dispensing, posting stok, atau tindakan klinis aktif. Gunakan hanya data sintetis.

## 0. Keputusan singkat untuk seluruh tim
- **North star:** “setiap petugas melihat pekerjaan yang relevan, mendapatkan konteks yang aman, menyelesaikan **satu aktivitas per kali**, lalu menyerahkan ke profesi/unit berikutnya tanpa entri berulang”.
- **Prinsip navigasi:** login → workspace profesi/unit → worklist yang perlu ditangani → detail pasien/objek+encounter → form kontekstual → draft/review → handoff dan kembali ke antrean.
- **Acuan visual:** 13 mockup = *referensi komposisi*; 12 eksplorasi WebP = ide, bukan aturan field. FR/US/AC/SOP dari PRD mengalahkan ketidaktepatan gambar.
- **Skala produk:** 44 role demo dan 68 modul (belum berarti 68 halaman menu); 12 workflow utama; 7 PIC domain + 1 koordinator; 13 layar acuan, 14 elemen ekstensi klinis (CF-01..CF-13 subform dan CF-14 riwayat read-only).
- **Perangkat:** desktop kerja tetap prioritas, tablet di bangsal/IGD, mobile untuk pekerjaan singkat yang aman; jangan mengecilkan 3 panel secara paksa menjadi 3 kolom di HP.
- **Safety gate:** draft, review, verify/sign, release, dispense, stock movement, payment, claim, external submit = **state/aksi berbeda**, validasi otorisasi di server untuk produk nyata.

## 1. Scope, tujuan, non-goals

### 1.1 Tujuan pengalaman
1. Mengurangi waktu mencari pekerjaan berikutnya tanpa membuat petugas menelusuri hierarki kode modul.
2. Meminimalkan salah pasien, salah encounter, salah obat, salah hasil, salah bed, dan posting ganda lewat *contextual safety*.
3. Menjaga kesinambungan RJ–IGD–RI–Penunjang–Farmasi–Kasir–Klaim dalam satu jejak transaksi/episode, walaupun UI sesuai profesi.
4. Memfasilitasi kerja saat data belum lengkap, jaringan bermasalah, status integrasi tertunda, dan saat pasien berpindah unit.
5. Memperlihatkan progres dan *exception* yang dapat ditindaklanjuti, bukan statistik tanpa definisi.

### 1.2 Batas dan ketergantungan
Termasuk: information architecture (IA), screen specifications, navigasi, design system, form semantics, peran, pemodelan state UI, UAT, prototype testing, roadmap dan quality gates. **Bukan** keputusan final teknologi BE, DDL, algoritma klinis, lisensi ikon pihak ketiga, SOP restrain/partograf, atau perizinan bisnis. Integrasi nasional di UI harus mengikuti kontrak adapter/outbox dan dokumentasi SATUSEHAT yang berlaku; kandidat resource Bab 13 belum otomatis menjadi profil nasional final.

## 2. Apa yang dipelajari dari kompetitor dan riset
Rincian klaim serta tautan sumber ada di [benchmark](./UIUX_BENCHMARK_KOMPETITOR_2026-11-11.md). Kesimpulan implementasi:

| Sumber | Pola yang dipinjam secara konseptual | Penyesuaian untuk rumah sakit Indonesia | Anti-pattern |
|---|---|---|---|
| Epic acute/inpatient | Rekam pasien dan rencana terapi sebagai konteks bersama | Patient banner + encounter + handoff yang konsisten antar-unit | Menganggap semua petugas butuh semua menu |
| Oracle Health EHR | Chart, order, medication administration dan dokumentasi dipisah | Batas hak dokter/perawat/farmasis + evidensi tanda tangan | Memakai satu tombol generik “selesai” untuk semua transaksi |
| TrakCare | Workspace personal dan workflow cerdas | Worklist operasional berdasarkan shift, unit, role dan assignment | Beranda universal |
| MEDITECH Expanse | Personalisasi, bedside/tablet/mobile nursing | Form TTV/asuhan ringkas dengan identifikasi pasien dan guardrail | Mengecilkan spreadsheet menjadi form mobile |
| Dedalus ORBIS U | Klinis, administratif, dan billing terhubung | Handoff dari performed service ke charge tanpa akses silang tugas | Kewenangan kasir mencakup pekerjaan klinis |
| SIMGOS | Keutuhan operasional dan pola registrasi RS | Pencarian MPI, NIK/RM/penjamin, admisi, layanan penunjang | Menyalin menu historis tanpa penelitian lapangan |
| SIMKES Khanza | Operasi lokal lengkap, barcode dan bridging | Barcode, penjamin, logistik, RL, kebutuhan back-office | Menampilkan seluruh modul di sidebar masing-masing pengguna |
| Dribbble | Hierarki, whitespace, kartu, tabel, tipografi | Visual modern **hanya bila aman dan efisien** bagi petugas | Grafik dekoratif, status warna saja, font terlalu kecil |
| ONC SAFER + WCAG 2.2 | Patient identity, CPOE, follow-up hasil, aksesibilitas | UAT klinis, negative tests, keyboard, peringatan kritis yang tepat | Auto-sign AI, alarm fatigue, inaccessible forms |

## 3. Target pengguna dan pekerjaan inti

| Persona / kelompok | Perangkat dominan yang dihipotesiskan | Home dan prioritas | Jangan tampilkan |
|---|---|---|---|
| Pendaftaran / Admission | Desktop loket | Cari pasien; deduplikasi; identifikasi; appointment, cek penjamin, registrasi, antrean | Form SOAP/CPOE dan master stok |
| CS / Operator antrean | Desktop/kiosk | Queue-by-unit, panggilan, check-in, exception jadwal | Diagnosa dan billing internal |
| Dokter RJ / dokter spesialis | Desktop poli + tablet opsional | Pasien jadwal hari ini, alergi & obat, longitudinal chart, SOAP, diagnosis, order dan resep | Manajemen gudang dan hutang RS |
| DPJP rawat inap / dokter visite | Laptop/tablet bangsal | Visit roster, problem list, hasil terbaru, care plan, order dan discharge | Registrasi penjamin sebagai aksi klinis |
| Dokter IGD | Desktop IGD | Tracker acuity, waktu tunggu, triase dan asesmen, critical results, disposisi | Grafik manajemen yang tidak relevan |
| Perawat poli / bangsal / IGD | Tablet/desktop (mobile tugas singkat) | Daftar pasien shift, TTV, asesmen/NCP, tindakan, MAR terotorisasi, handoff | Resep dokter, administrasi tarif |
| Bidan / dokter obgyn | Tablet/desktop | Asesmen maternal/persalinan, observasi terstruktur | Partograf interaktif aktif sebelum SOP valid |
| Bed Manager / admisi RI | Desktop | Occupancy + cleaning + transfer request, class/ward constraints | Status pasien tanpa assignment |
| ATLM / petugas lab | Desktop workstation | Order -> barcode/specimen -> analyzer/QC -> hasil -> verifikasi | Ubah order dokter |
| Radiografer / Radiolog | Desktop high-resolution + viewer | Worklist modalitas, DICOM, ekspertise, critical result handoff | Viewer gambar dianggap alat diagnosis bila hanya placeholder |
| Farmasis / petugas depo | Desktop/scan station | Resep signed, telaah, interaksi/alergi, FEFO, penyiapan/serah obat | Menulis diagnosis/ubah resep dokter sembarangan |
| Gudang / procurement / logistik | Desktop + scanner | Permintaan, penerimaan, batch/lot, expiry, alokasi, audit movement | Dispense ke pasien tanpa tahapan klinis |
| Kasir | Desktop loket | Invoice, tagihan, alokasi pembayaran, kuitansi draft, refund exception | Edit tindakan klinis; seluruh klaim Casemix |
| Billing / Casemix / coder | Desktop | Charge capture, coding, grouping, dossier klaim, error/return partner | Refund atau sign klinis bila bukan kewenangan |
| Petugas MCU / Koordinator | Desktop/tablet | Paket, itinerary peserta, progres pemeriksaan, review resume | Release resume sebelum hasil lengkap |
| Tim mutu / PPI / Manajemen | Desktop dashboard | Indikator yang didefinisikan, exception, tren, drill-down dan freshness | Data sensitif individu tanpa dasar akses |
| Admin RS / IAM / master data | Desktop | Pengguna, role, lokasi, praktisi, master, audit perubahan | Identitas demo digunakan sebagai bukti autentikasi |
| Tim integrasi / IT | Desktop | Queue/outbox, ACK, retry/error klasifikasi, lineage dan audit | Tombol “kirim ulang” tanpa idempotency/audit |
| Pasien portal | Mobile-first | Janji temu, dokumen yang boleh diakses, hasil yang telah dirilis | Katalog internal atau draft klinis staf |
| Reviewer UI/QA | Desktop/test mobile | Katalog 68 modul, coverage, FR/US/AC, role simulation, state testing | Reviewer dianggap role produksi dengan superuser klinis |

**Catatan:** daftar ini mengelompokkan kebutuhan, bukan mengubah 44 role yang sudah ada. **Pemetaan eksplisit semua 44 role** tetap di `design/ROLE_WORKLIST_COVERAGE_V11_2026-11-09.md` dan fungsi role-nav di kode aktif; setiap perubahan role×menu memerlukan review kewenangan.

## 4. Information Architecture (IA) dan pola routing

### 4.1 Pola struktural
```text
Login (identity; credential only)
 └─ Workspace role (tenant/org + unit + shift/assignment)
     ├─ Ringkasan pekerjaan saya (alerts + task counts)
     ├─ Worklist spesifik pekerjaan (search, filter, status, sort)
     │    └─ Work item / patient or non-patient detail
     │         ├─ Context banner: MRN, name, DOB/age, encounter, location, allergies
     │         ├─ Activity view: exactly one primary form / stage
     │         ├─ Read-only related history / result / evidence
     │         └─ Draft → review → [authorized next transition]
     └─ Handoff / inbox / exception / local-vs-external status
```

Penerapan route dapat memakai path/route internal di masa depan tetapi **tidak perlu mengubah seluruh route** demi merapikan tampilan. Di mockup aktif, baca `public/ui-preview/role-demo-login.js`, `role-workspace-v4.js`, `role-worklist-detail-v5.js`, `role-native-forms-v13.js` dan `benchmark-clinical-v16.js` sebelum mengubah alur.

### 4.2 Konsistensi komponen global
- **Global header:** tenant/RS, unit dan identitas akun, koneksi, notifikasi yang relevan; tanpa switch role bebas. Non-production diberi label `DATA DEMO`.
- **Primary nav:** maks. 6–8 kelompok aktivitas yang relevan per role, dengan secondary nav kontekstual. Angka ini pedoman IA, bukan batas jumlah modul.
- **Context banner:** MRN, nama, umur/tgl lahir, penjamin bila relevan, encounter/type/status, lokasi, allergy/risiko, dan peringatan identitas. Dua identifier sebelum tindakan high-risk sesuai SOP.
- **Worklist:** owner, timestamp, SLA, status teks + warna, search, sort, filter, pagination/virtualization jika besar; selection tidak boleh pindah pasien diam-diam.
- **Single-activity editor:** form yang relevan saja, summary read-only dan action footer. Tab = isi setara; wizard = urutan wajib; drawer = konteks; modal = konfirmasi singkat.
- **Handoff cues:** from/to unit, assigned person, pending review, rejected & reason, retry, audit; jangan memalsukan approval.
- **Non-patient tasks:** bed, stock, equipment dan invoice memiliki object-specific banner, bukan memaksa Patient ID untuk setiap objek.

## 5. Spesifikasi 13 layar mockup

Setiap baris = **screen family** yang dapat menghasilkan detail/form kecil. **Bukan** berarti 13 layar menutup semua 68 modul.

| Screen | Mockup PNG | Home/action utama | Komponen kunci dan alur | Modul + FR (representatif) | Uji risiko utama |
|---|---|---|---|---|---|
| S01 Login | [01](./references/simrs-uiux-mockups-2026-11/role-screens/01_login.png) | Credential → workspace | Error login, sesi, unit dan role dari akun | CORE-02 · FR-002 | Role bukan input hak akses; session expiry |
| S02 Front Office | [02](./references/simrs-uiux-mockups-2026-11/role-screens/02_front.png) | Cari/daftarkan pasien | MPI possible match → penjamin → appointment → visit → antrean | CORE-08/09/10/11 · FR-004/005/006/007 · WF-01 | Duplikasi pasien/registrasi; check-in idempotent |
| S03 Dokter RJ | [03](./references/simrs-uiux-mockups-2026-11/role-screens/03_doctor.png) | Dokumentasi dan order | Patient chart → SOAP/CPPT → diagnosis → CPOE → resep | RME-01/04/06/08 · FR-009/016 · WF-02 | Allergy alert, wrong encounter, signed immutability |
| S04 Perawat | [04](./references/simrs-uiux-mockups-2026-11/role-screens/04_nurse.png) | Pengkajian shift | Worklist pasien → TTV → asesmen/NCP → catatan → handoff | RME-05/07 · FR-012/034; CF-02/03/04 | Izin profesi, patient ID, dokumentasi obat |
| S05 IGD | [05](./references/simrs-uiux-mockups-2026-11/role-screens/05_igd.png) | Triase dan disposisi | Tracker urgency → ABCDE → order/observasi → admit/referral/discharge | RME-02 · FR-010 · WF-03; CF-01 | Acuity kritis, response time, wrong disposition |
| S06 Bed Board | [06](./references/simrs-uiux-mockups-2026-11/role-screens/06_beds.png) | Alokasi bed yang sah | Status occupancy/cleaning → request → assign/transfer | CORE-05/OPS-10 · FR-011 · WF-04 | Double occupancy, hold, wrong ward |
| S07 LIS | [07](./references/simrs-uiux-mockups-2026-11/role-screens/07_lab.png) | Verifikasi hasil | Order → specimen/barcode → analyzer → QC → verified → critical escalation | MED-01 · FR-017 · WF-05 | Wrong specimen, unverified result, critical follow-up |
| S08 Farmasi | [08](./references/simrs-uiux-mockups-2026-11/role-screens/08_pharmacy.png) | Telaah resep | Signed order → drug/allergy → lot FEFO → prepare → dispense | MED-04/05, OPS-01 · FR-020/021/022 · WF-07 | Medication mismatch, negative stock, duplicate movement |
| S09 Finance | [09](./references/simrs-uiux-mockups-2026-11/role-screens/09_finance.png) | Invoice & collection | Charge source → invoice → allocation → paid/reconciliation; claim separate | FIN-01/02/03/04/07 · FR-025/026/027 · WF-08 | Duplicate charge, overpayment, refund vs reversal |
| S10 Management | [10](./references/simrs-uiux-mockups-2026-11/role-screens/10_management.png) | Prioritas exception | KPIs + trends + numerator/denominator + drilldown + freshness | ENT-08/09/10/11 · FR-030/031/032 · WF-12 | Stale data, denominator hidden, leakage across RS |
| S11 Admin | [11](./references/simrs-uiux-mockups-2026-11/role-screens/11_admin.png) | Pengelolaan akses | Role/assignment, practitioner, org/locations, audit access | CORE-01/02/03/04 · FR-001/002 | Privilege escalation, cross-tenant lookup |
| S12 Radiologi | [12](./references/simrs-uiux-mockups-2026-11/role-screens/12_radiology.png) | Hasil & ekspertise | Imaging order → modality worklist → DICOM viewer → report → verify | MED-02/03 · FR-018 · WF-06 | Wrong study/patient, viewer placeholder, critical report |
| S13 MCU | [13](./references/simrs-uiux-mockups-2026-11/role-screens/13_mcu.png) | Kelengkapan paket | Paket → itinerary → per pemeriksaan → result review → resume | MED-10 · FR-019 + kontrak MCU PRD | Missing test, disclosure perusahaan, premature release |

**Aturan S03/S04:** riwayat longitudinal `CF-14` adalah read-only; `CF-06` (PRMRJ) dan `CF-13` (partograf) **tetap gated** sampai instrumen/SOP/profesi/terminologi tervalidasi. Lingkup rincinya di [panduan PRD](../docs/simrs-baru/PANDUAN_PENGEMBANGAN_MOCKUP_BERDASARKAN_PRD.md).

## 6. Pola form detail dan tata bahasa UI

### 6.1 Form taxonomy
| Pola | Kapan dipakai | Aturan validasi/aksi |
|---|---|---|
| Quick entry | TTV, check-in, status kecil | 1 kelompok, fokus keyboard, validasi inline; tidak auto-submit |
| Multi-section clinical note | SOAP, asesmen, discharge | Autosave draft yang jelas; review bukan sign; version/addendum setelah signed |
| Structured order composer | CPOE, resep, lab/radiologi | Catalog item + unit/dose/frequency/route/indication; allergy & contraindication review; gated |
| Repeating rows | Obat, tindakan, BMHP, order detail | Add/edit/delete lokal dengan ID stabil; validasi tiap baris dan total |
| Resource status board | Bed, spesimen, inventory | State transition eksplisit; undo tak digunakan untuk transaksi irreversible, gunakan reversal terkendali |
| Read-only timeline | Alergi, history, hasil dan perawatan | Source, author, timestamp, effective date, encounter, status, provenance |
| Analytics / exception queue | KPI, indikator, integrasi | Indikator punya formula, cakupan tenant, refresh time, source dan drilldown |

### 6.2 Rincian interaksi wajib
1. **Identify:** search pasien nomor RM/NIK/nama/penjamin sesuai izin. Tampilkan kemungkinan duplikat sebagai risiko, bukan *merge* otomatis.
2. **Select:** work item menyimpan konteks `tenant_id/org_id + role/assignment + patient_id? + registration_id? + encounter_id? + unit_visit_id? + work_item_id + form_id`. Tanda `?` artinya tidak berlaku untuk seluruh jenis objek.
3. **Edit:** field kondisional jelas; terminologi terstruktur dengan kode dan display yang natural; kelelahan alert diminimalkan.
4. **Validate:** error spesifik di field dan error summary berisi tautan fokus ke input; tidak menghapus jawaban saat validasi gagal.
5. **Draft:** tampil status `Belum disimpan / Menyimpan / Tersimpan / Konflik`, waktu pembaruan dan author. Tidak menjanjikan autosave lintas perangkat jika hanya lokal demo.
6. **Review/verify:** peninjau sesuai kewenangan; preview perbedaan; assessment context, allergies, dan result abnormal ditunjukkan sebelum sign.
7. **Amend:** signed artefact read-only; koreksi dengan addendum/versi baru yang ditautkan.
8. **Handoff:** status dan penerima dicatat; external ACK berbeda dari task completion internal.

### 6.3 State model UI yang diwajibkan
```text
not_started → editing → draft_saved → review_requested → reviewed → verified/signed
                  ↘ validation_error / conflict / denied
signed → addendum_requested → addendum_reviewed → addendum_signed

order: drafted → authorized → accepted_by_unit → in_progress → performed → verified → released
external: not_queued → queued → sending → acknowledged | rejected | retryable_failure | dead_letter
```
State di atas adalah **desain UI konseptual**, bukan instruksi mengaktifkan backend/transaksi; istilah harus direkonsiliasi per modul dengan state machine PRD, aturan klinis dan otorisasi.

## 7. Design system dan adaptivitas

### 7.1 Identitas dan token
- **Navigasi primer navy** (`#122A47` referensi mockup V8), **aksi teal** (`#078D88`), **informasi biru**, **surface putih**, **canvas terang**, **danger/warning/success semantik**. Token teknis final harus dipusatkan (tidak diulang di CSS V8–V17), dan diverifikasi terhadap [referensi design system SATUSEHAT](https://satusehat-stg.dto.kemkes.go.id/design-system) bila tersedia.
- Komponen: `AppShell`, `RoleNav`, `PageHeader`, `WorklistTable`, `PatientContextBanner`, `ObjectContextBanner`, `ActivityEditor`, `ClinicalHistoryPanel`, `StateBadge`, `FieldErrorSummary`, `VerificationGate`, `AuditTimeline`, `IntegrationStatus`, `EmptyState` dan `ConfirmDialog`.
- Visual V17 telah mencoba sidebar terang pada pola klinis tertentu. **Keputusan untuk disahkan saat design review:** apakah navy primary dipertahankan seragam atau dipakai varian `light clinical`. Jangan menggabungkan dua navbar/dua sistem komponen yang bersaing.
- Kode desain (modul/FR/US/WF/PIC) tampil di Dev/QA trace, **tidak** sebagai label menu utama petugas.

### 7.2 Target aksesibilitas
- **WCAG 2.2 AA** untuk UI web. Periksa kontras teks biasa minimum 4.5:1 dan non-text UI 3:1 sesuai kriteria berlaku, tanpa menjadikan seluruh teks metadata 10px; tetap utamakan keterbacaan.
- Keyboard end-to-end: tab order, focus indicator terlihat/tidak tertutup sticky header, Enter/Space bekerja, Escape menutup dialog, dialog mengembalikan fokus.
- W3C 2.2 AA: minimum target 24×24 CSS px dengan pengecualian standar; **rekomendasi internal** target sentuh ≥44×44 untuk tindakan penting di tablet/HP.
- Gunakan label + helper + error yang dapat dibaca pembaca layar; status jangan tergantung warna; aria-live hanya untuk perubahan penting agar tidak spam.
- Pengguna berpengalaman butuh kecepatan, tetapi shortcut selalu punya alternatif yang dapat ditemukan.

### 7.3 Grid
- **≥1280 px:** sidebar ±240–264px; worklist + editor + context rail bila relevan; form tidak melebihi lebar baca yang nyaman.
- **769–1279 px:** 2 panel atau collapsible context; jangan menyembunyikan alergi/risiko kritis.
- **≤768 px:** drawer navigasi, worklist berupa kartu atau tabel ringkas, form satu kolom, footer action tetap mudah diakses, tab tidak membelah layar menjadi 3 kolom.
- **Baseline viewport test:** 1440×900, 980×800, 390×844 dan zoom browser 200%. Tidak boleh ada *page-level* horizontal overflow; tabel lebar harus punya strategi responsive yang aman.
- Perilaku offline/low network: indikator status, disable aksi ganda saat pending, draft lokal dummy saja untuk mockup; offline-first produksi membutuhkan threat model tersendiri.

## 8. Clinical safety, privacy dan Indonesian workflows
- Ikuti [2025 SAFER Guides](https://healthit.gov/clinical-quality-and-safety/safer-guides/) tentang patient identification, CPOE, test-result follow-up, clinician communication, contingency dan system management.
- Sebelum aksi berisiko tinggi, tampilkan identifikasi pasien dan encounter (dua identifier sesuai SOP), dose/route/strength yang dibedakan, tanggal/waktu, allergies, pemeriksa dan asal data.
- Peringatan `critical` harus berbeda dari `abnormal`; ada penerima, waktu acknowledged dan eskalasi; tidak diperlakukan sebagai toast sementara.
- *Break-the-glass*: hanya untuk peran dengan kebijakan emergency jelas, alasan tertulis, audit, expiry, review; **tidak** disediakan sebagai jalan pintas untuk reviewer.
- Kebijakan consent/disclosure dan pemisahan akses organisasi, unit, tim perawatan, loket, kasir, coder, pasien diuji negatif. Data pasien nyata tidak boleh ditaruh di GitHub Pages/localStorage.
- Alur BPJS/penjamin, INA-CBG, RJ/IGD/RI, lab, farmasi, DICOM, SIRS/RL dan SATUSEHAT memiliki sumber kebenaran dan state tersendiri; tidak menyamakan `local completed` dengan `external accepted`. Gunakan adapter/outbox berjejak untuk rancangan produk, jangan direct API dari browser demo.

## 9. Roadmap bertahap dan dependensi

| Gelombang | Prioritas | Cakupan UI/UX | Deliverable yang dapat direview | Gate sebelum lanjut |
|---|---|---|---|---|
| **Foundation F0** | P0 | Audit informasi/role, inventory seluruh 68 modul dan CF-01..14, tokens, komponen, accessibility, identitas pasien | Canonical design tokens, 44-role navigation matrix, screen registry + backlog traceable | Persetujuan koordinator + PIC1 + clinical safety lead |
| **Front & Clinical F1** | P0 | Login → Pendaftaran → Dokter RJ → Perawat → IGD; 1 aktivitas aktif dan contextual history | S01–S05 high-fidelity, workflow RJ/IGD, form validation dan prototype UAT | Uji salah pasien, role denial, local draft, SOP klinis |
| **Penunjang & Perawatan F2** | P0/P1 | Bed board, LIS, Farmasi, Radiologi, handoff discharge/RI | S06–S08 + S12; order-result-medication paths; critical result flow | ID specimen/lot/bed, sign/release gates, no duplicate posting |
| **Finance & Enterprise F3** | P1/P2 | Billing/casemix/penjamin, admin, MCU, manajemen, monitoring integrasi | S09–S11 + S13; KPIs lineage; invoicing & claim error states | Keuangan, mutu, admin dan data owners menyetujui AC |
| **Scale/Advanced F4** | P2/P3 | Portal pasien, OK/anestesi, gizi, CSSD, laundry, analitik lanjut, multi-RS, accessibility regression | Role-native worklists seluruh 44 role, form fidelity per area, pilot usability | SOP, data security, performance & production go/no-go |

Gelombang menyatakan **urutan desain dan risiko**, bukan tanggal rilis atau janji penyelesaian. Jangan menunggu seluruh 68 modul rampung untuk menguji alur P0; jangan mengaktifkan transaksi kritis hanya karena UI sudah selesai.

## 10. Backlog prioritas yang siap dibuat issue

| ID | Epic | Hasil yang diminta | Owner domain | DoR / minimum acceptance (ringkas) |
|---|---|---|---|---|
| UX-001 | Canonical tokens & component library | Hapus konflik style V8–V17, pilih varian role, dokumentasikan komponen | Koordinator + PIC1 + UI/UX | AA contrast, responsive, no duplicate nav |
| UX-002 | Role & authorization navigation | Peta 44 akun → scope kerja/menu/assignment | PIC1 + semua PIC | Deny-by-default, negative test tiap domain |
| UX-003 | Patient/encounter safety banner | Context lintas worklist/form/history + confirm wrong patient | PIC1+2+3 | Cross-patient/episode blocked |
| UX-004 | Registrasi & MPI | S02 possible matches, payer, check-in, antrean, registration form | PIC2 | Duplicate check, idempotent check-in |
| UX-005 | Dokter chart & SOAP | S03 patient history, allergies, structured clinical note, order | PIC3+4 | Draft-review-sign separated; wrong role rejected |
| UX-006 | Keperawatan & CF | S04 TTV/NCP, CF-02/03/04, longitudinal CF-14 | PIC3 | One active subform, no unsafe MAR |
| UX-007 | IGD triase/disposisi | S05 triage acuity, order, referral/admission state | PIC3 | Critical case conspicuous, transition gated |
| UX-008 | Bed board | S06 occupancy, transfer/cleaning, request context | PIC3+1 | Two concurrent assignments denied |
| UX-009 | LIS/RIS/PACS | S07/S12 specimen + critical result + DICOM placeholder | PIC4 | Verification gate, traceable order/result |
| UX-010 | Farmasi workflow | S08 medication review, lot/FEFO, patient pick | PIC5 | No actual dispense/stock until SOP/UAT |
| UX-011 | Billing, casemix & klaim | S09 charge source, payer, settlement, partner status | PIC6 | Over-allocation rejected, finance/casemix separated |
| UX-012 | Management & integration | S10 indicators, freshness, exception/retry | PIC7 | Defined numerator/denominator, ACK status separate |
| UX-013 | Admin & MCU | S11/S13 permissions, practitioner, itinerary + resume review | PIC1+4+7 | No privilege escalation, no premature resume |
| UX-014 | Cross-role UAT & accessibility | Personas + task scripts + benchmark usability | Koordinator + QA + seluruh PIC | 44-role coverage, WCAG AA, negative tests |
| UX-015 | Long-tail modules & patient portal | P1–P3 per role; portal pasien tersendiri | PIC per modul | No hidden permissions; no generic catalog for staff |

**Definisi siap coding (DoR):** modul/PIC, FR, US, AC, workflow, role/action rights, source of truth, sample data sintetis, UI states, error/denial cases, dependencies and prototype approval. Semua issue harus merujuk pada baseline PRD; jangan membuat FR baru hanya dari gambar.

## 11. Traceability dan dokumen rujukan

### 11.1 Sumber spesifikasi berurutan
1. **Baseline final:** `PRD_SIMRS_Baru_Final_User_Stories_Acceptance_Technical_7PIC_2026-11-06`.
2. **Ekstensi terinci:** [PRD v1.1 Bab 1–13](../docs/simrs-baru/PRD_SIMRS_Baru_v1.1_Ekstensi_Form_Klinis_2026-11-10.md) dan [Panduan Mockup](../docs/simrs-baru/PANDUAN_PENGEMBANGAN_MOCKUP_BERDASARKAN_PRD.md).
3. **Visual:** [13 PNG + 12 eksplorasi](./references/simrs-uiux-mockups-2026-11/README.md) dan [V17 adopsi referensi](./REFERENCE_CLINICAL_UI_V17_2026-11-10.md).
4. **Role/worklist:** [V11 coverage](./ROLE_WORKLIST_COVERAGE_V11_2026-11-09.md), [V12 parity](./OPERATIONAL_VISUAL_PARITY_V12_2026-11-09.md), [V13 form per profesi](./ROLE_NATIVE_FORMS_V13_2026-11-09.md), [V16 form](./CLINICAL_BENCHMARK_FORMS_V16_2026-11-10.md).
5. **Benchmark eksternal:** [Dokumen komparasi](./UIUX_BENCHMARK_KOMPETITOR_2026-11-11.md) dengan sumber resmi vendor/standar.

**Jangan salah menafsirkan:** `design/module_coverage.json` dan `design/design_tokens.json` memiliki metadata versi historis yang belum direkonsiliasi; masterplan ini **tidak** mengubah kode, metadata PRD atau teknologi backend. Jika PRD tertulis Go sedangkan keputusan teknis berikutnya Node.js, rekonsiliasi melalui ADR dan persetujuan eksplisit, bukan lewat keputusan UI/UX.

### 11.2 Format traceability untuk setiap screen/story/PR
```text
SCREEN-ID | page title | persona + role | objective | primary CTA | work item
MODULE | PIC | FR-ID | US-ID | AC-ID | WF-ID | entity/state
patient/encounter scope | field schema | entry/exit criteria | failure/denied states
mockup screenshot | component references | link to test | UX reviewer + clinical/SOP sign-off
```

## 12. Rencana usability research & UAT

### 12.1 Siklus penelitian
1. **Contextual inquiry:** observasi petugas nyata (dengan izin dan tanpa data pasien dalam artefak), kelompok minimal pendaftaran, dokter, perawat, IGD, ATLM, farmasis, kasir, bed manager, admin dan manajemen.
2. **Task walkthrough:** untuk tiap persona uji 3–5 tugas representatif termasuk variasi negatif; kumpulkan komentar *think-aloud* tanpa pasien asli.
3. **Prototype evaluation:** desktop/tablet/mobile, novice dan experienced users; ukur keberhasilan, kesalahan, bantuan yang dibutuhkan, lama tugas dan beban kognitif.
4. **Accessibility & safety review:** keyboard/focus/reader, error handling dan negative clinical events bersama PIC klinis dan QA.
5. **Pilot UAT:** rilis user flow hanya jika acceptance formal, SOP, audit dan integrasi disetujui.

### 12.2 Target awal untuk disepakati, bukan hasil pengukuran
| Metrik | Target awal pilot | Cara ukur |
|---|---|---|
| Task success | ≥90% pada tugas normal tanpa bantuan | Observasi task completion per persona |
| Critical patient safety error | **0** pada scripted wrong-patient/order/critical-result scenarios | Test case negatif & dual review |
| Cross-tenant/role leakage | **0** pada skenario adversarial yang diuji | RBAC/authz test terpisah |
| Page-level horizontal overflow | 0 pada viewport utama | Playwright + manual resize |
| Keyboard completion | 100% core flow non-diagnostic oleh keyboard | Manual WCAG test |
| Form validation recovery | ≥90% peserta dapat memperbaiki input pada skenario uji | Pengamatan error-recovery |
| User satisfaction | Target ditetapkan setelah baseline pilot | SUS/SEQ atau instrumen yang disepakati |
| Draft state clarity | 100% UI menyatakan status simpan dan kegagalan | Heuristic audit + browser check |

Angka di atas **hipotesis target kualitas internal**, tidak boleh diklaim sudah tercapai atau dijadikan KPI klinis RS tanpa validasi.

## 13. Quality gates dan Definition of Done

- **Visual:** foto referensi vs hasil implementasi dinilai dengan checklist, tidak harus pixel-identical; konten dan tindakan lebih penting.
- **Functional UX:** workflow per role, form, action CTA, empty/loading/forbidden/error/conflict/retry dan sumber data jelas.
- **Safety:** 2 identifier pada high-risk actions sesuai SOP; allergies dan hasil kritis; no overwrite signed; no unauthorized role/tenant; no unsafe stock/payment/medication actions.
- **Traceability:** tautan modul–FR–US–AC–WF–PIC dan test.
- **A11y:** WCAG 2.2 AA, keyboard, focus, contrast, status semantics dan zoom.
- **Testing:** `node --test tests/*.test.mjs`; `npx playwright test --config=tests/playwright.config.mjs`; preview 390/980/1440; periksa GitHub Actions.
- **UAT:** minimal satu user representative per unit terkait, hasil skenario positif dan negatif, catatan keputusan, PIC sign-off.
- **Change-control:** pembaruan kode di `public/ui-preview/` harus ada PR, bukti screenshot, regression tests, dan tidak memakai data asli.

## 14. Risiko desain yang harus dihindari

| Risiko | Dampak | Mitigasi |
|---|---|---|
| 13 mockup dianggap sudah meliputi 68 modul | Kebutuhan form/role terlewat | Registry screen → modul → field/AC, QA coverage, explicit gap |
| Screenshot generatif menampilkan label keliru | Keputusan klinis/keuangan salah | Review dengan PIC/domain owner, gunakan PRD sebagai otoritas |
| Campuran CSS V8–V17 & menu historis | Inkonsistensi visual, regresi mobile | Consolidate tokens/components dan visual regression |
| Header pasien hilang saat scroll/form | Salah pasien/episode | Sticky context & safe confirmation |
| Role switch tanpa izin produksi | Privilege escalation | Server RBAC, unit assignment, audit |
| Hasil abnormal dianggap sama dengan hasil kritis | Follow-up terlambat | Critical results escalation, ack owner/time |
| Perbedaan status lokal vs SATUSEHAT | Kesimpulan “terkirim” palsu | Independent local/external ledger dan timeline |
| Terlalu banyak informasi awal | Waktu tugas naik | Progressive disclosure dan task-based worklist |
| Akses offline/HP tidak diuji | Gagal di bangsal dan ruang terbatas | Responsive & low-network tests; offline design decision tersendiri |
| AI ambient/autosummarize masuk sebelum governance | Dokumentasi tidak dapat dipertanggungjawabkan | Exclude P0, human review/sign, provenance, consent & audit |

## 15. Definition of Success dan tindak lanjut
Masterplan dianggap diterima **bila**: (a) seluruh 13 screen family dan 44 role ada pemilik review, (b) 68 modul dan CF-01..14 dipetakan tanpa menciptakan menu berlebihan, (c) 12 workflow punya jalur kerja dan error path, (d) desain siap diuji di desktop/tablet/mobile, dan (e) backlog F0–F4 siap dibagi ke 7 PIC/koordinator tanpa mengubah baseline PRD.

**Langkah berikut setelah masterplan:** buat issue bertahap dari UX-001 s.d. UX-015, sertakan screen-spec detail dan snapshot per role. Jangan otomatis menganggap semua target selesai hanya karena masterplan telah di-merge.

---

### Referensi primer eksternal
- Epic: https://www.epic.com/software/acute-and-inpatient-care/
- Oracle Health: https://docs.oracle.com/en/industries/health/oracle-health-ehr/
- InterSystems TrakCare: https://www.intersystems.com/products/trakcare/
- MEDITECH Expanse Physicians/Nurses: https://ehr.meditech.com/ehr-solutions/expanse-for-physicians ; https://ehr.meditech.com/ehr-solutions/expanse-for-nurses
- Dedalus ORBIS U: https://www.dedalus.com/global/en/our-offer/products/orbis-u/
- SIMGOS Kemenkes: https://keslan.kemkes.go.id/simgos ; dokumentasi https://docs.simgos2.simpel.web.id/docs/
- SIMKES Khanza: https://www.yaski.or.id/fitur
- SIMRS.ID: https://simrs.id/
- Dribbble: https://dribbble.com/tags/hospital-dashboard ; https://dribbble.com/tags/medical-dashboard-ui
- ONC SAFER: https://healthit.gov/clinical-quality-and-safety/safer-guides/
- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/
- SATUSEHAT: https://satusehat.kemkes.go.id/platform/docs/id/interoperability/
