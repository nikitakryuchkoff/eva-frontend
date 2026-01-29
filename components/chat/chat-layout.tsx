"use client"

import { useState, useCallback, useEffect } from 'react'
import { ChatHeader } from './chat-header'
import { MessageList } from './message-list'
import { InputArea } from './input-area'
import type { Message } from '@/lib/types'
import { createMessage, getWelcomeMessage, getOperatorResponse } from '@/lib/chat-store'

export function ChatLayout() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [currentVersion, setCurrentVersion] = useState('eva-v2')
  const [operatorChat, setOperatorChat] = useState(false)

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMsg = getWelcomeMessage('Марина')
    setMessages([welcomeMsg])
  }, [])

  const handleVersionChange = useCallback((versionId: string) => {
    setCurrentVersion(versionId)
  }, [])

  const handleSendMessage = useCallback(async (content: string) => {
    const userMessage = createMessage(content, 'user')
    setMessages((prev) => [...prev, userMessage])

    // Check for operator request
    if (content.toLowerCase().includes('оператор')) {
      setIsTyping(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      const operatorMessages = getOperatorResponse()
      setMessages((prev) => [...prev, ...operatorMessages])
      setOperatorChat(true)
      setIsTyping(false)
      return
    }

    // Simulate bot response
    setIsTyping(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    const botMessage = createMessage(
      'Спасибо за ваш вопрос! Я проанализировала информацию и готова помочь. Что именно вас интересует?',
      'assistant',
      {
        actions: [
          { id: 'help', label: 'Чем я могу помочь' },
          { id: 'artist', label: 'Включить художника' },
        ]
      }
    )
    setMessages((prev) => [...prev, botMessage])
    setIsTyping(false)
  }, [])

  const handleActionClick = useCallback((actionId: string) => {
    if (actionId === 'help') {
      handleSendMessage('Чем я могу помочь')
    } else if (actionId === 'artist') {
      handleSendMessage('Включить художника')
    } else if (actionId === 'end-operator') {
      setOperatorChat(false)
      const endMessage = createMessage(
        'Чат с оператором завершен. Я снова с тобой! Чем могу помочь?',
        'assistant',
        {
          actions: [
            { id: 'help', label: 'Чем я могу помочь' },
          ]
        }
      )
      setMessages((prev) => [...prev, endMessage])
    }
  }, [handleSendMessage])

  const handleClose = useCallback(() => {
    // Handle close action - could minimize chat or navigate away
    console.log('Chat closed')
  }, [])

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-b from-[#f7fafe] to-[#eef4fd]">
      <ChatHeader
        currentVersion={currentVersion}
        onVersionChange={handleVersionChange}
        onClose={handleClose}
      />

      {/* Chat area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <MessageList
          messages={messages}
          isTyping={isTyping}
          onActionClick={handleActionClick}
          operatorChat={operatorChat}
          onEndOperatorChat={() => handleActionClick('end-operator')}
        />

        <InputArea onSend={handleSendMessage} disabled={isTyping} />
      </div>
    </div>
  )
}
