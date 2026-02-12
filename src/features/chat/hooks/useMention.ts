import { useFetchUsers } from '@/enitites/user';
import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { debounce } from 'lodash';
import { DEBOUNCE_MS } from '@/shared';

interface UseMentionOptions {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export const useMention = ({ textareaRef }: UseMentionOptions) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const mentionStartRef = useRef<number>(-1);

  const debouncedSetQuery = useMemo(
    () =>
      debounce((nextQuery: string) => {
        setDebouncedQuery(nextQuery);
      }, DEBOUNCE_MS),
    [],
  );

  useEffect(() => {
    debouncedSetQuery(query);
  }, [query]);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useFetchUsers(
    debouncedQuery,
    isOpen,
  );

  const employees = useMemo(() => data?.pages.flat() ?? [], [data]);

  const handleChange = useCallback((value: string, cursorPos: number) => {
    const mentionQuery = ((text: string, pos: number) => {
      const before = text.slice(0, pos);
      const match = before.match(/@([^\s@]*)$/);
      return match?.[1] ?? null;
    })(value, cursorPos);

    if (mentionQuery !== null) {
      setIsOpen(true);
      setQuery(mentionQuery);
      setActiveIndex(0);
      mentionStartRef.current = cursorPos - mentionQuery.length - 1;
    } else {
      setIsOpen(false);
      setQuery('');
    }
  }, []);

  const selectEmployee = useCallback(
    (employee: any) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = mentionStartRef.current;
      const cursorPos = textarea.selectionStart;
      const text = textarea.value;

      const before = text.slice(0, start);
      const after = text.slice(cursorPos);
      const insertText = `@${employee.name} `;
      const newValue = before + insertText + after;
      const newCursor = before.length + insertText.length;

      const nativeSetter = Object.getOwnPropertyDescriptor(
        HTMLTextAreaElement.prototype,
        'value',
      )?.set;

      nativeSetter?.call(textarea, newValue);
      textarea.dispatchEvent(new Event('input', { bubbles: true }));

      requestAnimationFrame(() => {
        textarea.selectionStart = newCursor;
        textarea.selectionEnd = newCursor;
        textarea.focus();
      });

      setIsOpen(false);
      setQuery('');
    },
    [textareaRef],
  );

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, []);

  return {
    isOpen,
    query,
    employees,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    activeIndex,
    selectEmployee,
    handleChange,
    close,
  };
};
