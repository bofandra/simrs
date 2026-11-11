# SIMRS Baru — UI/UX V40–V42: Audit 13 Layar, Penyelarasan Visual dan Pemulihan Error Form

Tanggal: 11 November 2026. **Acuan normatif tetap** \`PRD_SIMRS_Baru_Final_User_Stories_Acceptance_Technical_7PIC_2026-11-06\` (Bab 1–12 di PRD v1.1), dengan ekstensi Bab 13 hanya untuk subform yang telah disepakati. Ini **prototipe statis dengan data sintetis**, bukan sistem RS produksi.

## 1. Referensi dan batas evaluasi

Referensi gambar sudah di repo: [13 PNG desktop 1600×1000](references/simrs-uiux-mockups-2026-11/README.md), termasuk [contact sheet](references/simrs-uiux-mockups-2026-11/role-screens/contact_sheet.png). Dibandingkan dengan \`public/ui-preview/index.html\` yang memuat lapisan UI V4–V39. Galeri gambar adalah **contoh komposisi**, bukan spesifikasi field atau bukti bahwa fungsi backend tersedia.

**Temuan visual yang dapat dibuktikan dari CSS dan contact sheet:** S02–S13 pada referensi konsisten menggunakan sidebar vertikal **navy** dengan menu aktif **teal**, tetapi \`unified-workspaces-v18.css\` menimpa sidebar staf menjadi **putih**. V40 memperbaiki cascade terakhir untuk seluruh akun operasional tanpa mengubah menu atau izin, mengembalikan hirarki navigasi navy–teal dan kontras tab aktif. Login S01 sudah memakai panel identitas teal dan pemilihan akun demo; struktur aslinya dipertahankan.

### Audit struktural per screen family

Status di bawah adalah **audit heuristik komposisi awal**, bukan skor pixel parity dan bukan hasil UAT klinis. Kata *parsial* berarti pola worklist/konteks sudah ada tetapi komposisi dan field dalam screenshot belum semuanya tertutup pada satu layar.

| ID | Referensi desain (berkas pada role-screens/) | Target komposisi | Kondisi kode V39 dan perubahan V40–V42 | Gap desain berikutnya |
|---|---|---|---|---|
| S01 | 01_login.png | Brand kiri, card kredensial kanan, akun demo di bawah | Struktur login tetap; V42 menangkap snapshot login | Uji kontras/zoom dan alur error login |
| S02 | 02_front.png | MPI, form registrasi, antrean dan worklist | Role-first pendaftaran + form kontekstual; sidebar navy dipulihkan | Tampilan berdampingan untuk MPI/antrean; validasi duplicate dan error state |
| S03 | 03_doctor.png | Daftar pasien, SOAP, keselamatan/alergi | Role-first dokter + SOAP bertahap, pasien/encounter sintetis, fokus error form | Ringkasan longitudinal, handoff hasil kritis, chart context |
| S04 | 04_nurse.png | TTV, asuhan keperawatan, checklist shift | Role-first perawat + subform TTV/NCP; styling konsisten | Respons abnormal value dan handover per shift |
| S05 | 05_igd.png | Tracker acuity, timeline/tindakan, triase kanan | Role-first IGD + triase/CF-01; styling konsisten | Prioritas dan eskalasi klinis sesuai SOP |
| S06 | 06_beds.png | Bed board grid + request penempatan | Bed Manager worklist dan detail objek bed; styling konsisten | Grid okupansi berbasis state, hold/transfer fail-closed |
| S07 | 07_lab.png | Worklist sampel, hasil, QC/verification | ATLM task-first + form; styling konsisten | Layout split worklist/result dan komunikasi nilai kritis |
| S08 | 08_pharmacy.png | Antrean resep, telaah, stok/lot | Farmasis task-first + form; styling konsisten | Panel rekonsiliasi alergi/lot dan gate dispensing |
| S09 | 09_finance.png | Invoice, alokasi pembayaran, klaim | Kasir/Billing/Casemix role-native + form demo | Komposisi invoice–alokasi dan status reject/reconcile |
| S10 | 10_management.png | KPI card, tren, antrian pengecualian | Manajemen/Mutu role-native dengan data demo | Formula/source/denominator/tren; jangan klaim data realtime |
| S11 | 11_admin.png | Pengguna, role, assignment, audit | Admin role-native dengan form master demo | Audit akses dan denied/tenant boundary memerlukan backend |
| S12 | 12_radiology.png | RIS worklist, viewer/citra dan report | Radiografer/Radiolog role-native + form | DICOM viewer adalah placeholder; verifikasi report tetap gated |
| S13 | 13_mcu.png | Peserta/paket, status pemeriksaan, resume | MCU task-first, wizard form dan status demo | Itinerary, missing-test, resume release sesuai SOP |

### Prioritas keputusan PIC

1. **P0 safety** (PIC1/2/3/4): registrasi, identitas pasien/encounter, SOAP/NCP/triase, spesimen, alergi, aturan izin/denied. Uji wrong-patient, audit, signed immutability.
2. **P1 role-panel fidelity** (PIC3/4/5/6): bed grid, hasil LIS, telaah resep, invoice, RIS/MCU; sebuah screenshot tidak melegalkan tindakan nyata.
3. **P2 analytics/enterprise** (PIC7): KPI lineage, izin/assignment, state integrasi; tanpa klaim data live.
4. **Cross-role QA**: tangkap screenshot semua 13 keluarga pada desktop, sampel tablet/mobile; bandingkan berdampingan terhadap PNG aslinya melalui review manual yang tercatat per PIC.

## 2. V40 — Implementasi visual

- Satu lapisan CSS terakhir \`public/ui-preview/visual-parity-v40.css\`, setelah V37, yang **mengembalikan sidebar navy dan active teal** untuk pengguna staf; reviewer UI/QA tetap memakai layout terpisah.
- Harmonisasi surface, border, line-height, worklist table dan focus outline. Teks status selalu berlabel; warna hanya penunjang.
- Pada 980 px worklist/detail menjadi satu kolom; pada 390 px tabel menggulir di dalam card, bukan halaman. Target sentuh 44 px untuk input pencarian dan aksi penting.
- Penanganan reduced motion tetap tersedia. Token dari referensi **tidak diklaim sebagai token design system resmi**.

## 3. V41 — Perbaikan interaksi dan form

- \`public/ui-preview/visual-parity-v41.js\` memetakan 13 screen family (S01–S13) ke role dan berkas PNG, menggunakan atribut \`data-v40-screen\` / \`data-v40-reference\` untuk QA. Alias role untuk keluarga S09/S10/S12/S13 tidak membuka akses baru.
- Untuk role dengan worklist V25–V34 yang tidak mempunyai kartu empty recovery khusus, pencarian/filter tanpa hasil menampilkan pesan dan tombol **Hapus pencarian dan filter**. Aksi mengubah filter/search saja. V37 tetap memakai mekanismenya sendiri.
- Pada form berizin, status **draft demo**, **baca saja**, dan **akses terbatas** diberi keterangan yang eksplisit; tindakan sign/approve/release existing tetap disabled.
- Validasi \`p0-forms.js\` tetap sumber kebenaran. V41 hanya menambahkan navigasi ke tiap field yang ditandai invalid dengan \`aria-describedby\` dan fokus ke section/form bertahap yang tepat. Setelah mengoreksi, pengguna harus mengulang **Tinjau kelengkapan**. Tidak ada perubahan aturan klinis, pengesahan atau field data.
- Form reviewer UI/QA tidak dihias dengan state staf agar tetap bisa dipakai mengaudit katalog 68 modul.

## 4. V42 — Gate pengujian dan aset review

**Node contract**: \`tests/visual-parity-v40.test.mjs\` memvalidasi mapping 13 PNG, urutan cascade, target fokus dan tidak ada API/privilege baru.

**Browser Chromium**: \`tests/visual-parity-v40.spec.mjs\` mengambil screenshot \`test-results/snapshots/v42-screen-S01*\` hingga \`S13*\` pada desktop 1440×900; menguji UI login dan halaman worklist sesuai role; overflow, script error dan tidak ada request API riil. Tambahan skenario responsive 980/390, empty/search reset, reviewer isolation dan klik link error pada validasi form bertahap. Screenshot dan trace diunggah sebagai artefak \`simrs-ui-smoke-artifacts\` pada workflow Actions.

**Batas keberhasilan:** screenshot adalah *evidence untuk review komposisi*, **bukan otomatis lolos pixel parity**. Manual review oleh PIC dan staf RS diperlukan untuk memberi status Accepted/Needs Change per layar. Tidak ada visual diff numerik terhadap gambar generatif karena label/data contoh dan detail field berbeda.

## 5. Usability test script untuk peninjauan per profesi

| Persona / peran | Tugas yang diuji | Keberhasilan demonstrasi | Negative test |
|---|---|---|---|
| Pendaftaran / S02 | Cari pekerjaan, buka registrasi draft, lengkapi kolom salah | Menemukan form berizin, error kolom terarah, bisa kembali ke daftar | Form salah pasien/duplikasi identitas tidak diasumsikan sah |
| Dokter RJ / S03 | Buka SOAP pada encounter terpilih, perbaiki validasi | Pasien/episode tetap konsisten, review tidak auto-sign | Alergi/konteks pasien tidak dapat dilewati |
| Perawat / S04 | Buka TTV dan kembali ke shift, uji mobile | Satu kegiatan terlihat, tombol dapat dijangkau | Tidak melakukan administrasi obat nyata |
| IGD / S05 | Temukan pasien prioritas dan panduan triase | Indikator dan SOP jelas bertanda simulasi | Tidak ada triase otomatis yang dianggap final |
| ATLM / S07 | Temukan sampel, tinjau validasi hasil | Identitas order dan izin jelas | Tidak release critical result |
| Farmasis / S08 | Telaah draft resep dan lot | Kerja berdasarkan antrean pasien yang benar | Tidak ada dispensing/stock movement nyata |
| Kasir / S09 | Buka tagihan dan cek pembayaran | Form pembayaran hanya demo | Tidak memposting uang atau klaim |
| Admin / S11 | Tinjau role dan penugasan | Denied dan akun terbatas terbaca | Tidak menjadi superuser lintas tenant |
| MCU / S13 | Tinjau pekerjaan paket peserta | Kelengkapan dan status draft terbaca | Tidak membuka resume tanpa approval |

**Metode UAT berikutnya:** uji desktop/tablet/mobile, keyboard, zoom 200%, pemahaman label serta skenario error, ukur task completion dan waktu penyelesaian; kumpulkan evidence dan sign-off per PIC. Referensi WCAG 2.2 AA tetap target tetapi tidak diklaim sudah terbukti hanya oleh browser smoke.

## 6. Tindakan yang tetap terlarang

Tidak ada implementasi produksi, autentikasi pasien riil, consent, pembayaran, dispensing, mutasi stok, release bed/lab/darah, sign klinis, submission klaim, SIRS/RL resmi, FHIR/SATUSEHAT, atau bridging BPJS. Form mockup hanya mengubah data sintetis di browser.
