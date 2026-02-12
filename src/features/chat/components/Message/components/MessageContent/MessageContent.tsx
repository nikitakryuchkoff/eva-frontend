import { type FC, memo } from 'react';

import styles from '../../Message.module.css';
import { useMessageContent } from '@/enitites/message/lib/hooks';
import { TextContent } from '../TextContent';
import { GeneratedImageContent } from '../GeneratedImageContent';
import { AdditionalContent } from '../AdditionalContent';

interface Props {
  content: ReturnType<typeof useMessageContent>;
  isLast: boolean;
  contentWidth?: number | undefined;
  onLinkClick?: ((e: React.MouseEvent, href: string) => void) | undefined;
}

export const MessageContent: FC<Props> = memo(({ content, isLast, onLinkClick }) => {
  const { title, showTitle, blocks, additionalText } = content;

  // if (hasAction && actionData) {
  //   return <ActionContent title={title} actionData={actionData} />;
  // }

  if (additionalText && onLinkClick) {
    return <AdditionalContent html={additionalText} onLinkClick={onLinkClick} />;
  }

  return (
    <div className={styles.content}>
      {showTitle && title && <h3 className={styles.title}>{title}</h3>}

      {blocks?.map((block) => {
        const { id, request, text, classId } = block;

        const isImageBlock = !!request;

        if (isImageBlock) {
          return <GeneratedImageContent key={id} request={request} isLast={isLast} />;
        }

        return <TextContent key={id} text={text} classId={classId} />;
      })}
    </div>
  );
});
