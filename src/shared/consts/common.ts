import { Frown, Heart, Mail, MessageSquare } from 'lucide-react';

import { getComplexUrl } from '../lib';
import { REACTIONS } from '../types';

export const STORAGE_KEYS = {
  IAM_TOKEN: 'IAM_TOKEN_STORAGE_KEY',
  AUTH_USER: 'AUTH_USER',
  ACCESS_TOKEN: 'accessToken',
};

export const DEBOUNCE_MS = 300;

const MULTIPORPOSE_URL = `${getComplexUrl()}/front/modules/multipurpose/requests/create`;

export const FEEDBACK_TEXT: Record<REACTIONS, string> = {
  [REACTIONS.LIKE]: '',
  [REACTIONS.DISLIKE]:
    'Жаль, что Вам не понравился мой ответ. Напишите, что мне следует узнать и в следующий раз я буду точнее',
};

export const LINKS = [
  {
    id: 'contact',
    label: 'Напишите нам',
    icon: Mail,
    variant: 'default',
    href: 'mailto:evafeedback@sbertech.ru',
  },
  {
    id: 'thanks',
    label: 'Оставить благодарность',
    icon: Heart,
    variant: 'default',
    href: `${MULTIPORPOSE_URL}/677`,
  },
  {
    id: 'idea',
    label: 'Предложить идею',
    icon: MessageSquare,
    variant: 'default',
    href: `${MULTIPORPOSE_URL}/675`,
  },
  {
    id: 'complaint',
    label: 'Пожаловаться',
    icon: Frown,
    variant: 'danger',
    href: `${MULTIPORPOSE_URL}/678`,
  },
];
