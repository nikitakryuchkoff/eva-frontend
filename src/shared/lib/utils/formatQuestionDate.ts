const isSameDay = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

export const formatQuestionDate = (value?: string | null): string | null => {
  if (!value) return null;

  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return null;

  const now = new Date();
  const timePart = date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isSameDay(date, now)) {
    return timePart;
  }

  const isSameYear = date.getFullYear() === now.getFullYear();
  const datePart = date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
    ...(isSameYear ? {} : { year: 'numeric' }),
  });

  return `${datePart}, ${timePart}`;
};
