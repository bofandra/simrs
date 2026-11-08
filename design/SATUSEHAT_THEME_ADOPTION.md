# Adopsi Tema SATUSEHAT pada Mockup SIMRS Baru

Tanggal: 8 November 2026  
Status: **IMPLEMENTASI SEMENTARA — perlu verifikasi terhadap situs acuan**  
Acuan yang diminta: https://satusehat-stg.dto.kemkes.go.id/design-system  
Baseline produk: PRD SIMRS Baru 8 November 2026, 68 modul, 66 FR, 15 workflow.

## Keputusan dan batasan

- **UI SATUSEHAT sebagai acuan gaya**, bukan sebagai pengganti kebutuhan fungsional SIMRS.
- Situs staging tidak dapat diambil saat pengecekan pada 8 November 2026; warna, ukuran, komponen, dan token pada file ini **bukan klaim token resmi SATUSEHAT**.
- Sambil menunggu akses, preview menggunakan pendekatan visual Kemenkes: nuansa turquoise, putih, panel ringan dan status semantik. Acuan pendukung: Pedoman Identitas Kemenkes 2024 (identitas visual, **bukan spesifikasi UI SATUSEHAT**), https://kemkes.go.id/app_asset/file_content_download/170841436665d4559e265ea7.20391856.pdf
- Jangan menggunakan atau meniru logo SATUSEHAT/Kemenkes sebagai logo produk SIMRS tanpa verifikasi hak penggunaan.
- Tidak mengubah alur klinis, akses per role, integrasi, atau interaksi safety-gate; semuanya tetap simulasi.

## Hasil tahap ini

- **`public/ui-preview/satusehat-theme.css`**: lapisan styling terpisah yang dapat diganti setelah token dan screenshot resmi terverifikasi.
- **`public/ui-preview/index.html`**: memuat tema tersebut setelah stylesheet internal sebagai override.
- **`design/design_tokens.json`**: versi token sementara 1.1.0-provisional.
- Halaman demo tetap mendukung 7 workspace, role switcher dan data simulasi.

## Komponen yang dipetakan

| Area | Penerapan tahap ini | Perlu diperiksa terhadap halaman resmi |
|---|---|---|
| Brand/warna | Nuansa turquoise/teal, neutral, semantik status | Palet primary/secondary, tone, kondisi disabled |
| Navigasi | Sidebar terang, active state teal, breadcrumbs | Sidebar/topbar resmi, ikon, spacing |
| Tipografi | Segoe UI fallback, hirarki existing | Font, ukuran/line-height, weight |
| Button | Primary teal, secondary outline, hover/focus | Variant, size, disabled/loading |
| Form | Rounded input, focus outline, label kontras | Field states, select, checkbox, required/error |
| Table/worklist | Light header, hover ringan, divider tipis | Dense table, pagination, sorting, row actions |
| Card | Border halus, bayangan ringan | Elevation, radius dan density |
| Status | Success/warning/error/info tetap dibedakan dengan teks | Variasi badge dan semantic token |
| Responsivitas | Layout 7 workspace tetap menggunakan breakpoint lama | Navigasi dan komponen resmi versi mobile |

## Pemeriksaan wajib sebelum menyebut *sesuai SATUSEHAT Design System*

1. Akses situs asli; dokumentasikan tangkapan layar untuk color, typography, button, inputs, table, tabs, navigation, alerts, modal, dan empty states.
2. Ambil token resmi atau hasil inspeksi CSS dari halaman yang dapat diakses; beri provenance dan tanggal.
3. Bandingkan sisi-ke-sisi ketujuh workspace (desktop/tablet/mobile), lalu perbarui `satusehat-theme.css` dan `design_tokens.json`.
4. Smoke test klik navigasi, role switching, tabel, form, dan status klinis agar override tidak merusak interaksi.
5. Uji kontras, keyboard focus, resize, zoom, teks panjang, loading/error/empty state.
6. Review desain dengan pengguna RS sebelum merge ke `main` atau deployment GitHub Pages.

**Kesimpulan:** Mockup kini mempunyai lapisan visual referensi SATUSEHAT yang mudah disesuaikan, **bukan reproduksi terverifikasi dari situs staging**.
