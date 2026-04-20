// src/context/AuthContext.tsx
import { createContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useUserStore } from '../store/useUserStore'

export const AuthContext = createContext({} as any)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useUserStore((state) => state.setUser)
  const clearUser = useUserStore((state) => state.clearUser)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        clearUser()
        setLoading(false)
        return
      }

      const userId = data.user.id

      // 🔥 busca profile no banco (ESSENCIAL)
      const { data: profile } = await supabase
        .from('profiles')
        .select('school_id, role')
        .eq('id', userId)
        .single()

      if (profile) {
        setUser({
          userId,
          schoolId: profile.school_id,
          role: profile.role ?? 'teacher',
        })
      }

      setLoading(false)
    }

    loadUser()

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!session) {
          clearUser()
          return
        }

        const userId = session.user.id

        const { data: profile } = await supabase
          .from('profiles')
          .select('school_id, role')
          .eq('id', userId)
          .single()

        if (profile) {
          setUser({
            userId,
            schoolId: profile.school_id,
            role: profile.role ?? 'teacher',
          })
        }
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ loading }}>
      {children}
    </AuthContext.Provider>
  )
}