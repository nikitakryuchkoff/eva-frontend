import { forwardRef } from 'react';
import styles from './Button.module.css';
import { ButtonProps } from './Button.typed';

const Spinner = () => (
  <svg
    className={styles.spinner}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="32"
      strokeDashoffset="12"
    />
  </svg>
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    const buttonClass = [
      styles.button,
      styles[variant],
      styles[size],
      fullWidth && styles.fullWidth,
      isLoading && styles.loading,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button ref={ref} type="button" disabled={isDisabled} className={buttonClass} {...props}>
        {isLoading && <Spinner />}
        {!isLoading && leftIcon && <span className={styles.icon}>{leftIcon}</span>}
        {children && <span className={styles.text}>{children}</span>}
        {!isLoading && rightIcon && <span className={styles.icon}>{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = 'Button';
