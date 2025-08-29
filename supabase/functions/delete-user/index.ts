import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 })
  }

  try {
    const { user_id } = await req.json()

    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL ?? '',
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
    )

    console.log(`Deleting user ${user_id}`)

    // 1. Get all conversations for the user
    const { data: conversations, error: conversationsError } = await supabaseAdmin
      .from('conversations')
      .select('id')
      .eq('user_id', user_id)

    if (conversationsError) {
      console.error(`Error getting conversations for user ${user_id}:`, conversationsError)
      throw conversationsError
    }

    console.log(`Found ${conversations.length} conversations for user ${user_id}`)

    // 2. Delete all messages for each conversation
    for (const conversation of conversations) {
      console.log(`Deleting messages for conversation ${conversation.id}`)
      await supabaseAdmin.from('messages').delete().eq('conversation_id', conversation.id)
    }

    // 3. Delete all conversations for the user
    console.log(`Deleting conversations for user ${user_id}`)
    await supabaseAdmin.from('conversations').delete().eq('user_id', user_id)

    // 4. Delete the user
    console.log(`Deleting user ${user_id} from auth.users`)
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(user_id)

    if (deleteUserError) {
      console.error(`Error deleting user ${user_id}:`, deleteUserError)
      throw deleteUserError
    }

    console.log(`User ${user_id} deleted successfully`)

    return new Response(JSON.stringify({ message: 'User deleted successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
