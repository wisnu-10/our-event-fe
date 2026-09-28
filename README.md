# Our Event — Frontend

Antarmuka web platform tiket event **Our Event**: pengunjung menjelajah event, membeli tiket,
membayar via transfer, dan menerima tiket QR — admin mengelola event dan verifikasi dari dashboard.

> Dokumen perencanaan: [`PRD.md`](../PRD.md) dan [`plan/`](../plan/README.md). Kontrak API: backend `README.md`.

## Fitur & Halaman

**Publik**

| Rute              | Guna                                              |
| ----------------- | ------------------------------------------------- |
| `/`               | Beranda: daftar event + filter (alat utama)       |
| `/events/[slug]`  | Detail event + tombol beli                        |
| `/events/[slug]/checkout` | Pilih jumlah tiket, buat order              |
| `/orders/[orderCode]/payment` | Instruksi bayar + upload bukti          |
| `/orders/[orderCode]` | Detail order + tiket QR                         |
| `/orders/my`      | Riwayat order dengan saring status                |
| `/auth/login`, `/auth/register` | Masuk / daftar akun               |

**Admin** (`/admin/login` → `/dashboard`)

| Rute                   | Guna (role)                              |
| ---------------------- | ---------------------------------------- |
| `/dashboard`           | Ringkasan statistik (ADMIN, SUPERADMIN)  |
| `/dashboard/events`    | CRUD + tayangkan event (ADMIN, SUPERADMIN) |
| `/dashboard/orders`    | Verifikasi pembayaran (ADMIN, SUPERADMIN)|
| `/dashboard/users`     | Kelola akun admin (SUPERADMIN saja)      |

## Tech Stack

| Lapisan   | Teknologi                                           |
| --------- | --------------------------------------------------- |
| Framework | Next.js 16 (App Router) + React 19 + TypeScript     |
| Styling   | TailwindCSS v4 (token di `globals.css`)             |
| Form      | React Hook Form + Zod                               |
| Auth      | Cookie httpOnly via backend (tanpa token di browser)|
| Tipografi | Bricolage Grotesque, Plus Jakarta Sans, IBM Plex Mono |

## Prasyarat

- Node.js 20+ dan npm.
- Backend menyala di `http://localhost:5000` (lihat backend `README.md`).

## Quick Start

```bash
cd frontend
npm install

# 1. Arahkan ke API backend (file sudah ada, sesuaikan bila perlu)
# .env.local → NEXT_PUBLIC_API_URL=http://localhost:5000/api

# 2. Jalankan dev server
npm run dev
```

Buka `http://localhost:3000`.

## Environment Variables

| Variabel              | Wajib | Default                  | Guna                  |
| --------------------- | ----- | ------------------------ | --------------------- |
| `NEXT_PUBLIC_API_URL` | Tidak | `http://localhost:5000/api` | Base URL backend API |

## Script NPM

| Script            | Guna                                   |
| ----------------- | -------------------------------------- |
| `npm run dev`     | Dev server dengan hot-reload           |
| `npm run build`   | Build production                       |
| `npm start`       | Jalankan hasil build                   |
| `npm run lint`    | ESLint (Next.js)                       |
| `npm run typecheck` | Cek tipe tanpa emit (`tsc --noEmit`) |

## Struktur Folder

```
src/
├── app/
│   ├── layout.tsx          # Font, metadata, AuthProvider
│   ├── middleware.ts       # Guard rute berdasar cookie + role
│   ├── (main)/             # Halaman publik (Navbar + Footer)
│   ├── admin/login/        # Portal masuk admin
│   └── dashboard/          # Area admin (sidebar gelap)
├── features/<domain>/      # Kode per domain: api/, components/, hooks/, schemas/, types.ts
│   ├── auth/ event/ order/ region/ ticket/ dashboard/ admin-users/
├── components/ui/          # Primitif: Button, Input, Card, Badge, DateBlock, Steps, EmptyState
├── providers/              # AuthProvider (sesi via /auth/me)
├── lib/api-client.ts       # Fetch wrapper (credentials:include, tanpa header auth manual)
└── utils/format.ts         # Rupiah, tanggal, label kategori
```

## Konvensi

- **Sesi**: cookie httpOnly milik backend; frontend tidak menyimpan token (tidak ada `localStorage`).
  Semua request memakai `credentials: 'include'`; refresh sesi otomatis saat 401.
- **Respons API yang diharapkan**: `{ "success": true, "message": "...", "data": {...} }`;
  gagal melempar `ApiError` berisi `message` + `status`.
- **Token desain** (`app/globals.css`, Tailwind v4 `@theme`): warna `tinta/panggung/lampion/kertas/daun/bara`,
  font `display/sans/mono`; utilitas `.field` (input standar), `.perforasi-x` (tepi karcis),
  `.skeleton`, `.muncul` (animasi masuk, nonaktif bila `prefers-reduced-motion`).
- **Akses halaman**: middleware membaca cookie `accessToken` (role dari payload JWT);
  `/dashboard/users` khusus `SUPERADMIN`, `/admin/login` untuk yang belum masuk.
- **Tulisan UI**: Bahasa Indonesia, kalimat aktif, error menjelaskan sebab + langkah berikutnya.
