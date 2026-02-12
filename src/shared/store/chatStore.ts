import { Message } from '@/enitites/message';
import { create } from 'zustand';

interface ChatState {
  messages: Message[];
  threadId: string | null;
  context: string | null;
  isLoading: boolean;
  isGreetingLoading: boolean;
  isSending: boolean;
  isTyping: boolean;
  operatorName: string;
  hasOperatorChat: boolean;
  threadInFeedbackState: boolean;
  waitForCustomerResolve: boolean;
}

interface ChatActions {
  addMessage: (message: Message) => void;
  addMessages: (messages: Message[]) => void;
  prependMessages: (messages: Message[]) => void;
  setMessages: (messages: Message[]) => void;
  setThreadId: (id: string | null) => void;
  setContext: (context: string | null) => void;
  setLoading: (loading: boolean) => void;
  setGreetingLoading: (loading: boolean) => void;
  setSending: (sending: boolean) => void;
  setTyping: (typing: boolean) => void;
  setOperatorName: (name: string) => void;
  setHasOperatorChat: (has: boolean) => void;
  setThreadInFeedbackState: (state: boolean) => void;
  setWaitForCustomerResolve: (state: boolean) => void;
  resetContext: () => void;
  reset: () => void;
}

const initialState: ChatState = {
  messages: [],
  threadId: null,
  context: null,
  isLoading: false,
  isGreetingLoading: false,
  isSending: false,
  isTyping: false,
  operatorName: '',
  hasOperatorChat: false,
  threadInFeedbackState: false,
  waitForCustomerResolve: false,
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
  setLoading: (loading) => set({ isLoading: loading }),
  setGreetingLoading: (loading) => set({ isGreetingLoading: loading }),
  setSending: (sending) => set({ isSending: sending }),
  setTyping: (typing) => set({ isTyping: typing }),
  setOperatorName: (name) => set({ operatorName: name }),
  setHasOperatorChat: (has) => set({ hasOperatorChat: has }),
  setThreadInFeedbackState: (state) => set({ threadInFeedbackState: state }),
  setWaitForCustomerResolve: (state) => set({ waitForCustomerResolve: state }),

  resetContext: () => set({ context: null, threadId: null }),

  reset: () => set(initialState),
}));
