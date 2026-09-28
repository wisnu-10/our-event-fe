'use client';

import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';

export function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-40 border-b border-garis/70 bg-kertas/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-panggung font-display text-lg font-bold text-white">
            O
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-tinta">
            Our<span className="text-panggung">Event</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 text-sm sm:gap-3">
          {user ? (
            <>
              {user.role !== 'CUSTOMER' ? (
                <Link
                  href="/dashboard"
                  className="rounded-lg px-3 py-1.5 font-semibold text-tinta-soft hover:bg-panggung-tint hover:text-panggung-deep"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/orders/my"
                  className="rounded-lg px-3 py-1.5 font-semibold text-tinta-soft hover:bg-panggung-tint hover:text-panggung-deep"
                >
                  Tiket Saya
                </Link>
              )}
              <span className="hidden max-w-32 truncate font-medium text-tinta-faint sm:inline">
                {user.name}
              </span>
              <button
                onClick={() => logout()}
                className="cursor-pointer rounded-lg px-3 py-1.5 font-semibold text-bara hover:bg-bara-soft"
              >
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-lg px-3 py-1.5 font-semibold text-tinta-soft hover:bg-panggung-tint hover:text-panggung-deep"
              >
                Masuk
              </Link>
              <Link
                href="/auth/register"
                className="rounded-lg bg-panggung px-4 py-1.5 font-semibold text-white shadow-[0_8px_20px_-8px_var(--color-panggung)] transition hover:bg-panggung-deep"
              >
                Daftar
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
