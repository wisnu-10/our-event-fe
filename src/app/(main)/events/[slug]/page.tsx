'use client';

import { use } from 'react';
import Link from 'next/link';
import { useEventDetail } from '@/features/event/hooks/useEvents';
import { formatCategory, formatDate, formatRupiah } from '@/utils/format';
import { DateBlock } from '@/components/ui/DateBlock';
import { Badge } from '@/components/ui/Badge';
import { EmptyState, LoadingState } from '@/components/ui/EmptyState';

export default function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { event, loading, error } = useEventDetail(slug);

  if (loading)
    return (
      <div className="flex flex-col gap-4">
        <LoadingState label="Memuat event" />
      </div>
    );
  if (error || !event)
    return (
      <EmptyState
        ikon="🗺️"
        judul="Event tidak ditemukan"
        deskripsi={error || 'Tautan ini mungkin sudah kedaluwarsa atau event-nya sudah dihapus.'}
        aksi={
          <Link href="/" className="font-semibold text-panggung hover:underline">
            Kembali ke daftar event
          </Link>
        }
      />
    );

  const habis = event.remainingQuota <= 0;

  return (
    <article className="flex flex-col gap-6">
      <Link href="/" className="w-fit text-sm font-semibold text-tinta-soft hover:text-panggung-deep">
        ← Semua event
      </Link>
      <div className="relative overflow-hidden rounded-3xl bg-beludru">
        {event.bannerUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.bannerUrl} alt={event.title} className="h-64 w-full object-cover sm:h-80" />
        ) : (
          <div
            className="flex h-64 items-center justify-center bg-[radial-gradient(circle_at_25%_25%,var(--color-panggung)_0%,transparent_55%),radial-gradient(circle_at_80%_20%,var(--color-lampion)_0%,transparent_38%),var(--color-beludru)] sm:h-80"
            aria-hidden
          >
            <span className="font-display text-8xl font-bold text-white/90">✳</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-end gap-4 bg-gradient-to-t from-beludru/90 to-transparent p-5 pt-16">
          <DateBlock value={event.startDate} tone="gelap" />
          <div className="min-w-0 pb-1">
            <p className="text-xs font-semibold tracking-wider text-lampion uppercase">
              {formatCategory(event.category)}
            </p>
            <h1 className="font-display truncate text-2xl font-bold text-white sm:text-3xl">
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="flex min-w-0 flex-col gap-4">
          <dl className="grid gap-4 rounded-2xl border border-garis bg-kartu p-5 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-mono text-[11px] tracking-wider text-tinta-faint uppercase">Jadwal</dt>
              <dd className="mt-1 font-semibold">
                {formatDate(event.startDate)} — {formatDate(event.endDate)}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] tracking-wider text-tinta-faint uppercase">Lokasi</dt>
              <dd className="mt-1 font-semibold">{event.location}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] tracking-wider text-tinta-faint uppercase">Harga</dt>
              <dd className="font-display mt-1 text-xl font-bold text-panggung-deep">
                {formatRupiah(event.price)}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] tracking-wider text-tinta-faint uppercase">Sisa kuota</dt>
              <dd className={`mt-1 font-mono font-semibold ${habis ? 'text-bara' : 'text-daun'}`}>
                {habis ? 'HABIS' : `${event.remainingQuota} tiket`}
              </dd>
            </div>
          </dl>
          <div className="rounded-2xl border border-garis bg-kartu p-5">
            <h2 className="font-display mb-2 font-bold">Tentang event ini</h2>
            <p className="text-sm leading-relaxed whitespace-pre-line text-tinta-soft">
              {event.description}
            </p>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl bg-beludru p-5 text-white">
            <div className="flex items-baseline justify-between">
              <p className="font-mono text-[11px] tracking-wider text-white/60 uppercase">Mulai dari</p>
              <Badge status={habis ? 'CLOSED' : 'PUBLISHED'} />
            </div>
            <p className="font-display mt-1 text-3xl font-bold text-lampion">
              {formatRupiah(event.price)}
            </p>
            <div className="perforasi-x-gelap my-4 opacity-70" aria-hidden />
            {habis ? (
              <p className="rounded-xl bg-white/10 p-3 text-center text-sm font-semibold">
                Tiket habis — pantau event lainnya
              </p>
            ) : (
              <Link
                href={`/events/${event.slug}/checkout`}
                className="block rounded-xl bg-lampion px-6 py-3 text-center font-bold text-tinta transition hover:brightness-95 active:scale-[0.98]"
              >
                Beli Tiket
              </Link>
            )}
            <p className="mt-3 text-center text-xs text-white/60">
              Bayar via transfer • tiket QR setelah diverifikasi
            </p>
          </div>
        </aside>
      </div>

      {/* Bilah beli menempel untuk layar kecil */}
      {!habis && (
        <div className="sticky bottom-4 lg:hidden">
          <Link
            href={`/events/${event.slug}/checkout`}
            className="block rounded-2xl bg-lampion px-6 py-3.5 text-center font-bold text-tinta shadow-[0_12px_28px_-8px_rgba(0,0,0,0.4)]"
          >
            Beli Tiket • {formatRupiah(event.price)}
          </Link>
        </div>
      )}
    </article>
  );
}
