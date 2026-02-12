import { type FC, type ReactNode, useState, useRef, useEffect } from 'react';

import classNames from 'classnames';

import styles from './Tooltip.module.css';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom';
  delay?: number;
}

export const Tooltip: FC<TooltipProps> = ({ content, children, position = 'top', delay = 200 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setCoords({
          x: rect.left + rect.width / 2,
          y: position === 'top' ? rect.top : rect.bottom,
        });
      }
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={triggerRef}
      className={styles.trigger}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && (
        <div
          className={classNames(styles.tooltip, styles[position])}
          style={
            {
              '--tooltip-x': `${coords.x}px`,
              '--tooltip-y': `${coords.y}px`,
            } as React.CSSProperties
          }
          role="tooltip"
        >
          <span className={styles.content}>{content}</span>
          <span className={styles.arrow} />
        </div>
      )}
    </div>
  );
};
