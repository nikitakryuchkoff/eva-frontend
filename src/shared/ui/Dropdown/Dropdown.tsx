import { type FC, useCallback } from 'react';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import classNames from 'classnames';
import { Menu, type LucideIcon } from 'lucide-react';

import { Button } from '..';
import styles from './Dropdown.module.css';

interface Props {
  items: {
    id: string;
    label: string;
    icon: LucideIcon;
    variant?: string | undefined;
    onClick?: (() => void) | undefined;
  }[];
  onSelect?: (id: string) => void;
  align?: 'end' | 'center' | 'start';
  sideOffset?: number;
  title?: string;
}

export const Dropdown: FC<Props> = ({
  items,
  onSelect,
  align = 'end',
  sideOffset = 8,
  title = 'Обратная связь',
}) => {
  const handleSelect = useCallback(
    (id: string, itemOnClick?: () => void) => {
      itemOnClick?.();
      onSelect?.(id);
    },
    [onSelect],
  );

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost">
          <Menu size={17} />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content align={align} sideOffset={sideOffset} className={styles.content}>
          <div className={styles.header}>{title}</div>

          {items.map((item) => (
            <DropdownMenu.Item
              key={item.id}
              className={classNames(styles.item, item.variant === 'danger' && styles.itemDanger)}
              onSelect={() => handleSelect(item.id, item.onClick)}
            >
              <span className={classNames(styles.iconWrap, styles[`icon${item.id}`])}>
                <item.icon className={styles.icon} />
              </span>
              <span className={styles.itemText}>{item.label}</span>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
