'use client'

import { ChatList } from "./chat-list"
import { Button } from "./ui/button"
import { Plus, LogOut } from "lucide-react"; // Import LogOut icon
import { supabase } from '@/lib/supabaseClient' // Import supabase

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
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
    } else {
      window.location.href = '/login'
    }
  }

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
      <div className="mt-4 pt-4 border-t border-gray-200"> {/* Added border-t and padding */}
        <Button onClick={handleSignOut} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
