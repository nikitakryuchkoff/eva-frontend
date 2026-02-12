import { useCallback, useRef, type FC } from 'react';
import classNames from 'classnames';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import styles from './UserList.module.css';

interface Employee {
  id?: string | number;
  name: string;
  source?: string;
}

interface MentionDropdownProps {
  employees: Employee[];
  activeIndex: number;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage?: boolean;
  fetchNextPage: () => Promise<unknown> | void;
  onSelect: (employee: Employee) => void;
  query: string;
}

const ITEM_HEIGHT = 44;

export const UserList: FC<MentionDropdownProps> = ({
  employees,
  activeIndex,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  onSelect,
  query,
}) => {
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.loading}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.loadingItem}>
              <div className={styles.loadingAvatar} />
              <div className={styles.loadingText} />
            </div>
          ))}
        </div>
      );
    }

    if (employees.length === 0) {
      return <div className={styles.empty}>Сотрудник не найден</div>;
    }

    return (
      <Virtuoso
        ref={virtuosoRef}
        className={styles.list}
        style={{ height: 200 }}
        totalCount={employees.length}
        defaultItemHeight={ITEM_HEIGHT}
        endReached={handleEndReached}
        overscan={100}
        itemContent={(index) => {
          const employee = employees[index];
          if (!employee) {
            return null;
          }

          const isActive = index === activeIndex;

          return (
            <div
              role="option"
              aria-selected={isActive}
              className={classNames(styles.item, isActive && styles.itemActive)}
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect(employee);
              }}
            >
              <span>
                <span className={styles.avatar}>
                  <span className={styles.avatarFallback}>
                    {employee.name.charAt(0).toUpperCase()}
                  </span>
                </span>
              </span>
              <div className={styles.info}>
                <span className={styles.name}>{employee.name}</span>
              </div>
            </div>
          );
        }}
        components={{
          Footer: () =>
            isFetchingNextPage ? (
              <div className={styles.fetchingMore}>Загружаем сотрудников…</div>
            ) : null,
        }}
      />
    );
  };

  return (
    <div className={styles.dropdown} role="listbox" aria-label="Список сотрудников для упоминания">
      <div className={styles.header}>
        <span className={styles.title}>Сотрудники</span>
        {query && <span className={styles.query}>@{query}</span>}
      </div>
      {renderContent()}
    </div>
  );
};
