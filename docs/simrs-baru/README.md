# SIMRS Baru — GitHub Pages Interactive Prototype

Halaman publik: https://bofandra.github.io/simrs/

## Status
**Prototipe interaktif dengan data sintetis**, bukan aplikasi rumah sakit operasional dan **bukan** koneksi PostgreSQL/SATUSEHAT yang telah berjalan.

## Ruang lingkup
- Executive dashboard dan pergerakan encounter;
- Master pasien dan registrasi encounter (simulasi CRUD);
- Workspace RME (diagnosis, observasi LOINC, CPOE);
- LIS (order, specimen dan verifikasi hasil);
- Farmasi & dispensing yang memperbarui mock stock ledger;
- Billing, invoice dan pencatatan pembayaran simulasi;
- Database Explorer: 23 schema, subset field dan FK per tabel dari rancangan awal;
- FHIR Adapter: contoh transformasi JSON R4 dan status outbox simulasi;
- Katalog cakupan 68 modul SIMRS.
- Clinical Pathway interaktif: matriks H1–H4, catatan eksekusi dan bukti, varian, evaluasi outcome, serta relasi encounter.

Mockup memanfaatkan **model data yang disederhanakan** dari blueprint database versi 1, dengan 271 tabel kandidat, 3.395 kolom usulan, 762 foreign key dan 1.003 indeks. Jumlah tersebut merupakan cakupan **desain**, bukan jumlah tabel yang sudah diimplementasikan.

## Arsitektur produksi yang dituju
`React + TypeScript → Go modular monolith → PostgreSQL`, dengan `FHIR R4 mapper + validator + outbox worker` untuk SATUSEHAT. Dedicated FHIR Server **tidak digunakan**.

GitHub Pages menjalankan HTML/CSS/JavaScript mandiri supaya demo dapat dibuka tanpa backend. Simulasi transaksi hanya disimpan pada `localStorage` browser yang mengakses halaman.

## Clinical Pathway (prototipe 1 Nov 2026)
- Buka menu **Clinical Pathway** (hash `#clinical-pathway`) atau tombol dari **Workspace Klinis**.
- Default: encounter rawat inap `E-1003`, dengan template `DEMO-RI` versi 1.0 dan beberapa catatan simulasi.
- Klik sel pada matriks H1–H4 untuk menulis pelaksana, waktu, catatan realisasi, serta bukti terkait encounter jika ada.
- Jika terdapat penyimpangan, pilih **Catat varian**, isi alasan, dampak, tindak lanjut; pantau dan tutup melalui tab **Varian & tindak lanjut**.
- Nilai target melalui tab **Outcome & evaluasi**; tab **Relasi & bukti data** menampilkan kandidat relasi dan referensi ke record RME/CPOE/farmasi.
- Encounter non-rawat inap tidak otomatis masuk pathway. Enrollment baru untuk rawat inap lain dilakukan secara eksplisit.
- Data dan tindakan contoh tersimpan hanya di `localStorage`; gunakan **Reset Demo** untuk kembali ke contoh awal.
- **Penting:** Ini mockup alur kerja, **bukan** pedoman klinis yang telah disetujui. Tabel `clinical.pathway_step_executions`, `clinical.pathway_variances`, dan `clinical.pathway_outcome_assessments` masih *usulan detail blueprint* (belum DDL/implementasi PostgreSQL). Assessment outcome tidak dilakukan otomatis.

## Pengujian demo
1. Buka Dashboard.
2. Pilih pasien/encounter di Front Office.
3. Tambahkan dua observasi tekanan darah melalui Workspace Klinis.
4. Buat order laboratorium, lalu verifikasi hasil di LIS.
5. Lakukan dispensing resep dan cek perubahan stok serta charge.
6. Lihat invoice, outbox, JSON FHIR, dan Database Explorer.
7. Gunakan **Reset Demo** untuk mengembalikan seluruh data contoh.

## Batasan
- Tidak memiliki autentikasi, otorisasi, transaksi database, FHIR profile validation, atau komunikasi eksternal nyata.
- Tidak boleh digunakan untuk data kesehatan asli.
- FHIR JSON adalah ilustrasi, bukan pernyataan lulus profil SATUSEHAT.
- Detail field Database Explorer merupakan subset agar tetap terbaca.
- Source project Next.js lama di direktori `app/` dipertahankan agar riwayat dan eksperimen sebelumnya tidak hilang.

## Source
- `index.html` shell aplikasi;
- `styles.css` desain responsif;
- `catalog.js` daftar modul, contoh schema/field, synthetic data;
- `app.js` interaksi UI dan simulasi CRUD;
- `clinical-pathway.js` dan `clinical-pathway.css` modul interaktif pathway;

## Update: Mockup Workflow dan ERD v2 (30 Oktober 2026)

- **Patient 360** — profil longitudinal, kunjungan, penjamin, appointment, observasi dan resep.
- **Front Office & Bed Board** — appointment, check-in, nomor antrean, bed terisi.
- **RME RJ/IGD/RI** — SOAP/CPPT, triase IGD, asuhan keperawatan RI, order, e-resep, resume dan status signing demo.
- **LIS / Farmasi / Billing** — status specimen bertahap, verifikasi, dispensing dengan lot, mutasi stok, charge, invoice dan alokasi pembayaran parsial.
- **Database Explorer v2** — katalog nama seluruh 271 tabel dari workbook, field contoh tabel inti, hubungan FK, navigasi ERD lokal, sample row sintetis.
- **Record Lineage** — penelusuran patient_id / encounter_id ke data klinis, order, penunjang, invoice dan outbox.

**Batasan**: keseluruhan data tetap mock browser/localStorage tanpa backend. Nama 271 tabel bersumber dari workbook, namun detail seluruh 3.395 kolom dan 762 relasi belum disalin ke browser; file XLSX tetap sumber lengkap. Field contoh dan ERD lokal bukan keseluruhan desain database.

Automated test: `node scripts/simrs-mockup-smoke.cjs` memverifikasi semua 22 halaman, state simulasi transaksi dan lintas modul. Workflow deployment menjalankan pengujian tersebut sebelum publish.

## Mockup Lanjutan — Workspaces Spesialistik & Backoffice

Tambahan layar yang tetap 100% menggunakan data sintetis dalam browser:

- **Radiologi RIS/PACS**: order radiologi, akuisisi, ekspertise, release, contoh UID DICOM dan ilustrasi FHIR ImagingStudy.
- **Kamar Operasi & Anestesi**: penjadwalan kasus, checklist, tindakan, recovery, charge; tahap operasi dikunci sampai set CSSD steril.
- **Gizi Klinis & Dapur**: NutritionOrder demo → persiapan → produksi makanan → distribusi tray.
- **CSSD**: status set dari dirty sampai distributed, contoh hubungan set steril ke operasi.
- **Laundry**: siklus linen dari penerimaan sampai distribusi.
- **HRIS**: master pegawai demo, penugasan shift, presensi.
- **Pelaporan & Mutu**: KPI komputasi dari data demo; RL/SIRS adalah ilustrasi, bukan spesifikasi atau submission resmi.

Transisi perubahan pada modul spesialistik menggunakan state `localStorage` dan memperlihatkan hubungan ke encounter, charge, outbox dan Database Explorer jika relevan. Sebagian besar modul lain pada katalog 68 fitur masih berupa blueprint.

## Peta Fitur → Workflow → Database → FHIR (1 November 2026)

- Navigasi baru **Peta Fitur & Database** (`#feature-map`) menghubungkan seluruh 68 modul dengan workflow kandidat, aktor, 7 usulan domain PIC, subset tabel canonical PostgreSQL, kandidat HL7 FHIR R4, dan workspace demo yang relevan.
- Setiap modul mempunyai tautan **Peta Fitur** dari Katalog Modul. Tabel dapat dibuka langsung ke Database Explorer. Domain PIC hanya usulan (belum ada penugasan nama individu); koordinator konsolidasi mengawal keputusan lintas PIC.
- Sebanyak 11 nama tabel lama dalam katalog `catalog.js` diselaraskan dengan daftar canonical `database-tables.js`, termasuk seluruh referensi foreign key pada katalog yang terkait.
- Smoke test memeriksa ke-68 modul mapped, seluruh tabel workflow valid terhadap blueprint 271 tabel, katalog detail valid, dan navigasi antarworkspace.
- Peta FHIR bukan validasi profil SATUSEHAT; data tetap sintetis pada localStorage dan tidak boleh untuk penggunaan klinis riil.

## Workflow Simulasi Terpadu (1 November 2026)

Menu **Perjalanan Pasien E2E** (`#care-journey`) memperlihatkan transaksi sintetis dalam satu Encounter, dari Front Office ke RME, Laboratorium LIS, Farmasi/Inventory, hingga Billing.

- Front Office membuat appointment, queue, encounter, dan relasi pendaftaran simulasi.
- RME menulis SOAP, ICD-10, dua Observation tekanan darah dan status signed (bukan tanda tangan legal).
- LIS menambah order, specimen, hasil Hb Observation LOINC 718-7, verifikasi, release, outbox, serta charge idempotent.
- Farmasi melakukan e-resep, verifikasi farmasis, dispensing yang memeriksa kecocokan lot/stok/kedaluwarsa, dan membuat stock movement dan charge.
- Billing menghitung outstanding dari charge dan payment allocation, mendukung pembayaran parsial serta menolak overpayment.
- Penutupan encounter hanya dapat dilakukan setelah kelima tahap lengkap; event transisi dicatat di audit demo dan terlihat melalui halaman rekam terkait.

Semua data tetap berada di localStorage browser. Simulasi peran **bukan autentikasi ataupun RBAC**. Modul ini tidak terhubung ke BPJS, SATUSEHAT, alat medis, database RS, atau transaksi keuangan riil. Belum dilakukan pengujian visual di browser nyata; pemeriksaan otomatis mencakup JavaScript syntax serta state-machine dan E2E smoke test di Node.js.
## Worklist Petugas v3.3 (1 November 2026)

Enam perspektif role demo tersedia pada `#role-worklists`: Front Office, Dokter/DPJP, Perawat, Laboratorium, Farmasi dan Kasir. Status actionable/waiting/completed dihitung dari data sintetik bersama, bukan tabel worklist terpisah. Front Office dapat melakukan check-in demo idempotent; perawat dapat mencatat asuhan keperawatan sekali per encounter; modul lain mempunyai deep-link ke encounter E2E. Pemeriksaan integritas read-only memeriksa beberapa relasi dan saldo, bukan validasi backend. Pilihan peran **bukan autentikasi, RBAC, atau otorisasi klinis**.

## Pengujian Browser Nyata

Workflow publikasi menjalankan Chromium/Playwright pada desktop 1440×900, tablet 768×1024 dan mobile 390×844, termasuk halaman worklist enam peran, pencatatan keperawatan, LIS, farmasi, kasir, alur E2E, pengecekan JavaScript exception dan overflow horizontal. Screenshot tersimpan di GitHub Actions artifact `simrs-role-worklists-browser-shots`. Pengujian ini adalah browser smoke test, bukan sertifikasi aksesibilitas, keamanan atau UAT klinis.
