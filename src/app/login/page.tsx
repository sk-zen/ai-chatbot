'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setError(error.message)
    } else {
      window.location.href = '/'
    }
  }

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) {
      setError(error.message)
    } else {
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
          <div className="space-y-2">
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
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm text-center">{error}</p>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <Button
              onClick={handleLogin}
              className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-slate-900/25 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              Sign in
            </Button>
            <Button
              onClick={handleSignUp}
              variant="outline"
              className="w-full h-11 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-medium rounded-lg transition-all duration-300 bg-transparent hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              Create account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
