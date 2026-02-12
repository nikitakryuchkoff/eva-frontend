import { CONTEXT } from '@/enitites/message';

export const isContextActive = (context: string | null | undefined, target: string): boolean => {
  return context ? context.toLowerCase().includes(target.toLowerCase()) : false;
};

export const isKandinskyContext = (
  context?: string | null,
  setContext?: string | null,
): boolean => {
  return (
    isContextActive(context, CONTEXT.KANDINSKY) || isContextActive(setContext, CONTEXT.KANDINSKY)
  );
};
