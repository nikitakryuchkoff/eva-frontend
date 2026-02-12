import { type FC, memo } from 'react';
import { MessageButton } from '@/enitites/message';
import styles from './ButtonGroup.module.css';
import { Button } from '..';

interface Props {
  buttons: MessageButton[];
  disabled?: boolean;
  onClick?: (category: string, text: string) => void;
}

export const ButtonGroup: FC<Props> = memo(({ buttons, disabled, onClick }) => (
  <div className={styles.buttonGroup}>
    {buttons.map((btn, idx) => (
      <Button
        key={`${btn.category}-${idx}`}
        type="button"
        className={styles.actionBtn}
        disabled={disabled}
        onClick={() => onClick?.(btn.category, btn.text)}
        data-spec={`messages-btn-${idx}`}
        variant="outline"
      >
        {btn.text}
      </Button>
    ))}
  </div>
));
