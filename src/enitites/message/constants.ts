export const MESSAGE_OWNER = {
  USER: 'user',
  EVA: 'eva',
  SYSTEM: 'system',
} as const;

export const CONTEXT = {
  KANDINSKY: 'kandinsky',
} as const;

export const TITLES = {
  DEFAULT: 'default',
  ANOTHER: 'Ни один из вариантов не подходит?',
} as const;

export const BUTTON_CATEGORIES = {
  OPERATOR_RESOLVED: 'operator_chat_resolved',
  OPERATOR_NOT_RESOLVED: 'operator_chat_not_resolved',
} as const;

export const RATING = {
  THRESHOLD: 3,
  MAX: 5,
} as const;

export const FEEDBACK = {
  PREFILL_TEXT: 'Обратная связь: ',
  DISLIKE_RESPONSE: 'Похоже, ответ не помог. Напишите, что исправить — буду точнее.',
  DEFAULT_MESSAGE: 'Хотите оставить отзыв? Напишите «Обратная связь: …» или через ☰ ➔ ✉.',
} as const;

export const ATTACHMENT_TYPE = {
  IMAGE: 'image',
  VIDEO: 'video',
} as const;
