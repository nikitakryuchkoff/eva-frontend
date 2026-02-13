import { X } from 'lucide-react';

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

export const ChatHeader = ({ onClose }: ChatHeaderProps) => (
  <header className={styles.header}>
    <div className={styles.right}>
      <Dropdown items={LINKS} />

      <Button variant="ghost" onClick={onClose}>
        <X size={20} />
      </Button>
    </div>
  </header>
);
