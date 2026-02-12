import { MessageAuthor, RequestUrlParam } from '@/shared/types';

export type Message = {
  id: number | string;
  innerId: number | string;
  integrationId: string;
  integrationName: string;
  threadId: string;
  questionDate: string;
  login: string;
  sigmaLogin: string;
  userName: string;
  question: string | null;
  originalQuestion: string;
  answer: string | null;
  answerText: string;
  answerType: string;
  rate: number;
  setContext: string;
  context: string | null;
  isButton: boolean;
  like: boolean | null;
  categoryOriginId: number | null;
  source: string;
  isSentByEmail: boolean;
  answerGood: boolean | null;
  author: MessageAuthor;
  isLikeable?: boolean;
};

export type Messages = Message[];

export type MessageButton = {
  category: string;
  text: string;
};

export type ImageRequest = {
  method: string;
  url: string;
  urlParams: Array<{ name: string; value: string }>;
  body: null;
};

export type MessageRequest = {
  id: string;
  title: string;
  source: string;
  integrationId: string;
  threadId?: string | null;
  context?: string | null;
  files?: File[];
};

export type MessageButtonRequest = {
  category: string;
  context?: string | null;
  source: string;
  title: string;
  integrationId: string;
  query: string | null;
  threadId?: string | null;
};

export type MessageResponse = {
  id: number;
  title: string;
  rate: number;
  isLikeable: boolean;
  questionChanged: string;
  originalCategorys: string[];
  specificationMessage: string | null;
  integrationId: string;
  threadId: string;
  context: string;
};

export type ParsedTextItem = {
  classId: string;
  text: string;
  request?: ImageRequest;
  bold?: string[];
  links?: Array<{ href: string; text: string }>;
  images?: Array<{ id: string; src: string }>;
};

export type MessageTitleRequest = {
  method: string;
  url: string;
  urlParams: RequestUrlParam[];
  body: unknown | null;
};

export type MessageTextContent = {
  title: string;
  messages: {
    text: string;
    classId: string;
    request: MessageTitleRequest | null;
  }[];
  buttons: MessageButton[];
  additionalInfo: string | null;
  action: string | null;
};

export const isUserMessage = (msg: Message) => msg.author === MessageAuthor.USER;

export const isAssistantMessage = (msg: Message) => msg.author === MessageAuthor.EVA;
