'use client'

import { ChatList } from "./chat-list"
import { Button } from "./ui/button"
import { Plus } from "lucide-react"; // Import Plus icon

interface Conversation { // Define Conversation interface
  id: string;
  created_at: string;
}

interface SidebarProps {
  conversations: Conversation[]; // Replace any with Conversation[]
  onNewChat: () => void;
  onSelectConversation: (conversationId: string) => void;
}

export function Sidebar({ conversations, onNewChat, onSelectConversation }: SidebarProps) {
  return (
    <div className="flex flex-col h-full w-64 bg-white rounded-lg shadow-lg p-4">
      <div className="mb-4">
        <Button onClick={onNewChat} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200">
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>
      <div className="flex-grow overflow-y-auto">
        <ChatList
          conversations={conversations}
          onSelectConversation={onSelectConversation}
        />
      </div>
    </div>
  )
}