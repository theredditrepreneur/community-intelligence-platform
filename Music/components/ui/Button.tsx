import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'orange';
  href?: string;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ children, variant = 'primary', href, className = '', type = 'button', ...props }: ButtonProps) {
  const classes = [
    'btn',
    variant === 'secondary' ? 'btn-secondary' : 'btn-primary',
    variant === 'orange' ? 'btn-orange' : '',
    className,
  ].filter(Boolean).join(' ');

  if (href) {
    return <Link href={href} className={classes}>{children}</Link>;
  }

  return <button className={classes} type={type} {...props}>{children}</button>;
}
