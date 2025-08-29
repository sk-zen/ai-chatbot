'use client'

import { User } from '@supabase/supabase-js'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatMessages } from './chat-messages'
import { PromptForm } from './prompt-form'
// import { Header } from './header' // Remove Header import
import { FormEvent } from 'react'
import { Menu } from 'lucide-react'; // Import Menu icon
import { Button } from '@/components/ui/button'; // Import Button component

import { Message } from "../types";

interface ChatProps {
  messages: Message[];
  input: string;
  setInput: (value: string) => void;
  loading: boolean;
  user: User | null;
  handleSubmit: (e: FormEvent) => Promise<void>;
  className?: string;
  isSidebarCollapsed: boolean; // Add isSidebarCollapsed prop
  setIsSidebarCollapsed: (collapsed: boolean) => void; // Add setIsSidebarCollapsed prop
}

export function Chat({ messages, input, setInput, loading, user, handleSubmit, className, isSidebarCollapsed, setIsSidebarCollapsed }: ChatProps) {
  return (
    <Card className={className + " flex flex-col h-full max-h-screen rounded-lg shadow-lg border-none bg-white"}>
      <CardHeader className="border-b p-4 flex flex-row items-center justify-between"> {/* Added flex-row items-center justify-between */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="mr-2 cursor-pointer" // Added cursor-pointer
          >
            <Menu className="h-5 w-5" />
          </Button>
          <CardTitle className="text-lg font-semibold">AI Chatbot</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-4">
        <ScrollArea className="h-full pr-4">
          <ChatMessages messages={messages} loading={loading} user={user} />
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t border-gray-200">
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