import { Suspense } from 'react';
import Link from 'next/link';
import { LoginForm } from '@/features/auth/hooks/useAuthForm';
import { Card } from '@/components/ui/Card';

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6 text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-panggung uppercase">Selamat datang kembali</p>
        <h1 className="font-display mt-1 text-3xl font-bold tracking-tight">Masuk ke akunmu</h1>
      </div>
      <Card>
        <Suspense>
          <LoginForm />
        </Suspense>
        <div className="perforasi-x my-5 opacity-70" aria-hidden />
        <p className="text-center text-sm text-tinta-soft">
          Baru di Our Event?{' '}
          <Link href="/auth/register" className="font-semibold text-panggung-deep hover:underline">
            Buat akun gratis
          </Link>
        </p>
      </Card>
    </div>
  );
}
