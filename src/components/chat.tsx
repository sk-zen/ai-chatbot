"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatMessages } from "./chat-messages"
import { PromptForm } from "./prompt-form"
import { Header } from "./header"
import type { FormEvent } from "react"
import { User } from '@supabase/supabase-js' // Import User type

interface Message {
  role: "user" | "model"
  content: string
}

interface ChatProps {
  messages: Message[]
  input: string
  setInput: (value: string) => void
  loading: boolean
  user: User | null // Use User | null
  handleSubmit: (e: FormEvent) => Promise<void>
}

export function Chat({ messages, input, setInput, loading, user, handleSubmit }: ChatProps) {
  return (
    <Card className="flex flex-col h-full max-h-screen rounded-3xl shadow-2xl shadow-slate-900/10 border border-white/20 bg-white/90 backdrop-blur-2xl overflow-hidden">
      <Header />
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <ChatMessages messages={messages} loading={loading} user={user} />
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-0 border-t border-white/20">
        <PromptForm input={input} setInput={setInput} handleSubmit={handleSubmit} loading={loading} />
      </CardFooter>
    </Card>
  )
}