'use client'

import { ChatList } from "./chat-list"
import { Button } from "./ui/button"
import { Plus, LogOut, ChevronLeft, ChevronRight, Trash2 } from "lucide-react"; // Import ChevronLeft, ChevronRight icons
import { supabase } from '@/lib/supabaseClient' // Import supabase
import { cn } from "@/lib/utils"; // Import cn utility

interface Conversation {
  id: string;
  created_at: string;
  title?: string;
}

interface SidebarProps {
  conversations: Conversation[];
  onNewChat: () => void;
  onSelectConversation: (conversationId: string) => void;
  onDeleteConversation: (conversationId: string) => void;
  isCollapsed: boolean; // Add isCollapsed prop
  setIsCollapsed: (collapsed: boolean) => void; // Add setIsCollapsed prop
}

export function Sidebar({ conversations, onNewChat, onSelectConversation, onDeleteConversation, isCollapsed, setIsCollapsed }: SidebarProps) {
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
    } else {
      window.location.href = '/login'
    }
  }

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase.functions.invoke('delete-user', {
          body: { user_id: user.id },
        });
        if (error) {
          console.error('Error deleting account:', error);
        } else {
          await supabase.auth.signOut();
          window.location.href = '/login';
        }
      }
    }
  }

  return (
    <div className={cn(
      "relative flex flex-col h-full bg-white rounded-lg shadow-lg p-4 transition-all duration-300",
      isCollapsed ? "w-16 items-center" : "w-64"
    )}>
      <div className="flex justify-end mb-4"> {/* Container for the toggle button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-500 hover:bg-gray-100 cursor-pointer" // Added cursor-pointer
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      <div className={cn("mb-4", isCollapsed && "flex justify-center")}>
        <Button onClick={onNewChat} className={cn("w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 cursor-pointer", isCollapsed && "w-10 h-10 p-0")}> {/* Added cursor-pointer */}
          <Plus className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
          {!isCollapsed && "New Chat"}
        </Button>
      </div>
      <div className="flex-grow overflow-y-auto">
        <ChatList
          conversations={conversations}
          onSelectConversation={onSelectConversation}
          onDeleteConversation={onDeleteConversation}
          isCollapsed={isCollapsed}
        />
      </div>
      <div className={cn("mt-4 pt-4 border-t border-gray-200", isCollapsed && "flex justify-center")}>
        <Button onClick={handleSignOut} className={cn("w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 cursor-pointer mb-2", isCollapsed && "w-10 h-10 p-0")}> {/* Added cursor-pointer */}
          <LogOut className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
          {!isCollapsed && "Sign Out"}
        </Button>
        <Button onClick={handleDeleteAccount} className={cn("w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 cursor-pointer", isCollapsed && "w-10 h-10 p-0")}> {/* Added cursor-pointer */}
          <Trash2 className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
          {!isCollapsed && "Delete Account"}
        </Button>
      </div>
    </div>
  )
}