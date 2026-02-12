import { create } from 'zustand';

import { Message } from '@/enitites/message';

interface ChatState {
  messages: Message[];
  threadId: string | null;
  context: string | null;
}

interface ChatActions {
  addMessage: (message: Message) => void;
  addMessages: (messages: Message[]) => void;
  prependMessages: (messages: Message[]) => void;
  setMessages: (messages: Message[]) => void;
  setThreadId: (id: string | null) => void;
  setContext: (context: string | null) => void;
  resetContext: () => void;
  reset: () => void;
}

const initialState: ChatState = {
  messages: [],
  threadId: null,
  context: null,
};

export const normalizeQuestionDate = (message: Message): Message => {
  const parsedDate = new Date(message.questionDate).getTime();

  if (Number.isFinite(parsedDate)) {
    return message;
  }

  return {
    ...message,
    questionDate: new Date().toISOString(),
  };
};

export const useChatStore = create<ChatState & ChatActions>()((set) => ({
  ...initialState,

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, normalizeQuestionDate(message)],
    })),

  addMessages: (messages) =>
    set((state) => ({
      messages: [...state.messages, ...messages],
    })),

  prependMessages: (messages) =>
    set((state) => ({
      messages: [...messages, ...state.messages],
    })),

  setMessages: (messages) => set({ messages }),

  setThreadId: (id) => set({ threadId: id }),
  setContext: (context) => set({ context }),

  resetContext: () => set({ context: null, threadId: null }),

  reset: () => set(initialState),
}));
