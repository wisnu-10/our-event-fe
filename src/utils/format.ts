export function formatRupiah(value: number | string): string {
  const num = typeof value === 'string' ? Number(value) : value;
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
}

export function formatDate(value: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export function formatDayNumber(value: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit' }).format(new Date(value));
}

export function formatMonthShort(value: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(new Date(value)).replace('.', '');
}

const CATEGORY_LABELS: Record<string, string> = {
  music: 'Musik',
  workshop: 'Workshop',
  food: 'Kuliner',
  sports: 'Olahraga',
  general: 'Lainnya',
};

export function formatCategory(value: string): string {
  return CATEGORY_LABELS[value] ?? value;
}
