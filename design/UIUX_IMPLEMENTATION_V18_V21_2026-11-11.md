# SIMRS Baru — Implementasi UI/UX V18–V21
**Tanggal:** 11 November 2026
**Status:** Prototype GitHub Pages / data sintetis — bukan UAT atau fitur produksi
**Baseline normatif:** `PRD_SIMRS_Baru_Final_User_Stories_Acceptance_Technical_7PIC_2026-11-06`
**Masterplan:** [UIUX_MASTERPLAN_SIMRS_BARU_2026-11-11.md](./UIUX_MASTERPLAN_SIMRS_BARU_2026-11-11.md)

## Ruang lingkup implementasi
| Tahap | Implementasi sekarang | Sumber |
|---|---|---|
| **V18 — Konsistensi UI** | Satu layer token CSS aktif setelah V17: warna semantic, focus ring, panel/card, tabel, form, sidebar terang, CTA utama teal, dan breakpoint 1100/700/390. Tidak menghapus sistem lama yang masih dipakai JS. | `public/ui-preview/unified-workspaces-v18.css`, `design/design_tokens.json` |
| **V19 — Klinis** | Panduan konteks kerja yang menampilkan pekerjaan dipilih, informasi patient/encounter sintetis bila tersedia, pemeriksaan identitas, guardrail SOAP/asuhan/triase/visite/radiologi, urutan aktivitas per role. | `public/ui-preview/workflow-context-v19-v20.js` |
| **V20 — Operasional** | Urutan kerja read-only untuk pendaftaran, bed, laboratorium, farmasi, billing, casemix, mutu/manajemen, integrasi, admin, radiologi, MCU. Tidak mengubah status backend atau membuat aksi baru. | `public/ui-preview/workflow-context-v19-v20.js` |
| **V21 — Regression checks** | Tes kontrak Node (escaping, reviewer isolation, role-specific flows, asset linking, no network calls) dan browser smoke (clinical, pharmacy mobile, reviewer). | `tests/workflow-context-v18-v20.test.mjs`, `tests/mockup-smoke.spec.mjs` |

## Mapping layar representatif
| Screen | Kategori | Target role | Implementasi |
|---|---|---|---|
| S02 | Front office | Pendaftaran | Penguatan identitas dan check-in |
| S03 | Klinis | Dokter RJ | Identitas, riwayat, SOAP, order, review |
| S04 | Klinis | Perawat | Asesmen, NCP, evaluasi dan handover |
| S05 | Klinis | Dokter IGD | Triase, observasi, disposisi |
| S06 | Inap/operasional | DPJP RI, Bed Manager | Perawatan dan penempatan |
| S07 | Penunjang | ATLM | Order–spesimen–hasil–verify |
| S08 | Penunjang | Farmasis | Telaah resep dan rencana penyiapan |
| S09 | Keuangan | Kasir, Petugas Billing, Casemix | Charge–invoice–allocation/claim |
| S10 | Manajemen | Manajemen RS, Tim Mutu, Integrasi | Indikator dan exception |
| S11 | Enterprise | Admin Sistem, HR Admin | Hak akses dan SDM |
| S12 | Radiologi | Radiografer, Radiolog | Studi dan laporan |
| S13 | MCU | Petugas MCU, Koordinator MCU | Paket, stasiun dan hasil |

**Catatan penomoran:** S01 adalah login eksisting; tidak diubah karena V18–V21 tidak mengubah mekanisme demo account. Tampilan lain dari total 44 role tetap menggunakan worklist V11 yang sudah tersedia; tidak boleh diklaim telah menjalani audit visual per role hanya karena styling global berlaku.

## Aturan desain dan keselamatan
1. Satu form aktif pada satu waktu (V15); tidak menampilkan seluruh form di satu halaman. Worklist role → detail objek/pasien → form.
2. Segmen alur pada panel merupakan **urutan acuan**, bukan status selesai. Nama pengguna, konteks pasien, encounter, tugas, dan KPI situs tetap *synthetic*.
3. Konteks pasien hanya ditampilkan jika `SIMRSRoleUXV5.selectionContext` memasok data; tidak membuat id pasien atau episode fiktif tambahan.
4. Tidak mengubah role permissions, navigation grants, clinical field definitions, draft keys, order semantics, localStorage workflow atau kontrak API.
5. Tidak ada tanda tangan nyata, release hasil, dispensing, mutasi stok, transfer bed, billing, klaim, BPJS, SATUSEHAT/FHIR, DICOM/PACS, atau transaksi finansial yang diaktifkan.
6. Reviewer/QA (`reviewer.demo`) tetap memperoleh katalog dan tidak mendapat panel spesifik pekerja.

## Validasi
- CI Node: `node --test tests/*.test.mjs`.
- Browser: `npx playwright test --config=tests/playwright.config.mjs`.
- GitHub Pages hanya mengambil `public/ui-preview/` melalui workflow deploy aktif.
- Manual UAT pada 390×844, 980×800 dan 1440×900, zoom 200%, keyboard, screen reader, dan audit kontras **masih diperlukan**; tes otomatis bukan pengganti UAT.
- Untuk tim reviewer: login `akun.dokter-rj`, `akun.perawat`, `akun.dokter-igd`, `akun.atlm`, `akun.farmasis`, `akun.kasir`, dan `reviewer.demo`, lalu periksa role restriction, panel alur, konteks, toggle Tabel/Kartu, draft/validation.

## Gap yang tetap terbuka
- **UX-001** Konsolidasi fisik file CSS historis V8–V17 ke komponen yang lebih modular; V18 menyediakan satu layer akhir tetapi belum menghapus kode warisan.
- **UX-002–015** Penerimaan semua workflow 44 role, negative authorization backend, traceability field-to-DTO-to-DB, real data/API, usability testing dan SOP.
- Rekonsiliasi desain resmi SATUSEHAT belum terverifikasi; token V18 **bukan** token resmi SATUSEHAT.
- Target bentuk akhir untuk setiap screenshot S01–S13 belum diverifikasi *side-by-side* melalui human visual approval; V18–V20 adalah peningkatan bertahap, bukan klaim pixel parity.

**Langkah merger:** merge PR hanya setelah seluruh GitHub Actions yang diperlukan berhasil. Setelah deployment, lakukan visual review terhadap galeri 13 referensi dan hasil screenshot dari akun masing-masing.
