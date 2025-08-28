'use client'

import { CardHeader, CardTitle } from "@/components/ui/card"

export function Header() {
  return (
    <CardHeader className="border-b p-4"> {/* Added border-b and p-4 */}
      <CardTitle className="text-lg font-semibold">AI Chatbot</CardTitle> {/* Adjusted font size and weight */}
    </CardHeader>
  )
}
