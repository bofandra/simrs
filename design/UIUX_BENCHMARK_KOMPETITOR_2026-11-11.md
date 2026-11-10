# SIMRS Baru — Benchmark Kompetitor & Implikasi UI/UX
**Tanggal kajian:** 11 November 2026  
**Status:** Desk research dari materi publik; bukan evaluasi hands-on, audit akses internal, atau pembuktian seluruh fitur tiap vendor.  
**Konteks:** [Masterplan UI/UX SIMRS Baru](./UIUX_MASTERPLAN_SIMRS_BARU_2026-11-11.md) dan [13 mockup role-based](../references/simrs-uiux-mockups-2026-11/README.md).

## 1. Tujuan & metode
Kajian ini membandingkan **pola kerja pengguna**, bukan menghitung banyaknya fitur dari brosur. Unit pembanding: identitas pasien, navigasi profesi, formulir klinis, handoff, penunjang, farmasi, billing, indikator, keamanan dan adopsi. Sumber yang diutamakan: situs/dokumentasi resmi vendor, SIMGOS Kemenkes, katalog yayasan Khanza, standar aksesibilitas W3C dan panduan keselamatan SAFER. Dribbble adalah *inspirasi komposisi visual*, bukan bukti cara kerja produk nyata.

**Kelas bukti:** A = dokumentasi resmi terverifikasi; B = dokumentasi publik pihak lain (konteks saja); C = interpretasi/pilihan desain kita yang perlu validasi pengguna. Tidak ada klaim kecepatan, efektivitas, kelengkapan layar atau peringkat UX kompetitor tanpa pengujian terukur.

## 2. Peta kompetitor global (sumber A)

| Produk | Bukti dari sumber publik | Pola UI/UX yang bisa diadaptasi | Apa yang **tidak** boleh diasumsikan | Referensi |
|---|---|---|---|---|
| **Epic Acute & Inpatient Care** | Menekankan satu rekam pasien, care plan, clinical pathway, koordinasi perawatan, konteks rawat inap serta farmasi | Patient chart longitudinal; status tugas, hasil, medication dan handoff dekat konteks pasien; berbeda bagi dokter vs perawat | Tidak mengklaim desain internal tertentu persis sama dengan screenshot vendor atau seluruh fitur kompatibel langsung dengan aturan Indonesia | [Epic official](https://www.epic.com/software/acute-and-inpatient-care/) |
| **Oracle Health EHR (Cerner)** | Dokumentasi menyebut charting, documents, medication administration, orders, jadwal/aksi provider | Pisahkan aktivitas *review / order / documentation / administration*; jadwal personal untuk klinisi dan pengelolaan order jelas | Tidak menganggap AI klinis otomatis sebagai keluaran valid/diizinkan atau menyalin tata letak proprietary | [Oracle docs](https://docs.oracle.com/en/industries/health/oracle-health-ehr/) |
| **InterSystems TrakCare** | Klaim resmi personalized user experience, intelligent workflow, unified patient record, interoperabilitas FHIR/SMART on FHIR | Beranda tugas spesifik profesi, patient context lintas unit, transisi antar-care setting | Belum diverifikasi detail pixel/komponen atau model RBAC di deployment pelanggan | [TrakCare product](https://www.intersystems.com/products/trakcare/) |
| **MEDITECH Expanse** | Dokumentasi resmi dokter menonjolkan personalization/widgets/shortcuts/order sets; perawat memakai chart bedside, tablet/smartphone dan wristband scanning | Preferensi role, shortcut, tablet bedside, akses cepat TTV, alergi dan MAR, minimizing duplicate entry | Demo foto/AI vendor bukan bukti keselamatan atau efektivitas pada RS kita; AI ambient bukan prioritas P0 | [For physicians](https://ehr.meditech.com/ehr-solutions/expanse-for-physicians/), [for nurses](https://ehr.meditech.com/ehr-solutions/expanse-for-nurses) |
| **Dedalus ORBIS U** | Satu EPR untuk klinis, keperawatan, administrasi dan billing; antarmuka desktop/mobile; clinical workflow dapat disesuaikan | Sambungkan worklist pelayanan → tindakan → charge tanpa membuka katalog modul; role-aware dan status yang natural | Integrasi billing/clinical tidak berarti staf kasir bisa mengubah catatan klinis atau petugas farmasi bisa mengubah order dokter | [ORBIS U product](https://www.dedalus.com/global/en/our-offer/products/orbis-u/) |

**Simpulan global:** desain berbasis *care/team/workflow* lebih cocok daripada dashboard generik. **Adaptasi ke SIMRS kita:** satu patient context, one-primary-action form, role-specific worklist, quick history, status transaksi klinis jelas, dan konfigurasi per role tanpa melonggarkan otorisasi.

## 3. Peta kompetitor lokal (sumber A)

| Produk | Bukti publik | Yang perlu diakomodasi | Batas interpretasi | Referensi |
|---|---|---|---|---|
| **SIMGOS Kemenkes** | Sistem generik open source untuk fasyankes; dokumentasi v2 mencakup pendaftaran, master, alur, BPJS, Kemenkes, laboratorium, penunjang | Praktik pencarian pasien menggunakan No.RM/NIK/penjamin; registrasi RJ/IGD/RI; pengaturan master layanan/penjamin; rekonsiliasi dan integrasi | Jangan menyebut SIMGOS selalu lebih/kurang baik dalam UX tanpa uji staf. Tampilan berbeda menurut versi, konfigurasi dan izin | [Kemenkes SIMGOS](https://keslan.kemkes.go.id/simgos), [Dokumentasi SIMGOS V2](https://docs.simgos2.simpel.web.id/docs/), [Pendaftaran](https://docs.simgos2.simpel.web.id/docs/panduan/pendaftaran/) |
| **SIMKES Khanza** | Katalog resmi menggambarkan registrasi–billing, RME, barcode obat/tindakan/BHP, penjamin, bridging BPJS/INACBG/Kemenkes, inventory, RL dan dashboard | Cakupan operasional lokal yang lengkap, kebutuhan tenaga administrasi dan front office, pilihan nomor rawat, barcode dan form layanan | Katalog pemasaran bukan bukti status release fitur atau pengalaman pengguna semua rumah sakit | [YASKI fitur](https://www.yaski.or.id/fitur), [YASKI](https://www.yaski.or.id/) |
| **SIMRS.ID** | Situs produk menjelaskan pendaftaran/antrean, RJ–IGD, bed, laboratorium/PA/mikro, DICOM/PACS, farmasi, billing, laporan | Kenali kebutuhan konfigurasi RS Indonesia, penunjang spesialis dan penjamin; jangan abaikan modul non-klinis dalam backlog | Informasi pemasaran tidak cukup untuk menyimpulkan fitur telah diuji/diimplementasikan di semua deployment | [SIMRS.ID](https://simrs.id/) |

**Konteks nasional lintas vendor:** SATUSEHAT menerbitkan modul interoperabilitas per use case; panduan menyebut RJ, IGD, RI, farmasi, serta sumber data FHIR seperti Patient, Encounter, Observation, ServiceRequest, DiagnosticReport, ImagingStudy, MedicationRequest dan MedicationDispense. UI harus menampilkan **status lokal vs status pengiriman/ACK nasional secara terpisah**, bukan tombol “terkirim” yang mencampur keduanya. Lihat [panduan interoperabilitas](https://satusehat.kemkes.go.id/platform/docs/id/interoperability/) dan [resource FHIR](https://satusehat.kemkes.go.id/platform/docs/id/fhir/resources/).

## 4. Dribbble — referensi inspirasi saja (sumber C)
[Medical Dashboard UI](https://dribbble.com/tags/medical-dashboard-ui), [Hospital Dashboard](https://dribbble.com/tags/hospital-dashboard), [Medical Dashboard Design](https://dribbble.com/tags/medical-dashboard-design).

| Elemen visual yang berguna | Adaptasi pada mockup | Trade-off / anti-pattern |
|---|---|---|
| Hierarki judul, KPI card, grid dan whitespace | Dashboard manajemen: KPI terbatas, prioritas exception; headline pada worklist | Dashboard tampak cantik tetapi tidak dapat ditindaklanjuti; terlalu banyak KPI sebelum status pekerjaan |
| Tabel + panel detail, filter terintegrasi | Front Office, Lab, Farmasi, Kasir | Menyembunyikan kolom penting, memaksa horizontal scroll di HP |
| Patient overview, identitas visual dan informasi penting | Dokter, Perawat, IGD | Alergi/hasil kritis terkubur di dekorasi; identitas pasien kecil |
| Warna status yang tertahan dan CTA utama | Semua worklist dan transaksi | Warna saja tanpa teks; satu tombol “Selesaikan” untuk beberapa status berbeda |
| Responsif dan variasi komposisi kartu | Mobile nursing, bed manager, admin | Menganggap kartu marketing cocok untuk form klinis padat tanpa uji |

Jangan menyalin merek, grafik, foto pasien, ikon proprietary, teks atau aset desain kreator; gunakan hanya pola umum yang diterjemahkan menjadi desain orisinal.

## 5. Penilaian aspek UX yang direncanakan — bukan skor vendor
Skala **T (target SIMRS)** menunjukkan penerapan yang ingin diraih, **bukan** penilaian produk pembanding.

| Dimensi | Target SIMRS | Artefak bukti yang wajib disiapkan |
|---|---|---|
| Personalisasi role | T: seluruh 44 role punya entry dan menu kerja natural | Role×menu×task matrix, access review |
| Identitas pasien | T: tetap terlihat + konfirmasi sebelum aksi kritis | Patient banner test, negative cross-patient test |
| Dokumentasi klinis | T: 1 aktivitas/kelompok form aktif, draft-review-sign terpisah | Screen spec, workflow, sample validation/denial |
| Order & hasil | T: status pending/performed/verified/critical dibedakan | State diagram + critical value escalation test |
| Farmasi/penunjang | T: lot, barcode, expiry, specimen traceable; hard gate untuk transaksi nyata | SOP sign-off, UAT, audit events |
| Front office & penjamin | T: duplicate-check, check-in idempotent, payer transitions jelas | MPI and registration tests |
| Integrasi nasional | T: local status, queued, accepted/rejected external + retry/audit terpisah | Outbox/ACK UX contract |
| Aksesibilitas dan efisiensi | T: WCAG 2.2 AA + uji user operasional | Keyboard/screen reader/manual test, time-on-task |

## 6. Referensi best practice independen
- **W3C WCAG 2.2**: target AA; kontras, label/error, navigasi keyboard, fokus terlihat, ukuran target minimum dan responsif: https://www.w3.org/TR/WCAG22/
- **ONC/ASTP 2025 SAFER Guides**: patient identification, CPOE/clinical decision support, test reporting and follow-up, clinician communication, contingency, system management dan high-priority practices: https://healthit.gov/clinical-quality-and-safety/safer-guides/
- **SATUSEHAT**: use case dan resource FHIR sesuai dokumentasi resmi versi yang berlaku: https://satusehat.kemkes.go.id/platform/docs/id/interoperability/
- **Sumber produk**: hanya fakta yang dijelaskan pada halaman resmi masing-masing (tautan tabel di atas).

## 7. Keputusan adopsi, bukan cloning
1. **Adopsi** patient-first chart (Epic/Oracle), personalized worklist (TrakCare), mobile nursing (MEDITECH), workflow lintas unit (ORBIS U), kebutuhan proses lokal SIMGOS/Khanza, serta hierarki visual Dribbble.
2. **Sesuaikan** dengan peran lokal (pendaftaran, admisi, penjamin, casemix, perawat, ATLM, radiografer/radiolog, farmasis, bed manager, manajemen, mutu, IT), BPJS, bahasa Indonesia, FHIR/SATUSEHAT dan kondisi jaringan RS.
3. **Tolak** menu mega-modul untuk semua pengguna, penggantian role bebas sebagai eskalasi hak akses, AI auto-sign, fake success pada kirim nasional, penempatan bed ganda, stok/charge tanpa event sah, serta percampuran tugas kasir dan casemix.
4. **Validasi** hipotesis desain dengan staf RS melalui task testing; tidak mengklaim “UX terbaik” berdasarkan brosur atau mockup AI.

Lihat [Masterplan](./UIUX_MASTERPLAN_SIMRS_BARU_2026-11-11.md) untuk prioritas layar, roadmap, state, acceptance dan siapa yang memvalidasi.
