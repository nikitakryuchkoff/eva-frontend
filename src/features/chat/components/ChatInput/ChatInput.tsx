import { useState, useRef, type KeyboardEvent } from 'react';
import classNames from 'classnames';
import styles from './ChatInput.module.css';
import { Send } from 'lucide-react';
import { useMention } from '../../hooks';
import { UserList } from '../UserList/UserList';

interface InputAreaProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  statusText?: string;
  helperText?: string;
}

export const ChatInput = ({ onSend, disabled }: InputAreaProps) => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    close,
    handleChange,
    isOpen,
    employees,
    activeIndex,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    selectEmployee,
    query,
  } = useMention({
    textareaRef,
  });

  const onChange = (newValue: string) => {
    setValue(newValue);
    const cursorPos = textareaRef.current?.selectionStart ?? newValue.length;
    handleChange(newValue, cursorPos);
  };

  const handleSend = () => {
    if (value.trim() && !disabled) {
      onSend(value.trim());
      setValue('');
      close();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const hasValue = value.trim().length > 0;

  const innerClassName = classNames(
    styles.inner,
    isFocused && styles.innerFocused,
    disabled && styles.innerDisabled,
  );

  return (
    <div className={styles.wrapper}>
      <div className={innerClassName}>
        {isOpen && (
          <UserList
            employees={employees}
            activeIndex={activeIndex}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            onSelect={selectEmployee}
            query={query}
          />
        )}

        <div className={styles.inputWrap}>
          {!value && !isFocused && <span className={styles.placeholder}>Напишите сообщение</span>}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            rows={1}
            className={styles.textarea}
          />
        </div>

        <button
          type="button"
          className={classNames(styles.sendButton, hasValue && styles.animateIn)}
          onClick={handleSend}
          disabled={disabled || !hasValue}
          aria-label="Отправить"
        >
          <Send className={styles.sendIcon} />
          <span className={styles.srOnly}>Отправить</span>
        </button>
      </div>
    </div>
  );
};
