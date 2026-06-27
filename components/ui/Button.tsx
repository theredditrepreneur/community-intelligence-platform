import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type BaseButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'orange';
  className?: string;
};

type LinkButtonProps = BaseButtonProps & {
  href: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className'>;

type NativeButtonProps = BaseButtonProps & {
  href?: undefined;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: LinkButtonProps | NativeButtonProps) {
  const { children, variant = 'primary', className = '' } = props;
  const classes = [
    'btn',
    variant === 'secondary' ? 'btn-secondary' : 'btn-primary',
    variant === 'orange' ? 'btn-orange' : '',
    className,
  ].filter(Boolean).join(' ');

  if ('href' in props && props.href) {
    const { href, children: _children, variant: _variant, className: _className, ...linkProps } = props;
    return <Link href={href} className={classes} {...linkProps}>{children}</Link>;
  }

  const { children: _children, variant: _variant, className: _className, ...buttonProps } = props;
  return <button className={classes} {...buttonProps}>{children}</button>;
}
