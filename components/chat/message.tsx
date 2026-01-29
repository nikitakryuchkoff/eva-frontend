"use client"

import { cn } from '@/lib/utils'
import type { Message as MessageType } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Bot, User, Headphones } from 'lucide-react'

interface MessageProps {
  message: MessageType
  showActions?: boolean
  onActionClick?: (action: string) => void
}

export function Message({ message, showActions, onActionClick }: MessageProps) {
  const isUser = message.role === 'user'

  // Check if message has special card type
  if (message.cardType === 'operator') {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
        <div className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f59e0b] to-[#fbbf24] shadow-md">
            <Headphones className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="rounded-2xl rounded-tl-md bg-white border border-[#e5eaef] p-4 shadow-sm">
              <h3 className="text-[14px] font-semibold text-[#212121] mb-1.5">
                {message.cardTitle || 'Чат с оператором'}
              </h3>
              <p className="text-[14px] text-[#424242] leading-relaxed">
                {message.content}
              </p>
            </div>
            <span className="text-[11px] text-[#bdbdbd] pl-1">
              {new Date(message.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-bottom-3 duration-300",
        isUser ? "flex justify-end" : ""
      )}
    >
      {isUser ? (
        // User message - pill on the right with avatar
        <div className="flex flex-row-reverse gap-3 max-w-[85%]">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#377BF3] to-[#75a4f6] shadow-md">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col items-end space-y-1">
            <div className="rounded-2xl rounded-tr-md bg-[#377BF3] px-4 py-3 text-white shadow-sm">
              <p className="text-[14px] leading-relaxed">{message.content}</p>
            </div>
            <span className="text-[11px] text-[#bdbdbd] pr-1">
              {new Date(message.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      ) : (
        // Bot message - card on the left with avatar
        <div className="flex gap-3 max-w-[85%]">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#377BF3] to-[#75a4f6] shadow-md">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 space-y-3">
            <div className="space-y-1">
              <div className="rounded-2xl rounded-tl-md bg-white border border-[#e5eaef] p-4 shadow-sm">
                <p className="text-[14px] text-[#212121] leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
              <span className="text-[11px] text-[#bdbdbd] pl-1">
                {new Date(message.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            {/* Quick action buttons */}
            {showActions && message.actions && message.actions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {message.actions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => onActionClick?.(action.id)}
                    className="h-9 px-4 text-[13px] font-medium border border-[#377BF3] text-[#377BF3] rounded-lg hover:bg-[#377BF3] hover:text-white transition-colors duration-200 bg-white"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Operator chat card component
interface OperatorChatCardProps {
  title: string
  message: string
  userName?: string
  onEndChat?: () => void
}

export function OperatorChatCard({ title, message, userName, onEndChat }: OperatorChatCardProps) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* Operator card */}
      <div className="flex gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f59e0b] to-[#fbbf24] shadow-md">
          <Headphones className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="rounded-2xl rounded-tl-md bg-white border border-[#e5eaef] p-4 shadow-sm">
            <h3 className="text-[14px] font-semibold text-[#212121] mb-1.5">{title}</h3>
            <p className="text-[14px] text-[#424242] leading-relaxed">{message}</p>
          </div>
        </div>
      </div>

      {/* User greeting card */}
      {userName && (
        <div className="flex gap-3">
          <div className="w-9" />
          <div className="flex-1">
            <div className="rounded-2xl bg-[#f7fafe] border border-[#bad1fb] p-4">
              <p className="text-[14px] text-[#212121] leading-relaxed">
                Привет, {userName}<br />
                У тебя есть активный чат с оператором. Можешь продолжить общение.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* End chat button */}
      {onEndChat && (
        <div className="flex gap-3">
          <div className="w-9" />
          <button
            onClick={onEndChat}
            className="h-9 px-4 text-[13px] font-medium border border-[#377BF3] text-[#377BF3] rounded-lg hover:bg-[#377BF3] hover:text-white transition-colors duration-200 bg-white"
          >
            Завершить чат с оператором
          </button>
        </div>
      )}
    </div>
  )
}
