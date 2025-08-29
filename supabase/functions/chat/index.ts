import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 })
  }

  try {
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: 'Missing GEMINI_API_KEY' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return new Response(JSON.stringify({ error: 'Missing Supabase environment variables' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    const { conversation_id, message } = await req.json()

    console.log('Chat function invoked for conversation_id:', conversation_id, 'message:', message); // Added log

    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    console.log('Supabase client initialized:', supabase ? 'Yes' : 'No'); // Added log to check supabase client

    // 1. Save the user's message
    await supabase.from('messages').insert([
      { conversation_id, role: 'user', content: message },
    ])

    // Check if this is the first user message in this conversation (for title generation)
    const { count: userMessageCount, error: countError } = await supabase
      .from('messages')
      .select('id', { count: 'exact' })
      .eq('conversation_id', conversation_id)
      .eq('role', 'user')
      .limit(1) // Only need to know if at least one exists

    if (countError) {
      console.error('Error counting user messages:', countError); // Added log
      throw countError
    }

    console.log('User message count for title generation:', userMessageCount); // Added log

    if (userMessageCount === 1) { // This is the first user message
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' })
      const prompt = `Summarize the following chat message into a short title (max 5 words): "${message}"`
      console.log('Generating title with prompt:', prompt); // Added log
      const titleResult = await model.generateContent(prompt)
      const title = titleResult.response.text().trim()
      console.log('Generated title:', title); // Added log

      const { error: updateError } = await supabase.from('conversations').update({ title: title }).eq('id', conversation_id)
      if (updateError) {
        console.error('Error updating conversation title:', updateError); // Added log
        throw updateError;
      }
      console.log('Conversation title updated successfully.'); // Added log
    }


    // 2. Get the conversation history
    const { data: history, error: historyError } = await supabase
      .from('messages')
      .select('role, content')
      .eq('conversation_id', conversation_id)
      .order('created_at', { ascending: true })

    if (historyError) {
      throw historyError
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' })

    // Prepare history for startChat
    let chatHistory = history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }));

    // If the first message in history is from the model, prepend a dummy user message
    if (chatHistory.length > 0 && chatHistory[0].role === 'model') {
      chatHistory = [{ role: 'user', parts: [{ text: 'Hello' }] }, ...chatHistory];
    }

    const chat = model.startChat({
      history: chatHistory, // Use the prepared chatHistory
    })

    const result = await chat.sendMessageStream(message)

    const stream = new ReadableStream({
      async start(controller) {
        let fullContent = ''
        for await (const chunk of result.stream) {
          const chunkText = chunk.text()
          controller.enqueue(new TextEncoder().encode(chunkText))
          fullContent += chunkText
        }

        // Save the full response after streaming is complete
        await supabase.from('messages').insert([
          { conversation_id, role: 'model', content: fullContent },
        ])

        controller.close()
      },
    })

    return new Response(stream, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
