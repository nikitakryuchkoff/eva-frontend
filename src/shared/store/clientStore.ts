import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UIState {
  isOpen: boolean;
  isMinimized: boolean;
  isMobile: boolean;
  showAttachmentPreview: boolean;

  setOpen: (isOpen: boolean) => void;
  toggle: () => void;
  setMinimized: (isMinimized: boolean) => void;
  setMobile: (isMobile: boolean) => void;
  reset: () => void;
}

const initialState = {
  isOpen: true,
  isMinimized: false,
  isMobile: false,
  showAttachmentPreview: false,
};

export const useClientStore = create<UIState>()(
  devtools(
    (set) => ({
      ...initialState,

      setOpen: (isOpen) => set({ isOpen }),

      toggle: () => set((state) => ({ isOpen: !state.isOpen })),

      setMinimized: (isMinimized) => set({ isMinimized }),

      setMobile: (isMobile) => set({ isMobile }),

      reset: () => set(initialState),
    }),
    { name: 'eva-ui' },
  ),
);

export const selectIsOpen = (state: UIState) => state.isOpen;
export const selectIsMobile = (state: UIState) => state.isMobile;
