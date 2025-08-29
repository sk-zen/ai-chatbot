"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Bot } from "lucide-react"

import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: "user" | "model"
  content: string
}

interface ChatMessagesProps {
  messages: Message[]
  loading: boolean
  user?: { email?: string; name?: string } | null
}

export function ChatMessages({ messages, loading, user }: ChatMessagesProps) {
  const getUserInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase()
    if (user?.email) return user.email.charAt(0).toUpperCase()
    return "U"
  }

  const getUserAvatarUrl = (email?: string) => {
    if (!email) return null
    // Simple gravatar-style URL generation
    return `https://api.dicebear.com/7.x/initials/svg?seed=${email}`
  }

  return (
    <div className="space-y-6 py-6 px-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={cn("flex items-start gap-3 group", msg.role === "user" ? "justify-end" : "justify-start")}
        >
          {msg.role === "model" && (
            <div className="flex-shrink-0">
              <Avatar className="w-10 h-10 border border-white shadow-sm">
                <AvatarFallback className="bg-slate-800 text-white">
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </div>
          )}
          <div
            className={cn(
              "max-w-[75%] px-4 py-3 text-sm leading-relaxed shadow-sm transition-all duration-200 group-hover:shadow-md font-normal",
              msg.role === "user"
                ? "bg-blue-500 text-white rounded-2xl rounded-tr-md"
                : "bg-white border border-slate-200/60 text-slate-700 rounded-2xl rounded-tl-md",
            )}
          >
            <ReactMarkdown
              components={{
                div: ({ node, ...props }) => <div className="prose" {...props} />,
              }}
            >
              {msg.content}
            </ReactMarkdown>
          </div>
          {msg.role === "user" && (
            <div className="flex-shrink-0">
              <Avatar className="w-10 h-10 border border-white shadow-sm">
                <AvatarImage src={getUserAvatarUrl(user?.email) || "/placeholder.svg"} alt="User Avatar" />
                <AvatarFallback className="bg-slate-600 text-white font-medium text-sm">
                  {getUserInitial()}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      ))}
      {loading && (
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Avatar className="w-10 h-10 border border-white shadow-sm">
              <AvatarFallback className="bg-slate-800 text-white">
                <Bot className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-white border border-slate-200/60 shadow-sm">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
