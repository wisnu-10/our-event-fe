import type { ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-garis bg-kartu p-6 shadow-[0_1px_2px_rgba(37,34,76,0.05)] ${className}`}>
      {children}
    </div>
  );
}
