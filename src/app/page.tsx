'use client'

import { useState, useEffect, FormEvent } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { v4 as uuidv4 } from 'uuid'

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let currentSessionId = localStorage.getItem('chat_session_id')
    if (!currentSessionId) {
      currentSessionId = uuidv4()
      localStorage.setItem('chat_session_id', currentSessionId)
    }
    setSessionId(currentSessionId)
  }, [])

  useEffect(() => {
    if (sessionId) {
      const fetchMessages = async () => {
        const { data, error } = await supabase
          .from('messages')
          .select('role, content')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: true })

        if (error) {
          console.error('Error fetching messages:', error)
        } else {
          setMessages(data as Message[])
        }
      }
      fetchMessages()
    }
  }, [sessionId])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { session_id: sessionId, message: input },
      })

      if (error) {
        throw error
      }

      const modelMessage: Message = { role: 'model', content: data.text }
      setMessages((prev) => [...prev, modelMessage])
    } catch (error) {
      console.error('Error invoking function:', error)
      const errorMessage: Message = { role: 'model', content: 'Sorry, something went wrong.' }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-grow p-6 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-2 rounded-lg bg-gray-300 text-black">...</div>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 bg-white border-t">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
          />
          <button type="submit" className="ml-4 px-6 py-2 bg-blue-500 text-white rounded-full font-semibold" disabled={loading}>
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
