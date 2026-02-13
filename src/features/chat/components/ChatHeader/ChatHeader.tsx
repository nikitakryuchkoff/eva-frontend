import { Video, X } from 'lucide-react';

import { LINKS } from '@/shared';
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

const MOCK_AVATARS = [
  { name: 'E', color: '#6366f1' },
  { name: 'A', color: '#f59e0b' },
  { name: 'M', color: '#10b981' },
];

export const ChatHeader = ({ onClose }: ChatHeaderProps) => (
  <header className={styles.header}>
    <div className={styles.left}>
      <div className={styles.botBadge}>
        <span className={styles.botIcon}>E</span>
      </div>
      <div className={styles.titleBlock}>
        <span className={styles.title}>EVA Assistant</span>
        <span className={styles.subtitle}>Online</span>
      </div>
    </div>

    <div className={styles.right}>
      <div className={styles.avatarStack}>
        {MOCK_AVATARS.map((a, i) => (
          <div
            key={i}
            className={styles.avatar}
            style={{ background: a.color, zIndex: MOCK_AVATARS.length - i }}
          >
            {a.name}
          </div>
        ))}
        <div className={styles.avatarBadge}>+14</div>
      </div>

      <Button variant="ghost" className={styles.headerBtn}>
        <Video size={18} />
      </Button>

      <Dropdown items={LINKS} />

      <Button variant="ghost" className={styles.headerBtn} onClick={onClose}>
        <X size={18} />
      </Button>
    </div>
  </header>
);
