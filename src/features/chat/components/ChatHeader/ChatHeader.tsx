import styles from './ChatHeader.module.css';
import { Button, Dropdown, Select } from '@/shared/ui';
import { Integration, Integrations } from '@/enitites/integration';
import { LINKS } from '@/shared';
import { X } from 'lucide-react';

export interface BotVersion {
  id: string;
  name: string;
  description: string;
}

interface ChatHeaderProps {
  integrations: Integrations;
  onChange: (value: Integration) => void;
  onClose?: () => void;
  currentIntegration: Integration | null;
  isLoading: boolean;
}

export const ChatHeader = ({
  onChange,
  onClose,
  integrations,
  currentIntegration,
  isLoading,
}: ChatHeaderProps) => (
  <header className={styles.header}>
    <Select
      options={integrations}
      value={currentIntegration}
      onChange={onChange}
      showStatus
      statusColor="#22c55e"
      isLoading={isLoading}
    />

    <div className={styles.right}>
      <Dropdown items={LINKS} />

      <Button variant="ghost" onClick={onClose}>
        <X size={20} />
      </Button>
    </div>
  </header>
);
