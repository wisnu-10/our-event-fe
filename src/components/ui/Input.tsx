import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, id, ...props }: InputProps) {
  const inputId = id ?? props.name;
  return (
    <label className="flex flex-col gap-1.5 text-sm" htmlFor={inputId}>
      <span className="font-semibold text-tinta">{label}</span>
      <input id={inputId} className={`field ${error ? '!border-bara' : ''}`} {...props} />
      {error && <span className="text-xs font-medium text-bara">{error}</span>}
    </label>
  );
}
