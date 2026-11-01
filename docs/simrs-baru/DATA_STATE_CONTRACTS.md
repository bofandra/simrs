# SIMRS Baru — Kontrak Data dan Status (Draf Workshop)

**Tanggal:** 1 November 2026. **Sifat:** kontrak demo untuk desain, bukan SOP klinis produksi.

Data bersama memiliki jalur kunci: `patient.patients` → `encounter.encounters`; `scheduling.appointments` → `scheduling.queue_tickets`; `orders.service_orders` → `laboratory.lab_orders`; `pharmacy.prescriptions` → `inventory.stock_movements`; `billing.charges` → `billing.invoices` → `billing.payment_allocations`.

| Aksi demo | Peran simulasi | Prasyarat | Mutasi data / status | Idempotensi |
|---|---|---|---|---|
| Registrasi E2E | Pendaftaran | Identitas dan DPJP valid | Appointment, Queue, Encounter, registrasi demo | Perlu idempotency key backend |
| SOAP, diagnosis, BP | Dokter | Encounter aktif, belum signed | SOAP draft, ICD-10, 2 Observation | Update draft, bukan baris ganda |
| Sign CPPT | Dokter | Draft, diagnosis, BP lengkap | signed + outbox | Tolak repeat/overwrite |
| Order Hb | Dokter | CPPT signed | ServiceRequest/order dan lab ordered | Satu order untuk skenario E2E |
| Specimen → hasil → release | Laboratorium | Transisi berurutan dan hasil valid | LIS state, Observation Hb, DiagnosticReport dan charge | Verifikasi/release ulang ditolak |
| E-resep → verifikasi → dispensing | Dokter/Farmasi | Lab released, stok/lot sesuai | Rx, movement stok, charge | No duplicate dispense |
| Pembayaran | Kasir | Charge ada, nominal positif <= outstanding | payment, allocation, invoice partial/paid | Overpayment ditolak |
| Close encounter | Dokter | Lima tahap selesai dan outstanding nol | Encounter finished + outbox | Double close ditolak |
| Check-in | Pendaftaran | Appointment booked dan tiket belum ada | Queue + checked-in | Double check-in ditolak |
| Asuhan keperawatan | Perawat | Encounter aktif, intervensi dan hasil terisi | nursingNotes completed | Satu catatan completed per encounter pada demo |

**Kebutuhan fase produksi yang belum terimplementasi:** auth dan RBAC; versioned clinical notes, signature legal, audit aktor; multi-tenancy, PostgreSQL FK/constraints/transaction; retry/idempotency keys; visit-date expiry validation, claim BPJS/SATUSEHAT contract validation, UAT dan approval per PIC.

Panel integritas Worklist adalah pemeriksaan read-only atas source collection demo. Tidak menggantikan constraint dan transaksi ACID.