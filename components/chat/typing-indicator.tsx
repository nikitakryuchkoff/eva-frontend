"use client"

import { Bot } from 'lucide-react'

export function TypingIndicator() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="flex gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#377BF3] to-[#75a4f6] shadow-md">
          <Bot className="h-4 w-4 text-white" />
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-2xl rounded-tl-md bg-white border border-[#e5eaef] px-5 py-4 shadow-sm">
          <span className="h-2.5 w-2.5 rounded-full bg-[#377BF3]/60 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="h-2.5 w-2.5 rounded-full bg-[#377BF3]/70 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="h-2.5 w-2.5 rounded-full bg-[#377BF3]/80 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}
