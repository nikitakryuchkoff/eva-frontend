import { useState, useCallback, type ReactElement } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { ChevronDown, Check } from 'lucide-react';
import classNames from 'classnames';
import styles from './Select.module.css';
import { SelectOption, SelectProps } from './Select.typed';

export const Select = <T extends SelectOption>({
  options,
  value,
  onChange,
  placeholder = 'Выберите...',
  isLoading = false,
  disabled = false,
  align = 'center',
  sideOffset = 8,
  showStatus = false,
  statusColor = '#22c55e',
  renderOption,
  renderTrigger,
  className,
  triggerClassName,
  contentClassName,
}: SelectProps<T>): ReactElement => {
  const [open, setOpen] = useState(false);

  const handleSelect = useCallback(
    (option: T) => {
      if (option.disabled) return;
      onChange?.(option);
      setOpen(false);
    },
    [onChange],
  );

  const isDisabled = disabled || isLoading;

  const defaultTriggerContent = (
    <>
      {showStatus && (
        <span
          className={styles.statusDot}
          style={{ '--status-color': statusColor } as React.CSSProperties}
          aria-hidden
        />
      )}
      {isLoading ? (
        <span className={styles.skeleton} aria-hidden />
      ) : (
        <span className={styles.triggerText}>
          {value?.title.toLocaleUpperCase() || placeholder}
        </span>
      )}
      <ChevronDown className={classNames(styles.chevron, open && styles.chevronOpen)} size={16} />
    </>
  );

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={classNames(styles.trigger, triggerClassName)}
          disabled={isDisabled}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          {renderTrigger ? renderTrigger(value ?? null, open) : defaultTriggerContent}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align={align}
          sideOffset={sideOffset}
          className={classNames(styles.content, contentClassName, className)}
          role="listbox"
        >
          <div className={styles.list}>
            {options.map((option) => {
              const isSelected = option.id === value?.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={option.disabled}
                  onClick={() => handleSelect(option)}
                  className={classNames(
                    styles.option,
                    isSelected && styles.optionActive,
                    option.disabled && styles.optionDisabled,
                  )}
                >
                  {renderOption ? (
                    renderOption(option, isSelected)
                  ) : (
                    <>
                      <span className={styles.optionText}>{option.title}</span>
                      {isSelected && <Check className={styles.checkIcon} size={16} />}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
