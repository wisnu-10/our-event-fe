'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

const NAV = [
  { href: '/dashboard', label: 'Ringkasan', admin: true },
  { href: '/dashboard/events', label: 'Event', admin: true },
  { href: '/dashboard/orders', label: 'Pesanan', admin: true },
  { href: '/dashboard/users', label: 'Kelola Admin', admin: false, superonly: true },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isSuperadmin = user?.role === 'SUPERADMIN';

  const onLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const items = NAV.filter((n) => (n.superonly ? isSuperadmin : true));

  return (
    <div className="flex min-h-screen bg-kertas">
      <aside className="flex w-60 shrink-0 flex-col bg-beludru p-4 text-white">
        <Link href="/dashboard" className="mb-6 px-2 font-display text-lg font-bold">
          Our<span className="text-lampion">Event</span>{' '}
          <span className="font-mono text-[10px] font-medium tracking-widest text-white/50 uppercase">
            kru
          </span>
        </Link>
        <nav className="flex flex-col gap-1 text-sm" aria-label="Navigasi dashboard">
          {items.map((n) => {
            const aktif = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={aktif ? 'page' : undefined}
                className={`rounded-xl px-3 py-2.5 font-semibold transition ${
                  aktif ? 'bg-panggung text-white' : 'text-white/65 hover:bg-white/10 hover:text-white'
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex flex-col gap-1 border-t border-white/10 pt-4 text-sm">
          <Link href="/" className="rounded-xl px-3 py-2.5 text-white/65 hover:bg-white/10 hover:text-white">
            Lihat situs
          </Link>
          <button
            onClick={onLogout}
            className="cursor-pointer rounded-xl px-3 py-2.5 text-left font-semibold text-lampion hover:bg-white/10"
          >
            Keluar
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-6 sm:p-8">{children}</main>
    </div>
  );
}
