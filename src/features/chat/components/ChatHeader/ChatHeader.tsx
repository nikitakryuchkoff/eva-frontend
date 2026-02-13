import { Sun, Moon, X } from 'lucide-react';

import { LINKS } from '@/shared';
import { useClientStore } from '@/shared/store';
import { Button, Dropdown } from '@/shared/ui';

import styles from './ChatHeader.module.css';


export interface BotVersion {
  id: string;
  name: string;
  description: string;
}

interface ChatHeaderProps {
  onClose?: () => void;
}

export const ChatHeader = ({ onClose }: ChatHeaderProps) => {
  const theme = useClientStore((s) => s.theme);
  const toggleTheme = useClientStore((s) => s.toggleTheme);

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.botBadge}>
          <span className={styles.botIcon}>E</span>
        </div>
        <div className={styles.titleBlock}>
          <span className={styles.title}>EVA Assistant</span>
        </div>
      </div>

      <div className={styles.right}>
        <Button variant="ghost" className={styles.headerBtn} onClick={toggleTheme} aria-label="Переключить тему">
          {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
        </Button>

        <Dropdown items={LINKS} />

        <Button variant="ghost" className={styles.headerBtn} onClick={onClose}>
          <X size={17} />
        </Button>
      </div>
    </header>
  );
};
