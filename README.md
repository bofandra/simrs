# SIMRS Prototype

Starter project ini menyiapkan fondasi awal prototipe SIMRS berbasis `Next.js + TypeScript` sesuai arah yang sudah dibahas:

1. Fokus pada modul MVP operasional.
2. Menyatukan alur pasien melalui `Encounter`.
3. Menjaga kebutuhan akreditasi dan regulasi tetap terlihat sejak awal desain.

## Struktur Awal

- `app/`
  - Halaman prototype utama dan area modul awal.
- `components/`
  - Shell layout dan navigasi dasar.
- `lib/prototype-data.ts`
  - Data dummy dan definisi awal modul, alur, queue, compliance, serta entitas inti.
- `.env.example`
  - Placeholder untuk integrasi Supabase pada fase berikutnya.

## Halaman yang Sudah Disiapkan

1. `/`
   - Executive overview, scope MVP, roadmap modul, dan compliance guardrail.
2. `/patients`
   - Front office, registrasi, queue, dan keputusan admission awal.
3. `/clinical`
   - Clinical core untuk rawat jalan, UGD, rawat inap, dan rekam medik.
4. `/operations`
   - Support operations untuk lab, radiologi, farmasi, dan bed board.
5. `/finance`
   - Billing minimum dan laporan dasar.
6. `/compliance`
   - Peta compliance dan entitas data inti.

## Setup Lokal

Project ini disusun manual agar fondasi kodenya bisa dibuat terlebih dulu. Untuk menjalankannya, install dependency Node sesuai package manager yang kamu pilih.

Contoh dengan `npm`:

```bash
npm install
npm run dev
```

Contoh dengan `pnpm`:

```bash
pnpm install
pnpm dev
```

Jika `pnpm` belum ada di shell, gunakan binary lokal yang sudah disiapkan di workspace ini:

```bash
/Users/dto/code/Prototipe_SIMRS/simrs/.tools/bin/pnpm install
/Users/dto/code/Prototipe_SIMRS/simrs/.tools/bin/pnpm dev
```

Lalu buka:

```bash
http://localhost:3000
```

## Deploy Gratis yang Disarankan

1. Frontend: `Vercel`
2. Database/Auth/Storage tahap berikutnya: `Supabase`

Untuk fase ini, app masih memakai data dummy. Integrasi Supabase bisa ditambahkan setelah struktur layar dan entitas inti dianggap cukup stabil.

## Langkah Berikutnya yang Disarankan

1. Tambahkan `master data` dan `mock record` yang lebih detail per modul.
2. Ubah data dummy menjadi typed repository per domain.
3. Sambungkan auth dan database Supabase.
4. Mulai bangun layar transaksi nyata: registrasi, detail encounter, order, hasil, dan billing.
