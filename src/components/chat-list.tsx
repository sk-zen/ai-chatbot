"use client"

import { Clock, MessageCircle } from "lucide-react"

interface Conversation {
  id: string
  created_at: string
}

interface ChatListProps {
  conversations: Conversation[]
  onSelectConversation: (conversationId: string) => void
}

export function ChatList({ conversations = [], onSelectConversation }: ChatListProps) {
  return (
    <div className="space-y-4">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          onClick={() => onSelectConversation(conversation.id)}
          className="group p-5 rounded-2xl cursor-pointer hover:bg-white/80 hover:shadow-lg transition-all duration-300 border border-transparent hover:border-white/40 backdrop-blur-sm hover:scale-[1.02]"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <MessageCircle className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                <p className="text-base font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
                  {new Date(conversation.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3 ml-8">
                <Clock className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <p className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors font-medium">
                  {new Date(conversation.created_at).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
            </div>
            <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex-shrink-0 mt-2 shadow-lg"></div>
          </div>
        </div>
      ))}
      {conversations.length === 0 && (
        <div className="text-center py-12">
          <div className="p-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <MessageCircle className="h-8 w-8 text-indigo-500" />
          </div>
          <p className="text-slate-600 text-base font-medium">No conversations yet</p>
          <p className="text-slate-500 text-sm mt-2">Start a new chat to begin your journey</p>
        </div>
      )}
    </div>
  )
}
