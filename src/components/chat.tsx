'use client'

import { User } from '@supabase/supabase-js'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatMessages } from './chat-messages'
import { PromptForm } from './prompt-form'
import { Header } from './header'
import { FormEvent } from 'react'

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface ChatProps {
  messages: Message[];
  input: string;
  setInput: (value: string) => void;
  loading: boolean;
  user: User | null;
  handleSubmit: (e: FormEvent) => Promise<void>;
}

export function Chat({ messages, input, setInput, loading, user, handleSubmit }: ChatProps) {
  return (
    <Card className="flex flex-col h-full max-h-screen rounded-lg shadow-lg border-none bg-white">
      <Header />
      <CardContent className="flex-1 overflow-hidden p-4">
        <ScrollArea className="h-full pr-4">
          <ChatMessages messages={messages} loading={loading} user={user} />
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t border-gray-200"> {/* Added border-gray-200 */}
        <PromptForm
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      </CardFooter>
    </Card>
  )
}