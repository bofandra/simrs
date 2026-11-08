# SIMRS Baru — Role-Native Worklist to Detail (V5)

Tanggal: 9 November 2026  
**Baseline resmi:** PRD_SIMRS_Baru_Final_User_Stories_Acceptance_Technical_7PIC_2026-11-06  
Ruang lingkup: prototipe GitHub Pages saja, bukan sistem produksi.

## Hasil yang diterapkan

Alur **login per role → daftar kerja operasional → pemilihan baris → konteks dan checklist → form berdasarkan modul dan izin** untuk tujuh peran berikut:

| Role | Halaman konteks | Modul dan workflow terkait |
|---|---|---|
| Pendaftaran | Identitas, check-in, booking, antrean | CORE-08/09/10/11; WF-01 |
| Dokter RJ | Pasien poli, SOAP, diagnosis, order, resep, dokumen | RME-01/04/06/08/11, MED-04; WF-02/05/07 |
| Perawat | Pasien shift, tanda vital, asuhan, CPPT/handover | RME-05/07/04; WF-04 |
| Dokter IGD | Triase, observasi, order, disposisi, rujukan | RME-02/05/08/10; WF-03/05/09 |
| Farmasis | Resep masuk, telaah, penyiapan, rencana serah terima | MED-04/05; WF-07 |
| Kasir | Tagihan, rencana pembayaran, kuitansi | FIN-02/03; WF-08 |
| Bed Manager | Ketersediaan, permintaan alokasi, transfer/pelepasan | OPS-10; WF-04 |

Jumlah menu per role dan mapping modul/FR/workflow bersumber dari ROLE_SCREEN_FR_WORKFLOW_MATRIX_V4_2026-11-08.md, yang mengacu pada PRD final 6 November 2026. Seluruh 44 profil role dan 68 modul tetap pada v4; V5 **tidak memperluas izin**.

## Perilaku UI

1. Login tetap menggunakan satu akun per role tanpa memilih profesi lagi.
2. Untuk Pendaftaran, Dokter RJ, dan Perawat, workspace operasional v2 tetap menjadi landing page. Menu "Beranda" dan submenu tugas memberi akses ke worklist detail V5. Untuk Farmasis, IGD, Kasir, dan Bed Manager, V5 menjadi beranda dan subhalaman kerja awal.
3. Klik "Lihat detail" memilih satu baris sintetis; panel kanan berubah sesuai kasus dan tahapan kerja.
4. Pencarian memfilter baris berdasarkan nomor, objek pekerjaan, maupun status; layar kosong memiliki pesan tersendiri.
5. Checklist menunjukkan pemeriksaan operasional yang lazim dilakukan sebelum membuka form, bukan tindakan tersimpan.
6. Tombol "Buka form" hanya muncul jika canOpen(modul) menyatakan role memiliki akses menurut katalog demo. Jika tidak, ditampilkan "Form belum tersedia".
7. Pada mobile, panel detail berada di bawah tabel; tabel tetap dapat digulir horizontal. Filter dan aksi memiliki label.

## Batasan yang sengaja dipertahankan

- Semua nama, identitas, prioritas, daftar tugas, angka, order, resep, bed dan invoice adalah **data sintetis**.
- Nomor item yang dipilih **belum** tersambung otomatis ke patient_id, encounter_id, prescription_id, invoice_id, atau bed assignment pada editor form lama; UI menyampaikan keterbatasan ini secara eksplisit.
- Tidak ada backend RBAC, otorisasi provider, audit log immutabel, penyimpanan pasien asli, maupun sign klinis, dispensing, mutasi stok, reservasi tempat tidur, settlement dan integrasi SATUSEHAT/BPJS.
- Warna dan gaya SATUSEHAT masih **provisional**, belum hasil audit token resmi pada design system staging.
- V5 memperdalam tujuh peran prioritas; 37 role lainnya tetap memakai worklist V4.
- Pengujian otomatis menguji rendering, pemisahan modul dan navigasi; **bukan UAT pengguna rumah sakit**.

## QA

- tests/role-worklist-detail-v5.test.mjs: tujuh role × seluruh submenu, data khusus tahap, escape string, default deny, seleksi job, dan pencarian.
- tests/mockup-smoke.spec.mjs: Chromium memeriksa login, pemilihan rincian Kasir, filter pencarian, serta konteks Pendaftaran dan IGD.
- Perubahan harus mengikuti CI Mockup Forms P0–P3 Checks dan Publish SIMRS Baru Mockup. Merge hanya dilakukan jika pipeline lulus.

## Tindak lanjut desain

1. Hubungkan worklist sintetis dengan draft yang identitas pasien/encounter-nya konsisten sehingga pembukaan form menjadi benar-benar konteks-spesifik.
2. Desain state transition dan guard yang bisa diuji: identitas ganda, wrong-patient, nursing handover, resep belum ditelaah, invoice belum layak dibayar, bed belum siap, dan disposisi IGD.
3. Review field-by-field Form–FR–US–AC–API–tabel database bersama tujuh PIC; jangan mengklaim 68 form sudah memenuhi kontrak hanya karena tersedia dalam katalog.
4. Audit aksesibilitas dan design tokens SATUSEHAT yang benar (bukan warna perkiraan), perbandingan desktop/tablet/mobile dan UAT alur nyata bersama petugas RS.
5. Perluas worklist kontekstual ke LIS/RIS, DPJP RI, Billing, Casemix dan role operasional lainnya.
