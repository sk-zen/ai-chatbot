'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link" // Import Link

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null) // New state for success messages

  const handleLogin = async () => {
    setError(null); // Clear previous errors
    setMessage(null); // Clear previous messages
    const { data, error: loginError } = await supabase.auth.signInWithPassword({ // Capture data
      email,
      password,
    })
    if (loginError) {
      if (loginError.message.includes('Email not confirmed')) { // Specific check for unconfirmed email
        setError('Please confirm your email address before logging in.');
      } else if (loginError.message.includes('Invalid login credentials')) { // Specific check for email not found
        setError('Invalid email or password. Please check your credentials.');
      }
      else {
        setError(loginError.message)
      }
    } else if (data.user && !data.user.email_confirmed_at) { // Check if user exists but email not confirmed
      setError('Please confirm your email address before logging in.');
      // Optionally, you might want to sign out the user if they were partially signed in
      await supabase.auth.signOut();
    }
    else {
      window.location.href = '/'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-2xl shadow-slate-200/50">
        <CardHeader className="space-y-2 pb-8 pt-8">
          <CardTitle className="text-3xl font-bold text-center text-slate-900 text-balance">Welcome back</CardTitle>
          <p className="text-slate-600 text-center text-sm">Sign in to your account to continue</p>
        </CardHeader>
        <CardContent className="space-y-6 px-8 pb-8">
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 border-slate-200 bg-white/50 focus:border-slate-400 focus:ring-slate-400/20 transition-all duration-300 hover:border-slate-300"
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 border-slate-200 bg-white/50 focus:border-slate-400 focus:ring-slate-400/20 transition-all duration-300 hover:border-slate-300"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                <p className="text-red-700 text-sm text-center">{error}</p>
              </div>
            )}
            {message && ( // Display success message
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                <p className="text-green-700 text-sm text-center">{message}</p>
              </div>
            )}

            <div className="space-y-3 pt-6">
              <Button
                type="submit"
                className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-slate-900/25 cursor-pointer"
              >
                Sign in
              </Button>
              <div className="text-center"> {/* Added div for link */}
                <p className="text-sm text-slate-600">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-slate-900 hover:text-slate-700 font-medium transition-colors cursor-pointer">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
