import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'orange';

type SharedButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

type ButtonLinkProps = SharedButtonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'href' | 'type'> & {
    href: string;
  };

type NativeButtonProps = SharedButtonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'href'> & {
    href?: never;
    type?: 'button' | 'submit' | 'reset';
  };

export type ButtonProps = ButtonLinkProps | NativeButtonProps;

function buttonClasses(variant: ButtonVariant, className: string) {
  return [
    'btn',
    variant === 'secondary' ? 'btn-secondary' : 'btn-primary',
    variant === 'orange' ? 'btn-orange' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

export function Button(props: ButtonProps) {
  const { children, variant = 'primary', className = '' } = props;
  const classes = buttonClasses(variant, className);

  if ('href' in props && props.href) {
    const {
      href,
      children: _children,
      variant: _variant,
      className: _className,
      ...anchorProps
    } = props;

    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  const {
    children: _children,
    variant: _variant,
    className: _className,
    type = 'button',
    ...buttonProps
  } = props;

  return (
    <button className={classes} type={type} {...buttonProps}>
      {children}
    </button>
  );
}
