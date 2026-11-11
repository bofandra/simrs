# SIMRS Baru — V22–V24 Role-first Entry & Task Continuity
**Tanggal:** 11 November 2026  
**Baseline:** `PRD_SIMRS_Baru_Final_User_Stories_Acceptance_Technical_7PIC_2026-11-06`  
**Status:** Prototipe statis dengan data sintetis, bukan implementasi produksi.

## Masalah UI/UX yang ditutup
Sebelumnya tiga role (**Pendaftaran, Dokter RJ, Perawat**) masuk ke layar prototipe lama setelah login, sedangkan role lainnya langsung ke beranda tugas profesi. Ini membuat navigasi tidak konsisten, tidak sesuai alur target login → worklist → detail → form.

## Implementasi
| Tahap | Perubahan | Tes |
|---|---|---|
| V22 — Role-first | Semua 44 akun staf masuk `rolehome`. Tidak ada *legacy landing* untuk Pendaftaran, Dokter RJ, Perawat. `reviewer.demo` tetap masuk halaman generik khusus QA/katalog. | `tests/role-demo-login.test.mjs`, Playwright V22 |
| V23 — Form continuity | Di form yang dibuka oleh akun profesi, tampil konteks role, kode modul dan `work_item_id` bila tersedia. Aksi **Kembali ke daftar kerja** mengembalikan section dan item terpilih, bukan reset ke daftar awal. Tombol **Ke isian form** memfokuskan kontrol yang terlihat dan aktif. | Playwright V23 |
| V24 — Mobile/negative regression | Tindakan kembali bekerja di lebar 390 px; reviewer tidak mendapat bar konteks; tidak ada request API/transaksi tambahan; fokus dikembalikan ke detail pekerjaan setelah navigasi balik. | Playwright V24 |

## Kontrak yang dipertahankan
- Menu dan kode formulir tetap mengikuti **44 role**, 68 modul, 12 workflow dan 7 PIC dari PRD baseline.
- Hanya satu form kontekstual yang aktif pada satu waktu; tidak membuka katalog penuh untuk petugas biasa.
- Form tidak menciptakan order klinis, sign, release, pembayaran, klaim, dispensing, mutasi stok atau pengiriman SATUSEHAT/BPJS.
- Semua data contoh disimpan lokal; tidak ada data pasien sungguhan, auth server atau perubahan hak akses produksi.
- Field klinis, id pasien/encounter, storage draft, dan kewenangan `allowModule` tidak berubah.
- Form yang dibuka role harus tetap berasal dari worklist dan konteks item yang sah; bar kembali tidak meningkatkan hak akses.

## Batasan & QA lanjutan
- Visual parity terhadap 13 gambar referensi masih membutuhkan manual QA; perubahan ini terutama menyelesaikan *routing* dan *task continuity*.
- Keyboard/focus pada browser dan screen reader tetap membutuhkan review manual WCAG 2.2 AA.
- `backToWorklist` mempertahankan state pilihan pada sesi demo yang sama, bukan menyimpan navigasi antar perangkat.
- Lakukan Playwright serta `node --test tests/*.test.mjs` dan konfirmasi Pages hanya setelah kedua job CI lulus.
