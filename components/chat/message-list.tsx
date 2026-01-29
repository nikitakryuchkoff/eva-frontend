"use client"

import { useEffect, useRef } from 'react'
import { Message, OperatorChatCard } from './message'
import { TypingIndicator } from './typing-indicator'
import type { Message as MessageType } from '@/lib/types'
import { ScrollArea } from '@/components/ui/scroll-area'

interface MessageListProps {
  messages: MessageType[]
  isTyping: boolean
  onActionClick?: (actionId: string) => void
  operatorChat?: boolean
  onEndOperatorChat?: () => void
}

export function MessageList({ 
  messages, 
  isTyping, 
  onActionClick,
  operatorChat,
  onEndOperatorChat 
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  return (
    <ScrollArea className="flex-1">
      <div ref={scrollRef} className="mx-auto max-w-2xl space-y-5 px-4 py-6">
        {messages.map((message, index) => (
          <Message
            key={message.id}
            message={message}
            showActions={message.role === 'assistant' && !!message.actions && index === messages.length - 1}
            onActionClick={onActionClick}
          />
        ))}
        
        {/* Operator chat section */}
        {operatorChat && (
          <OperatorChatCard
            title="Чат с оператором"
            message="Перенаправляю на оператора."
            userName="Марина"
            onEndChat={onEndOperatorChat}
          />
        )}
        
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} className="h-1" />
      </div>
    </ScrollArea>
  )
}
