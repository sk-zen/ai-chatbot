'use client'

import { User } from '@supabase/supabase-js'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn, getUserAvatarUrl } from "@/lib/utils"
import { useEffect, useState } from 'react' // Import useEffect and useState
import { supabase } from '@/lib/supabaseClient' // Import supabase

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface ChatMessagesProps {
  messages: Message[];
  loading: boolean;
  user: User | null;
}

export function ChatMessages({ messages, loading, user }: ChatMessagesProps) {
  const aiAvatar = '/ai-avatar.svg'; // Path to AI avatar SVG
  const [usernameInitial, setUsernameInitial] = useState<string>('U'); // State for user initial

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error fetching profile:', error)
          setUsernameInitial(user.email ? user.email.charAt(0).toUpperCase() : 'U');
        } else if (data?.username) {
          setUsernameInitial(data.username.charAt(0).toUpperCase());
        } else {
          setUsernameInitial(user.email ? user.email.charAt(0).toUpperCase() : 'U');
        }
      }
    }
    fetchProfile();
  }, [user]);

  return (
    <div className="space-y-6 py-4">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={cn(
            "flex items-start gap-3",
            msg.role === 'user' ? "justify-end" : "justify-start"
          )}
        >
          {msg.role === 'model' && (
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarImage src={aiAvatar} alt="AI Avatar" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
          )}
          <div
            className={cn(
              "max-w-[70%] px-4 py-2 rounded-xl text-base leading-relaxed",
              msg.role === 'user'
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            )}
          >
            {msg.content}
          </div>
          {msg.role === 'user' && (
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarImage src={getUserAvatarUrl(user?.email)} alt="User Avatar" />
              <AvatarFallback>{usernameInitial}</AvatarFallback> {/* Use usernameInitial */}
            </Avatar>
          )}
        </div>
      ))}
      {loading && (
        <div className="flex items-start gap-3">
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src={aiAvatar} alt="AI Avatar" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div className="px-4 py-2 rounded-xl bg-gray-200 text-gray-800">...</div>
        </div>
      )}
    </div>
  )
}
