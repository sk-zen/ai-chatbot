'use client'

import { Trash2 } from "lucide-react"; // Import Trash2 icon
import { cn } from "@/lib/utils"; // Import cn utility

interface Conversation {
  id: string;
  created_at: string;
  title?: string;
}

interface ChatListProps {
  conversations: Conversation[];
  onSelectConversation: (conversationId: string) => void;
  onDeleteConversation: (conversationId: string) => void;
  isCollapsed: boolean; // Add isCollapsed prop
}

export function ChatList({ conversations, onSelectConversation, onDeleteConversation, isCollapsed }: ChatListProps) {
  const handleDeleteClick = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation(); // Prevent selecting the conversation when clicking delete
    if (window.confirm('Are you sure you want to delete this chat?')) {
      onDeleteConversation(conversationId);
    }
  };

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          onClick={() => onSelectConversation(conversation.id)}
          className={cn(
            "p-3 rounded-md cursor-pointer hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between group",
            isCollapsed && "justify-center" // Center content when collapsed
          )}
        >
          {!isCollapsed && ( // Hide text when collapsed
            <div>
              <p className="text-sm font-medium text-gray-800">
                {conversation.title || `Chat from ${new Date(conversation.created_at).toLocaleDateString()}`}
              </p>
              <p className="text-xs text-gray-500 mt-1">{new Date(conversation.created_at).toLocaleTimeString()}</p>
            </div>
          )}
          <button
            onClick={(e) => handleDeleteClick(e, conversation.id)}
            className={cn(
              "p-1 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-500 transition-opacity duration-200",
              isCollapsed ? "opacity-100" : "opacity-0 group-hover:opacity-100" // Always show delete button when collapsed
            )}
            aria-label="Delete chat"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}