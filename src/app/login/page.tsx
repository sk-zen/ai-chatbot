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
    <div className="flex items-center justify-center h-screen bg-gray-100"> {/* Consistent background */}
      <Card className="w-[400px] p-6 rounded-lg shadow-lg"> {/* Added p-6, rounded-lg, shadow-lg */}
        <CardHeader className="text-center mb-6"> {/* Added text-center and mb-6 */}
          <CardTitle className="text-3xl font-bold">Welcome</CardTitle> {/* Increased font size and weight */}
        </CardHeader>
        <CardContent className="space-y-6"> {/* Increased space-y */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label> {/* Refined label styling */}
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" // Refined input styling
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">Password</Label> {/* Refined label styling */}
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" // Refined input styling
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>} {/* Refined error styling */}
          <div className="flex flex-col space-y-3"> {/* Changed to flex-col and space-y-3 */}
            <Button onClick={handleLogin} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200">
              Login
            </Button>
            <Button onClick={handleSignUp} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md transition-colors duration-200" variant="outline"> {/* Refined signup button styling */}
              Sign Up
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}