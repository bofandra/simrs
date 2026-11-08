# Role–Screen–Module–FR–Workflow Matrix — SIMRS Baru v4

**Design baseline:** `PRD_SIMRS_Baru_Final_User_Stories_Acceptance_Technical_7PIC_2026-11-06.docx`.
**Repository scope:** Static GitHub Pages UX prototype only. This file documents intended navigation, not a statement of implemented production authorization.
**Principle:** Users see **worklists** and task pages; form modules are invoked by actions within worklists, not exposed as a generic catalogue in the left navigation.

## Constraints
- Login does not ask the user to choose profession or role. All 42 operational accounts are synthetic, with a separate QA reviewer.
- Permissions depend on authenticated identity, organization, unit, practitioner assignment, care relationship, access policies and operation. The mockup's client-side checks are illustrative only.
- The `role-workspace-v4.js` profile mapping is the single source for the UI role-specific menu and this traceability document.
- Module buttons are disabled when the role-to-module catalogue mapping does not permit access. Never silently expand access rights to satisfy the demo.
- Signing, release, dispense, ledger posting, refunds, partner submission and official reporting remain inactive without the PRD's SOP/UAT gates.
- P2/P3 features can be *represented* as conceptual screens but are not to be assumed live at MVP.
- Some supporting worklists mapped to a workflow are illustrative rather than explicitly enumerated as separate workflow steps in chapter 6.
- Form engine, detailed worklist evidence, comprehensive field specifications and state gates still require individual screen-by-screen design and testing.

## Coverage

- **44** role demo operasional dengan **153** area/menu kerja.
- **68/68** modul PRD final terwakili pada setidaknya satu area kerja.
- **12** workflow PRD tetap menjadi alur acuan. Tidak semua pekerjaan pendukung adalah langkah workflow eksplisit.
- Bed Manager dan Petugas Billing ditambahkan sebagai role berbeda demi separation of duties: alokasi bed (OPS-10) tidak dibebankan kepada DPJP; charge capture (FIN-01) tidak otomatis menjadi hak Kasir.
- Coverage desain **bukan** bukti form sudah implementable untuk semua role. Bila form catalogue belum memberi akses, tombol tetap dinonaktifkan.

## Matrix by role
| Role | Unit / scope | Screen (menu) | Modul PRD | FR | Workflow |
|---|---|---|---|---|---|
| Pendaftaran | Loket pendaftaran | Identitas pasien | `CORE-08` | FR-004 | WF-01 |
| Pendaftaran | Loket pendaftaran | Registrasi kunjungan | `CORE-09` | FR-006 | WF-01 |
| Pendaftaran | Loket pendaftaran | Janji temu | `CORE-10` | FR-005 | WF-01 |
| Pendaftaran | Loket pendaftaran | Antrean layanan | `CORE-11` | FR-007 | WF-01 |
| Dokter RJ | Poliklinik / dokter | Daftar pasien poli | `RME-01` | FR lintas domain | WF-02 |
| Dokter RJ | Poliklinik / dokter | Asesmen dan SOAP | `RME-04` | FR-009 | WF-02 |
| Dokter RJ | Poliklinik / dokter | Diagnosis dan tindakan | `RME-06` | FR lintas domain | WF-02 |
| Dokter RJ | Poliklinik / dokter | Order pemeriksaan | `RME-08` | FR-016 | WF-05 |
| Dokter RJ | Poliklinik / dokter | Resep elektronik | `MED-04` | FR-020 | WF-07 |
| Dokter RJ | Poliklinik / dokter | Surat dan resume | `RME-11` | FR-013 | WF-02 |
| Dokter IGD | Instalasi Gawat Darurat | Pasien dan triase | `RME-02` | FR-010 | WF-03 |
| Dokter IGD | Instalasi Gawat Darurat | Observasi klinis | `RME-05` | FR-034 | WF-03 |
| Dokter IGD | Instalasi Gawat Darurat | Order pemeriksaan | `RME-08` | FR-016 | WF-05 |
| Dokter IGD | Instalasi Gawat Darurat | Keputusan disposisi | `RME-02` | FR-010 | WF-03 |
| Dokter IGD | Instalasi Gawat Darurat | Rujukan pasien | `RME-10` | FR-014 | WF-09 |
| DPJP Rawat Inap | Bangsal rawat inap | Daftar pasien dirawat | `RME-03` | FR-011 | WF-04 |
| DPJP Rawat Inap | Bangsal rawat inap | Visite dan CPPT | `RME-04` | FR-009 | WF-04 |
| DPJP Rawat Inap | Bangsal rawat inap | Care plan dan tim | `RME-09` | FR-012 | WF-04 |
| DPJP Rawat Inap | Bangsal rawat inap | Order dan tindakan | `RME-08` | FR-016 | WF-05 |
| DPJP Rawat Inap | Bangsal rawat inap | Persiapan pulang | `RME-03` | FR-011 | WF-04 |
| DPJP Rawat Inap | Bangsal rawat inap | Resume medis | `RME-11` | FR-013 | WF-04 |
| DPJP Rawat Inap | Bangsal rawat inap | Clinical pathway | `ENT-04` | FR-015 | WF-12 |
| Perawat | Keperawatan / ruang perawatan | Pasien shift ini | `RME-07` | FR-012 | WF-04 |
| Perawat | Keperawatan / ruang perawatan | TTV dan asesmen | `RME-05` | FR-034 | WF-04 |
| Perawat | Keperawatan / ruang perawatan | Asuhan keperawatan | `RME-07` | FR-012 | WF-04 |
| Perawat | Keperawatan / ruang perawatan | CPPT dan serah terima | `RME-04` | FR-009 | WF-04 |
| Perawat HD | Hemodialisis | Daftar sesi HD | `MED-08` | FR-019 | WF-04 |
| Perawat HD | Hemodialisis | Observasi pra dan intra HD | `MED-08` | FR-019 | WF-04 |
| Perawat HD | Hemodialisis | Asuhan dan serah terima | `RME-07` | FR-012 | WF-04 |
| Terapis Rehabilitasi | Rehabilitasi medik | Jadwal terapi | `MED-09` | FR-019 | WF-02 |
| Terapis Rehabilitasi | Rehabilitasi medik | Catatan sesi | `MED-09` | FR-019 | WF-02 |
| Terapis Rehabilitasi | Rehabilitasi medik | Evaluasi outcome | `MED-09` | FR-019 | WF-02 |
| ATLM | Laboratorium | Worklist pemeriksaan | `MED-01` | FR-017 | WF-05 |
| ATLM | Laboratorium | Penerimaan spesimen | `MED-01` | FR-017 | WF-05 |
| ATLM | Laboratorium | Hasil pemeriksaan | `MED-01` | FR-034 | WF-05 |
| ATLM | Laboratorium | Verifikasi dan nilai kritis | `MED-01` | FR-017 | WF-05 |
| Petugas MCU | Pelayanan MCU | Daftar peserta MCU | `MED-10` | FR-019 | WF-05 |
| Petugas MCU | Pelayanan MCU | Progress pemeriksaan | `MED-10` | FR-019 | WF-05 |
| Petugas MCU | Pelayanan MCU | Kelengkapan hasil | `MED-10` | FR-019 | WF-05 |
| Radiografer | Instalasi radiologi | Worklist radiologi | `MED-02` | FR-018 | WF-06 |
| Radiografer | Instalasi radiologi | Pelaksanaan pemeriksaan | `MED-02` | FR-018 | WF-06 |
| Radiografer | Instalasi radiologi | Status citra dan studi | `MED-02` | FR-018 | WF-06 |
| Radiolog | Instalasi radiologi / ekspertise | Daftar studi dilaporkan | `MED-02` | FR-018 | WF-06 |
| Radiolog | Instalasi radiologi / ekspertise | Viewer PACS | `MED-03` | FR-018 | WF-06 |
| Radiolog | Instalasi radiologi / ekspertise | Laporan ekspertise | `MED-02` | FR-018 | WF-06 |
| Farmasis | Instalasi farmasi | Antrean resep | `MED-04` | FR-020 | WF-07 |
| Farmasis | Instalasi farmasi | Verifikasi resep | `MED-04` | FR-037 | WF-07 |
| Farmasis | Instalasi farmasi | Penyiapan obat | `MED-05` | FR-021 | WF-07 |
| Farmasis | Instalasi farmasi | Penyerahan dan riwayat | `MED-05` | FR-036 | WF-07 |
| Koordinator MCU | Koordinasi MCU | Paket dan peserta | `MED-10` | FR-019 | WF-05 |
| Koordinator MCU | Koordinasi MCU | Progress dan laporan | `MED-10` | FR-019 | WF-05 |
| Petugas Bank Darah | Bank darah | Permintaan darah | `MED-12` | FR-019 | WF-05 |
| Petugas Bank Darah | Bank darah | Kecocokan dan stok | `MED-12` | FR-019 | WF-05 |
| Petugas Bank Darah | Bank darah | Serah terima produk | `MED-12` | FR-019 | WF-05 |
| Dokter Anestesi | Anestesi / perioperatif | Asesmen pra-anestesi | `MED-07` | FR lintas domain | WF-10 |
| Dokter Anestesi | Anestesi / perioperatif | Intra-operatif | `MED-07` | FR lintas domain | WF-10 |
| Dokter Anestesi | Anestesi / perioperatif | Pemulihan PACU | `MED-07` | FR lintas domain | WF-10 |
| Koordinator OK | Kamar operasi | Jadwal operasi | `MED-06` | FR lintas domain | WF-10 |
| Koordinator OK | Kamar operasi | Checklist keselamatan | `MED-06` | FR lintas domain | WF-10 |
| Koordinator OK | Kamar operasi | Status operasi | `MED-06` | FR lintas domain | WF-10 |
| Ahli Gizi | Gizi klinis | Daftar konsultasi gizi | `MED-11` | FR-024 | WF-11 |
| Ahli Gizi | Gizi klinis | Order diet pasien | `MED-11` | FR-024 | WF-11 |
| Ahli Gizi | Gizi klinis | Monitoring intervensi | `MED-11` | FR-024 | WF-11 |
| Gudang | Gudang logistik | Saldo dan lot stok | `OPS-01` | FR-022 | WF-07 |
| Gudang | Gudang logistik | Permintaan barang | `OPS-01` | FR-036 | WF-07 |
| Gudang | Gudang logistik | Penerimaan barang | `OPS-01` | FR-022 | WF-07 |
| Gudang | Gudang logistik | Selisih dan koreksi | `OPS-01` | FR-036 | WF-07 |
| Petugas CSSD | Central Sterile Supply Department | Penerimaan instrumen | `OPS-03` | FR-023 | WF-10 |
| Petugas CSSD | Central Sterile Supply Department | Siklus sterilisasi | `OPS-03` | FR-023 | WF-10 |
| Petugas CSSD | Central Sterile Supply Department | Set steril siap serah | `OPS-03` | FR-023 | WF-10 |
| Petugas Dapur | Produksi makanan pasien | Permintaan tray | `OPS-05` | FR-024 | WF-11 |
| Petugas Dapur | Produksi makanan pasien | Produksi batch | `OPS-05` | FR-024 | WF-11 |
| Petugas Dapur | Produksi makanan pasien | Pengiriman makanan | `OPS-05` | FR-024 | WF-11 |
| Petugas Laundry | Laundry / Linen | Penerimaan linen | `OPS-04` | FR-023 | WF-10 |
| Petugas Laundry | Laundry / Linen | Proses pencucian | `OPS-04` | FR-023 | WF-10 |
| Petugas Laundry | Laundry / Linen | Selisih dan serah terima | `OPS-04` | FR-023 | WF-10 |
| Pengadaan | Pengadaan dan pembelian | Permintaan pembelian | `OPS-02` | FR-022 | WF-07 |
| Pengadaan | Pengadaan dan pembelian | Penawaran dan vendor | `OPS-02` | FR-045 | WF-07 |
| Pengadaan | Pengadaan dan pembelian | Purchase order | `OPS-02` | FR-045 | WF-07 |
| Pengadaan | Pengadaan dan pembelian | Penerimaan barang | `OPS-02` | FR-022 | WF-07 |
| Petugas Aset | Manajemen aset | Inventaris aset | `OPS-06` | FR-044 | WF-10 |
| Petugas Aset | Manajemen aset | Mutasi aset | `OPS-06` | FR-044 | WF-10 |
| Petugas Aset | Manajemen aset | Riwayat pemakaian | `OPS-06` | FR-044 | WF-10 |
| Teknisi | Pemeliharaan alat | Tiket maintenance | `OPS-07` | FR-044 | WF-10 |
| Teknisi | Pemeliharaan alat | Jadwal kalibrasi | `OPS-07` | FR-044 | WF-10 |
| Teknisi | Pemeliharaan alat | Hasil pekerjaan | `OPS-07` | FR-044 | WF-10 |
| Petugas Fasilitas | Fasilitas / housekeeping | Tugas kebersihan | `OPS-08` | FR lintas domain | WF-04 |
| Petugas Fasilitas | Fasilitas / housekeeping | Perbaikan sarana | `OPS-08` | FR lintas domain | WF-04 |
| Petugas Fasilitas | Fasilitas / housekeeping | Kesiapan ruang | `OPS-08` | FR lintas domain | WF-04 |
| Koordinator Transport | Transport pasien / ambulans | Permintaan transport | `OPS-09` | FR lintas domain | WF-03 |
| Koordinator Transport | Transport pasien / ambulans | Alokasi armada | `OPS-09` | FR lintas domain | WF-03 |
| Koordinator Transport | Transport pasien / ambulans | Status perjalanan | `OPS-09` | FR lintas domain | WF-03 |
| Kasir | Loket kasir | Daftar tagihan | `FIN-02` | FR-026 | WF-08 |
| Kasir | Loket kasir | Terima pembayaran | `FIN-03` | FR-026 | WF-08 |
| Kasir | Loket kasir | Kuitansi dan riwayat | `FIN-03` | FR-026 | WF-08 |
| Casemix | Casemix dan klaim | Berkas casemix | `FIN-06` | FR-027 | WF-08 |
| Casemix | Casemix dan klaim | Grouping INA-CBG | `FIN-06` | FR-027 | WF-08 |
| Casemix | Casemix dan klaim | Kelengkapan klaim | `FIN-07` | FR-027 | WF-08 |
| Petugas BPJS | Administrasi BPJS | Eligibilitas dan SEP | `FIN-05` | FR-027 | WF-08 |
| Petugas BPJS | Administrasi BPJS | Kontrol dan bridging | `FIN-05` | FR-027 | WF-08 |
| Petugas BPJS | Administrasi BPJS | Status dan pengecualian | `FIN-05` | FR-027 | WF-08 |
| Petugas BPJS | Administrasi BPJS | Coverage dan eligibility | `FIN-04` | FR-027 | WF-08 |
| Coder | Coding klinis | Daftar berkas coding | `FIN-06` | FR-027 | WF-08 |
| Coder | Coding klinis | Diagnosis dan prosedur | `FIN-06` | FR-027 | WF-08 |
| Coder | Coding klinis | Review dan grouping | `FIN-06` | FR-027 | WF-08 |
| Akuntan | Keuangan / akuntansi | Jurnal akuntansi | `FIN-08` | FR-028 | WF-08 |
| Akuntan | Keuangan / akuntansi | Rekonsiliasi akun | `FIN-08` | FR-028 | WF-08 |
| Akuntan | Keuangan / akuntansi | Piutang dan utang | `FIN-09` | FR-028 | WF-08 |
| Budget Owner | Pengelola anggaran | Anggaran unit | `FIN-10` | FR-028 | WF-08 |
| Budget Owner | Pengelola anggaran | Permintaan persetujuan | `FIN-10` | FR-028 | WF-08 |
| Budget Owner | Pengelola anggaran | Realisasi anggaran | `FIN-10` | FR-028 | WF-08 |
| Analis Biaya | Unit costing | Profil biaya layanan | `FIN-11` | FR-033 | WF-08 |
| Analis Biaya | Unit costing | Analisis unit cost | `FIN-11` | FR-044 | WF-08 |
| Analis Biaya | Unit costing | Review anomali biaya | `FIN-11` | FR-044 | WF-08 |
| Manajemen RS | Direksi / manajemen RS | Ringkasan operasional | `ENT-10` | FR-031 | WF-12 |
| Manajemen RS | Direksi / manajemen RS | Mutu dan keselamatan | `ENT-08` | FR-030 | WF-12 |
| Manajemen RS | Direksi / manajemen RS | Laporan manajemen | `ENT-09` | FR-031 | WF-12 |
| Manajemen RS | Direksi / manajemen RS | Kinerja antar unit | `ENT-10` | FR-031 | WF-12 |
| Tim Mutu | Unit mutu | Indikator mutu | `ENT-08` | FR-030 | WF-12 |
| Tim Mutu | Unit mutu | Insiden keselamatan | `ENT-06` | FR-030 | WF-12 |
| Tim Mutu | Unit mutu | Manajemen risiko | `ENT-07` | FR-030 | WF-12 |
| Tim Mutu | Unit mutu | Pelaporan mutu | `ENT-09` | FR-031 | WF-12 |
| Integrasi | Tim interoperabilitas | Antrean pengiriman | `ENT-11` | FR-032 | WF-09 |
| Integrasi | Tim interoperabilitas | ACK dan kegagalan | `ENT-11` | FR-032 | WF-09 |
| Integrasi | Tim interoperabilitas | Rekonsiliasi status | `ENT-11` | FR-032 | WF-09 |
| Admin Sistem | Administrasi SIMRS | Pengguna dan akses | `CORE-02` | FR-002 | WF-01 |
| Admin Sistem | Administrasi SIMRS | Organisasi dan unit | `CORE-03` | FR-001 | WF-01 |
| Admin Sistem | Administrasi SIMRS | Praktisi dan kewenangan | `CORE-04` | FR lintas domain | WF-01 |
| Admin Sistem | Administrasi SIMRS | Layanan dan tarif | `CORE-06` | FR-003 | WF-08 |
| Admin Sistem | Administrasi SIMRS | Terminologi | `CORE-07` | FR-003 | WF-02 |
| Admin Sistem | Administrasi SIMRS | Consent dan audit | `CORE-12` | FR-008 | WF-01 |
| Admin Sistem | Administrasi SIMRS | Tenant dan organisasi | `CORE-01` | FR-001 | WF-01 |
| Admin Sistem | Administrasi SIMRS | Master lokasi dan bed | `CORE-05` | FR lintas domain | WF-04 |
| HR Admin | Administrasi SDM | Data pegawai | `ENT-01` | FR-029 | WF-01 |
| HR Admin | Administrasi SDM | Penugasan staf | `ENT-01` | FR-046 | WF-01 |
| HR Admin | Administrasi SDM | Kompetensi dan dokumen | `ENT-01` | FR-029 | WF-01 |
| Payroll Admin | Penggajian | Rekap kehadiran | `ENT-02` | FR-029 | WF-01 |
| Payroll Admin | Penggajian | Komponen payroll | `ENT-02` | FR-029 | WF-01 |
| Payroll Admin | Penggajian | Validasi dan selisih | `ENT-02` | FR-029 | WF-01 |
| Rekruter | Rekrutmen | Lamaran masuk | `ENT-03` | FR-029 | WF-01 |
| Rekruter | Rekrutmen | Tahapan seleksi | `ENT-03` | FR-046 | WF-01 |
| Rekruter | Rekrutmen | Evaluasi kandidat | `ENT-03` | FR-046 | WF-01 |
| Tim PPI | Pencegahan dan pengendalian infeksi | Surveilans HAIs | `ENT-05` | FR-030 | WF-12 |
| Tim PPI | Pencegahan dan pengendalian infeksi | Tindak lanjut PPI | `ENT-05` | FR-030 | WF-12 |
| Tim PPI | Pencegahan dan pengendalian infeksi | Indikator pencegahan | `ENT-08` | FR-030 | WF-12 |
| Pasien Demo | Portal pasien | Janji temu saya | `CORE-10` | FR-005 | WF-01 |
| Pasien Demo | Portal pasien | Dokumen saya | `RME-12` | FR-039 | WF-01 |
| Petugas Billing | Unit billing / charge capture | Tindakan siap ditagihkan | `FIN-01` | FR-025 | WF-08 |
| Petugas Billing | Unit billing / charge capture | Charge capture | `FIN-01` | FR-025 | WF-08 |
| Petugas Billing | Unit billing / charge capture | Invoice draft | `FIN-02` | FR-026 | WF-08 |
| Bed Manager | Manajemen tempat tidur | Ketersediaan bed | `OPS-10` | FR-011 | WF-04 |
| Bed Manager | Manajemen tempat tidur | Permintaan alokasi | `OPS-10` | FR-011 | WF-04 |
| Bed Manager | Manajemen tempat tidur | Transfer dan pelepasan | `OPS-10` | FR-011 | WF-04 |

## Key separation-of-duties decisions

1. **Kasir:** invoice and payment only (FIN-02/FIN-03). Claim submission (FIN-07), AR (FIN-09), tariff administration (CORE-06) and BPJS bridging (FIN-05) belong to different workflows/roles.
2. **Farmasis vs Gudang:** drug review/dispensing (MED-04/05) and inventory ledger (OPS-01) use separate role menus.
3. **Dokter RJ:** clinical tabs and actions are scoped to the current encounter; no global patient-registration or cashier navigation.
4. **Perawat:** observations and nursing care only; an administration checklist must not be treated as automatic authorization to dispense.
5. **Dokter IGD vs DPJP RI:** triage/disposition is separated from admission/bed/discharge.
6. **Radiografer vs Radiolog:** procedure execution and study reporting are distinct; PACS access requires authorized patient/order context.
7. **Coder vs clinician:** coding can suggest revisions/clarification but cannot change signed clinical diagnoses.
8. **Admin Sistem vs Integrasi:** account/master/consent scope and delivery-monitoring duties are not automatically interchangeable.
9. **Patient portal:** only own appointments and released documents; no staff workspaces.
10. **Manajemen:** read-model KPIs require approved indicator definitions, source lineage, freshness and tenant-safe access.

## QA / remaining work
- Check all 44 login accounts, unique role sidebars and section navigation.
- Check every module CTA against the existing demo form catalogue permissions.
- Check negative access cases and reviewer QA isolation.
- Complete high-fidelity detailed worklist/field designs (particularly IGD, RI, LIS, RIS, pharmacy, finance) and align data states before any production implementation.
