import { Suspense } from 'react';
import { LoginForm } from '@/features/auth/hooks/useAuthForm';

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-beludru px-4">
      <div
        className="w-full max-w-md overflow-hidden rounded-3xl bg-kartu shadow-[0_32px_64px_-24px_rgba(0,0,0,0.5)]"
      >
        <div className="bg-beludru px-8 pt-8 pb-6 text-white">
          <p className="font-mono text-[11px] tracking-[0.25em] text-lampion uppercase">
            Our-Event • Kru
          </p>
          <h1 className="font-display mt-1 text-2xl font-bold">Portal Admin</h1>
          <p className="mt-1 text-sm text-white/60">Kelola event dan verifikasi pembayaran.</p>
        </div>
        <div className="perforasi-x-gelap opacity-70" aria-hidden />
        <div className="p-8">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
