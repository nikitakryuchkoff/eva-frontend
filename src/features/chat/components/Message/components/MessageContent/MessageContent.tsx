import { type FC, memo } from 'react';

import { useMessageContent } from '@/enitites/message';

import styles from './MessageContent.module.css';
import { AdditionalContent } from '../AdditionalContent';
import { GeneratedImageContent } from '../GeneratedImageContent';
import { TextContent } from '../TextContent';

interface Props {
  content: ReturnType<typeof useMessageContent>;
  isLast: boolean;
  onLinkClick?: ((e: React.MouseEvent, href: string) => void) | undefined;
}

export const MessageContent: FC<Props> = memo(({ content, isLast, onLinkClick }) => {
  const { title, showTitle, blocks, additionalText } = content;

  if (additionalText && onLinkClick) {
    return <AdditionalContent html={additionalText} onLinkClick={onLinkClick} />;
  }

  return (
    <div className={styles.content}>
      {showTitle && title && <h3 className={styles.title}>{title}</h3>}

      {blocks?.map((block) => {
        const { id, request, text } = block;

        const isImageBlock = !!request;

        if (isImageBlock) {
          return <GeneratedImageContent key={id} request={request} isLast={isLast} />;
        }

        return <TextContent key={id} text={text} />;
      })}
    </div>
  );
});
