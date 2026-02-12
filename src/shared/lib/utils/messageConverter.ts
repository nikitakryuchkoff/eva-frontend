export const messageConverter = (msg: string | { text: string }[]): string => {
  if (!msg) return '';

  const source = Array.isArray(msg) ? msg.map((item) => item.text).join('<br/>') : msg;

  let html = source;

  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt, url) => {
    return `<img src="${url}" alt="${alt}" style="max-width: 100%; height: auto; display: block; margin: 8px 0;" />`;
  });

  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  );

  html = html.replace(/\n/g, '<br />');

  return html;
};
