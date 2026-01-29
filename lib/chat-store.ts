"use client"

import type { Message, MessageAction } from './types'

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

export function createMessage(
  content: string, 
  role: 'user' | 'assistant',
  options?: {
    actions?: MessageAction[]
    cardType?: 'default' | 'operator'
    cardTitle?: string
  }
): Message {
  return {
    id: generateId(),
    content,
    role,
    timestamp: new Date(),
    actions: options?.actions,
    cardType: options?.cardType,
    cardTitle: options?.cardTitle,
  }
}

// Initial welcome message from Eva
export function getWelcomeMessage(userName: string = 'друг'): Message {
  return createMessage(
    `Привет, ${userName}! Я — Ева, твоя помощница по рабочим вопросам в СберТехе. Буду рада помочь тебе разобраться со всеми задачами и вопросами. Обращайся в любое время!`,
    'assistant',
    {
      actions: [
        { id: 'help', label: 'Чем я могу помочь' },
        { id: 'artist', label: 'Включить художника' },
      ]
    }
  )
}

// Response for operator request
export function getOperatorResponse(): Message[] {
  return [
    createMessage('Перенаправляю на оператора.', 'assistant', {
      cardType: 'operator',
      cardTitle: 'Чат с оператором'
    }),
  ]
}
