const colors: Record<string, string> = {
  PENDING_PAYMENT: 'bg-tinta/5 text-tinta-soft',
  WAITING_CONFIRMATION: 'bg-lampion-soft text-[#8a5a00]',
  APPROVED: 'bg-daun-soft text-daun',
  REJECTED: 'bg-bara-soft text-bara',
  EXPIRED: 'bg-tinta/5 text-tinta-faint',
  CANCELLED: 'bg-tinta/5 text-tinta-faint',
  PUBLISHED: 'bg-daun-soft text-daun',
  DRAFT: 'bg-tinta/5 text-tinta-faint',
  CLOSED: 'bg-bara-soft text-bara',
  ADMIN: 'bg-panggung-tint text-panggung-deep',
  CUSTOMER: 'bg-langit-soft text-langit',
  SUPERADMIN: 'bg-beludru text-lampion',
};

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: 'Menunggu bayar',
  WAITING_CONFIRMATION: 'Menunggu verifikasi',
  APPROVED: 'Disetujui',
  REJECTED: 'Ditolak',
  EXPIRED: 'Kedaluwarsa',
  CANCELLED: 'Dibatalkan',
  PUBLISHED: 'Tayang',
  DRAFT: 'Draf',
  CLOSED: 'Ditutup',
  ADMIN: 'Admin',
  CUSTOMER: 'Customer',
  SUPERADMIN: 'Superadmin',
};

export function Badge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${colors[status] ?? 'bg-tinta/5 text-tinta-soft'}`}
    >
      {STATUS_LABELS[status] ?? status.replaceAll('_', ' ')}
    </span>
  );
}
