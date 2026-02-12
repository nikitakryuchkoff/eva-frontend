import { useEffect } from 'react';
import { QueryProvider } from '@/app/providers';
import { Chat } from '@/features/chat/components/Chat';
import { useClientStore } from '@/shared';

interface WidgetAppProps {
  shadowRoot: ShadowRoot;
  onReady?: (() => void) | undefined;
  onError?: ((error: Error) => void) | undefined;
  onOpen?: (() => void) | undefined;
  onClose?: (() => void) | undefined;
}

export const Eva = ({ shadowRoot, onReady, onOpen, onClose }: WidgetAppProps) => {
  const setOpen = useClientStore((s) => s.setOpen);
  const isOpen = useClientStore((s) => s.isOpen);

  useEffect(() => {
    const handler = (e: Event) => {
      const action = (e as CustomEvent<{ action: string }>).detail.action;
      if (action === 'open') {
        setOpen(true);
        onOpen?.();
      } else if (action === 'close') {
        setOpen(false);
        onClose?.();
      } else if (action === 'toggle') {
        setOpen(!isOpen);
        if (!isOpen) {
          onOpen?.();
        } else {
          onClose?.();
        }
      }
    };

    shadowRoot.addEventListener('eva-chat-action', handler);
    return () => shadowRoot.removeEventListener('eva-chat-action', handler);
  }, [shadowRoot, setOpen, isOpen, onOpen, onClose]);

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  return (
    <QueryProvider>
      <Chat />
    </QueryProvider>
  );
};
