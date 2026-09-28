import { formatDayNumber, formatMonthShort } from '@/utils/format';

/** Blok tanggal kalender khas karcis: angka hari besar + bulan singkat. */
export function DateBlock({ value, tone = 'terang' }: { value: string | Date; tone?: 'terang' | 'gelap' }) {
  const gelap = tone === 'gelap';
  return (
    <div
      className={`flex w-14 shrink-0 flex-col items-center rounded-xl border py-1.5 ${
        gelap ? 'border-white/20 bg-white/10 text-white' : 'border-garis bg-kertas text-tinta'
      }`}
    >
      <span className="font-display text-2xl leading-none font-bold">{formatDayNumber(value)}</span>
      <span className={`text-[11px] font-semibold tracking-wide uppercase ${gelap ? 'text-white/70' : 'text-tinta-faint'}`}>
        {formatMonthShort(value)}
      </span>
    </div>
  );
}
