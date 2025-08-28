"use client"

import { CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export function Header() {
  return (
    <CardHeader className="border-b border-white/20 p-8 bg-gradient-to-r from-white/95 via-slate-50/90 to-white/95 backdrop-blur-2xl">
      <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg">
          <Sparkles className="h-7 w-7 text-white" />
        </div>
        AI Assistant
        <span className="text-base font-medium text-slate-600 ml-auto tracking-tight">Always here to help</span>
      </CardTitle>
    </CardHeader>
  )
}
