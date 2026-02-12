import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';

import { baseMarkdownComponents } from './components';

interface Props {
  text: string;
  inline?: boolean;
  allowImages?: boolean;
  componentsOverride?: Partial<Components>;
}

export const Markdown = ({
  text,
  inline = false,
  allowImages = true,
  componentsOverride,
}: Props) => {
  const components: Components = {
    ...baseMarkdownComponents,
    ...componentsOverride,
    ...(inline && {
      p: ({ children }) => <>{children}</>,
    }),
    ...(!allowImages && {
      img: () => null,
    }),
  };

  if (inline) {
    components['p'] = ({ children }) => <>{children}</>;
  }

  if (!allowImages) {
    components['img'] = () => null;
  }

  return (
    <ReactMarkdown
      components={components}
      unwrapDisallowed={inline}
      urlTransform={allowImages ? (url) => url : undefined}
      allowedElements={inline ? ['a', 'strong', 'em', 'code', 'span'] : undefined}
    >
      {text}
    </ReactMarkdown>
  );
};
