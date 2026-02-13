import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface UIState {
  isOpen: boolean;
  isMinimized: boolean;
  isMobile: boolean;
  showAttachmentPreview: boolean;
  theme: Theme;

  setOpen: (isOpen: boolean) => void;
  toggle: () => void;
  setMinimized: (isMinimized: boolean) => void;
  setMobile: (isMobile: boolean) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  reset: () => void;
}

const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('eva-theme') as Theme | null;
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

const applyTheme = (theme: Theme) => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
    const container = document.getElementById('eva-chat-container');
    if (container) container.setAttribute('data-theme', theme);
    localStorage.setItem('eva-theme', theme);
  }
};

const initialState = {
  isOpen: true,
  isMinimized: false,
  isMobile: false,
  showAttachmentPreview: false,
  theme: getInitialTheme(),
};

// Apply initial theme on load
applyTheme(initialState.theme);

export const useClientStore = create<UIState>()(
  devtools(
    (set) => ({
      ...initialState,

      setOpen: (isOpen) => set({ isOpen }),

      toggle: () => set((state) => ({ isOpen: !state.isOpen })),

      setMinimized: (isMinimized) => set({ isMinimized }),

      setMobile: (isMobile) => set({ isMobile }),

      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },

      toggleTheme: () =>
        set((state) => {
          const next = state.theme === 'light' ? 'dark' : 'light';
          applyTheme(next);
          return { theme: next };
        }),

      reset: () => set(initialState),
    }),
    { name: 'eva-ui' },
  ),
);

export const selectIsOpen = (state: UIState) => state.isOpen;
export const selectIsMobile = (state: UIState) => state.isMobile;
