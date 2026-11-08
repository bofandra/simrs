# SIMRS Baru — UI Design System & Wireframe Blueprint

**Versi:** 1.0 · 8 November 2026  
**Baseline:** PRD_SIMRS_Baru_Final_NodeJS_FR_US_UI_API_ERD_2026-11-08.docx  
**Status:** desain untuk review; bukan fitur implementasi atau sertifikasi keamanan.

> **Pembaruan visual 8 November 2026:** tema preview kini memakai lapisan `public/ui-preview/satusehat-theme.css` dan token `design/design_tokens.json` v1.1.0-provisional. Acuan yang diminta adalah `https://satusehat-stg.dto.kemkes.go.id/design-system`, tetapi situs tersebut belum dapat diverifikasi dari lingkungan akses saat ini. Tabel token warna pada bagian 3 di bawah merupakan *baseline historis*, bukan palet tema preview aktif. Lihat [SATUSEHAT_THEME_ADOPTION.md](SATUSEHAT_THEME_ADOPTION.md) sebelum menyatakan kepatuhan terhadap desain resmi.

## 1. Tujuan

Membuat satu desain antarmuka yang konsisten bagi **7 workspace** pengguna, sesuai cakupan **68 modul**, **66 FR**, dan **15 workflow** pada PRD. Setiap workspace menggunakan relasi `Patient → Registration → Encounter → UnitVisit`, namun komposisi layar menyesuaikan tugas operator.

**Deliverable:** `index.html` interaktif standalone, 7 wireframe PNG + editable SVG, `design_tokens.json`, `module_coverage.json` dan dokumen ini.

## 2. Keputusan sistem desain

| Aspek | Keputusan |
|---|---|
| Struktur | Sidebar fungsi operasional + topbar berisi RS, role switcher, dan DATA DEMO |
| Tampilan klinis | Worklist kiri, form/aksi utama tengah, ringkasan longitudinal kanan |
| Tampilan admin | Search/filter dan tabel berprioritas, drawer/form tindakan |
| Tampilan manajemen | KPI card + visual tren + freshness/lineage + exception queue |
| Aksi kritis | Simpan Draft, Review, Sign/Verify, Approve dan Release dipisah |
| Bahasa UI | Bahasa Indonesia, istilah teknis umum dipertahankan pada label yang familiar |
| Responsif | Desktop 3 panel; tablet 2 panel; mobile 1 panel dan navigasi horizontal |
| Bukti desain | Tampilkan metadata FR/US/modul/WF sebagai trace untuk reviewer, bukan menu utama operator |

## 3. Design tokens

| Token | Nilai | Fungsi |
|---|---|---|
| Navy | `#152947` | Navigasi dan heading |
| Action Teal | `#078D88` | CTA primer |
| Information Blue | `#3368C4` | Info, tautan, selected |
| Success | `#16845E` | Verified/approved |
| Warning | `#A26300` | Pending/needs-review |
| Danger | `#B53C47` | Critical/error |
| Canvas | `#F4F7FB` | Background |
| Border | `#DFE7EF` | Pembatas ringan |

Tipografi: font sistem (Inter bila tersedia), ukuran 28px untuk H1, 14px panel, 13px teks kerja, 11px tabel/form label, 10px metadata. Spacing 4/8/12/16/24/32px. Border-radius 7/11/15px.

## 4. Pola komponen dan state wajib

- **Patient context header:** nama demo, MRN, jenis kunjungan, encounter, unit, penjamin, status; tetap terlihat pada workspace klinis.
- **Worklist:** search, status filter, sorting, pagination, row action, empty state; status terkait waktu dan owner.
- **Form:** label di atas field, mandatory terlihat, validasi inline, sticky action footer untuk form panjang, error ringkas.
- **Review/sign:** sumber klinis dan alergi tampil sebelum sign; signed read-only; koreksi memakai addendum.
- **Status:** warna semantik didampingi teks. Jangan hanya mengandalkan warna.
- **Exception:** tampilkan forbidden/role, 409 konflik, retry, external ACK pending, duplicate call, incorrect patient/bed/lot.
- **Aksesibilitas:** tab keyboard, label input, visible focus, aria-live untuk notifikasi, rasio kontras yang memadai.
- **Simulasi:** semua data sintetis; event klinis/finansial hanya menghasilkan state lokal, bukan transaksi sungguhan.

## 5. Tujuh workspace wireframe

### Front Office
**Persona:** Pendaftaran, loket, verifikator identitas pasien  
**Alur:** Patient worklist → matching MPI → appointment → check-in → antrean → encounter  
**Modul:** CORE-08, CORE-09, CORE-10, CORE-11  
**FR:** FR-004, FR-005, FR-006, FR-007  
**Workflow:** WF-01  
**Referensi:** NUHA / Epic Appointment Desk / Dribbble Patient Listing  
**Kriteria utama:** Quick search, possible-match, peran penjamin, slot jadwal, check-in nonduplikat  
**Wireframe:** `assets/wireframe_front.svg` (editable) / `.png` dan tombol workspace di `index.html`.

### Dokter & Perawat
**Persona:** Dokter RJ, DPJP, perawat poli dan ruangan  
**Alur:** Patient roster + sticky patient banner + SOAP/CPPT + diagnosis + CPOE + riwayat  
**Modul:** RME-01, RME-04, RME-05, RME-06, RME-07, RME-08  
**FR:** FR-009, FR-012, FR-016, FR-034, FR-042  
**Workflow:** WF-02  
**Referensi:** NUHA Asesmen Medis Rawat Inap / Epic Assessment  
**Kriteria utama:** Draft terpisah sign, review alergi dan medikasi, provenance, addendum  
**Wireframe:** `assets/wireframe_clinical.svg` (editable) / `.png` dan tombol workspace di `index.html`.

### IGD & Rawat Inap
**Persona:** Dokter/perawat IGD, bed manager, DPJP RI  
**Alur:** ED tracker → triase → disposisi → bed search → admission → handover  
**Modul:** RME-02, RME-03, OPS-10, MED-06, MED-07  
**FR:** FR-010, FR-011, FR-012  
**Workflow:** WF-03, WF-04, WF-10  
**Referensi:** Epic ED Tracker / Trust Medis IGD / TrakCare Bed Search  
**Kriteria utama:** Acuity visual semantik, tidak bentrok bed, konfirmasi disposisi  
**Wireframe:** `assets/wireframe_acute.svg` (editable) / `.png` dan tombol workspace di `index.html`.

### Laboratorium & MCU
**Persona:** ATLM, petugas lab, verifikator, petugas MCU  
**Alur:** CPOE worklist → specimen → analyzer → verification; paket MCU → itinerary → buku MCU  
**Modul:** RME-08, MED-01, MED-02, MED-03, MED-10  
**FR:** FR-016, FR-017, FR-018, FR-019, FR-057  
**Workflow:** WF-05, WF-06, WF-13, WF-14  
**Referensi:** Epic Results Review / Dribbble Clinico / Biosys clinic-MCU  
**Kriteria utama:** Barcode accession, unmatched queue, verified-before-release, corporate disclosure  
**Wireframe:** `assets/wireframe_lab.svg` (editable) / `.png` dan tombol workspace di `index.html`.

### Farmasi & Logistik
**Persona:** Farmasis, petugas depo, gudang  
**Alur:** Resep signed → telaah → pilih lot FEFO → dispensing → stock movement → charge  
**Modul:** MED-04, MED-05, OPS-01, OPS-02  
**FR:** FR-020, FR-021, FR-022, FR-036, FR-050  
**Workflow:** WF-07, WF-15  
**Referensi:** NUHA Farmasi RJ / Oracle Pharmacist Workflow  
**Kriteria utama:** Pemeriksaan alergi, lot, expiry, stock nonnegatif, movement append-only  
**Wireframe:** `assets/wireframe_pharmacy.svg` (editable) / `.png` dan tombol workspace di `index.html`.

### Keuangan & Klaim
**Persona:** Kasir, billing, penjamin, casemix, keuangan  
**Alur:** Performed charge → invoice → allocation/payment → dossier klaim → status partner  
**Modul:** FIN-01, FIN-02, FIN-03, FIN-04, FIN-05, FIN-06, FIN-07  
**FR:** FR-025, FR-026, FR-027, FR-062, FR-065  
**Workflow:** WF-08  
**Referensi:** BVK Eucalyptus / Dribbble Hospital Billing  
**Kriteria utama:** Source charge unik, alokasi ≤ outstanding, koreksi melalui reversal  
**Wireframe:** `assets/wireframe_finance.svg` (editable) / `.png` dan tombol workspace di `index.html`.

### Manajemen & Mutu
**Persona:** Direksi, tim mutu, integrasi, analis operasional  
**Alur:** Snapshot KPI → data lineage/freshness → quality work queue → integration ACK/DLQ  
**Modul:** ENT-06, ENT-08, ENT-09, ENT-10, ENT-11  
**FR:** FR-030, FR-031, FR-032, FR-063  
**Workflow:** WF-12 / integrasi lintas-workflow  
**Referensi:** Dribbble Healthcare SaaS Dashboard / Dedalus ORBIS U  
**Kriteria utama:** Definisi numerator/denominator, role scope, freshness, status ACK eksternal  
**Wireframe:** `assets/wireframe_management.svg` (editable) / `.png` dan tombol workspace di `index.html`.

## 6. Keterlacakan 68 modul

`module_coverage.json` memetakan seluruh 68 modul PRD beserta PIC, FR, user story, area primer dan area pendukung. **Pemetaan desain bukan klaim bahwa 68 modul telah diimplementasikan.**

| Workspace | Jumlah modul primer (pemetaan desain) |
|---|---:|
| Front Office | 5 |
| Dokter & Perawat | 8 |
| IGD & Rawat Inap | 6 |
| Laboratorium & MCU | 8 |
| Farmasi & Logistik | 8 |
| Keuangan & Klaim | 11 |
| Manajemen & Mutu | 22 |

## 7. Uji interaksi pada preview HTML

- Pilih role dan workspace untuk mengganti konteks kerja.
- Front Office: booking dan simulasi check-in.
- Dokter: pilih pasien, isi SOAP, simpan draft, preview sign, buat CPOE.
- IGD: pilih acuity dan bed; alokasi bed yang unavailable harus ditolak.
- LIS: verifikasi hasil sebelum analyzer message harus ditolak; kemudian gunakan tombol terima data analyzer dan verifikasi.
- MCU: buku hasil belum boleh dibuat sebelum 6 pemeriksaan ditandai lengkap.
- Farmasi: dispensing sebelum verifikasi ditolak; retry setelah dispense tidak mencatat dua kali.
- Billing: pembayaran melebihi outstanding ditolak, pembayaran yang valid mengurangi saldo.
- Manajemen: ekspor CSV demo dan lihat status integrasi/lineage.
- Tombol Reset Demo mengembalikan kondisi awal di browser.

## 8. Penempatan di GitHub Pages

Preview mandiri (`index.html`) tidak memerlukan Node.js backend, PostgreSQL, auth nyata, atau API routes. Dapat diletakkan di `public/ui-preview/index.html` pada repository Next.js dan akan muncul dalam static export saat konfigurasi Pages diaktifkan. **Tidak menggantikan halaman utama atau deploy publik sebelum review UI.**

## 9. Sumber inspirasi dan batasan

- NUHA Asesmen Rawat Inap: https://drive.google.com/file/d/1uQuDWND-pqz3NeY_IaXCfd-WBMXSNPEb/view
- NUHA Farmasi RJ: https://drive.google.com/file/d/13k3AkwKcSPqTXM0FdZTGnprZFc0y48Lu/view
- Epic Asesmen Medis: https://drive.google.com/file/d/18nyxvuhbuZ-AU-VIYE_8BZo9sm1sMcfm/view
- Trust Medis IGD: https://drive.google.com/file/d/1UuKIyKl87lKEXWKgb8OcycTVyBxl772m/view
- Galeri referensi SIMRS global: https://drive.google.com/drive/folders/1ocybJIp2IhpCyNnvWs8_L37VkbNrWs3t
- Inspirasi visual Dribbble yang sudah ditinjau: EHR Dashboard, Patient Listing in EHR System (Koru), Clinico Labtest Management, Hospital Bed & Wards Management, Hospital Billing. UI diterjemahkan menjadi komposisi orisinal; tidak menyalin karya visual atau aset pihak ketiga.

## 10. Batasan & keputusan sebelum implementasi modul

Design System v1 ini menjelaskan pola UI representatif. Ia belum menyediakan form lengkap 68 modul, validasi aktual terhadap OpenAPI, backend Node.js, akses produksi, data asli, maupun mekanisme integrasi. Setelah disetujui secara visual, pekerjaan coding dirinci berdasarkan PRD dan AC setiap user story.
