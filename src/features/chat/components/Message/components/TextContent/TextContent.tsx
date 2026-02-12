import { type FC, memo } from 'react';

import { Markdown } from '@/shared';

interface Props {
  text: string;
}

export const TextContent: FC<Props> = memo(({ text }) => {
  return (
    <div>
      <Markdown text={text} />
    </div>
  );
});
