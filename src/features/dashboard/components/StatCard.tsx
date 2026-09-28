import { formatRupiah } from '@/utils/format';

export function StatCard({ label, value, uang = false }: { label: string; value: string; uang?: boolean }) {
  const tampil = uang && !Number.isNaN(Number(value)) ? formatRupiah(value) : value;
  return (
    <div className="rounded-2xl border border-garis bg-kartu p-5">
      <p className="font-mono text-[11px] tracking-wider text-tinta-faint uppercase">{label}</p>
      <p className="font-display mt-1 text-3xl font-bold text-tinta">{tampil}</p>
    </div>
  );
}
