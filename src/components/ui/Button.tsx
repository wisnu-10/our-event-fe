import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'utama' | 'lampion' | 'hantu' | 'bahaya' | 'tenang';

const variants: Record<ButtonVariant, string> = {
  utama: 'bg-panggung text-white hover:bg-panggung-deep shadow-[0_8px_20px_-8px_var(--color-panggung)]',
  lampion: 'bg-lampion text-tinta hover:brightness-95 shadow-[0_8px_20px_-8px_var(--color-lampion)]',
  hantu: 'border border-garis bg-kartu text-tinta hover:border-panggung hover:text-panggung',
  bahaya: 'bg-bara text-white hover:brightness-95',
  tenang: 'bg-tinta/5 text-tinta hover:bg-tinta/10',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  varian?: ButtonVariant;
}

export function Button({ varian = 'utama', className = '', type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 ${variants[varian]} ${className}`}
      {...props}
    />
  );
}
