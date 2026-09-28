'use client';

import { EventCard } from '@/features/event/components/EventCard';
import { EventFilter } from '@/features/event/components/EventFilter';
import { useEvents } from '@/features/event/hooks/useEvents';
import { EmptyState, LoadingState } from '@/components/ui/EmptyState';

export function EventListSection() {
  const { data, loading, error, setFilter, setPage } = useEvents();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="font-mono text-xs font-medium tracking-[0.2em] text-panggung uppercase">
          Papan pengumuman
        </p>
        <h1 className="font-display max-w-xl text-3xl leading-tight font-bold tracking-tight text-tinta sm:text-4xl">
          Mau ke mana <span className="text-panggung">pekan ini?</span>
        </h1>
        <p className="max-w-xl text-sm text-tinta-soft">
          Konser, workshop, dan festival di kotamu. Pilih yang cocok, amankan tiketnya sebelum
          habis.
        </p>
      </div>
      <div className="sticky top-[57px] z-30 -mx-4 bg-kertas/95 px-4 py-3 backdrop-blur">
        <EventFilter onChange={(f) => setFilter(f)} />
      </div>
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <LoadingState key={i} />
          ))}
        </div>
      )}
      {error && (
        <EmptyState
          ikon="📡"
          judul="Gagal memuat event"
          deskripsi={`${error} Periksa koneksimu lalu coba lagi.`}
        />
      )}
      {data && data.items.length === 0 && (
        <EmptyState
          ikon="🔭"
          judul="Tidak ada event yang cocok"
          deskripsi="Coba longgarkan filter — hapus kata kunci, ganti kategori, atau pilih wilayah lain."
        />
      )}
      {data && data.items.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((e, i) => (
              <EventCard key={e.id} event={e} index={i} />
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 text-sm">
            <button
              className="cursor-pointer rounded-xl border border-garis bg-kartu px-4 py-2 font-semibold text-tinta transition hover:border-panggung hover:text-panggung-deep disabled:cursor-not-allowed disabled:opacity-40"
              disabled={data.meta.page <= 1}
              onClick={() => setPage(data.meta.page - 1)}
            >
              ← Sebelumnya
            </button>
            <span className="font-mono text-xs text-tinta-soft">
              {data.meta.page}/{data.meta.totalPages} • {data.meta.total} event
            </span>
            <button
              className="cursor-pointer rounded-xl border border-garis bg-kartu px-4 py-2 font-semibold text-tinta transition hover:border-panggung hover:text-panggung-deep disabled:cursor-not-allowed disabled:opacity-40"
              disabled={data.meta.page >= data.meta.totalPages}
              onClick={() => setPage(data.meta.page + 1)}
            >
              Berikutnya →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
