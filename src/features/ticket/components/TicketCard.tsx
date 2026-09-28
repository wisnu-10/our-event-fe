import type { TicketItem } from '@/features/order/types';

/** Karcis dengan tepi perforasi — elemen signature. */
export function TicketCard({ ticket }: { ticket: TicketItem }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-beludru text-white">
      <div className="flex items-center gap-4 p-4">
        {ticket.qrCodeUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={ticket.qrCodeUrl}
            alt={`QR ${ticket.ticketCode}`}
            className="h-24 w-24 rounded-xl bg-white p-1"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-white/10 text-xs text-white/60">
            Tanpa QR
          </div>
        )}
        <div className="min-w-0">
          <p className="font-mono text-sm font-semibold break-all text-lampion">{ticket.ticketCode}</p>
          <p className="mt-1 text-xs text-white/60">
            {ticket.isUsed ? 'Sudah dipakai' : 'Tunjukkan QR ini di pintu masuk'}
          </p>
        </div>
      </div>
      <div className="perforasi-x-gelap opacity-70" aria-hidden />
      <p className="px-4 py-2 text-center font-mono text-[10px] tracking-[0.25em] text-white/40">
        OUR-EVENT • ADMIT ONE
      </p>
    </div>
  );
}
