import { forwardRef, useCallback, useRef, type ComponentPropsWithoutRef, type FC } from 'react';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import classNames from 'classnames';
import { ErrorBoundary } from '@/shared/components';
import { Message } from '@/enitites/message';
import { Message as MessageItem } from '../Message';
import styles from './VirtualizedChat.module.css';

interface VirtualizedChatProps {
  messages: Message[];
  firstItemIndex: number;
  hasMore: boolean;
  isFetchingMore: boolean;
  fetchNextPage: () => Promise<unknown> | void;
  onButtonClick: (category: string, text: string, context?: string) => void;
  isTyping: boolean;
  onError: () => void;
  onResetError: () => void;
}

const VirtuosoList = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, children, ...props }, ref) => (
    <div {...props} ref={ref} className={classNames(className, styles.virtuosoList)}>
      {children}
    </div>
  ),
);

VirtuosoList.displayName = 'VirtuosoList';

export const VirtualizedChat: FC<VirtualizedChatProps> = ({
  messages,
  firstItemIndex,
  hasMore,
  isFetchingMore,
  fetchNextPage,
  onButtonClick,
  isTyping,
  onError,
  onResetError,
}) => {
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const handleStartReached = useCallback(() => {
    if (hasMore && !isFetchingMore) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasMore, isFetchingMore]);

  return (
    <div className={styles.chat}>
      <ErrorBoundary onError={onError} onReset={onResetError}>
        <Virtuoso
          ref={virtuosoRef}
          style={{ height: '100%' }}
          data={messages}
          computeItemKey={(_, item) => item.innerId}
          initialTopMostItemIndex={messages.length - 1}
          alignToBottom
          followOutput={(isAtBottom) => {
            if (isTyping) {
              return 'smooth';
            }

            if (isAtBottom) {
              return 'smooth';
            } else {
              return false;
            }
          }}
          startReached={handleStartReached}
          firstItemIndex={firstItemIndex}
          atBottomThreshold={200}
          increaseViewportBy={{ top: 200, bottom: 50 }}
          itemContent={(index, item) => (
            <div className={styles.listItem}>
              <MessageItem
                index={index - firstItemIndex}
                message={item}
                onButtonClick={onButtonClick}
                messages={messages}
                isTyping={isTyping}
              />
            </div>
          )}
          components={{
            Header: () =>
              isFetchingMore ? (
                <div className={styles.historyLoader}>
                  <span className={styles.loaderText}>Загружаем ещё...</span>
                </div>
              ) : null,
            List: VirtuosoList,
          }}
        />
      </ErrorBoundary>
    </div>
  );
};
