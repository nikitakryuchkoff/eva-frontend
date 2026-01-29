export interface MessageAction {
  id: string
  label: string
}

export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  actions?: MessageAction[]
  cardType?: 'default' | 'operator'
  cardTitle?: string
}

export interface BotVersion {
  id: string
  name: string
}
