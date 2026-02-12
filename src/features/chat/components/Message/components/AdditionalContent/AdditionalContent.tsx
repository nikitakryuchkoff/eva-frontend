import { type FC, memo } from 'react';

import styles from '../../Message.module.css';
import { Markdown } from '@/shared';

interface Props {
  html: string;
  onLinkClick?: (e: React.MouseEvent, href: string) => void;
}

export const AdditionalContent: FC<Props> = memo(({ html, onLinkClick }) => {
  return (
    <div className={styles.additionalContent} data-spec="additional-text">
      <Markdown
        text={html}
        allowImages={false}
        componentsOverride={{
          a: ({ href, children }) => (
            <a
              href={href}
              onClick={(e) => {
                if (onLinkClick && href) {
                  e.preventDefault();
                  onLinkClick(e, href);
                }
              }}
            >
              {children}
            </a>
          ),
        }}
      />
    </div>
  );
});
