import type { Components } from 'react-markdown';

export const baseMarkdownComponents: Components = {
  ul: ({ children }) => <ul className="md-list md-list--unordered">{children}</ul>,
  ol: ({ children }) => <ol className="md-list md-list--ordered">{children}</ol>,
  li: ({ children }) => <li className="md-list__item">{children}</li>,

  a: ({ href, children, ...props }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="md-link" {...props}>
      {children}
    </a>
  ),

  img: ({ src, alt, ...props }) => <img src={src} alt={alt ?? ''} {...props} />,
};
