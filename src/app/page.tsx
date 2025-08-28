'use client'

import { useState, useEffect, FormEvent } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { User } from '@supabase/supabase-js'
import { Sidebar } from '@/components/sidebar'
import { Chat } from '@/components/chat'

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface Conversation {
  id: string;
  created_at: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
      } else {
        window.location.href = '/login'
      }
    }
    getUser()
  }, [])

  useEffect(() => {
    if (user) {
      const fetchConversations = async () => {
        const { data, error } = await supabase.functions.invoke('get-conversations', {
          body: { user_id: user.id },
        })
        if (error) {
          console.error('Error fetching conversations:', error)
        } else {
          setConversations(data)
          if (data.length > 0) {
            setCurrentConversationId(data[0].id)
          } else {
            handleNewChat()
          }
        }
      }
      fetchConversations()
    }
  }, [user])

  useEffect(() => {
    if (currentConversationId) {
      const fetchMessages = async () => {
        const { data, error } = await supabase
          .from('messages')
          .select('role, content')
          .eq('conversation_id', currentConversationId)
          .order('created_at', { ascending: true })

        if (error) {
          console.error('Error fetching messages:', error)
        } else {
          setMessages(data as Message[])
        }
      }
      fetchMessages()
    }
  }
  , [currentConversationId])

  const handleNewChat = async () => {
    if (!user) return
    const { data, error } = await supabase.functions.invoke('create-conversation', {
      body: { user_id: user.id },
    })
    if (error) {
      console.error('Error creating conversation:', error)
    } else {
      setConversations([data, ...conversations])
      setCurrentConversationId(data.id)
    }
  }

  const handleSelectConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !currentConversationId) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { conversation_id: currentConversationId, message: input },
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

  if (!user) {
    return null // or a loading spinner
  }

  return (
    <div className="flex h-screen p-6 bg-gray-100"> {/* Increased padding, changed bg-gray-50 to bg-gray-100 */}
      <Sidebar
        conversations={conversations}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
      />
      <div className="flex-1 ml-6"> {/* Increased ml-4 to ml-6 */}
        <Chat
          messages={messages}
          input={input}
          setInput={setInput}
          loading={loading}
          user={user}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}