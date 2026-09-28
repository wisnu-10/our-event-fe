import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-beludru text-white/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-display text-lg font-bold text-white">
            Our<span className="text-lampion">Event</span>
          </p>
          <p className="mt-1 max-w-xs text-xs leading-relaxed">
            Temukan konser, workshop, dan festival di kotamu. Beli tiket, bayar via transfer,
            terima tiket QR.
          </p>
        </div>
        <div className="flex gap-5 text-xs font-semibold">
          <Link href="/" className="hover:text-lampion">
            Jelajahi event
          </Link>
          <Link href="/orders/my" className="hover:text-lampion">
            Tiket saya
          </Link>
          <Link href="/admin/login" className="hover:text-lampion">
            Portal admin
          </Link>
        </div>
      </div>
      <div className="perforasi-x-gelap opacity-60" aria-hidden />
      <p className="px-4 py-4 text-center font-mono text-[11px] tracking-wide text-white/40">
        OUR-EVENT • TIKET RESMI • SIMPAN KODEMU
      </p>
    </footer>
  );
}
