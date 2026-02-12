import { type FC, memo } from 'react';
import styles from '../../Message.module.css';
import { Markdown } from '@/shared';

interface Props {
  title: string | null;
  actionData: { type: string; name: string };
}

export const ActionContent: FC<Props> = memo(({ title }) => {
  return (
    <div className={styles.actionContent}>
      <Markdown text={title ?? ''} />
    </div>
  );
});
