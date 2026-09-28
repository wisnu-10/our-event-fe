interface StepsProps {
  langkah: string[];
  aktif: number;
}

/** Penanda alur yang memang sekuens: Pilih → Bayar → Tiket. */
export function Steps({ langkah, aktif }: StepsProps) {
  return (
    <ol className="flex items-center gap-2 text-xs font-semibold" aria-label="Alur pemesanan">
      {langkah.map((label, i) => {
        const selesai = i < aktif;
        const kini = i === aktif;
        return (
          <li key={label} className="flex flex-1 items-center gap-2 last:flex-none">
            <span className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full ${
                  selesai
                    ? 'bg-daun text-white'
                    : kini
                      ? 'bg-panggung text-white'
                      : 'bg-tinta/10 text-tinta-faint'
                }`}
              >
                {selesai ? '✓' : i + 1}
              </span>
              <span className={kini ? 'text-tinta' : selesai ? 'text-tinta-soft' : 'text-tinta-faint'}>
                {label}
              </span>
            </span>
            {i < langkah.length - 1 && (
              <span className={`h-px flex-1 ${selesai ? 'bg-daun' : 'bg-garis'}`} aria-hidden />
            )}
          </li>
        );
      })}
    </ol>
  );
}
