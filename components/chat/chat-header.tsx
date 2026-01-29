"use client"

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { MoreVertical, X, Mail, Heart, MessageSquare, Frown, ChevronDown, Check, Bot } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export interface BotVersion {
  id: string
  name: string
  description: string
}

const botVersions: BotVersion[] = [
  { id: 'eva-v2', name: 'ЕВА V.2', description: 'Основной помощник' },
  { id: 'itsm-bot', name: 'ITSM БОТ', description: 'IT-поддержка' },
]

interface ChatHeaderProps {
  currentVersion: string
  onVersionChange: (versionId: string) => void
  onClose?: () => void
}

export function ChatHeader({ currentVersion, onVersionChange, onClose }: ChatHeaderProps) {
  const [versionOpen, setVersionOpen] = useState(false)
  const selectedVersion = botVersions.find(v => v.id === currentVersion) || botVersions[0]

  return (
    <header className="flex h-16 items-center justify-between border-b border-[#e5eaef] bg-white px-4 shadow-sm">
      {/* Left section - Title with avatar */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#377BF3] to-[#75a4f6] shadow-md">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-[15px] font-semibold text-[#212121]">Чат с Евой</span>
          <span className="text-[12px] text-[#8e8e8e]">Онлайн</span>
        </div>
      </div>

      {/* Center section - Version Selector */}
      <Popover open={versionOpen} onOpenChange={setVersionOpen}>
        <PopoverTrigger asChild>
          <button
            className="flex items-center gap-1.5 text-[#377BF3] font-medium hover:opacity-80 transition-opacity"
          >
            <span className="text-[14px]">{selectedVersion.name}</span>
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform duration-200",
              versionOpen && "rotate-180"
            )} />
          </button>
        </PopoverTrigger>
        <PopoverContent align="center" className="w-[200px] p-1.5 rounded-lg shadow-lg border border-[#e5eaef]">
          <div className="space-y-0.5">
            {botVersions.map((version) => (
              <button
                key={version.id}
                onClick={() => {
                  onVersionChange(version.id)
                  setVersionOpen(false)
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition-colors",
                  version.id === currentVersion
                    ? "bg-[#f7fafe] text-[#377BF3]"
                    : "hover:bg-[#f4f5f9] text-[#212121]"
                )}
              >
                <span className="text-[14px] font-medium">{version.name}</span>
                {version.id === currentVersion && (
                  <Check className="h-4 w-4 text-[#377BF3]" />
                )}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Right section - Menu & Close */}
      <div className="flex items-center gap-1">
        {/* Feedback menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-[#8e8e8e] hover:text-[#212121] hover:bg-[#f4f5f9] transition-colors">
              <MoreVertical className="h-5 w-5" />
              <span className="sr-only">Меню</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 p-2">
            <div className="px-2 py-2 mb-1">
              <span className="text-[14px] font-semibold text-[#212121]">Обратная связь</span>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer gap-3 px-3 py-3 rounded-lg hover:bg-[#f7fafe] focus:bg-[#f7fafe]">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#bad1fb]/50">
                <Mail className="h-4 w-4 text-[#377BF3]" />
              </div>
              <span className="text-[14px] text-[#212121]">Напишите нам</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-3 px-3 py-3 rounded-lg hover:bg-[#f7fafe] focus:bg-[#f7fafe]">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fce7f3]">
                <Heart className="h-4 w-4 text-[#ec4899]" />
              </div>
              <span className="text-[14px] text-[#212121]">Оставить благодарность</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-3 px-3 py-3 rounded-lg hover:bg-[#f7fafe] focus:bg-[#f7fafe]">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d1fae5]">
                <MessageSquare className="h-4 w-4 text-[#10b981]" />
              </div>
              <span className="text-[14px] text-[#212121]">Предложить идею</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-3 px-3 py-3 rounded-lg hover:bg-[#fef2f2] focus:bg-[#fef2f2]">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fef2f2]">
                <Frown className="h-4 w-4 text-[#eb4f47]" />
              </div>
              <span className="text-[14px] text-[#212121]">Пожаловаться</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Close button */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="h-10 w-10 rounded-full text-[#8e8e8e] hover:text-[#212121] hover:bg-[#f4f5f9] transition-colors"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Закрыть</span>
        </Button>
      </div>
    </header>
  )
}

export { botVersions }
