'use client'

import { useState, useEffect, FormEvent, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { User } from '@supabase/supabase-js'
import { Sidebar } from '@/components/sidebar'
import { Chat } from '@/components/chat'
// Removed Menu and Button imports as they will be in Chat's Header

import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
}

interface Conversation {
  id: string;
  created_at: string;
  title?: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // New state for sidebar collapse

  const handleNewChat = useCallback(async () => {
    if (!user) return
    const { data, error } = await supabase.functions.invoke('create-conversation', {
      body: { user_id: user.id },
    })
    if (error) {
      console.error('Error creating conversation:', error)
    } else {
      setConversations((prev) => [data, ...prev])
      setCurrentConversationId(data.id)
    }
  }, [user])

  const handleDeleteConversation = useCallback(async (conversationId: string) => {
    if (!user) return
    const { error } = await supabase.functions.invoke('delete-conversation', {
      body: { conversation_id: conversationId },
    })
    if (error) {
      console.error('Error deleting conversation:', error)
    } else {
      // Remove the deleted conversation from the state
      const updatedConversations = conversations.filter(
        (conv) => conv.id !== conversationId
      )
      setConversations(updatedConversations)

      // If the deleted conversation was the current one, switch to the latest or create new
      if (currentConversationId === conversationId) {
        if (updatedConversations.length > 0) {
          setCurrentConversationId(updatedConversations[0].id)
        }
      }
    }
  }, [user, conversations, currentConversationId, handleNewChat])

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
  }, [user, handleNewChat])

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
          setMessages(data.map((msg) => ({ ...msg, id: uuidv4() })) as Message[])
        }
      }
      fetchMessages()
    }
  }
  , [currentConversationId])



  const handleSelectConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !currentConversationId) return

    const userMessage: Message = { id: uuidv4(), role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
          'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ conversation_id: currentConversationId, message: input }),
      });

      if (!response.body) {
        throw new Error('No response body')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let done = false;
      let content = "";

      setMessages((prev) => [...prev, { id: uuidv4(), role: 'model', content: '' }]);

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunk = decoder.decode(value, { stream: !done });
        content += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.role === 'model') {
            lastMessage.content = content;
          }
          return newMessages;
        });
      }

      setLoading(false)

    } catch (error) {
      console.error('Error invoking function:', error)
      const errorMessage: Message = { role: 'model', content: 'Sorry, something went wrong.' }
      setMessages((prev) => [...prev, errorMessage])
      setLoading(false)
    }
  }

  if (!user) {
    return null // or a loading spinner
  }

  return (
    <div className="flex h-screen p-6 bg-gray-100">
      <Sidebar
        conversations={conversations}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed} // Pass setIsCollapsed to Sidebar
      />
      <div className={`flex flex-col flex-1 ml-6 transition-all duration-300 ${isSidebarCollapsed ? 'ml-0' : 'ml-6'}`}>
        <Chat
          messages={messages}
          input={input}
          setInput={setInput}
          loading={loading}
          user={user}
          handleSubmit={handleSubmit}
          isSidebarCollapsed={isSidebarCollapsed} // Pass isSidebarCollapsed to Chat
          setIsSidebarCollapsed={setIsSidebarCollapsed} // Pass setIsSidebarCollapsed to Chat
        />
      </div>
    </div>
  )
}