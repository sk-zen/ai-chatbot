"use client"

import type { FormEvent } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Loader2 } from "lucide-react"

interface PromptFormProps {
  input: string
  setInput: (value: string) => void
  handleSubmit: (e: FormEvent) => Promise<void>
  loading: boolean
}

export function PromptForm({ input, setInput, handleSubmit, loading }: PromptFormProps) {
  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-end gap-3 p-4 bg-gradient-to-t from-white/90 to-white/60 backdrop-blur-2xl border-t border-slate-200/40"
    >
      <div className="flex-1 relative">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
          className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200/60 bg-white/95 backdrop-blur-sm focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 transition-all duration-200 text-slate-700 placeholder:text-slate-400 resize-none min-h-[48px] shadow-sm hover:shadow-md text-sm font-normal"
        />
      </div>
      <Button
        type="submit"
        disabled={loading || !input.trim()}
        className="h-12 w-12 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:hover:bg-slate-300 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 border-0 flex-shrink-0"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      </Button>
    </form>
  )
}
