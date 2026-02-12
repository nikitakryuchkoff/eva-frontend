import { createRoot } from 'react-dom/client';

import { QueryProvider } from '@/app/providers';
import { Chat } from '@/features/chat/components/Chat';
import './global.css';

const rootElement = document.getElementById('eva-chat-container');

if (rootElement) {
  createRoot(rootElement).render(
    <QueryProvider>
      <Chat />
    </QueryProvider>,
  );
}
