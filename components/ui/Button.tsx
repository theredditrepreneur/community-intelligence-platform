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

function isLinkButton(props: ButtonProps): props is ButtonLinkProps {
  return typeof (props as ButtonLinkProps).href === 'string';
}

export function Button(props: ButtonProps) {
  if (isLinkButton(props)) {
    const {
      href,
      children,
      variant = 'primary',
      className = '',
      ...anchorProps
    } = props;

    return (
      <Link href={href} className={buttonClasses(variant, className)} {...anchorProps}>
        {children}
      </Link>
    );
  }

  const {
    children,
    variant = 'primary',
    className = '',
    type = 'button',
    ...buttonProps
  } = props;

  return (
    <button className={buttonClasses(variant, className)} type={type} {...buttonProps}>
      {children}
    </button>
  );
}
