import { createElement } from 'react';

import { createRoot } from 'react-dom/client';

import { Eva } from './Eva';
import '@/app/global.css';

const DEFAULT_CONTAINER_SELECTOR = '#eva-chat-container';
const SHADOW_STYLE_ID = 'eva-chat-style';
const SHADOW_MOUNT_ID = 'eva-chat-root';

const getEvaCss = () => (window as Window & { __EVA_CSS__?: string }).__EVA_CSS__ ?? '';

const syncStyles = (shadowRoot: ShadowRoot) => {
  let styleNode = shadowRoot.getElementById(SHADOW_STYLE_ID) as HTMLStyleElement | null;

  if (!styleNode) {
    styleNode = document.createElement('style');
    styleNode.id = SHADOW_STYLE_ID;
    shadowRoot.prepend(styleNode);
  }

  styleNode.textContent = getEvaCss();
};

const resolveContainer = (container: string | HTMLElement) => {
  if (typeof container === 'string') {
    return document.querySelector<HTMLElement>(container);
  }

  return container;
};

export const mountWidget = (container: string | HTMLElement = DEFAULT_CONTAINER_SELECTOR) => {
  const host = resolveContainer(container);

  if (!host) {
    throw new Error(`Widget container "${String(container)}" not found`);
  }

  const shadowRoot = host.shadowRoot ?? host.attachShadow({ mode: 'open' });

  syncStyles(shadowRoot);

  let mountNode = shadowRoot.getElementById(SHADOW_MOUNT_ID) as HTMLDivElement | null;
  if (!mountNode) {
    mountNode = document.createElement('div');
    mountNode.id = SHADOW_MOUNT_ID;
    shadowRoot.appendChild(mountNode);
  }

  const root = createRoot(mountNode);
  root.render(createElement(Eva, { shadowRoot }));

  const stylesObserver = new MutationObserver(() => {
    syncStyles(shadowRoot);
  });

  stylesObserver.observe(document.head, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  return {
    unmount: () => {
      stylesObserver.disconnect();
      root.unmount();
    },
  };
};
