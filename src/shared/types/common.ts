export interface EntitiesResponse<T> {
  entities: T[];
  total: number;
}

export enum MessageAuthor {
  USER = 'user',
  EVA = 'eva',
  OPERATOR = 'operator',
}

export enum REACTIONS {
  LIKE = 1,
  DISLIKE = 0,
}

export enum MESSAGE_IDS {
  WELCOME = 'welcome',
}

export interface RequestUrlParam {
  name: string;
  value: string;
}
