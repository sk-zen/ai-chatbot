'use client'

interface Conversation {
  id: string;
  created_at: string;
}

interface ChatListProps {
  conversations: Conversation[];
  onSelectConversation: (conversationId: string) => void;
}

export function ChatList({ conversations, onSelectConversation }: ChatListProps) {
  return (
    <div className="space-y-2">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          onClick={() => onSelectConversation(conversation.id)}
          className="p-3 rounded-md cursor-pointer hover:bg-gray-100 transition-colors duration-200 flex flex-col" // Changed p-2 to p-3, hover:bg-gray-200 to hover:bg-gray-100, added flex flex-col
        >
          <p className="text-sm font-medium text-gray-800">Chat from {new Date(conversation.created_at).toLocaleDateString()}</p>
          <p className="text-xs text-gray-500 mt-1">{new Date(conversation.created_at).toLocaleTimeString()}</p> {/* Added mt-1 */}
        </div>
      ))}
    </div>
  )
}
