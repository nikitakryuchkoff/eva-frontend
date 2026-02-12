import { type FC, useCallback } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MoreVertical, type LucideIcon } from 'lucide-react';
import classNames from 'classnames';
import styles from './Dropdown.module.css';
import { Button } from '..';

interface DropdownItem {
  id: string;
  label: string;
  icon: LucideIcon;
  variant?: string | undefined;
  onClick?: (() => void) | undefined;
}

interface Props {
  items: DropdownItem[];
  onSelect?: (id: string) => void;
  align?: 'end' | 'center' | 'start';
  sideOffset?: number;
}

export const Dropdown: FC<Props> = ({ items, onSelect, align = 'end', sideOffset = 8 }) => {
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
          <MoreVertical size={20} />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content align={align} sideOffset={sideOffset} className={styles.content}>
          <div className={styles.header}>Обратная связь</div>
          <DropdownMenu.Separator className={styles.separator} />

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
