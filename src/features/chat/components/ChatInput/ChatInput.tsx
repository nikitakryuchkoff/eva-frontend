import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';

import classNames from 'classnames';
import { Plus, Paperclip, Mic, Send, ChevronDown } from 'lucide-react';

import { Integration, Integrations } from '@/enitites/integration';
import { Select } from '@/shared/ui';

import styles from './ChatInput.module.css';
import { useMention } from '../../hooks';
import { UserList } from '../UserList/UserList';

interface InputAreaProps {
  onSend: (message: string) => void;
  integrations: Integrations;
  currentIntegration: Integration | null;
  onIntegrationChange: (value: Integration) => void;
  isIntegrationsLoading?: boolean;
  disabled?: boolean;
  statusText?: string;
  helperText?: string;
}

export const ChatInput = ({
  onSend,
  integrations,
  currentIntegration,
  onIntegrationChange,
  isIntegrationsLoading = false,
  disabled,
}: InputAreaProps) => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isMentionVisible, setIsMentionVisible] = useState(false);
  const [isMentionClosing, setIsMentionClosing] = useState(false);
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

  const handleInputWrapMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    const target = event.target as HTMLElement;
    if (target.closest('[data-chat-footer]')) {
      return;
    }

    event.preventDefault();

    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.focus();
    const cursorPos = textarea.value.length;
    textarea.setSelectionRange(cursorPos, cursorPos);
  };

  useEffect(() => {
    if (isOpen) {
      setIsMentionVisible(true);
      setIsMentionClosing(false);
      return;
    }

    if (!isMentionVisible) return;

    setIsMentionClosing(true);
    const timer = setTimeout(() => {
      setIsMentionVisible(false);
      setIsMentionClosing(false);
    }, 220);

    return () => clearTimeout(timer);
  }, [isOpen, isMentionVisible]);

  const innerClassName = classNames(
    styles.inner,
    isFocused && styles.innerFocused,
    disabled && styles.innerDisabled,
  );

  return (
    <div className={styles.wrapper}>
      <div className={innerClassName}>
        {isMentionVisible && (
          <UserList
            employees={employees}
            activeIndex={activeIndex}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            onSelect={selectEmployee}
            query={query}
            isClosing={isMentionClosing}
          />
        )}

        <div className={styles.inputWrap} onMouseDown={handleInputWrapMouseDown}>
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
          <div className={styles.inputFooter} data-chat-footer>
            <div className={styles.footerLeft}>
              <button type="button" className={styles.composerIcon} aria-label="Добавить">
                <Plus size={18} />
              </button>
              <button type="button" className={styles.composerIcon} aria-label="Прикрепить файл">
                <Paperclip size={16} />
              </button>
              <button type="button" className={styles.composerIcon} aria-label="Голосовое сообщение">
                <Mic size={16} />
              </button>

              <div className={styles.integrationControl}>
                <Select
                  options={integrations}
                  value={currentIntegration}
                  onChange={onIntegrationChange}
                  showStatus={false}
                  isLoading={isIntegrationsLoading}
                  disabled={Boolean(disabled)}
                  align="start"
                  sideOffset={6}
                  triggerClassName={styles.integrationTrigger ?? ''}
                  contentClassName={styles.integrationContent ?? ''}
                />
              </div>
            </div>

            <div className={styles.sendGroup}>
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
              <button type="button" className={styles.sendChevron} aria-label="Ещё">
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
