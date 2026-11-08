# SIMRS Baru — Mockup Interaktif

**Situs resmi mockup saat ini:** https://bofandra.github.io/simrs/

Repositori ini menyimpan prototype UI SIMRS Baru dengan **7 workspace, 68 modul/form demo** dan tiga alur terpandu:

**Workspace v2 (8 November 2026):** Front Office serta Dokter RJ kini memakai daftar kerja, form, banner pasien/encounter, validasi, dan navigasi tugas berbasis peran. Kode: `public/ui-preview/workspaces-v2.js` dan `.css`; dokumentasi: `design/WORKSPACE_V2_FRONT_CLINICAL_2026-11-08.md`. Semua tindakan tetap demonstrasi.

- Rawat Jalan — 10 tahapan.
- IGD — 7 tahapan.
- Rawat Inap — 9 tahapan.

Kode HTML/CSS/JavaScript yang **diterbitkan GitHub Pages** ada di [`public/ui-preview/`](public/ui-preview/). Semua data pasien, jadwal, layanan, obat, tarif, catatan klinis, dan transaksi **sintetis**, disimpan hanya dalam `localStorage` browser. Tidak ada backend, autentikasi rumah sakit, FHIR/SATUSEHAT, pembayaran, dispensing, mutasi stok atau proses klinis sungguhan.

## Status situs

GitHub Pages menerbitkan **hanya mockup terbaru sebagai halaman utama**. Halaman prototipe lama telah dihapus dari site dan source HTML/CSS/JS legacy. Folder `docs/simrs-baru/` sekarang menyimpan **dokumen referensi teknis saja**, bukan situs lain.

Pengujian dan deployment:
- `.github/workflows/mockup-forms-p0.yml`: pengujian Node dan Chromium pada perubahan mockup.
- `.github/workflows/publish-mindmap-pages.yml`: tes ulang dan deploy isi `public/ui-preview/` ke root Pages ketika perubahan masuk `main`.

Untuk menjalankan preview secara lokal:

```bash
python3 -m http.server 8000 --directory public/ui-preview
```

Lalu buka http://localhost:8000/ . Untuk tes Node: `node --test tests/*.test.mjs`. Untuk tes browser, instal `@playwright/test` dan Chromium sesuai workflow.

## Struktur tambahan

- `design/`: desain, pemetaan form, dan rancangan UI.
- `docs/simrs-baru/`: arsip kontrak dan dokumen teknis (tanpa halaman web lama).
- `app/`, `components/`, `lib/`: kode Next.js eksperimen terdahulu yang **tidak termasuk** paket GitHub Pages; tidak digunakan oleh situs di atas.

> **Penting:** Ini hanya prototipe statis untuk menguji alur dan UI, bukan SIMRS yang siap dipakai di rumah sakit.
