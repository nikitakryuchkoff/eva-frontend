import { ReactNode } from 'react';

export interface SelectOption {
  id: string;
  title: string;
  disabled?: boolean;
}

export interface SelectProps<T extends SelectOption> {
  options: T[];
  value?: T | null;
  onChange?: (option: T) => void;
  placeholder?: string;
  isLoading?: boolean;
  disabled?: boolean;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  showStatus?: boolean;
  statusColor?: string;
  renderOption?: (option: T, isSelected: boolean) => ReactNode;
  renderTrigger?: (option: T | null, isOpen: boolean) => ReactNode;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
}
