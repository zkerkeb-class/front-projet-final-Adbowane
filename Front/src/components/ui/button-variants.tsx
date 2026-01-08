
import React from 'react';
import { Button, ButtonProps } from './button';
import { cn } from '@/lib/utils';

interface GradientButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export const GradientButton: React.FC<GradientButtonProps> = ({ 
  children, 
  className, 
  ...props 
}) => {
  return (
    <Button
      className={cn("btn-gradient", className)}
      {...props}
    >
      {children}
    </Button>
  );
};

interface NeonButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export const NeonButton: React.FC<NeonButtonProps> = ({ 
  children, 
  className, 
  ...props 
}) => {
  return (
    <Button
      className={cn("btn-neon", className)}
      variant="outline"
      {...props}
    >
      {children}
    </Button>
  );
};

interface FloatingButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({ 
  children, 
  className, 
  ...props 
}) => {
  return (
    <Button
      className={cn("btn-floating", className)}
      {...props}
    >
      {children}
    </Button>
  );
};

interface StatusBadgeProps {
  children: React.ReactNode;
  status: 'success' | 'warning' | 'danger';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  children, 
  status, 
  className 
}) => {
  return (
    <span className={cn(`status-badge status-${status}`, className)}>
      {children}
    </span>
  );
};
