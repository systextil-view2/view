import React from 'react';
import { Box } from './Box';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default';

const variantStyles: Record<BadgeVariant, { bg: string; color: string }> = {
  success: { bg: '#d4edda', color: '#155724' },
  warning: { bg: '#fff3cd', color: '#856404' },
  error: { bg: '#f8d7da', color: '#721c24' },
  info: { bg: '#d1ecf1', color: '#0c5460' },
  default: { bg: '#e9ecef', color: '#495057' }
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  children,
  style,
  ...rest
}) => {
  const sizeStyles = {
    sm: { fontSize: '11px', padding: '2px 6px' },
    md: { fontSize: '12px', padding: '4px 8px' },
    lg: { fontSize: '14px', padding: '6px 12px' }
  };

  const { bg, color } = variantStyles[variant];

  return (
    <span
      style={{
        background: bg,
        color: color,
        fontWeight: 500,
        display: 'inline-block',
        borderRadius: '4px',
        ...sizeStyles[size],
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
};
