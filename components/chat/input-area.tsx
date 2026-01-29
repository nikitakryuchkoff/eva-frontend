"use client"

import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Paperclip, Send, Mic } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InputAreaProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function InputArea({ onSend, disabled }: InputAreaProps) {
  const [value, setValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [value])

  const handleSend = () => {
    if (value.trim() && !disabled) {
      onSend(value.trim())
      setValue('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const hasValue = value.trim().length > 0

  return (
    <div className="border-t border-[#e5eaef] bg-white px-4 py-4">
      <div
        className={cn(
          "relative flex items-end gap-3 rounded-2xl border-2 bg-[#f7fafe] px-4 py-3 transition-all duration-200",
          isFocused ? "border-[#377BF3] bg-white shadow-sm" : "border-transparent",
          disabled && "opacity-60"
        )}
      >
        {/* Attachment button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={disabled}
          className="h-9 w-9 shrink-0 rounded-full text-[#8e8e8e] hover:text-[#377BF3] hover:bg-[#377BF3]/10 transition-colors"
        >
          <Paperclip className="h-5 w-5" />
          <span className="sr-only">Прикрепить файл</span>
        </Button>

        {/* Input container */}
        <div className="relative flex-1 min-h-[24px]">
          {/* Placeholder */}
          {!value && !isFocused && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[14px] text-[#8e8e8e] pointer-events-none">
              Введите сообщение...
            </span>
          )}
          
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            rows={1}
            className={cn(
              "w-full resize-none bg-transparent text-[14px] leading-relaxed",
              "text-[#212121] placeholder:text-[#8e8e8e] focus:outline-none",
              "disabled:cursor-not-allowed",
              "max-h-[120px] min-h-[24px]"
            )}
          />
        </div>

        {/* Voice button - show when no text */}
        {!hasValue && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={disabled}
            className="h-9 w-9 shrink-0 rounded-full text-[#8e8e8e] hover:text-[#377BF3] hover:bg-[#377BF3]/10 transition-colors"
          >
            <Mic className="h-5 w-5" />
            <span className="sr-only">Голосовое сообщение</span>
          </Button>
        )}

        {/* Send button - show when there's text */}
        {hasValue && (
          <Button
            type="button"
            size="icon"
            onClick={handleSend}
            disabled={disabled}
            className={cn(
              "h-9 w-9 shrink-0 rounded-full transition-all duration-200",
              "bg-[#377BF3] text-white hover:bg-[#2e75f2] hover:scale-105 shadow-md",
              "animate-in zoom-in-50 duration-200"
            )}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Отправить</span>
          </Button>
        )}
      </div>
      
      {/* Helper text */}
      <p className="text-center text-[11px] text-[#bdbdbd] mt-2">
        Нажмите Enter для отправки, Shift+Enter для новой строки
      </p>
    </div>
  )
}
