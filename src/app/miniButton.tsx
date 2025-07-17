import { ButtonHTMLAttributes, FC } from 'react';

export const MiniButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className = '',
  ...rest
}) => (
  <button
    className={`inline-flex items-center gap-1
                rounded-md bg-emerald-500 px-3 py-1.5 text-sm font-medium text-white
                shadow transition-colors
                hover:bg-emerald-600 active:bg-emerald-700
                focus:outline-none focus:ring-2 focus:ring-emerald-400
                disabled:opacity-50 ${className}`}
    {...rest}
  >
    {children}
  </button>
);