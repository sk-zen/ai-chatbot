'use client'

import { FormEvent } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SendHorizonal } from "lucide-react";

interface PromptFormProps {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  loading: boolean;
}

export function PromptForm({ input, setInput, handleSubmit, loading }: PromptFormProps) {
  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
      <Input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" // Added more refined input styling
      />
      <Button type="submit" disabled={loading} size="icon" className="rounded-full w-10 h-10 flex-shrink-0"> {/* Made button rounder and fixed size */}
        <SendHorizonal className="h-5 w-5" /> {/* Increased icon size */}
      </Button>
    </form>
  )
}