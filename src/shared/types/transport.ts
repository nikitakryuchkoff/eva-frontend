export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting';

export type TransportType = 'signalr' | 'websocket';

export interface ReconnectConfig {
  enabled: boolean;
  maxAttempts?: number | undefined;
  baseDelay?: number | undefined;
  maxDelay?: number | undefined;
}

export interface TransportConfig {
  type: TransportType;
  url: string;
  token: string;
  username: string;
  reconnect?: ReconnectConfig;
}

export interface TransportEvents {
  message: (message: any) => void;
  typing: (data: any) => void;
  operatorJoined: (data: any) => void;
  operatorLeft: (data: any) => void;
  threadClosed: (threadId: string) => void;
  error: (error: Error) => void;
}

export interface ITransport {
  readonly status: ConnectionStatus;

  connect(): Promise<void>;
  disconnect(): Promise<void>;

  send(event: string, data: unknown): Promise<void>;
  sendMessage(threadId: string, message: any): Promise<void>;
  sendTyping(threadId: string): Promise<void>;

  on<K extends keyof TransportEvents>(event: K, handler: TransportEvents[K]): () => void;
  off<K extends keyof TransportEvents>(event: K, handler: TransportEvents[K]): void;

  onStatusChange(handler: (status: ConnectionStatus) => void): () => void;
}
