import type { ReactNode } from 'react';

/** Keadaan kosong yang mengajak bertindak, bukan sekadar pesan. */
export function EmptyState({
  ikon = '🎟️',
  judul,
  deskripsi,
  aksi,
}: {
  ikon?: string;
  judul: string;
  deskripsi: string;
  aksi?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-garis bg-kartu px-6 py-12 text-center">
      <span className="text-4xl" aria-hidden>
        {ikon}
      </span>
      <p className="font-display text-lg font-bold text-tinta">{judul}</p>
      <p className="max-w-sm text-sm text-tinta-soft">{deskripsi}</p>
      {aksi && <div className="mt-2">{aksi}</div>}
    </div>
  );
}

export function LoadingState({ label = 'Memuat...' }: { label?: string }) {
  return (
    <div className="flex flex-col gap-3" role="status" aria-label={label}>
      <div className="skeleton h-36" />
      <div className="skeleton h-4 w-2/3" />
      <div className="skeleton h-4 w-1/3" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
