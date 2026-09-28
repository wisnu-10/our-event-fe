import Link from 'next/link';
import { formatCategory, formatDate, formatRupiah } from '@/utils/format';
import { DateBlock } from '@/components/ui/DateBlock';
import type { EventItem } from '@/features/event/types';

export function EventCard({ event, index = 0 }: { event: EventItem; index?: number }) {
  const habis = event.remainingQuota <= 0;
  return (
    <Link
      href={`/events/${event.slug}`}
      className="muncul group flex flex-col overflow-hidden rounded-2xl border border-garis bg-kartu shadow-[0_1px_2px_rgba(37,34,76,0.06)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_32px_-16px_rgba(91,61,245,0.35)]"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div className="relative flex h-36 items-center justify-center overflow-hidden bg-beludru">
        {event.bannerUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_20%_20%,var(--color-panggung)_0%,transparent_55%),radial-gradient(circle_at_85%_15%,var(--color-lampion)_0%,transparent_40%),var(--color-beludru)]"
            aria-hidden
          >
            <span className="font-display text-5xl font-bold text-white/90">✳</span>
          </div>
        )}
        <span className="absolute top-3 left-3 rounded-full bg-beludru/70 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
          {formatCategory(event.category)}
        </span>
        {habis && (
          <span className="absolute top-3 right-3 rounded-full bg-bara px-2.5 py-1 text-[11px] font-bold text-white">
            Habis
          </span>
        )}
      </div>
      <div className="flex flex-1 gap-3 p-4">
        <DateBlock value={event.startDate} />
        <div className="flex min-w-0 flex-1 flex-col">
          <h3 className="font-display leading-snug font-bold text-tinta group-hover:text-panggung-deep">
            {event.title}
          </h3>
          <p className="mt-1 truncate text-xs text-tinta-soft">
            {formatDate(event.startDate)} • {event.regency}
          </p>
          <div className="perforasi-x mt-3 mb-2 opacity-70" aria-hidden />
          <div className="mt-auto flex items-baseline justify-between gap-2">
            <p className="font-display text-lg font-bold text-panggung-deep">
              {formatRupiah(event.price)}
            </p>
            {!habis && (
              <p className="font-mono text-[11px] text-daun">sisa {event.remainingQuota}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
