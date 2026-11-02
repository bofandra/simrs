# SIMRS Baru — Kontrak Workflow Implementasi v0.1

**Status:** draf eksekusi workshop PIC, 2 November 2026. Tidak menggantikan PRD, DDL rinci, SOP, UAT klinis, audit keamanan atau validasi regulasi.

## Arsitektur & batasan demo

Arsitektur produksi yang direncanakan: React/TypeScript → Go modular monolith → PostgreSQL; HL7 FHIR R4 Adapter + validator + outbox untuk SATUSEHAT; tanpa dedicated FHIR server.

GitHub Pages menggunakan JavaScript dan localStorage. Tidak terhubung ke PostgreSQL, BPJS, SATUSEHAT, atau transaksi keuangan riil. Peran di demo tidak menegakkan autentikasi ataupun RBAC. Dilarang menggunakan data pasien asli.

## Matriks fitur → kontrak → PIC

| Workspace | PIC | Tabel kandidat | Kunci relasi | Status |
| --- | --- | --- | --- | --- |
| Master Data & Tarif | PIC 1 | master.organization_units, master.service_catalog, master.practitioner_assignments, master.beds | unit_id, practitioner_id, service_id, bed_id | Add-only demo dan guard referensial |
| Rujukan | PIC 3 | clinical.referrals, clinical.referral_responses, encounter.encounters | encounter_id, referral_id | Requested → accepted/rejected |
| BPJS & Klaim | PIC 6 | billing.claims, billing.charges, clinical.diagnoses, encounter.encounters | encounter_id, claim_id | Draft/validated/submitted/returned/revision |
| Clinical Pathway | PIC 3 | clinical.pathway_step_executions, clinical.pathway_variances, clinical.pathway_outcome_assessments (usulan) | encounter_id, pathway_id, step_id | Matriks, bukti, varian, outcome interaktif |
| Perjalanan Pasien E2E | PIC 2/3/4/5/6 | patient, scheduling, encounter, clinical, orders, laboratory, pharmacy, billing | patient_id, encounter_id | Simulasi lintas modul |

Catatan: semua pemetaan tabel adalah kandidat dari blueprint 23 schema/271 tabel. Alur demo tersedia tidak berarti modul sepenuhnya terimplementasi.

## Kontrak Master Data

- Kode unit, layanan, dan bed uppercase, terdiri dari huruf/angka/underscore/dash sepanjang 2–30 karakter, dan unik per koleksi.
- Nama unit/layanan minimal tiga karakter. Unit harus aktif untuk dipakai layanan, bed atau penugasan practitioner.
- Penugasan practitioner-unit tidak boleh duplikat. Tarif wajib integer rupiah non-negatif.
- Fitur yang belum ada: edit/approval, tarif berlaku per periode dan payer, versioning, soft delete, concurrency lock, tenant isolation, database constraints, audit actor.

## Kontrak Rujukan

- Permintaan hanya dari Encounter in-progress; tujuan minimal tiga karakter, alasan minimal delapan karakter.
- Permintaan yang masih aktif ke tujuan yang sama pada Encounter yang sama ditolak untuk menghindari duplikasi.
- Perubahan status hanya requested → accepted atau requested → rejected; hasil final tidak dapat dibalik.
- Belum ada pengiriman FHIR Task, ServiceRequest, CarePlan, eligibility, consent, BPJS, atau pilihan strata/spesialisasi. Kontrak RI/IGD/RJ perlu finalisasi terpisah sesuai kebutuhan nasional.

## Kontrak Klaim BPJS

- Satu draft sintetis per Encounter. Gate validasi: Encounter finished, payer BPJS, diagnosis terkait Encounter tersedia, total charge positif.
- Transisi state: draft → validated → submitted → returned → draft revisi; wajib validasi ulang untuk pengajuan berikutnya.
- Jumlah pada layar hanya total charge internal, bukan tarif INA-CBG ataupun hasil grouping/klaim yang telah disetujui.
- Belum ada SEP, eligibility BPJS, ICD-9-CM/coding lengkap, grouping, dokumen klaim, approvals, bridging, pengajuan real, audit atau rekonsiliasi pembayaran.

## Kontrak hardening produksi (wajib di luar demo)

| Gate | Acceptance criteria |
| --- | --- |
| G-01 Auth & tenancy | RBAC/ABAC, tenant dan organization scope, audit actor-action-time |
| G-02 Master | FK/unique constraints, tariff versioning/effective date, non-destructive correction |
| G-03 Clinical | Legal signing, addenda, template medis, safe discharge dan consent |
| G-04 Penunjang | Order transitions, idempotency, no duplicate release/dispense |
| G-05 Financial | Approval, immutable ledger, separation of billing/claims, refund & reconciliation |
| G-06 Interop | FHIR profile validation, terminology, durable outbox, retries/dead letter |
| G-07 UAT | Positive/negative tests, patient safety, security test dan approval RS/PIC |

## Pembagian pekerjaan 7 PIC + 1 koordinator

1. PIC 1 — master organisasi, lokasi/bed, practitioner, layanan/tarif, consent & core platform.
2. PIC 2 — front office, patient registry, MPI, appointment, antrean, registrasi & admission.
3. PIC 3 — RME RJ/IGD/RI, keperawatan, rujukan, pathway, discharge.
4. PIC 4 — order, LIS, RIS/PACS, HD, rehabilitasi, MCU & transfusi.
5. PIC 5 — farmasi, inventory, CSSD, laundry, gizi, procurement & fasilitas.
6. PIC 6 — billing, pembayaran, penjamin, casemix/klaim BPJS, accounting.
7. PIC 7 — HRIS, mutu, patient safety, analitik, RL/SIRS, API & interoperabilitas.
8. Koordinator — quality gate, lintas PIC, naming PK/FK, event ownership, glossary, freeze spesifikasi.

## Rekomendasi urutan pengembangan

**P0:** master dan Encounter untuk RJ/IGD/RI, auth/tenant, database migrations, API contract.
**P1:** order-LIS-farmasi end-to-end, Rujukan, BPJS/casemix, clinical signature, audit.
**P2:** HD/rehab/MCU/bank darah, mutu, HR, ERP, analytics multi-RS.

**Definition of done** untuk setiap workflow: role/actor, state diagram, aturan validasi + kegagalan, UI, FK/migration, OpenAPI, tests pos-neg, integration tests, security gate, audit, UAT dan keputusan PIC.

## Regression tests

- Unik kode master, referensi unit valid, tarif negatif ditolak, penugasan duplicate ditolak.
- Referral duplicate ditolak dan accepted tidak dapat ditukar ke rejected.
- Klaim tidak dapat lolos jika Encounter belum selesai atau diagnosis/charge/payer belum sesuai.
- Klaim retur menghasilkan draft versi bertambah dan kembali menjalani validasi.
- Reset demo bersih; smoke tests dan Chromium desktop/tablet/mobile mencakup tiga halaman.

## Remaining decision log

Belum ada pengesahan scope per PIC, review SOP dari RS, desain 271 tabel fisik lengkap, validasi seluruh profil FHIR SATUSEHAT, aturan BPJS terbaru, atau audit aksesibilitas/keamanan mendalam. Dokumen ini adalah baseline workshop, bukan persetujuan produksi.
