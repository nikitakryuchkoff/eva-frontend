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
          <img src={'./images/logo.gif'} alt="Logo" />
        </div>
        <div className={styles.titleBlock}>
          <span className={styles.title}>EVA</span>
        </div>
      </div>

      <div className={styles.right}>
        <Button
          variant="ghost"
          className={styles.headerBtn}
          onClick={toggleTheme}
          aria-label="Переключить тему"
        >
          {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
        </Button>

        <Dropdown items={LINKS} triggerClassName={styles.headerBtn ?? ''} alignOffset={-54} />

        <Button variant="ghost" className={styles.headerBtn} onClick={onClose}>
          <X size={17} />
        </Button>
      </div>
    </header>
  );
};
