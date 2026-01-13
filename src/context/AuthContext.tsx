import React, { createContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("AuthContext: Initializing...")
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)
        console.log("AuthContext: Session initialized", session?.user?.email)
      } catch (error) {
        console.error('AuthContext: Error initializing auth:', error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("AuthContext: Auth state changed", _event)
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    user,
    session,
    loading,
    signOut
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
