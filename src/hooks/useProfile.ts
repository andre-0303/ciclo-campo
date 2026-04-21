// src/hooks/useProfile.ts
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useIsOnline } from './useIsOnline'

export function useProfile() {
  const isOnline = useIsOnline();

  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: sessionData } = await supabase.auth.getSession()

      if (!sessionData.session?.user) return null

      const { data, error } = await supabase
        .from('profiles')
        .select('school_id, role, name')
        .eq('id', sessionData.session.user.id)
        .maybeSingle()

      if (error) throw error

      return data
    },
    // Desabilita quando offline — usa dados do cache
    enabled: isOnline,
  })
}