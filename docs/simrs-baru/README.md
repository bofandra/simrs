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

Mockup memanfaatkan **model data yang disederhanakan** dari blueprint database versi 1, dengan 271 tabel kandidat, 3.395 kolom usulan, 762 foreign key dan 1.003 indeks. Jumlah tersebut merupakan cakupan **desain**, bukan jumlah tabel yang sudah diimplementasikan.

## Arsitektur produksi yang dituju
`React + TypeScript → Go modular monolith → PostgreSQL`, dengan `FHIR R4 mapper + validator + outbox worker` untuk SATUSEHAT. Dedicated FHIR Server **tidak digunakan**.

GitHub Pages menjalankan HTML/CSS/JavaScript mandiri supaya demo dapat dibuka tanpa backend. Simulasi transaksi hanya disimpan pada `localStorage` browser yang mengakses halaman.

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
- `app.js` interaksi UI dan simulasi CRUD.

## Update: Mockup Workflow dan ERD v2 (30 Oktober 2026)

- **Patient 360** — profil longitudinal, kunjungan, penjamin, appointment, observasi dan resep.
- **Front Office & Bed Board** — appointment, check-in, nomor antrean, bed terisi.
- **RME RJ/IGD/RI** — SOAP/CPPT, triase IGD, asuhan keperawatan RI, order, e-resep, resume dan status signing demo.
- **LIS / Farmasi / Billing** — status specimen bertahap, verifikasi, dispensing dengan lot, mutasi stok, charge, invoice dan alokasi pembayaran parsial.
- **Database Explorer v2** — katalog nama seluruh 271 tabel dari workbook, field contoh tabel inti, hubungan FK, navigasi ERD lokal, sample row sintetis.
- **Record Lineage** — penelusuran patient_id / encounter_id ke data klinis, order, penunjang, invoice dan outbox.

**Batasan**: keseluruhan data tetap mock browser/localStorage tanpa backend. Nama 271 tabel bersumber dari workbook, namun detail seluruh 3.395 kolom dan 762 relasi belum disalin ke browser; file XLSX tetap sumber lengkap. Field contoh dan ERD lokal bukan keseluruhan desain database.

Automated test: `node scripts/simrs-mockup-smoke.cjs` memverifikasi semua 15 halaman, state simulasi transaksi dan lintas modul. Workflow deployment menjalankan pengujian tersebut sebelum publish.
