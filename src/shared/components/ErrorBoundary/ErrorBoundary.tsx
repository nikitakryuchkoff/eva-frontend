import { Component, type ReactNode, type ErrorInfo } from 'react';

import { Button } from '@/shared/ui';

import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryProps {
  children: ReactNode;
  onError?: ((error: Error) => void) | undefined;
  onReset?: (() => void) | undefined;
  fallback?: ReactNode | undefined;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[EvaChat] Error:', error, errorInfo);
    this.props.onError?.(error);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={styles.container}>
          <div className={styles.icon}>⚠️</div>
          <h3 className={styles.title}>Что-то пошло не так</h3>
          <p className={styles.message}>Чат не загрузился. Попробуйте ещё раз.</p>

          <Button onClick={this.handleRetry}> Попробовать снова</Button>
        </div>
      );
    }

    return this.props.children;
  }
}
