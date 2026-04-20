// src/hooks/useProfile.ts
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser()

      if (!userData.user) return null

      const { data, error } = await supabase
        .from('profiles')
        .select('school_id, role, name')
        .eq('id', userData.user.id)
        .maybeSingle()

      if (error) throw error

      return data
    },
  })
}